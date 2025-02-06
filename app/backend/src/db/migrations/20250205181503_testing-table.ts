import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
		CREATE TABLE test (
			id SERIAL PRIMARY KEY,
			field1 VARCHAR (50) UNIQUE NOT NULL,
			created_at TIMESTAMP NOT NULL,
			updated_at TIMESTAMP
		);
	`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE test;');
}
