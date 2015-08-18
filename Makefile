clean:
	git clean -fxd

install:
	npm install origami-build-tools
	obt install

test:
	obt verify

build:
	obt build

deploy:
	nbt deploy-static ./sw.js --destination service-worker/ --strip 1 --bucket ft-next-service-worker-prod --cache-control 'max-age=0'
