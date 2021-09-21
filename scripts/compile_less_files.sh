#!/bin/bash

cd $( dirname "${BASH_SOURCE[0]}" )
cd ..

OPTS="--rewrite-urls=all --clean-css=--s1"

pushd web_root/files > /dev/null

lessc $OPTS less/style.less > css/style.css

pushd ../publications/timetables > /dev/null
lessc $OPTS timetable.less > timetable.css

# TODO weitere direkte LESS files

popd -2 > /dev/null
