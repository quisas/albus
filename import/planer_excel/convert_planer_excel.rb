# coding: utf-8
require 'rubygems'

# puts $LOAD_PATH

$LOAD_PATH.push('./modified_gems/spreadsheet-1.1.2/lib')
#gem 'ruby-ole', '=1.2.11.1' # Wegen spreadsheet
require 'spreadsheet'


FileUtils.rm_f('import.log')

def import_logger
  $Import_logger ||= Logger.new("import.log")
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
$CSV << "Klasse\tFach\tFachgruppe\tLehrer\tTag\tLektion"
def add_csv(klasse, subject, subjects_group, teacher, day, lesson)
  row = [klasse, subject, subjects_group, teacher, day, lesson].join("\t")
  $CSV << row
  # puts(row)
end

###############################################################################################
# Planer-Excel Import
#

# HINWEIS! Es braucht eine modifizierte Version von spreadsheet (in vendor/modified_gems/...), welche schlicht den Zahlenwert für pattern_bg_color gibt
# und dies nicht in benannte Farbnamen umwandeln will (und nicht kann, wenn unbekannte Farben gewählt wurden)

# Vorbereitung:
# - Excel-Farbtabelle muss angepasst werden mit den korrekten Fachkürzeln!
# - Excel-File muss im Format Excel 97/2000 gespeichert werden, sonst werden die Farben nicht gelesen.

# Regeln des Imports:
# - Fachlegende einlesen und loggen. Nur Fächer matchen, welche ein korrektes Kürzel haben. Andere ignorieren und loggen.
# - Wenn Fach per Farbe nicht erkannt wird, oder wenn mehrere Lehrer in einer Zelle drin stehen, dann wird das Fach aufgrund der bestehenden
#   Skelettlektionen indirekt herausgefunden und geloggt.
# - Leere Zellen komplett ignorieren
# - Graue Zellen werden ignoriert (PK, FF) und müssen manuell in ProPlan gesetzt werden (wir können das nicht importieren, zu wenig Informationen)

###################################################################################################
# Init
#

log('Import aus Stundenplaner-Excel gestartet')

Spreadsheet.client_encoding = 'UTF-8'

book = Spreadsheet.open './plan_excel.xls'
sheet = book.worksheet(0)

# ignored_colors = ['2860', '2871', '2998'] # Grautöne
# Ich glaube, ignorieren bringt nichts. Wir finden schon intelligent raus, welches Fach es wäre:
ignored_colors = ['2860', '2871', '2998', '5654', '3359', '3990', '5407'] # Grautöne


###############################
# Farbtabelle einlesen
#

# Farbtabelle muss ab Zeile 2 beginnen und in Spalte BF/BG sein

# Struktur: {Farbwert => Fach}
color_subject_map = {}

COLOR_COLUMN_INDEX = 58 # Spalte BG
SUBJECT_COLUMN_INDEX = 59 # Spalte BH
row_index = 1

log("Farbzuweisungs-Tabelle:")

# Wir suchen den Anfang der Tabelle
while true do
  subject_code = sheet.row(row_index)[SUBJECT_COLUMN_INDEX].to_s.gsub("\n", '')
  break if not subject_code.empty?
  row_index += 1
  if row_index > 100
    log('Keine Farbtabelle gefunden. Muss in Spalte BG/BH seind')
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
        text = row[column_index]

        # tick("Verarbeite Zelle #{cell_name(column_index, row_index)} mit Inhalt '#{text}'", row_index, column_index)
        tick("Verarbeite Zelle #{cell_name(column_index, row_index)}", row_index, column_index)
      
        # Wenn Zelle leer, dann weiter
        next if text.to_s.strip.empty?

        # Fach rausfinden anhand der Farbe
        color = row.format(column_index).pattern_bg_color.to_s
      
        # Wenn wir das Fach nicht erkennen (bei einem nicht-leeren Feld, an dieser Stelle)
        if color_subject_map.has_key?(color)
          subject = color_subject_map[color]
          invalid_color = false
        else
          subject = ''
          unless ignored_colors.include?(color)
            invalid_color = true
          end
        end


        # Vorberechnung aller Lehrer. Nicht ganz optimiert und redundant weil unten nochmals, aber pragmatisch.
        # Lehrer rausfinden, anhand der Kürzel
        # Split nur bei Zeilenumbruch, so dass Leerzeichen in Fachnamen möglich sind
#        tokens = text.split(/\r?\n/) #Falls es Fachnamen mit Leerzeichen hat, dann müssen wir strikt Zeilen trennen. Siehe "Conv. francaise" etc.
        tokens = text.split(/[\r|\n|\s]/)
        
        teachers = []
        for token in tokens

          subtokens = token.split('/')
          token_teacher = subtokens[0].to_s.strip

          if not token_teacher.empty?
            teachers << token_teacher
          end
        end


        # Jedes Token in der Zelle verarbeiten. Konvention ist: Lehrer[/Fach[/Fachgruppe]]
        # Für jeden Lehrer je eine Lektion finden (ISU vorbereitet) oder neu erstellen
        for token in tokens

          # Optional kommt auch Fach und Fachgruppe darin vor
          subtokens = token.split('/')
          token_teacher = subtokens[0].to_s.strip
          token_subject = subtokens[1].to_s.strip
          token_subjects_group = subtokens[2].to_s.strip


          # Wenn mehrere Lehrer angegeben wurden dann müssen wir das Fach immer wieder vergessen.
          # Mehrere Lehrer im Excel können nicht mehrere Fächer zugewiesen werden, weil das mehrere Farben pro
          # Excel-Zelle sein müssten. Deshalb können wir das korrekte Fach nicht rauslesen.
          if teachers.size > 1
            subject = ''
          end


          # Fach von Farbe nehmen, falls nichts angegeben im Token
          if token_subject.empty?
            token_subject = subject

            if invalid_color
              log_cell("Fach nicht aus Farbe erkannt und fehlende Fachangabe. Farbe #{color}, Zellinhalt: #{text}")
            end
            
          end

          token_subject.gsub!('(f)', '')
        
        
          # In CSV schreiben
          add_csv(students_group_code, token_subject, token_subjects_group, token_teacher, day_index, lesson_index)
        
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
