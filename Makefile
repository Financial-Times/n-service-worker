include n.Makefile

test: verify

build:
	webpack src/__sw.js dist/__sw.js -p

deploy: build
	nht deploy-static ./dist/__sw.js --destination service-worker/ --strip 1 --bucket ft-next-service-worker-prod --no-cache
