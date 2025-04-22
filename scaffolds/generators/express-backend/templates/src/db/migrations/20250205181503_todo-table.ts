import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
		CREATE TABLE todo (
			id UUID PRIMARY KEY,
			title text NOT NULL,
			completed boolean NOT NULL DEFAULT false,
			due_at TIMESTAMP WITH TIME ZONE,
			created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
			updated_at TIMESTAMP WITH TIME ZONE,
			deleted_at TIMESTAMP WITH TIME ZONE
		);
	`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE todo;');
}
