# Albus

Open Source Schulverwaltung

# Produktive Installation

Die folgenden Schritte sind für einen Software-Entwickler gedacht, welcher die Albus Installation seiner Schule pflegt.
Albus läuft auf einem Linux Server (z.B. Ubuntu Server), andere Server-Betriebssysteme sind nicht ausgeschlossen, jedoch
ohne spezifische Dokumentation.


## 1. Basis-Installationsschritte

Auf der Entwicklungsumgebung:

* `git clone https://github.com/quisas/albus-vagrant.git`
* `cd albus-vagrant`
* `cp albus.yml.template albus.yml`
* Eigenes git-Repository erstellen für den schulspezifischen Smalltalk-Code ("albus-schuleXY"
* Eigenes git-Repository erstellen für die schulspezifischen Dateien
* albus.yml bearbeiten und darin die eigene Konfiguration speichern

Fahren Sie weiter bei 2a oder 2b

## 2a. Installieren auf neuem VM-Server

Empfohlen für Entwickler oder als Evaluationsumgebung. Damit wird mittels [vagrant](http://vagrantup.com) eine eigene VM erstellt,
welche sodann als Entwicklungsumgebung oder Evaluations-Server verwendet werden kann, oder auch als produktiven Server
weiterverwendet werden kann.

* Alle folgenden Arbeiten auf dem VM-Host:
* VirtualBox installieren (<https://www.virtualbox.org/wiki/Downloads>)
* Vagrant installieren (<http://vagrantup.com>)
* Basis-Installation, siehe Punkt 1
* `vagrant up --provision dev`

## 2b. Installieren auf einem eigenen Server

Empfohlen für produktive Umgebung. Damit kann ein Linux-Server eigener Wahl aufgesetzt werden, und mittels ansible für Albus automatisch konfiguriert werden.

* Eigener Linux-Server aufsetzen (z.B. Ubuntu Server)
* Alle folgenden Arbeiten auf dem Linux-Server:
* Ansible installieren (<http://docs.ansible.com/ansible/latest/intro_installation.html>)
* Basis-Installation, siehe Punkt 1
* `ansible-playbook playbook_install.yml`

# Weitere Infos

## Smalltalk Quellcode

Der Quellcode der Kernapplikation ist in einem eigenen Repository gespeichert: <https://github.com/quisas/albus-smalltalk-code>

## Instant-Demo lokal installieren

* Installation einer Virtualisierungs-Lösung welche OVA-Dateien öffnen kann. Zum Beispiel VirtualBox.
  * Download siehe https://www.virtualbox.org/wiki/Downloads
  * Download für Windows direkt: http://download.virtualbox.org/virtualbox/5.1.14/VirtualBox-5.1.14-112924-Win.exe
* Download von voll konfiguriertem Albus-Server als virtuelle Maschine, siehe www.albus-soft.ch/downloads/albus-hogwarts-demo.ova
* ova-File mit Doppelklick öffnen (Öffnet sich mit VirtualBox)
  * Evt. in den Netzwerk-Einstellungen den Typ "Bridge" auswählen
* Im Browser auf http://albus.hogwarts.local gehen und dort den Installer laufen lassen. Login: admin/dumbledore

Probleme:
* VM von virtualbox mit lokalen Pfaden?! Passt das OVA-Import an?
* Evt. besser deploy auf irgendeine virtualcloud?
* Deploy als exportierte OVA das Beste?


## Verwendete Komponenten

* Pharo Smalltalk (<http://www.pharo.org>)
* Seaside Web Framework (<http://www.seaside.st>)
* Magritte Metamodelling
* LibreOffice (für Dokumentenerzeugung und -konvertierung)
* Verschiedene Linux Utilities (ImageMagick, wkhtmltopdf, ...)
