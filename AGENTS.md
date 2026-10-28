# Underpressured

Astro site for the Underpressured macOS app: features, benchmarks, FAQ, and a support form. See `README.md` for commands and the project map.

## File names

- Use kebab-case for every file: `feature-video.astro`, `feature-video.module.css`.
- Use PascalCase for component identifiers in code: `import FeatureVideo from "./feature-video.astro"`.

## CSS Modules

These rules adapt `.agents/skills/css-modules` to Astro without React. This file wins over the skill. Do not generate a setup profile.

- Put one `name.module.css` next to each component.
- Write kebab-case class names (`.variant-ghost`). Read them as camelCase keys (`styles.variantGhost`). `vite.shared.ts` sets `localsConvention: 'camelCaseOnly'`.
- Combine classes with `class:list`. Do not build class names from strings.
- Pass runtime values as private `--_` custom properties, through `define:vars` or a `style` object.
- Import shared styles from `src/shared/styles/` with the `#styles/*` alias.
- `src/shared/styles/global.css` declares the layer order once: `reset, base, atoms, ui`.
  - `reset`: resets.
  - `base`: palette, semantic colors, document defaults.
  - `atoms`: shared primitives, only after project review. Empty now.
  - `ui`: page, layout, and component modules.
- Compose classes in markup.
- Do not invent spacing, sizing, typography, or color scales.
