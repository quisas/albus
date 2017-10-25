# Albus

Open Source Schulverwaltung

## Produktive Installation

Bedingungen:

- Linux Server (z.B. Ubuntu Server)
- 

Varianten:

- via automatisiertem vagrant/ansible eine VM erstellen
- via halbmanuellem installieren durch Ansible mit playbook_install.yml auf einem eigenen Server


## Demo lokal installieren

* Installation einer Virtualisierungs-Lösung welche OVA-Dateien öffnen kann. Zum Beispiel VirtualBox.
** Download siehe https://www.virtualbox.org/wiki/Downloads
** Download für Windows direkt: http://download.virtualbox.org/virtualbox/5.1.14/VirtualBox-5.1.14-112924-Win.exe
* Download von voll konfiguriertem Albus-Server als virtuelle Maschine, siehe www.albus-soft.ch/downloads/albus-hogwarts-demo.ova
* ova-File mit Doppelklick öffnen (Öffnet sich mit VirtualBox)
** Evt. in den Netzwerk-Einstellungen den Typ "Bridge" auswählen
* Im Browser auf http://albus.hogwarts.local gehen und dort den Installer laufen lassen. Login: admin/dumbledore

Probleme:
* VM von virtualbox mit lokalen Pfaden?! Passt das OVA-Import an?
* Evt. besser deploy auf irgendeine virtualcloud?
* Deploy als exportierte OVA das Beste?

## Entwickler Installation

Demo = Appliance runterladen

* git-Repository clonen
* init.sh laufen lassen. Kopiert ein frisches Albus-Image.
* Im Webbrowser Installations-Wizard laufen lassen:
http://localhost:8080

## Upgrades

## Verzeichnisse und ihre Bedeutung

## Verwendete Komponenten
Pharo Smalltalk
Seaside Web Framework
Magritte Metamodelling
LibreOffice (für Dokumentenerzeugung und -konvertierung)
Etc. (ImageMagick, Linux, ...)