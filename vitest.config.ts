import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    // Integration tests share the Prisma singleton; parallel file runs + per-file
    // $disconnect in afterAll caused flaky failures (e.g. project-auto-assign).
    fileParallelism: false,
  },
});
