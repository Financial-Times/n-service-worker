include n.Makefile

test: verify

build-dev: build
	webpack -d --watch

server:
	http-server dist -p 3010

run: build-dev server

deploy: build
	nht deploy-static `find . -path "./dist/*"` --strip 1 --bucket ft-next-service-worker-prod --no-cache
