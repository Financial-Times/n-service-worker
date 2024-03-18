node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

.PHONY: demo

test: echo "no tests"

build-dev:
	webpack --watch --debug

PORT ?= 3010

build:
	webpack --bail --debug

build-production:
	webpack --bail -p

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
