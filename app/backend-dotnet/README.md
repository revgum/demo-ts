- TODO: Documentation for running, call out that this has live reloading

`dotnet tool install --global dotnet-ef`

- TODO: figure out how to create the postgres-dotnet schema

- Migration strategy
  - make up-db (to run the db)
  - dotnet ef migration add (create a migration)
  - Run the docker-compose.migrations.yaml to run the program with the `--migrate` flag
  - once complete, run the docker-compose.yaml to run the program
