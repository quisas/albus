#!/usr/bin/env bash

openssl req -x509 -newkey rsa:4096 -keyout albus_vault.key -out albus_vault.crt -days 365 -nodes -subj '/CN=localhost'

sudo mkdir /usr/share/ca-certificates/albus_vault
sudo cp albus_vault.crt /usr/share/ca-certificates/albus_vault/albus_vault-ca.crt
sudo sh -c 'echo "albus_vault/albus_vault-ca.crt" >> /etc/ca-certificates.conf'
sudo update-ca-certificates
