#!/usr/bin/env bash

# path
DIR="/opt/albus/main/hashicorp_vault"
PID_FILE="$DIR/vault.pid"

killall --wait --user albus vault

rm $PID_FILE
