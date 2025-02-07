# Local development

## Running the full stack
The Makefile includes a target to launch the full stack (infrastructure, services) in `development` mode. In general, running `make` is the recommended way to build and launch a fresh stack everytime.

***Note: When you `ctrl-c` to exit a running stack, the containers will still be running in podman. If launching the stack shows errors about pre-existing containers running, you can run `make down` to tear down an existing stack or run `make` to launch a completely fresh stack.***

### Commands
- `make` : Tear down, build and launch a fresh full stack.
- `make up` : Bring up a running full stack.
- `make down` : Tear down the full stack.

## Attach a debugger to a backend service
The Makefile includes a target to launch a service with a docker-compose.debug.yaml by including a `SERVICE` variable to the make command:

```bash
SERVICE=backend make debug

***Building microservice base image***
...output...
***Starting backend in debug mode***
...output...
```

This behavior is intended to bring your service up in such a way that you can attach a debugger. The example in the `backend` service launches a node app with port `9229` mapped and ready to attach the VSCode debugger.

# Example application details
## [Backend](./app/backend/README.md)
A simple node backend microservice with postgres and dapr integration.
## [WebNuxt](./app/webnuxt/README.md)
A simple Nuxt server-side rendering application integrated to make API calls to the backend.

