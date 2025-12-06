#!/usr/bin/env bash

IS_ROOT=1

# Disable XDebug
if [ ! ${XDEBUG_ENABLE} = 1 ]; then
    rm -f /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
fi

# Disable Blackfire
if [ ! ${BLACKFIRE_ENABLED} = 1 ]; then
    rm -f /usr/local/etc/php/conf.d/blackfire.ini
fi

# Start PHP-FPM
if [ "$IS_ROOT" = "0" ]; then
    php-fpm
else
    sed -i -e "s/user.*/user = root/" /usr/local/etc/php-fpm.d/www.conf
    sed -i -e "s/group.*/group = root/" /usr/local/etc/php-fpm.d/www.conf
    php-fpm -R
fi