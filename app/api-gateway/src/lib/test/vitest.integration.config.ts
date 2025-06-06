import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    maxConcurrency: 1, // Safest because of db truncation between tests
    globals: true,
    environment: 'node',
    setupFiles: ['./src/lib/test/vitest.integration.setup.ts'],
    include: ['**/*.integration.test.*'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/instrumentation.ts',
        '**/openapi.ts',
        '**/seed.ts',
        '**/vitest.*.ts',
        '**/db/**',
        '**/*.d.ts',
      ],
    },
  },
});
