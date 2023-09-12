node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

.PHONY: demo

test: verify unit-test integration-test

build-dev:
	NODE_OPTIONS="--openssl-legacy-provider" webpack --watch --debug

PORT ?= 3010

build:
	NODE_OPTIONS="--openssl-legacy-provider" webpack --bail --debug

build-production:
	NODE_OPTIONS="--openssl-legacy-provider" webpack --bail -p

# TODO: Add proper integration tests with nightwatch
integration-test:
	node_modules/karma/bin/karma start karma.conf.js

unit-test:
	mocha test/unit/*.spec.js test/unit/**/*.spec.js --require babel-core/register --require babel-polyfill --exit

test-chrome:
	node_modules/karma/bin/karma start --autoWatch=true --singleRun=false --browsers=Chrome

test-firefox:
	node_modules/karma/bin/karma start --autoWatch=true --singleRun=false --browsers=Firefox

a11y:
	node .pa11yci.js
	PA11Y=true node demos/app

demo:
	node demos/app

run: build-dev server

server:
	http-server dist -p $(PORT) -c-1

deploy: build-production
	nht deploy-static `find . -path "./dist/*"` --strip 1 --bucket ft-next-service-worker-prod \
		--cache-control "max-age=0" --surrogate-control "max-age=600; stale-while-revalidate=60; stale-on-error=3600" --monitor
