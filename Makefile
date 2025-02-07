# Don't output the makefile errors
.IGNORE:
# Don't output the makefile commands being executed
.SILENT:
# Makefile targets don't correspond to actual files
.PHONY: setup build up down login shell psql debug

# Default target to bring up a fresh stack
all: setup build up

# Build the microservice base image
setup:
	echo "\n\n***Building microservice base image***\n\n"
	podman build ./shared/microservice -t microservice-build

# Build the stack
build: setup
	podman-compose build

# Bring up the stack
up: setup
	podman-compose up && podman-compose rm -fsv

# Bring up the stack while debugging a service,
# i.e. SERVICE=backend make debug
debug: setup
	echo "\n\n***Starting $$SERVICE in debug mode***\n\n"
	podman-compose -f docker-compose.yaml -f app/$$SERVICE/docker-compose.debug.yaml up

# Take down the stack
down:
	podman-compose down

# Login to Dockerhub
login:
	podman login docker.io

# Run psql to connect to local postgres, default password is "postgres"
psql:
	podman run -it --rm --network demo_dapr-net postgres:17-alpine psql -h postgres -U postgres
