#!/bin/bash

MYDIR=$(dirname "$0")

$MYDIR/../cli_tools/runTask.sh restartPharoUsingMonit

# Warten bis dieses pharo gestoppt ist. OPTIMIZE
while pgrep -af "pharo.*albus_proplan.image" > /dev/null; do sleep 1; done

sudo monit validate
