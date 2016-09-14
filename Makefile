include n.Makefile

test: verify test-unit

build-dev: watch

server:
	http-server dist -p 3010 -c-1

run: build-dev server

deploy: build-production
	nht deploy-static `find . -path "./dist/*"` --strip 1 --bucket ft-next-service-worker-prod --cache-control "max-age=0" --surrogate-control "max-age=600; stale-while-revalidate=60; stale-on-error=3600" --monitor

test-unit:
	karma start

test-chrome:
	karma start --autoWatch=true --singleRun=false --browsers=Chrome

test-firefox:
	karma start --autoWatch=true --singleRun=false --browsers=Firefox
