import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
    pool: "threads",
    maxWorkers: 1,
    isolate: false,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
