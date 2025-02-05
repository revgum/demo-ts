import type { Knex } from "knex";
import { env } from "./config";
import { knex } from "./db/db";

export type Context = {
	env: "development" | "staging" | "production";
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	db: Knex<any, unknown[]>;
};

export const context: Context = {
	env,
	db: knex(env),
};
