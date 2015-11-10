clean:
	git clean -fxd

install:
	obt install

test:
	nbt verify --skip-layout-checks

build:
	nbt build

deploy:
	nbt configure
	nbt deploy-static ./__sw.js --destination service-worker/ --strip 1 --bucket ft-next-service-worker-prod --cache-control 'max-age=0'
