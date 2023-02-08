#!/bin/bash

OUTPUTFILE="/tmp/albus_runTask_$1_output.txt"
MAXTIME=${2:-60}
HOSTNAME=`hostname`

# Vorheriges Outputfile löschen
rm -f $OUTPUTFILE

# TODO stone name variable. capture errors in output text and return exit code.
./executeSmalltalk.sh albus_gs363 <<EOF $OUTPUTFILE >& /dev/null
| taskClass db |
tasksClass := self db schoolConfigurator tasksClass.
db := ALDatabase current.

[
	result := taskClass $1.

	"Reagiere auf verschiedene Resultate"
	result isString
    ifTrue: [
	    output := result.
			db logError: output.
		]
    ifFalse: [
		  (result == false)
			  ifTrue: [
				  output := 'Fehler in Task'.
					db logError: output]
				ifFalse: [
					output := taskName, ' OK'.
					db logInfo: output]
    ]
] on: Error do: [:err |
  output := err description.
	db logError: output.
]
EOF

# # Albus via http kontaktieren, ohne nginx dazwischen
# STATUS=$(curl --silent --show-error --max-time $MAXTIME -w "%{http_code}" -H "X-From-RunTask-Script: Yes" -o $OUTPUTFILE http://$HOSTNAME:8083/runTask/$1)

# if [ $STATUS -ne 200 ]; then
# 		echo "HTTP Status $STATUS"
#     echo "Fehler in Task $1:"

# 		# NF removes empty lines
# 		if [ -f $OUTPUTFILE ]; then
# 				awk NF $OUTPUTFILE
# 		fi

#     exit 1
# fi
