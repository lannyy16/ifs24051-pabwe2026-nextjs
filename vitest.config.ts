import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    environment: "jsdom",

    setupFiles: ["./src/setupTests.ts"],

    globals: true,

    coverage: {
      provider: "v8",

      reporter: ["text", "html", "lcov", "json"],

      include: [
        "src/**/*.{ts,tsx}",
      ],

      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/setupTests.ts",
        "src/test-utils.tsx",
        "src/server.ts",
        "src/types/**",
        "src/**/*.d.ts",
        "src/app/**/layout.tsx",
        "src/app/layout.tsx",
      ],

      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});