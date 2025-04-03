import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    globals: true,
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    deps: {
      inline: ["@testing-library/jest-dom"],
    },
  },
});

