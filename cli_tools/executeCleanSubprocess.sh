#!/bin/bash

# On Linux, all the opened files and sockets from the parent process (which is Pharo), will be inherited to subprocesses.
# Thats kind of stupid, we have to explicitlty close them, since the web server socket will be kept by the subprocess
# and if Pharo saves the image, it releases the sockets and immediately wants to get them again, but that will fail,
# since the subprocess still has it (unused) open

# Find file descriptor of open socket on pharos port
MYPID=$$

#fileDescriptor=$(lsof -w -a -i tcp:$PORT -c /pharo/i -F f | tail -n 1)

# Get tcp sockets. Ignoring first line, since lsof always outputs the PID there
fileDescriptors=$(lsof -a -p $MYPID -i tcp -F f | tail -n +2)

for fd in $fileDescriptors; do

		# Remove the first char "f", leaving the number
		fileDescriptor="${fd:1}"

		# Close the open socket file descriptor for that process,
		# so that it does not stick to it. (Its the parent web server listening socket)
		# echo "exec $fileDescriptor>&-"
		eval "exec $fileDescriptor>&-"

done


# Run the initially given command line
eval $@
