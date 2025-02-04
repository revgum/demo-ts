
.PHONY: setup build up down login

# Default target to bring up stack
all: setup build up

# Build the microservice base image
setup:
	@echo "Building microservice base image"
	@podman build ./shared/microservice -t microservice-build

# Build the stack
build: setup
	podman-compose build

# Bring up the stack
up: setup
	podman-compose up

# Take down the stack
down:
	podman-compose down

# Login to Dockerhub
login:
	podman login docker.io
