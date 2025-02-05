import Knex from "knex";
import config from "./knexfile";
import type { Context } from "../context";

export const knex = (env: Context["env"]) => Knex(config[env]);
