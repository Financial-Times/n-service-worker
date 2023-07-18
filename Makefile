node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

.PHONY: demo

NODE_VERSION := $(shell node --version)
NODE_MAJOR_VERSION := $(shell echo $(NODE_VERSION) | cut -c2-3)

ifeq ($(NODE_MAJOR_VERSION),18)
	NODE_OPTS := "--openssl-legacy-provider --dns-result-order=ipv4first"
endif

test: verify unit-test integration-test

build-dev:
	NODE_OPTIONS=$(NODE_OPTS) webpack --watch --debug

PORT ?= 3010

build:
	NODE_OPTIONS=$(NODE_OPTS) webpack --bail --debug

build-production:
	NODE_OPTIONS=$(NODE_OPTS) webpack --bail -p

# TODO: Add proper integration tests with nightwatch
integration-test:
	NODE_OPTIONS=$(NODE_OPTS) node_modules/karma/bin/karma start karma.conf.js

unit-test:
	NODE_OPTIONS=$(NODE_OPTS) && mocha test/unit/*.spec.js test/unit/**/*.spec.js --require babel-core/register --require babel-polyfill --exit

test-chrome:
	NODE_OPTIONS=$(NODE_OPTS) node_modules/karma/bin/karma start --autoWatch=true --singleRun=false --browsers=Chrome

test-firefox:
	NODE_OPTIONS=$(NODE_OPTS) node_modules/karma/bin/karma start --autoWatch=true --singleRun=false --browsers=Firefox

a11y:
	NODE_OPTIONS=$(NODE_OPTS) node .pa11yci.js
	PA11Y=true node demos/app

demo:
	NODE_OPTIONS=$(NODE_OPTS) node demos/app

run: build-dev server

server:
	NODE_OPTIONS=$(NODE_OPTS) http-server dist -p $(PORT) -c-1

deploy: build-production
	nht deploy-static `find . -path "./dist/*"` --strip 1 --bucket ft-next-service-worker-prod \
		--cache-control "max-age=0" --surrogate-control "max-age=600; stale-while-revalidate=60; stale-on-error=3600" --monitor
