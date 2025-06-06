import type { Knex } from 'knex';
import { vi, type Mocked } from 'vitest';

export const buildMockDbChain = (): Mocked<Knex.QueryBuilder> => {
  let mockDbChain: Mocked<Knex.QueryBuilder>;

  mockDbChain = {
    where: vi.fn().mockImplementation(() => mockDbChain),
    andWhere: vi.fn().mockImplementation(() => mockDbChain),
    orderBy: vi.fn().mockImplementation(() => mockDbChain),
    offset: vi.fn().mockImplementation(() => mockDbChain),
    limit: vi.fn().mockImplementation(() => mockDbChain),
    count: vi.fn().mockImplementation(() => mockDbChain),
    update: vi.fn().mockImplementation(() => mockDbChain),
    insert: vi.fn().mockImplementation(() => mockDbChain),
    returning: vi.fn().mockImplementation(() => mockDbChain),
    first: vi.fn().mockImplementation(() => mockDbChain),
    rollback: vi.fn().mockImplementation(() => mockDbChain),
    commit: vi.fn().mockImplementation(() => mockDbChain),
  } as unknown as Mocked<Knex.QueryBuilder>;

  return mockDbChain;
};
