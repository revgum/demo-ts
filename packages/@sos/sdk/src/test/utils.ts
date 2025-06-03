import type { Logger } from 'pino';
import { vi } from 'vitest';

export const mockedLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  child: vi.fn(),
} as unknown as Logger;
