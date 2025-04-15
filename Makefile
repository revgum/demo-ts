# Don't output the makefile errors
.IGNORE:
# Don't output the makefile commands being executed
.SILENT:
# Makefile targets don't correspond to actual files
.PHONY: setup build up up-db up-migrations up-dapr up-otel up-infra down-otel debug down prune login shell psql redis-cli

# Default target to bring up a fresh stack
all: build up

# Build the microservice base image
setup:
	echo "\n\n***Building microservice base image***\n\n"
	podman build ./shared/microservice -t microservice-build --build-arg NO_CERT=$$NO_CERT

# Build the stack
build:
	podman-compose --parallel 3 build

# Bring up the stack, stopping containers and removing anonymous volumes when stopped using CTRL-C
up:
	echo "\n\n***Bringing up the stack***\n\n"
	bash -c "trap 'trap - SIGINT SIGTERM ERR; echo ***Shutting down stack***; podman-compose down; exit 1' SIGINT SIGTERM ERR; podman-compose up --remove-orphans"

# Bring up the database, stopping containers and removing anonymous volumes when stopped using CTRL-C
up-db:
	echo "\n\n***Bringing up the db***\n\n"
	bash -c "trap 'trap - SIGINT SIGTERM ERR; echo ***Shutting down the db***; podman-compose down postgres postgres-build-dbs; exit 1' SIGINT SIGTERM ERR; podman-compose up postgres postgres-build-dbs"

# Run migrations for specified service.
up-migrations:
	echo "\n\n***Bringing up the $$SERVICE migrations***\n\n"
	bash -c "trap 'trap - SIGINT SIGTERM ERR; echo ***Shutting down the migrations***; podman-compose -f docker-compose.migrations.yaml down; cd -; exit 1' SIGINT SIGTERM ERR; cd app/$$SERVICE && podman-compose -f docker-compose.migrations.yaml build && podman-compose -f docker-compose.migrations.yaml up && podman-compose -f docker-compose.migrations.yaml down"

# Bring up Dapr services
up-dapr:
	echo "\n\n***Bringing up Dapr services**\n\n"
	bash -c "trap 'trap - SIGINT SIGTERM ERR; echo ***Shutting down Dapr services***; podman-compose down placement redis zipkin dapr-dashboard exit 1' SIGINT SIGTERM ERR; podman-compose up placement redis zipkin dapr-dashboard"

# Bring up Grafana OpenTelemetry stack running detached
up-otel:
	echo "\n\n***Bringing up the OpenTelemetry services***\n\n"
	bash -c "cd shared/otel && podman-compose up -d grafana-otel && cd -"

# Take down Grafana OpenTelemetry stack running detached
down-otel:
	echo "\n\n***Shutting down the OpenTelemetry services***\n\n"
	bash -c "cd shared/otel && podman-compose down grafana-otel && cd -"

up-infra: up-otel up-db

# Take down the stack
down:
	podman-compose down

# Bring up the stack, setting a single service in debug mode
debug: setup
	echo "\n\n***Bringing up a service in debug mode***\n\n"
	bash -c "trap 'trap - SIGINT SIGTERM ERR; echo ***Shutting down stack***; podman-compose -f docker-compose.yaml -f app/$$SERVICE/docker-compose.debug.yaml down; exit 1' SIGINT SIGTERM ERR; podman-compose -f docker-compose.yaml -f app/$$SERVICE/docker-compose.debug.yaml up -V"

prune:
	podman system prune
	podman volume prune --filter label!=io.podman.compose.project=demo

# Login to Dockerhub
login:
	podman login docker.io

# Run psql to connect to local postgres, default password is "postgres"
psql:
	echo "\n\n***Default user 'postgres' has default password 'postgres'***\n\n"
	podman run -it --rm --network demo_dapr-net postgres:17-alpine psql -h postgres -U postgres

redis-cli:
	podman run -it --rm --network demo_dapr-net redis:7-alpine redis-cli -h redis

# Run an alpine shell for very basic access to the dapr-net network to use tools like nc and ping
shell:
	podman run -it --rm --network demo_dapr-net alpine:latest

