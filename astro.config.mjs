// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import { patchCssModules } from "vite-css-modules";
import sitemap from "@astrojs/sitemap";

import { sharedViteConfig } from "./vite.shared.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Cherry Bomb One",
      cssVariable: "--font-cherry-bomb-one",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["cursive"],
    },
  ],
  output: "static",
  site: "https://underpressured.app",
  trailingSlash: "always",
  vite: {
    ...sharedViteConfig,
    plugins: [
      patchCssModules({
        generateSourceTypes: true,
        declarationMap: true,
      }),
    ],
  },
});
