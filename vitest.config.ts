import { defineConfig } from "vitest/config";

/** Fixed seed for CI property-based tests (PBT-08). */
export const PBT_FIXED_SEED = 2_026_090_2;

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
