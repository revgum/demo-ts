## Open a commandline shell in the running container
Using the microservice name matching this service (ex. `app/{MICROSERVICE_NAME}`), execute commands using `podman compose` to jump into the container command line.
Often times this can be helpful when working with local database migrations, such as creating a new migration or inspect the local database.

```
podman compose exec backend-ts sh

// Commandline opened inside the running container

/app # npm run knex -- migrate:list

// Command output from inside the running container

> backend-ts@1.0.0 knex
> tsx ./node_modules/knex/bin/cli.js --knexfile ./src/db/knexfile.ts migrate:list

Working directory changed to /app/src/db
2025-05-05T16:28:55.687Z INFO [HTTPClient, HTTPClient] Sidecar Started
Using environment: development
Found 1 Completed Migration file/files.
20250205181503_todo-table.ts
Found 1 Pending Migration file/files.
20250505162040_my-new-migrations.ts

/app #
```

## Create a new migration
Using the microservice name matching this service (ex. `app/{MICROSERVICE_NAME}`), execute commands using `podman compose` to create a new migration file.

```
podman compose exec backend-ts npm run knex -- migrate:make my-new-migration

// Command output from inside the running container

> backend-ts@1.0.0 knex
> tsx ./node_modules/knex/bin/cli.js --knexfile ./src/db/knexfile.ts migrate:make my-new-migrations

Working directory changed to /app/src/db
2025-05-05T16:20:40.401Z INFO [HTTPClient, HTTPClient] Sidecar Started
Using environment: development
Using environment: development
Using environment: development
Created Migration: /app/src/db/migrations/20250505162040_my-new-migrations.ts

```
