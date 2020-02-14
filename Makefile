.PHONY: build shell test test/watch

KUBECONFIG ?= ~/.kube/config
docker-run := docker run \
	--rm -ti \
	--env-file config/environment \
	-v $(shell pwd):/code \
	-v $(KUBECONFIG):/code/.kube/config \
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
