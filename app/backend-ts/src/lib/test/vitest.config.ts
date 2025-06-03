import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/lib/test/vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/*.integration.test.*', '**/node_modules'],
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
