import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [
      ["**/__tests__/components/**", "jsdom"],
      ["**/portal.test.*", "jsdom"],
    ],
    setupFiles: ["./vitest.setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})