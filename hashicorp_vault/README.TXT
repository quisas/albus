Vault Notizen

- Für mlock Berechtigung:
sudo setcap cap_ipc_lock=+ep vault

- vault nicht als root starten

- Beim allerersten Mal, manuell folgendes machen und die Sicherheits-Keys entgegennehmen:

export VAULT_ADDR='https://127.0.0.1:8200'
vault operator init

- Dann den key value store "kv" einschalten für Pfad albus

vault login <root-token>
vault secrets enable -path albus -version 2 kv
