import { defaultExclude, defineConfig } from "vitest/config";

import { sharedViteConfig } from "./vite.shared.ts";

// Unit tests run in Node and use the same import aliases as the app.
export default defineConfig({
  resolve: sharedViteConfig.resolve,
  test: {
    name: "unit",
    environment: "node",
    include: ["*.spec.ts", "src/**/*.spec.ts", "scripts/**/*.spec.ts"],
    exclude: [...defaultExclude],
  },
});
