# Local development

## Running the full stack
The Makefile includes a target to launch the full stack (infrastructure, services) in `development` mode. In general, running `make` is the recommended way to build and launch a fresh stack everytime.

***Note: When you `ctrl-c` to exit a running stack, the Makefile will capture that and bring the entire stack down. If launching the stack shows errors about pre-existing containers running, you can run `make down` to tear down an existing stack or run `make` to launch a completely fresh stack.***

### Commands
- `make` : Tear down, build and launch a fresh full stack.
- `make up` : Bring up a running full stack.
- `make down` : Tear down the full stack.

## Attach a debugger to a backend service
The Makefile includes a target to launch a service with a docker-compose.debug.yaml by including a `SERVICE` variable to the make command:

```bash
SERVICE=backend-ts make debug

***Building microservice base image***
...output...
***Starting backend-ts in debug mode***
...output...
```

This behavior is intended to bring your service up in such a way that you can attach a debugger. The example in the `backend-ts` service launches a node app with port `9229` mapped and ready to attach the VSCode debugger.

# Example application details
## [BackendTs](./app/backend-ts/README.md)
An example Typescript/Node backend microservice with postgres and dapr integration.
## [BackendDotnet](./app/backend-dotnet/README.md)
An example ASP.Net API backend microservice with postgres and dapr integration.
## [WebNuxt](./app/web-nuxt/README.md)
An example Nuxt server-side rendering application with dapr integration for making microservice API calls.
## [WebQwikjs](./app/web-qwikjs/README.md)
An example QwikJs server-side rendering application with dapr integration for making microservice API calls.

