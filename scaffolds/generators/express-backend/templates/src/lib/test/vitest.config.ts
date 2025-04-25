import 'dotenv/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
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
