#!/bin/bash

set -e
set -u

function create_database() {
	local database=$1
	local schema=$2
	local test_schema=$(echo $2)_test
	echo "Creating database '$database' for '$POSTGRES_USER' if it doesn't already exist."
	psql -h postgres -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" <<-EOSQL
					CREATE DATABASE "$database";
	    GRANT ALL PRIVILEGES ON DATABASE "$database" TO $POSTGRES_USER;
EOSQL
	echo "Creating schema '$schema' in '$database' if it doesn't already exist."
	psql -h postgres --username "$POSTGRES_USER" -d "$database" <<-EOSQL
		-- Create schemas
		CREATE SCHEMA IF NOT EXISTS $schema;
		CREATE SCHEMA IF NOT EXISTS $test_schema;
EOSQL
}

echo "Waiting for postgres service to settle before building databases..."
sleep 10;

if [ -n "$DB_NAMES" ]; then
	for db in $(echo $DB_NAMES | tr ',' ' '); do
		for schema in $(echo $SCHEMA_NAMES | tr ',' ' '); do
			create_database $db $schema
		done
	done
	echo "Databases built."
fi
