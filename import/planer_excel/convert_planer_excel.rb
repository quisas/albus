# coding: utf-8

###############################################################################################
# Planer-Excel Import
#

# HINWEIS! Es braucht eine modifizierte Version von spreadsheet (in vendor/modified_gems/...), welche schlicht den Zahlenwert für pattern_bg_color gibt
# und dies nicht in benannte Farbnamen umwandeln will (und nicht kann, wenn unbekannte Farben gewählt wurden)

# Vorbereitung:
# - Excel-Farbtabelle muss angepasst werden mit den korrekten Fachkürzeln!
# - Excel-File muss im Format Excel 97/2000 gespeichert werden, sonst werden die Farben nicht gelesen.

# 2023 Wir lesen optional keine Farben mehr

# Aufbau im Excel:
# - Jede Zelle enthält 1 oder mehrere Angaben im Format LP[,LP][/Fach[-HK][/Fachgruppe]]
# - HK = Halbklasse
# - Farbe wird optional eingelesen als Fach, falls es nicht schon genannt wurde


# TODO: Teils veraltet
# Regeln des Imports:
# - Fachlegende einlesen und loggen. Nur Fächer matchen, welche ein korrektes Kürzel haben. Andere ignorieren und loggen.
# - Wenn Fach per Farbe nicht erkannt wird, oder wenn mehrere Lehrer in einer Zelle drin stehen, dann wird das Fach aufgrund der bestehenden
#   Skelettlektionen indirekt herausgefunden und geloggt.
# - Leere Zellen komplett ignorieren
# - Graue Zellen werden ignoriert (PK, FF) und müssen manuell in ProPlan gesetzt werden (wir können das nicht importieren, zu wenig Informationen)

require 'rubygems'
$LOAD_PATH.push('./modified_gems/spreadsheet-1.1.2/lib')
require 'spreadsheet'


###############################################################################################
# Config
#

# Farbangaben in Excel soll als Fach eingelesen werden? (Default: false, nur Charlotte verwendet das evt.)
$use_colors = false



###############################################################################################
# Lib
#

def import_logger
  $Import_logger ||= Logger.new("convert.log")
end

def log(message)
  puts(message)
  import_logger.info(message)
end

def log_cell(message)

  range = @current_column / 26
  remainder = (@current_column % 26) + 1
  
  if range >= 1
    column_name = (65 + (range - 1)).chr
    column_name += (65 + (remainder - 1)).chr
  else
    column_name = (65 + (remainder - 1)).chr
  end
  
  
  message = "Zelle #{cell_name(@current_column, @current_row)} #{message}"
  puts(message)
  import_logger.info(message)
end

def error(message)
  log_cell("!!! #{message}")
end

def tick(message, row_index, column_index)
  @current_row = row_index
  @current_column = column_index
  puts(". #{message}")
end

# Liefert den Namen der Zelle im Spreadsheet anhand unserer Zeile/Spalte-Nummern
def cell_name(col, row)
  range = col / 26
  remainder = (col % 26) + 1
  
  if range >= 1
    column_name = (65 + (range - 1)).chr
    column_name += (65 + (remainder - 1)).chr
  else
    column_name = (65 + (remainder - 1)).chr
  end
  
  column_name + (row + 1).to_s
  
end

$CSV = []
$CSV << "Klasse\tFach\tHalbklasse\tFachgruppe\tLehrer\tTag\tLektion"
def add_csv(klasse, subject, halbklasse, subjects_group, teacher, day, lesson)
  row = [klasse, subject, (halbklasse ? 'HK' : ''), subjects_group, teacher, day, lesson].join("\t")
  $CSV << row
  # puts(row)
end


###################################################################################################
# Init
#

# Altes Logfile löschen
FileUtils.rm_f('convert.log')

log('Import aus Stundenplaner-Excel gestartet')

Spreadsheet.client_encoding = 'UTF-8'

book = Spreadsheet.open './plan_excel.xls'
sheet = book.worksheet(0)

# Ich glaube, ignorieren bringt nichts. Wir finden schon intelligent raus, welches Fach es wäre:
#ignored_colors = ['2860', '2871', '2998', '5654', '3359', '3990', '5407'] # Grautöne


# Ab 2023 FS verwenden wir die Farbe nicht mehr. Jacqueline schreibt im Text das Fach immer explizit. Charlotte verwendet es aber evt. trotzdem noch.
###############################
# Farbtabelle einlesen
#

if $use_colors then

  # Farbtabelle muss ab Zeile 2 beginnen und in Spalte BF/BG sein

  # Struktur: {Farbwert => Fach}
  color_subject_map = {}

  COLOR_COLUMN_INDEX = 57 # Spalte BF
  SUBJECT_COLUMN_INDEX = 58 # Spalte BG
  row_index = 1

  log("Farbzuweisungs-Tabelle:")

  # Wir suchen den Anfang der Tabelle
  while true do
    subject_code = sheet.row(row_index)[SUBJECT_COLUMN_INDEX].to_s.gsub("\n", '')
    break if not subject_code.empty?
    row_index += 1
    if row_index > 100
      log('Keine Farbtabelle gefunden. Muss in Spalte BF/BG seind')
      exit
    end
  end

  while true do
    color = sheet.row(row_index).format(COLOR_COLUMN_INDEX).pattern_bg_color.to_s
    subject_code = sheet.row(row_index)[SUBJECT_COLUMN_INDEX].to_s.gsub("\n", '')
    subject_code.gsub!('(f)', '')

    # Wir gehen durch die Tabelle, bis zum ersten leeren Feld
    break if subject_code.empty?
    
    raise "Doppelte Farbe #{color}!" if color_subject_map.has_key?(color)
    color_subject_map[color] = subject_code
    log("#{color} zu #{subject_code}")
    
    row_index += 1

  end
end

###################################################################################################
# Zellen einlesen
#

# Lese Zeilen solange wie ein korrekte Klassenkürzel am anfang steht
row_index = 0
go_ahead = true
ignored_cells = []
ambiguous_lessons = []
new_lessons = []  
auto_room_lessons = []
lesson_start_offset = 0
while go_ahead
  row_index += 1
  row = sheet.row(row_index)
  students_group_code = row[0].to_s


  if (students_group_code =~ /^\d\w$/)
    # Gehe durch alle Zellen in der Zeile, anhand der TimeSlots
    1.upto(5) do | day_index |
      1.upto(11) do | lesson_index |

        index = ((day_index - 1) * 11) + lesson_index
        column_index = index + lesson_start_offset
        text = row[column_index].to_s.strip

        # tick("Verarbeite Zelle #{cell_name(column_index, row_index)} mit Inhalt '#{text}'", row_index, column_index)
        tick("Verarbeite Zelle #{cell_name(column_index, row_index)}", row_index, column_index)
      
        # Wenn Zelle leer, dann weiter
        next if text.empty?

        # Explizit unbekannte Details. Ignorieren.
        next if text == '???'
        
        # Optional: Fach rausfinden anhand der Farbe
        if $use_colors then
          color = row.format(column_index).pattern_bg_color.to_s
          
          # Wenn wir das Fach nicht erkennen (bei einem nicht-leeren Feld, an dieser Stelle)
          if color_subject_map.has_key?(color)
            subject_from_color = color_subject_map[color]
            invalid_color = false
          else
            #unless ignored_colors.include?(color)
            invalid_color = true
            #end
          end
        end

        # Vorberechnung aller Lehrer. Nicht ganz optimiert und redundant weil unten nochmals, aber pragmatisch.
        # Lehrer rausfinden, anhand der Kürzel

        # Variante: Split nur bei Zeilenumbruch, so dass Leerzeichen in Fachnamen möglich sind:
#        tokens = text.split(/\r?\n/) #Falls es Fachnamen mit Leerzeichen hat, dann müssen wir strikt Zeilen trennen. Siehe "Conv. francaise" etc.
        tokens = text.split(/[\r|\n|\s]/) # Split bei Zeilenumbruch ODER Leerschlag
        
        teachers = []
        for token in tokens

          subtokens = token.split('/')
          token_teacher = subtokens[0].to_s.strip

          if not token_teacher.empty?
            # Lehrer können Teamteaching sein, kommagetrennt
            subteachers = token_teacher.split(',')
            teachers.concat(subteachers)

#            teachers << token_teacher
          end
        end


        # Jedes Token in der Zelle verarbeiten. Konvention ist: Lehrer[/Fach[-HK][/Fachgruppe]]
        # HK = Halbklasse
        # Für jeden Lehrer je eine Lektion finden oder neu erstellen
        for token in tokens

          # Optional kommt auch Fach und Fachgruppe darin vor
          subtokens = token.split('/')
          token_teacher = subtokens[0].to_s.strip
          token_subject = subtokens[1].to_s.strip
          token_subjects_group = subtokens[2].to_s.strip.upcase

          # Lehrer können Teamteaching sein, kommagetrennt
          subteachers = token_teacher.split(',')

          if token_subject.end_with?('HK')
            halbklasse = true
            subject = token_subject.chomp('-HK')
          else
            halbklasse = false
            subject = token_subject
          end
          
          # # Wenn mehrere Lehrer angegeben wurden dann müssen wir das Fach immer wieder vergessen.
          # # Mehrere Lehrer im Excel können nicht mehrere Fächer zugewiesen werden, weil das mehrere Farben pro
          # # Excel-Zelle sein müssten. Deshalb können wir das korrekte Fach nicht rauslesen.
          # if teachers.size > 1
          #   subject = ''
          # end


          # Optional: Fach von Farbe nehmen, falls nichts angegeben im Token
          if $use_colors then
            if token_subject.empty?
              subject = subject_from_color

              if invalid_color
                log_cell("Fach nicht aus Farbe erkannt und fehlende Fachangabe. Farbe #{color}, Zellinhalt: #{text}")
              end
              
            end
          end

        
          # In CSV schreiben
          for t in subteachers
            add_csv(students_group_code, subject, halbklasse, token_subjects_group, t, day_index, lesson_index)
          end
        
        end
      end
    end

  else
    go_ahead = false
  end
  
end


log('Import aus Stundenplaner-Excel beendet')

File.open('planer_data.csv', 'w+') do |f|
  $CSV.each do |row|
    f.write(row)
    f.write("\n")
  end
end
