#!/bin/bash

pushd web_root/files > /dev/null

lessc -x less/style.less > css/style.css

pushd ../publications/timetables > /dev/null
lessc -x timetable.less > timetable.css

# TODO weitere direkte LESS files

popd -2 > /dev/null
