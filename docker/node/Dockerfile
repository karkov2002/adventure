FROM node:20

ARG UID
ARG GID

# Change apache user UID
RUN usermod -u $UID node
RUN groupmod -g $GID node

#======================
# Adding some apps
#======================

RUN apt-get update && \
    apt-get install -y \
        wget \
        vim \
        git \
        yarn

# Workdir
WORKDIR /var/www/html

COPY ./docker/node/.bashrc /var/www/.bashrc

# Entrypoint
COPY ./docker/node/entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 3333