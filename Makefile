repo=gcr.io/mottu-321312/mottu
BRANCH=$(shell git describe --exact-match >/dev/null 2>&1 || echo $$(git rev-parse --abbrev-ref HEAD | sed 's/\//-/')- )
COMMIT=$(shell git describe --always)
TAG_NAME=$(BRANCH)$(COMMIT)
API ?= operation-planning-bff

ZEUS_REPO=$(repo)/zeus/attendance
APOLLO_REPO=$(repo)/apollo/attendance

build-and-push-production:
	docker build -t $(ZEUS_REPO)/$(API):$(TAG_NAME) .
	docker push $(ZEUS_REPO)/$(API):$(TAG_NAME)

build-and-push-homolog:
	docker build -t $(APOLLO_REPO)/$(API):$(TAG_NAME) .
	docker push $(APOLLO_REPO)/$(API):$(TAG_NAME)