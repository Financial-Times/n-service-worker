include n.Makefile

test: verify unit-test

build-dev: watch

PORT ?= 3010
SW_ENV=// check circle deets

server:
	http-server dist -p $(PORT) -c-1

run: build-dev server


deploy: build-production build-appcache
	mv dist/__sw.js dist/__sw-${SW_ENV}.js
	nht deploy-static `find . -path "./dist/*"` --strip 1 --bucket ft-next-service-worker-prod \
		--cache-control "max-age=0" --surrogate-control "max-age=600; stale-while-revalidate=60; stale-on-error=3600" --monitor

build-appcache:
	node appcache/generate.js
	node appcache/generate.js landing
	cp appcache/loader.html dist/__appcache-manifest-loader.html
	cp appcache/loader-landing.html dist/__appcache-manifest-loader-landing.html

unit-test:
	karma start

test-chrome:
	karma start --autoWatch=true --singleRun=false --browsers=Chrome

test-firefox:
	karma start --autoWatch=true --singleRun=false --browsers=Firefox
