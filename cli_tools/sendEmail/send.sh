#!/bin/bash
DIR=$( dirname "${BASH_SOURCE[0]}" )

"$DIR/sendEmail.pl" "$@" && echo 'OK'
