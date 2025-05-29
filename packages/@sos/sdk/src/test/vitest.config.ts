import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/vitest.setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/vitest.*.ts', '**/*.d.ts'],
    },
  },
});
