#!/bin/bash

MYDIR=$(dirname "$0")

$MYDIR/../cli_tools/runTask.sh restartPharoUsingMonit

# Wait until end of pharo's parent-process (pharo-ui script)
while pgrep -f "pharo-ui.*albus_proplan.image" > /dev/null; do sleep 1; done

# Revalidate monit after 5 seconds, this will restart pharo
sleep 5
sudo monit validate
