- TODO: Documentation for running, call out that this has live reloading

`dotnet tool install --global dotnet-ef`

# DB Migration strategy

The following process describes how to create a new database migration, apply it, and start the service with code updates to use updated database.

  - From project root directory, run `make up-db` to bring the database up.
  - Add new model or make model changes in the code.
  - From the backend-dotnet directory, run `dotnet ef migrations add MIGRATION_NAME` to create the migrations files.
  - Validate new migrations files in `/Migrations` directory and updates to the dbcontext model snapshot.
  - From the project root directory, run `SERVICE=backend-dotnet make up-migrations` to execute the migrations.
  - If migrations succeed, you can <CTRL-C> in the window running `make up-db` to bring the database down.
