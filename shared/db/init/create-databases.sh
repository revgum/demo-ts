#!/bin/bash

set -e
set -u

function create_database() {
	local database=$1
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE "$database";
	    GRANT ALL PRIVILEGES ON DATABASE "$database" TO $POSTGRES_USER;
EOSQL
}

if [ -n "$DB_NAMES" ]; then
	for db in $(echo $DB_NAMES | tr ',' ' '); do
		create_database $db
	done
	echo "Databases created"
fi
