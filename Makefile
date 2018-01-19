SHELL := /bin/bash # Use bash syntax
.PHONY: run in mysql stop clean build install run-homolog run-dev ci-deploy-dev ci-deploy-homolog ci-deploy-prod ci-deploy-tests-dev

# Configure environment.
# ----------------------

export TZ=America/Sao_Paulo
export USER_ID=$(shell id -u)

# @TODO Hack for MacOSX or other OS which has the same group id
#       than the containers user.
export GROUP_ID=$(shell if [ `id -g` == '20' ]; then echo '1000'; else echo `id -g`; fi)

run:
	docker-compose run --service-ports --rm app

run-dev:
	docker-compose -f docker-compose.dev.yml up -d

in:
	docker exec -it $(shell docker-compose ps | grep _app_run_ | cut -d" " -f 1) /bin/bash

test:
	docker-compose run --service-ports --rm app scripts/test.sh

mysql:
	docker exec -it natura-poc-db mysql -h localhost -u root -ppassword drupal

stop:
	docker-compose stop

clean:
	docker-compose down

build:
	docker-compose build app

install:
	docker-compose run --entrypoint="./docker/run-entrypoint.sh" --rm app composer install

styles:
	./scripts/styles.sh

run-homolog:
	sudo docker-compose -f docker-compose.homolog.yml up -d

ci-deploy-dev: install styles
	ENV=dev ./scripts/ci-deploy.sh

ci-deploy-homolog: install
	ENV=homolog ./scripts/ci-deploy.sh

ci-deploy-prod: install
	ENV=prod ./scripts/ci-deploy.sh

ci-deploy-tests-dev: install
	ENV=dev ./scripts/ci-deploy-tests-dev.sh

default: run
