# Underpressured

The website for Underpressured, a macOS app for image compression. Astro builds a static site. Cloudflare Workers serves it at `https://underpressured.app`.

## Run locally

Use Node.js 24 and Bun 1.4.4.

```bash
bun install --frozen-lockfile
bun run dev
```

## Commands

| Command                      | Action                                             |
| ---------------------------- | -------------------------------------------------- |
| `bun run check`              | Type-check Astro files.                            |
| `bun run lint`               | Lint scripts.                                      |
| `bun run stylelint`          | Lint CSS.                                          |
| `bun run format:check`       | Check formatting.                                  |
| `bun run test`               | Run unit tests.                                    |
| `bun run check:built`        | Build, then check links and canonicals in `dist/`. |
| `bun run deploy:check`       | Build and run a Wrangler dry run.                  |
| `bun run preview:cloudflare` | Build and serve with the local Cloudflare runtime. |

## Project map

| Path                                                 | Content                                               |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `src/pages/`                                         | Routes: `/`, `/benchmarks`, `/support`, 404.          |
| `src/components/home/`, `src/components/benchmarks/` | Page sections. Each `content.ts` holds the page text. |
| `src/shared/styles/`                                 | Palette, colors, and global CSS.                      |
| `src/shared/config/support.ts`                       | Web3Forms access key.                                 |
| `public/videos/`                                     | Published videos.                                     |
| `docs/design/`                                       | Icon, palette, and original video recordings.         |

## Docs

- [Deployment](docs/deployment.md): CI, Cloudflare setup, rollback.
- [Support form](docs/support-form.md): Web3Forms integration.
- [Videos](docs/videos.md): compress and publish feature videos.
- [AGENTS.md](AGENTS.md): code and CSS rules.
