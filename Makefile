include n.Makefile

test: verify

build:
	webpack src/__sw.js dist/__sw.js -p

build-watch:
	webpack src/__sw.js dist/__sw.js -p --watch

server:
	http-server dist -p 3010

run: build-watch server

deploy: build
	nht deploy-static ./dist/__sw.js --destination service-worker/ --strip 1 --bucket ft-next-service-worker-prod --no-cache
