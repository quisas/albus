backend "file" {
  path = "vault-backend"
}

listener "tcp" {
  address     = "127.0.0.1:8200"
  tls_cert_file = "albus_vault.crt"
  tls_key_file = "albus_vault.key"
}
