import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));

export default defineConfig({
  resolve: { alias: { "@": root } },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    unstubGlobals: true,
  },
});
