SHELL := /bin/bash

# Default env variables
APP_NAME = 
ENV ?= preprod

AWS_REGION ?= 
AWS_ACCOUNT_ID ?= 
AWS_ROLENAME ?= 
PULUMI_STATE_URL ?= s3://${AWS_ACCOUNT_ID}-${APP_NAME}-${ENV}-pulumi-state
PULUMI_CONFIG_PASSPHRASE ?= 
TARGET_DOMAIN ?= 
VCKIT_API_DOMAIN ?= api.${ENV}.${TARGET_DOMAIN}
VCKIT_DOMAIN ?= web.${ENV}.${TARGET_DOMAIN}
SEED_CONFIG_FILE_ID ?= 62df6b09f2e363392e196aac
CONFIGFILE_DATABASE_COLLECTION_NAME ?= configFile
DATABASE_SERVER_SELECTION_TIMEOUT ?= 3000

.EXPORT_ALL_VARIABLES: ; # send all vars to shell

install:
	cd apps/dvp-website && npm ci
	cd apps/api && npm ci

lint:
	cd apps/dvp-website && npm run lint
	cd apps/api && npm run lint

unit-test:
	cd apps/dvp-website && npm run test:coverage
	cd apps/api && npm run test:coverage

build:
	cd apps/dvp-website && npm run build
	cd apps/api && npm run build

# helper command to create a `artifacts` dir locally (mirroring what happens in CI pipeline)
create-artifacts-locally:
	mkdir -p ./artifacts
	cp -r apps/dvp-website/dist/. ./artifacts/dvp-website-build/
	cp -r apps/api/.webpack/. ./artifacts/api-build/

### Deployment
pulumi-preview:
	. scripts/run-pulumi.sh preview

pulumi-up:
	. scripts/run-pulumi.sh up

pulumi-destroy:
	. scripts/run-pulumi.sh destroy

# add config file to database
make seed-database:
	. scripts/seed-database.sh seed

make delete-seed:
	. scripts/seed-database.sh delete
