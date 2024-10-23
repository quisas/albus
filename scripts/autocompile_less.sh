#!/bin/sh

inotifywait --monitor --timeout 0 --event close_write --includei '^.*\.less$' "../web_root/files/less/" |
    while read dir action file; do
      echo "The file '$file' has changed ..."
      ./compile_less_files.sh
      echo "... less compilation finished"
    done
