FROM php:8.3-cli

ARG UID
ARG GID

# Change apache user UID
RUN usermod -u $UID www-data
RUN groupmod -g $GID www-data

# APT packages
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    libicu-dev \
    git \
    imagemagick \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    zlib1g-dev \
    libxml2-dev \
    mariadb-client \
    nano \
    unzip \
    libbz2-dev \
    libxml2-dev \
    libzip-dev \
    libssh2-1-dev \
    vim \
    wget \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/
RUN docker-php-ext-install intl mysqli pdo_mysql gd intl zip soap bz2

# ssl2 extension
RUN pecl install ssh2-1.3.1 \
    && docker-php-ext-enable ssh2

# User setup
RUN mkdir -p /var/www/.ssh && chown www-data:www-data /var/www/.ssh && chsh -s /bin/bash www-data

# PHP Configuration
COPY ./docker/php/config/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php/config/apcu.ini ./docker/php/config/xdebug.ini /usr/local/etc/php/conf.d/
COPY ./docker/php/.bashrc /var/www/.bashrc

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --filename=composer --install-dir=/usr/local/bin
ENV COMPOSER_HOME=/tmp/.composer
RUN chmod -R 777 /usr/local/bin/composer

# X-debug
RUN pecl install -o -f apcu xdebug-3.3.2 \
    && docker-php-ext-enable apcu xdebug \
    && rm -rf /tmp/pear
COPY ./docker/php/config/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Workdir
WORKDIR /var/www/html

# Entrypoint
COPY ./docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
