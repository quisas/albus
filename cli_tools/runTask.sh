#!/bin/bash

OUTPUTFILE="/tmp/albus_runTask_$1_output.txt"
MAXTIME=${2:-60}
HOSTNAME=`uname -n`

# Vorheriges Outputfile löschen
rm -f $OUTPUTFILE

# Albus via http kontaktieren, ohne nginx dazwischen
STATUS=$(curl --silent --show-error --max-time $MAXTIME -w "%{http_code}" -H "X-From-RunTask-Script: Yes" -o $OUTPUTFILE http://$HOSTNAME:8083/runTask/$1)

if [ $STATUS -ne 200 ]; then
		echo "HTTP Status $STATUS"
    echo "Fehler in Task $1:"

		# NF removes empty lines
		if [ -f $OUTPUTFILE ]; then
				awk NF $OUTPUTFILE
		fi

    exit 1
fi
