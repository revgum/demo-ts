import type { Context } from '@/types';
import { type CommonConfig, Documentation, type Routing } from 'express-zod-api';
import { writeFile as writeFileAsync } from 'node:fs/promises';
import { join } from 'node:path';

export const buildOpenApiSpec = async (
  routing: Routing,
  config: CommonConfig,
  context: Context,
) => {
  const yamlString = new Documentation({
    routing,
    config,
    version: '1.0.0',
    title: 'Todo API',
    serverUrl: `http://${context.runtime.localhost ? 'localhost' : context.server.host}:${context.server.port}`,
    composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
  }).getSpecAsYaml();

  const openApiPath = join(__dirname, '..', 'public', 'openapi.yaml');

  return await writeFileAsync(openApiPath, yamlString, 'utf-8');
};
