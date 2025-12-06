#!/usr/bin/env bash

set -e

: ${RED:='\033[0;31m'}
: ${GREEN:='\033[0;32m'}
: ${NOCOLOR:='\033[0m'}

UID=$(id -u)
USER=$(id -u -n)
echo -e "[${GREEN}UID="${UID}:${USER}"${NOCOLOR}]"

if [ "0" = "$UID" ]; then
    IS_ROOT=1
else
    IS_ROOT=0
fi

# Forward commands
if [ "$IS_ROOT" = "1" ]; then
	echo "${RED}[/!\ Root mode${NOCOLOR}]"
fi

/bin/bash -c "$*"
