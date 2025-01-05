#/bin/sh

# Als root laufen lassen

# vault scheint ein Problem zu haben, und manchmal dbus-Prozesse zu starten und nicht zu beenden:
# https://support.hashicorp.com/hc/en-us/articles/20562543907859-Vault-1-13-7-and-Linux-DBus-leftover-processes
export DBUS_SESSION_BUS_ADDRESS=/dev/null

/usr/bin/vault status -tls-skip-verify
