# Madhu Sudhan Srinivas: portfolio

Personal portfolio in a calm editorial "field notes" style (paper background, Inter with Instrument Serif italic accents).
Next.js 14 (App Router), TypeScript strict, Tailwind 3. Fully static export.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # static export to ./out
npx serve out -l 4600
```

`out/` can be uploaded to any static host. Nothing is deployed from this repo.

## Where things live

- `lib/data.ts`: every fact on the site (roles, projects, skills, education). Edit here only.
- `app/page.tsx`: main page. `app/cv/page.tsx`: plain, print-friendly CV at `/cv`.
- `components/Intro.tsx`: start-lights intro (once per session, skippable with Esc, skipped for reduced motion).
- `lib/engine.ts`: engine and beep sounds synthesised with the Web Audio API. Only plays after "Start engine" is clicked.
- `components/CircuitNav.tsx`: circuit-map navigation with a scroll-driven car marker; becomes a bottom sector bar on mobile.
- `components/TopBar.tsx`: name, live Melbourne/Dublin clocks ticker, DRS (motion effects) toggle, mute.

## Notes

- The circuit outline and skyline are hand-drawn approximations, not traced maps or photos.
- Project-card telemetry traces are decoration, and the page says so.
- Fan-made racing theme. Not affiliated with Formula 1 or the FIA.
