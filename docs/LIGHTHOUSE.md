# Lighthouse scores

Lighthouse 12.2.1, headless Edge, against `npx serve out` on localhost. Order: Performance / Accessibility / Best Practices / SEO.

| Page | Before (2026-10-26) | After (2026-10-26) |
|---|---|---|
| `/` mobile | 90 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/` desktop | 95 / 100 / 100 / 100 | 100 / 96 / 100 / 100 |
| `/cv/` mobile | 84 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

## What changed
- Google Fonts stylesheet (render-blocking, caused FCP 2.9 s on mobile and CLS 0.3 on /cv/) replaced with self-hosted Inter via `next/font`.
- Removed unused `framer-motion` dependency.
- Added Open Graph / Twitter metadata, canonical URLs, favicon set, web manifest, robots.txt, sitemap.xml.

## Open items
- Desktop accessibility 96: in the new iCloud dark theme, `text-muted` (#98989d) over the coloured glows falls to 3.8-4.3:1 contrast (side nav, experience dates/points). Lighten dark `--muted` (e.g. #aeaeb2) or soften the glows behind text.
- `uses-long-cache-ttl` is a GitHub Pages hosting limit (10 min cache) and can't be changed from the repo.

## Re-run
```
npm run build
npx serve out -l 4603
CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npx lighthouse http://localhost:4603/ --chrome-flags="--headless=new"
```
