# [Setup an Azure Sandbox](./docs/setup-azure-sandbox.md)
# [Create a new service](./docs/create-new-service.md)
# Local development

## Setup
- (Windows) Install Podman, Podman Desktop and make sure the "Compose" extension is active.
- (Not Windows) Install podman and docker-compose

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

# Backend DB migration strategy
A common pattern for database migrations in a microservice environment is to have a deployment focused on performing the migration ahead of deploying the functional code updates. Performing database migrations are **expected to be non-breaking** to currently deployed code. In the rare case that a breaking change to the database must be deployed, these changes are expected to coincide with a downtime/maintenance window rollout.

Below is a description of the process of creating and deploying a migration;

1. Run `make up-db` in a terminal window to bring the database container up.
2. In a new terminal window, run the migration process for the specific backend service (see its README.md for details)
3. In a terminal window from this projects root directory, run the migration on localhost using the `SERVICE` variable to target a specific backend service. (i.e. `SERVICE=backend-ts make up-migrations`). Watch the output to validate that the migrations complete without issue.
4. Stop the terminal window with the database container running, it has been migrated and will launch properly in the next step.
5. Run `make` to bring the full stack up with migrations having run and the backend microservice ready for code updates to make use of the new structures.

# Connecting to the DB
The command `make psql` exists to launch the database container to establish a connection to the shared database. Because the database container exposes port `5432`, any postgres compatible database client could be used to establish a connection.

The database container must be running from within the full stack or on its own. Below is a description of the process, and sample output, for connecting to the database container.

1. *If the full stack is running, skip this step.* Run `make up-db` in a terminal window to bring the database container up.
2. Connect your database client to `localhost:5432` as user `postgres` with password `postgres`, **OR** run `make psql` to open a connection to and use the postgres CLI query tool.

Example usage output:
```
$make psql


***Default user 'postgres' has default password 'postgres'***


Password for user postgres:
psql (17.2)
Type "help" for help.

postgres=# \c postgres-ts
You are now connected to database "postgres-ts" as user "postgres".
postgres-ts=# \dt
                List of relations
 Schema |         Name         | Type  |  Owner
--------+----------------------+-------+----------
 public | knex_migrations      | table | postgres
 public | knex_migrations_lock | table | postgres
 public | test                 | table | postgres
(3 rows)

postgres-ts=# \c postgres-dotnet
You are now connected to database "postgres-dotnet" as user "postgres".
postgres-dotnet=# \dt
                 List of relations
 Schema |         Name          | Type  |  Owner
--------+-----------------------+-------+----------
 public | __EFMigrationsHistory | table | postgres
 public | test                  | table | postgres
(2 rows)

postgres-dotnet=# \q
```

# Example application details
## [BackendTs](./app/backend-ts/README.md)
## [WebNext](./app/web-nextjs/README.md)
An example NextJS server-side rendering application with dapr integration for making microservice API calls.

