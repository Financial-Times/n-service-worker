include n.Makefile

test: verify

build-dev: watch

server:
	http-server dist -p 3010

run: build-dev server

deploy: build-production
	nht deploy-static `find . -path "./dist/*"` --strip 1 --bucket ft-next-service-worker-prod --cache-control "max-age=0"
