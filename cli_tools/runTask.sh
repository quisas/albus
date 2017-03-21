#!/bin/bash

OUTPUTFILE="./tmp/runTask_$1_output.txt"
MAXTIME=${2:-60}
HOSTNAME=`hostname`

# Vorheriges Outputfile löschen
rm -f $OUTPUTFILE

# curl --fail --silent --show-error --max-time $MAXTIME http://$HOSTNAME/runTask/$1 > $OUTPUTFILE
STATUS=$(curl --silent --show-error --max-time $MAXTIME -w "%{http_code}" -o $OUTPUTFILE http://$HOSTNAME/runTask/$1)

if [ $STATUS -ne 200 ]; then
	echo "Fehler in Task $1:"
	cat $OUTPUTFILE
	exit 1
fi
