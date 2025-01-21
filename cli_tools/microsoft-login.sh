#!/bin/bash

# Script only needed as alternative too builtin Pharo Zinc HTTP get

JSON=$(curl -s --max-time 5 -X GET -H "Authorization: Bearer $1" -H "Content-Type: application/json; charset=utf-8" https://graph.microsoft.com/v1.0/me)

# echo $JSON

# echo $JSON | jq -e -r ".mail,.givenName,.surname"
echo $JSON | jq -e -r ".mail"
