# Copyright 2017 The Caicloud Authors.
#
# The old school Makefile, following are required targets. The Makefile is written
# to allow building multiple binaries. You are free to add more targets or change
# existing implementations, as long as the semantics are preserved.
#
#   make        - default to 'build' target
#   make lint   - run eslint
#   make doctoc - doctoc of README.md
#   make container ${VERSION}    - build containers
#   $ docker login -u admin -p Pwd123456 -e caicloud cargo.caicloudprivatetest.com
#   make push ${VERSION}    - push containers
#
# The makefile is also responsible to populate project version information.

#
# Tweak the variables based on your project.
#

# Current version of the project.
VERSION ?= v0.1.0

# Target binaries. You can build multiple binaries for a single project.
TARGETS := node-project

# Container image prefix and suffix added to targets.
# The final built images are:
#   $[REGISTRY]/$[IMAGE_PREFIX]$[TARGET]$[IMAGE_SUFFIX]:$[VERSION]
# $[REGISTRY] is an item from $[REGISTRIES], $[TARGET] is an item from $[TARGETS].
IMAGE_PREFIX ?= $(strip )
IMAGE_SUFFIX ?= $(strip )

# Container registries. You can use multiple registries for a single project.
REGISTRIES ?= cargo.caicloudprivatetest.com/caicloud

#
# These variables should not need tweaking.
#

# Project main package location (can be multiple ones).
CMD_DIR := ./cmd

# Project output directory.
OUTPUT_DIR := ./

# Build direcotory.
BUILD_DIR := ./build

# Git commit sha.
COMMIT := $(shell git rev-parse --short HEAD)

#
# Define all targets. At least the following commands are required:
#

# All targets.
.PHONY: container push

container:
	@for target in $(TARGETS); do                                                      \
	  for registry in $(REGISTRIES); do                                                \
	    image=$(IMAGE_PREFIX)$${target}$(IMAGE_SUFFIX);                                \
	    docker build -t $${registry}/$${image}:$(VERSION)                              \
	      -f $(BUILD_DIR)/$${target}/Dockerfile .;                                     \
	  done                                                                             \
	done

push: container
	@for target in $(TARGETS); do                                                      \
	  for registry in $(REGISTRIES); do                                                \
	    image=$(IMAGE_PREFIX)$${target}$(IMAGE_SUFFIX);                                \
	    docker push $${registry}/$${image}:$(VERSION);                                 \
	  done                                                                             \
	done

.PHONY: lint
lint:
	npm run lint

DOCTOC := $(shell command -v doctoc 2> /dev/null)

.PHONY: doctoc
doctoc:
ifndef DOCTOC
	$(error "doctoc is not available, ref: https://github.com/thlorenz/doctoc")
endif
	doctoc README.md