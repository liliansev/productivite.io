import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.{ts,svelte}"],
      exclude: ["src/lib/components/ui/**"],
    },
  },
  resolve: {
    alias: {
      $lib: "/src/lib",
      $app: "/node_modules/@sveltejs/kit/src/runtime/app",
    },
  },
});
