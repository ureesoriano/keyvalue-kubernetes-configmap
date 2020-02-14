.PHONY: build shell

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
