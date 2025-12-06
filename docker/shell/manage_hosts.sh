#!/bin/bash

# add host
if [ $1 = "add" ]
then
    grep -qxF $3' '$2 /var/www/hosts || printf "\n"$3" "$2 >> /var/www/hosts
# remove host
elif [ $1 = "del" ]
then
    #Tips to prevent "sed: cannot rename XXXX : Device or resource busy" error
    #For more information, see : http://blog.jonathanargentiero.com/docker-sed-cannot-rename-etcsedl8ysxl-device-or-resource-busy/
    cp /var/www/hosts /var/www/hosts.new
    sed -i '/^$/d' /var/www/hosts.new
    sed -i "/$2/d" /var/www/hosts.new
    cp -f /var/www/hosts.new /var/www/hosts
else
    echo "Command error ! Syntax must be : ./manage_hosts.sh add|del [HOSTNAME] [IP]"
fi