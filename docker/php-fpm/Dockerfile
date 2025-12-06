FROM php:8.3-fpm

ARG UID
ARG GID

# Change user UID
RUN usermod -u $UID www-data
RUN groupmod -g $GID www-data

RUN apt-get update && apt-get install -y \
    apt-transport-https \
    libicu-dev \
    git \
    imagemagick \
    libfreetype6-dev \
    libpng-dev \
    libjpeg-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    zlib1g-dev \
    libxml2-dev \
    libbz2-dev \
    libssh2-1-dev \
    libzip-dev \
    iproute2 \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Some usefull php extension
RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ \
    && docker-php-ext-install gd
RUN docker-php-ext-install intl mysqli pdo_mysql zip soap bz2 xml

# ssl2 extension
RUN pecl install ssh2-1.3.1 \
    && docker-php-ext-enable ssh2

# OP Cache
RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache

# Install xdebug
#RUN pecl install xdebug-3.3.2 \
#    && docker-php-ext-enable xdebug \
#    && echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
#    && echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
#    && echo "display_errors = On" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
#    && echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini;

# X-debug with coverage support
RUN pecl install -o -f apcu xdebug-3.3.2 \
    && docker-php-ext-enable apcu xdebug \
    && rm -rf /tmp/pear
COPY ./docker/php/config/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# config php & extensions
COPY ./docker/php-fpm/conf/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php-fpm/conf/xdebug.ini ./docker/php-fpm/conf/apcu.ini /usr/local/etc/php/conf.d/
COPY ./docker/php-fpm/conf/opcache.ini /usr/local/etc/php/conf.d/

COPY ./docker/php-fpm/entrypoint.sh /usr/local/bin/entrypoint.sh
USER www-data
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
