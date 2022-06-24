#!/usr/bin/env bash

# path
DIR="/opt/albus/main/hashicorp_vault"
PID_FILE="$DIR/vault.pid"

/usr/bin/vault server --config=config.hcl > vault.log 2>&1  &

sleep 2

pidof /usr/bin/vault > $PID_FILE

