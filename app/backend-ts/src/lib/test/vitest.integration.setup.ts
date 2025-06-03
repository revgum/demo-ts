import { db } from '@/config';
import { buildServer } from '@/server';
import type { ContextKind } from '@/types';
import type { Context } from '@sos/sdk';
import type { Express } from 'express';
import { beforeAll, beforeEach } from 'vitest';

let server: { server: { app: Express }; context: Context<ContextKind> };

beforeAll(async () => {
  await getServer();
});

beforeEach(async () => {
  const startTime = Date.now();

  // Disable foreign key checks temporarily
  await server.context.db.raw('SET session_replication_role = replica');

  const tables = await server.context.db.raw(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = '${db.schema}'
  `);

  for (const row of tables.rows) {
    const table = row.tablename;
    if (!['knex_migrations', 'knex_migrations_lock'].includes(table)) {
      await server.context.db.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    }
  }

  // Re-enable foreign key checks
  await server.context.db.raw('SET session_replication_role = DEFAULT');

  // Give the DB some time after truncates to help with potential race conditions in tests
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log(`[Integration Test] : DB Truncation took ${Date.now() - startTime}ms`);
});

export const getServer = async () => {
  if (!server) {
    server = await buildServer();
  }
  return server;
};
