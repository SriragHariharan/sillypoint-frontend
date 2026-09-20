# Sillypoint — Frontend

## Product

Sillypoint is a cricket tournament management platform (web, mobile-first) for organizers, team
managers, scorers, players and spectators of local, college, corporate, club and amateur cricket.
It replaces the usual patchwork of WhatsApp groups, spreadsheets and paper scorebooks with one
system covering the full tournament lifecycle: create a tournament → register teams → generate
fixtures → schedule and score matches ball-by-ball → broadcast live scores → calculate standings
and statistics → crown a champion.

Full product requirements live in the team's Notion PRD ("Sillypoint"). Key things to know when
working on this app:

- **Tournament formats**: Round Robin, Single Elimination, Dynamic Knockout, and Group + Knockout.
  Dynamic Knockout (random pairing each round, sudden-death, byes for odd counts) is called out in
  the PRD as an important differentiator — it shows up in the landing page hero.
- **Roles**: Tournament Organizer, Team Manager, Scorer, and Spectator (no account required for
  spectators — public tournament/match pages).
- **Core principle**: tournament logic, fixture generation, match logic, and scoring logic are
  meant to stay separate layers (Tournament Engine → Fixture Engine → Match Engine → Scoring
  Engine → Live Broadcast). Don't conflate "who plays whom" (tournament/fixtures) with "what
  happens ball-by-ball" (scoring) if backend/domain code is added to this repo later.
- **Live scoring** is ball-by-ball and mobile-first; the intended architecture pushes updates to
  spectators over WebSocket without page refreshes.
- This repository currently contains only the **marketing landing page** for the product — there
  is no application/dashboard functionality here yet.

## Tech stack

- **Vite** + **React 19** (JSX, no TypeScript in this repo)
- **Tailwind CSS v4**, wired in via `@tailwindcss/vite` — utility classes only, no separate CSS
  files per component
- `oxlint` for linting (`npm run lint`)
- No routing, state management, or backend integration yet — the app is a single static page

## Structure

- `src/main.jsx` — entry point, mounts `<App />`
- `src/App.jsx` — composes the landing page from section components, in page order
- `src/components/` — one file per landing-page section (`Navbar`, `Hero`, `Features`, `Formats`,
  `HowItWorks`, `Roles`, `CTASection`, `Footer`, etc.). Each is a small, static, presentational
  component — no props, content defined inline or as local const arrays at the top of the file.
- `src/index.css` — `@import "tailwindcss";` plus a `@theme` block overriding the `red-*` color
  palette (see Theme below). Don't add component-scoped CSS files; use Tailwind utilities.
- `src/assets/` — image assets (e.g. `app_logo.png`, used as the logo/favicon)

## Theme

Brand palette is **red and white**, text in **black/gray only** — no other hues.

- Backgrounds: white by default, `bg-gray-50` for section contrast
- Primary accent: red, used for CTAs, icon backgrounds, highlights, borders
- Text: `text-gray-900`/`text-black` for headings, `text-gray-600`/`text-gray-700` for body copy

The red is intentionally a bold, deep "cricket ball leather" red rather than a bright/orange red.
This is implemented by overriding Tailwind's built-in `red-*` scale in `src/index.css` (`--color-red-600: #a6192e`
and related shades), so normal `red-*` utility classes (`bg-red-600`, `text-red-600`, `border-red-200`,
etc.) automatically pick up the custom tone — don't hardcode hex colors in components, use `red-*`
utilities so the palette stays centralized in one place.

## Conventions

- Mobile-first layout: base (unprefixed) Tailwind classes target mobile; use `sm:`/`md:`/`lg:` to
  scale up padding, font sizes, and grid columns for larger screens. Grids default to a single
  column and expand via `sm:grid-cols-*`/`lg:grid-cols-*`. Button groups stack (`flex-col`) on
  mobile and switch to a row (`sm:flex-row`) on larger screens.
- Keep new landing-page sections as separate components in `src/components/`, composed from
  `App.jsx`, matching the existing pattern.
- No comments in JSX/config for self-explanatory code; keep components free of unused
  boilerplate from the original Vite template.

## Commands

```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

Always run `npm run lint` and `npm run build` after making changes to verify nothing is broken.
