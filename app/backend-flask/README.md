# Setup VSCode
VSCode should use your personal python venv, using command palette do "Select Intepreter" and add a new one targetting your venv install. (i.e. ~/python-venv)


# Local Development

- Copy `.env.example` to `.env` to set local environments necessary for the application to run.
- In a terminal window run `make up-db` to bring the localhost database up.
- In a terminal window, at this services path, common commands to run are;
  - **Create migrations for the model updates** :
    ```bash
    flask --app src/models db migrate
    ````
  - **Run migrations against local database** :
    ```bash
    flask --app src/models db upgrade
    ```
  - **Run the app in development mode** :
    ```bash
    flask --app src/app run -h 0.0.0.0 -p 3003 --extra-files src/ --debug
    ```
