import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/lib/test/vitest.setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/instrumentation.ts',
        '**/openapi.ts',
        '**/seed.ts',
        '**/vitest.config.ts',
        '**/db/**',
        '**/*.d.ts',
      ],
    },
  },
});
