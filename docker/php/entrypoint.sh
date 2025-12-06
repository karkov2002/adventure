#!/usr/bin/env bash

set -e

: ${RED:='\033[0;31m'}
: ${GREEN:='\033[0;32m'}
: ${NOCOLOR:='\033[0m'}

UID=$(id -u)
USER=$(id -u -n)
echo -e "[${GREEN}UID="${UID}:${USER}"${NOCOLOR}]"
echo "XDEBUG : $XDEBUG_ENABLE"

if [ "0" = "$UID" ]; then
    IS_ROOT=1
else
    IS_ROOT=0
fi

# Disable Xdebug if needed
if [ "$XDEBUG_ENABLE" = "0" -a "1" = "$IS_ROOT" ]; then
    rm -f /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
    echo -e "[${RED}XDebug is disabled${NOCOLOR}]"
else
    echo -e "[${GREEN}XDebug is enabled${NOCOLOR}]"
fi

# Forward commands
if [ "$IS_ROOT" = "1" ]; then
	echo "[${RED}/!\ Root mode${NOCOLOR}]"
fi

if [ "$1" = "bash" -o "$*" = "xdebug" ]; then
    /bin/bash
elif [ "$1" = "xdebug" ]; then
    /bin/bash -c "${*:2}*"
elif [ "$1" = "mysql" ]; then
    /bin/bash -c "mysql -u root -p${MYSQL_ROOT_PASSWORD} -h mariadb"
else
    /bin/bash -c "$*"
fi
