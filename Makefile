#############################################################################################
#
#  -- Makefile Docker LAMP project --
#
#############################################################################################

#################################
# Configuration
#################################

SHELL = /bin/bash -o pipefail
.DEFAULT_GOAL := help

# Include environment variables
include .env
export $(shell sed 's/=.*//' .env)

# Aliases
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_RUN = $(DOCKER_COMPOSE) run --rm
DOCKER_COMPOSE_EXEC = $(DOCKER_COMPOSE) exec

# Project name must be compatible with docker-compose
override PROJECTNAME := $(shell echo $(PROJECTNAME) | tr -d -c '[a-z0-9_]' | cut -c 1-55)

# Print output
# For colors, see https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
INTERACTIVE := $(shell tput colors 2> /dev/null)
COLOR_UP = 3
COLOR_INSTALL = 6
COLOR_WAIT = 5
COLOR_STOP = 1
PRINT_CLASSIC = cat
PRINT_PRETTY = sed 's/^/$(shell printf "\033[3$(2)m[%-7s]\033[0m " $(1))/'
PRINT_PRETTY_NO_COLORS = sed 's/^/$(shell printf "[%-7s] " $(1))/'
PRINT = PRINT_CLASSIC

#################################
# Main commands
#################################

# Build
build: ## Force (re)build and start container via docker compose
	$(DOCKER_COMPOSE) up -d --build
	$(DOCKER_COMPOSE_RUN) php /var/www/shell/manage_hosts.sh add $(HOSTNAME)

build-nocache: ## Force (re)build container via docker compose without using docker cache
	$(DOCKER_COMPOSE) build --no-cache --pull
	$(DOCKER_COMPOSE) up -d --force-recreate
	$(DOCKER_COMPOSE_RUN) php /var/www/shell/manage_hosts.sh add $(HOSTNAME)

# Install
install: start composer

# Start
start: ## Start container via docker compose
	$(DOCKER_COMPOSE) up -d
	$(MAKE) host

# Stop
stop: ## Stop all container
	$(DOCKER_COMPOSE) stop

# down
down: ## Stop and remove all container
	$(DOCKER_COMPOSE) down

host:
	$(eval WEB_IP := $(shell docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' c_${PROJECTNAME}_apache))
	$(DOCKER_COMPOSE_RUN) apache /var/www/shell/manage_hosts.sh del internal.$(HOSTNAME)
	$(DOCKER_COMPOSE_RUN) apache /var/www/shell/manage_hosts.sh add $(HOSTNAME) 127.0.0.1
	$(DOCKER_COMPOSE_RUN) apache /var/www/shell/manage_hosts.sh add internal.$(HOSTNAME) $(WEB_IP)

#################################
# Tools
#################################

composer:
	$(DOCKER_COMPOSE_RUN) -u www-data php composer install

# Php exec
php: ## Enter the docker shell of php container
	$(DOCKER_COMPOSE_RUN) -u www-data php bash

# Php exec
apache: ## Enter the docker shell of php container
	$(DOCKER_COMPOSE_RUN) -u www-data apache bash

# Php exec
mysql: ## Enter the docker shell of php container
	$(DOCKER_COMPOSE_RUN) -u www-data php mysql

# Run interactive sh inside node
node:
	$(DOCKER_COMPOSE_RUN) -u node node bash

ngrok:
	docker run --net=host -it -e NGROK_AUTHTOKEN=$(NGROK_AUTH_TOKEN) ngrok/ngrok:latest http --domain=$(NGROK_DOMAIN) 80

watch:
	$(DOCKER_COMPOSE_RUN) -u node node yarn watch

cache:
	$(DOCKER_COMPOSE_RUN) -u www-data php bin/console cache:clear --env=dev

import-dump:
	cp docker/dump/dump.sql.gz application/
	gzip -d application/dump.sql.gz
	$(DOCKER_COMPOSE_RUN) -u www-data php "mysql -h mariadb -u root -padmin adventure<dump.sql --ssl=OFF"
	rm -f application/dump.sql

export-dump:
	$(DOCKER_COMPOSE_RUN) -u www-data php "mysqldump -h mariadb -u root -padmin adventure>dump.sql --ssl=OFF"
	mv application/dump.sql docker/dump/dump.sql
	gzip docker/dump/dump.sql

#################################
# Tools & Quality Analysis rules
#################################

php-cs-fixer:
	$(DOCKER_COMPOSE_RUN) -u www-data php vendor/bin/php-cs-fixer fix --verbose

phpstan:
	$(DOCKER_COMPOSE_RUN) -u www-data php vendor/bin/phpstan analyse --level=5 src -vvv

#################################
# Tests
#################################

#phpunit:
#	$(DOCKER_COMPOSE_RUN) -u www-data php vendor/bin/phpunit
phpunit:
ifeq ("$(coverage)","text")
	$(DOCKER_COMPOSE_RUN) -u www-data php phpdbg -qrr vendor/bin/phpunit --coverage-text
else
ifeq ("$(coverage)","html")
	$(DOCKER_COMPOSE_RUN) -u www-data php php -d xdebug.mode=coverage vendor/bin/phpunit --coverage-html=phpunit-output-test/phpunit
	xdg-open ./application/phpunit-output-test/phpunit/index.html > /dev/null
else
	$(DOCKER_COMPOSE_RUN) -u www-data php vendor/bin/phpunit
endif
endif
