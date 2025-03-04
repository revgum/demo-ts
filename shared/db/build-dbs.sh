#!/bin/bash

set -e
set -u

function create_database() {
	local database=$1
	echo "Creating database '$database' for '$POSTGRES_USER' if it doesn't already exist."
	psql -h postgres -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE "$database";
	    GRANT ALL PRIVILEGES ON DATABASE "$database" TO $POSTGRES_USER;
EOSQL
}

echo "Waiting for postgres service to settle before building databases..."
sleep 10;

if [ -n "$DB_NAMES" ]; then
	for db in $(echo $DB_NAMES | tr ',' ' '); do
		create_database $db
	done
	echo "Databases built."
fi
