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
- This repository contains the **marketing landing page** plus a UI-only **authentication flow**
  (login/signup/OTP). There is no real dashboard/app, no backend integration, and no route
  protection yet — see Auth below.

## Tech stack

- **Vite** + **React 19** (JSX, no TypeScript in this repo)
- **Tailwind CSS v4**, wired in via `@tailwindcss/vite` — utility classes only, no separate CSS
  files per component
- **react-router-dom** for routing (`BrowserRouter`/`Routes`/`Route`, `Link`, `useNavigate`)
- **zustand** for state management — one small store per domain in `src/store/` (e.g.
  `authStore.js`), created with `create((set) => ({ ... }))`. Don't reach for React context or
  prop-drilling for cross-page/cross-step state; add a store instead.
- **react-hook-form** for form validation — `useForm`/`register` for plain inputs, `Controller`
  for custom controlled components (like `PinInput`). Shared validation rules live in
  `src/lib/validators.js`, not duplicated per form.
- `oxlint` for linting (`npm run lint`)
- No backend integration yet — auth actions are local/no-op (see Auth below).

## Structure

- `src/main.jsx` — entry point, mounts `<App />`
- `src/App.jsx` — the router shell only (`BrowserRouter` + `Routes`); no page content lives here
- `src/pages/` — one file per **route** (`LandingPage`, `LoginPage`, `SignupPage`,
  `VerifyOtpPage`, `NotFoundPage`). `NotFoundPage` is wired up as the catch-all
  `<Route path="*" element={<NotFoundPage />} />` in `App.jsx` — keep it last in the `<Routes>`
  list so it only matches unmatched paths. A page composes components and/or forms and is what a `<Route element={...}>`
  points to.
- `src/components/` — reusable/presentational pieces, both landing-page sections (`Navbar`,
  `Hero`, `Features`, `Formats`, `HowItWorks`, `Roles`, `CTASection`, `Footer`) and shared UI
  (`AuthLayout`, `PinInput`). Landing sections take no props and keep content as local const
  arrays; shared UI components (like `PinInput`) do take props since they're reused across pages.
- `src/store/` — zustand stores, one per domain (e.g. `authStore.js`).
- `src/lib/` — framework-agnostic helpers shared across pages, e.g. `validators.js`.
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

## Auth

Login and signup are **mobile number + 4-digit PIN only** — no email/password, ever.

- **Login** (`/login`): one form, mobile number + existing 4-digit PIN, submitted together.
- **Signup** (`/signup` → `/verify-otp`): enter mobile number → "Request OTP" navigates to
  `/verify-otp`. That page has two local stages in one component: enter the 4-digit OTP, then
  (on the same page) set + confirm a new 4-digit PIN to finish creating the account.
- Mobile numbers are Indian 10-digit numbers (`INDIAN_MOBILE_REGEX` in `src/lib/validators.js`,
  `[6-9]\d{9}`), always shown with a fixed `+91` prefix chip. OTP and PIN are always exactly 4
  digits (`OTP_REGEX`/`PIN_REGEX`, both `\d{4}`).
- `useAuthStore` (`src/store/authStore.js`) holds `mobile` (set by `SignupPage`, read by
  `VerifyOtpPage` so the mobile number doesn't need to be passed via query params) and
  `isAuthenticated`/`login`/`reset`. `login()` is a **local state flip only** — there is no
  backend call, no token, no session persistence. Treat every auth action in this repo as a UI
  stub to be wired to a real API later.
- There is **no route protection** — all routes are open. Don't add a `PrivateRoute`/redirect
  guard until there's an actual backend session to check against.
- No dashboard/home route exists after login/signup completes; both `LoginPage` and
  `VerifyOtpPage` just render an inline success state rather than navigating anywhere further.
- `PinInput` (`src/components/PinInput.jsx`) is the shared 4-box segmented digit input used for
  PIN and OTP alike (`masked` prop toggles dot-masking for PIN vs plain digits for OTP). It's a
  controlled component (`value`/`onChange`) meant to be used via `react-hook-form`'s `Controller`,
  not `register`. It selects a box's existing content on focus so re-typing over a filled box
  overwrites it instead of silently no-op'ing against the native `maxLength=1` — don't remove that
  `onFocus` handler.
- `AuthLayout` (`src/components/AuthLayout.jsx`) is the shared centered-card shell for all three
  auth pages (logo, heading, subheading, back-to-home link) — reuse it for any future auth-related
  page rather than rebuilding the card chrome.

## Conventions

- Mobile-first layout: base (unprefixed) Tailwind classes target mobile; use `sm:`/`md:`/`lg:` to
  scale up padding, font sizes, and grid columns for larger screens. Grids default to a single
  column and expand via `sm:grid-cols-*`/`lg:grid-cols-*`. Button groups stack (`flex-col`) on
  mobile and switch to a row (`sm:flex-row`) on larger screens.
- Keep new landing-page sections as separate components in `src/components/`, composed from
  `src/pages/LandingPage.jsx`; keep new routes as separate pages in `src/pages/`, wired up in
  `src/App.jsx`.
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
