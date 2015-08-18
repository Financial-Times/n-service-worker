clean:
	git clean -fxd

install:
	npm install origami-build-tools
	obt install

test:
	obt verify

build:
	obt build
