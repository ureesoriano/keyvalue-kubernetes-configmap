.PHONY: build shell test test/watch

docker-run := docker run \
	--rm -ti \
	-v $(shell pwd):/code \
	keyvalue-kubernetes-configmap:latest

build:
	docker build \
		-t keyvalue-kubernetes-configmap:latest \
		.

shell: build
	$(docker-run) bash

test: build
	$(docker-run) npm run test

test/watch: build
	$(docker-run) npm run test/watch
