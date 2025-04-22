- Install Knex globally to work with migrations [link](https://knexjs.org/guide/migrations.html)
- Install Dapr locally [link](https://docs.dapr.io/getting-started/install-dapr-cli/)
  u)
  - Init dapr with podman `dapr init --container-runtime podman`, the default Dapr configurations live in `~/.dapr` and should work as defaults

# Development

## Run "locally" outside of the container stack

At times you may want to run the microservice and attach to its database without the full stack up and running. In order to do so, follow these steps;

- Run the dapr containers from the project root, `make up-dapr`
- Run the db container from the project root, `make up-db`
- Run the application in a separate window, `npm run start:localhost` or `npm run debug:localhost`

Add `DEBUG=1` to start commands to enable additional debug logging; `DEBUG=1 npm run start:localhost`

## Run the stack
