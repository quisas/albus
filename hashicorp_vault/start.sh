#!/usr/bin/env bash

# path
DIR="/opt/albus/main/hashicorp_vault"
PID_FILE="$DIR/vault.pid"

# ./pharo-ui --encoding latin1 -vm-display-X11 albus_proplan.image startup.st > log/pharo_$NOW.log 2>&1  &
/usr/bin/vault server --config=config.hcl > vault.log 2>&1  &

sleep 2

pidof /usr/bin/vault > $PID_FILE

