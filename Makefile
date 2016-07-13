include n.Makefile

test: verify

build: test
	webpack src/__sw.js dist/__sw.js -p

deploy:
	nbt configure
	nbt deploy-static ./__sw.js --destination service-worker/ --strip 1 --bucket ft-next-service-worker-prod --cache-control 'max-age=0'
