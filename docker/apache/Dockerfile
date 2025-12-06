FROM httpd:2.4

VOLUME ["/var/www/html"]

#======================
# Shell/bash config
#======================

ARG UID
ARG GID

# Change apache user UID
RUN usermod -u $UID www-data
RUN groupmod -g $GID www-data

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Alias - for all docker user
RUN echo 'alias ll="ls -lAh"' >> /etc/bash.bashrc

#======================
# Adding some apps
#======================

RUN apt-get update && \
    apt-get install -y \
        wget \
        vim \
        ghostscript \
        imagemagick \
        git

#===============================
# Adding apache modules & ssl
#===============================

COPY ./docker/apache/httpd.conf /usr/local/apache2/conf
COPY ./docker/apache/vhost.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf
RUN openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/ssl/private/ssl-cert-snakeoil.key -out /etc/ssl/certs/ssl-cert-snakeoil.pem -subj "/C=AT/ST=Vienna/L=Vienna/O=Security/OU=Development/CN=local.myapp"

# Expose listen port
EXPOSE 80 443