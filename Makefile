include n.Makefile

test: verify

build:
	webpack src/__sw.js dist/__sw.js -p

build-dev:
	webpack src/__sw.js dist/__sw.js -d --watch

server:
	http-server dist -p 3010

run: build-dev server

deploy: build
	nht deploy-static ./dist/__sw.js --destination service-worker/ --strip 1 --bucket ft-next-service-worker-prod --no-cache
