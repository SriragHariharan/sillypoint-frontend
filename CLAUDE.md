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
- This repository contains the **marketing landing page** plus a working **authentication flow**
  (mobile number + OTP, wired to the backend) ending in a minimal protected `/home` page. There is
  no real tournament dashboard yet.

## Tech stack

- **Vite** + **React 19** (JSX, no TypeScript in this repo)
- **Tailwind CSS v4**, wired in via `@tailwindcss/vite` — utility classes only, no separate CSS
  files per component
- **react-router-dom** for routing (`BrowserRouter`/`Routes`/`Route`, `Link`, `useNavigate`)
- **zustand** for state management — one small store per domain in `src/store/` (e.g.
  `authStore.js`), created with `create((set) => ({ ... }))`. Don't reach for React context or
  prop-drilling for cross-page/cross-step state; add a store instead.
- **react-hook-form** for form validation — `useForm`/`register` for plain inputs, `Controller`
  for custom controlled components (like `OtpInput`). Shared validation rules live in
  `src/lib/validators.js`, not duplicated per form.
- `oxlint` for linting (`npm run lint`)
- **react-hot-toast** for notifications (custom-styled, see Toasts below).
- **axios** for every HTTP call (`src/lib/api.js`). **Never use `fetch`.**
- **JavaScript only — no TypeScript**: `.js`/`.jsx` files only, no `.ts`/`.tsx`, no `@types/*`
  packages, no type annotations.
- Backend API base URL comes from `VITE_API_URL` (see `.env.example`; defaults to
  `http://localhost:3000/api`). The backend only allows the origin `http://localhost:5173`, so keep
  the dev server on port 5173.

## Structure

- `src/main.jsx` — entry point, mounts `<App />`
- `src/App.jsx` — the router shell only (`BrowserRouter` + `Routes`); no page content lives here
- `src/pages/` — one file per **route** (`LandingPage`, `MobileEntryPage`,
  `VerifyOtpPage`, `HomePage`, `NotFoundPage`). `NotFoundPage` is wired up as the catch-all
  `<Route path="*" element={<NotFoundPage />} />` in `App.jsx` — keep it last in the `<Routes>`
  list so it only matches unmatched paths. A page composes components and/or forms and is what a `<Route element={...}>`
  points to.
- `src/components/` — reusable/presentational pieces, both landing-page sections (`Navbar`,
  `Hero`, `Features`, `Formats`, `HowItWorks`, `Roles`, `CTASection`, `Footer`) and shared UI
  (`AuthLayout`, `OtpInput`, `FullPageLoader`) and route guards (`RequireAuth`, `RedirectIfAuthed`). Landing sections take no props and keep content as local const
  arrays; shared UI components (like `OtpInput`) do take props since they're reused across pages.
- `src/store/` — zustand stores, one per domain (e.g. `authStore.js`).
- `src/lib/` — framework-agnostic helpers shared across pages: `validators.js`, `constants.js`
  (OTP expiry / resend cooldown), `formatTime.js` (`mm:ss`), `api.js` (axios instance, interceptors,
  `getErrorMessage`), `authApi.js` (one function per auth endpoint), `session.js`
  (`restoreSession`, `signOut`), `sessionFlag.js` (non-sensitive "has a session" flag).
- `src/hooks/` — reusable hooks, e.g. `useCountdown.js`.
- Toasts: `src/components/AppToast.jsx` (the styled card) and `src/lib/notify.jsx`
  (`notifyError`, `notifyInfo`); `<Toaster />` is mounted once in `App.jsx`.
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

Login and signup are the **same flow**, matching the backend: **mobile number + OTP only** — no
email, no password, no PIN, ever.

- **Entry** (`/login` and `/signup`, both render `MobileEntryPage`, wrapped in `RedirectIfAuthed`):
  mobile number → `POST /auth/request-otp` → `{ userId, purpose }` (`signup` for a new number,
  `login` for a verified user; the UI never asks which) → `/verify-otp`.
- **Verify** (`/verify-otp`): 4-digit OTP → `POST /auth/verify-otp` with `{ userId, otp, purpose }`.
  Success returns `{ user, accessToken }` plus the refresh cookie, then the user goes to `/home`.
  Errors from the API (`Invalid OTP. N attempts left`, expired, `Too many attempts…`) are shown
  under the form. "Resend OTP" → `POST /auth/resend-otp`, shows "N resends left".
- **Session**: the access token lives **in memory only** (zustand `accessToken`, never persisted,
  never localStorage/sessionStorage). The refresh token is an HttpOnly cookie the JS cannot read;
  every request uses `withCredentials`. `api.js` attaches `Authorization: Bearer`, and on a `401`
  (except auth endpoints) does **one shared refresh** (`POST /auth/refresh`, single-flight because
  the backend rotates the refresh token on every use) and retries the request once; if the refresh
  fails the session is cleared and `RequireAuth` sends the user to `/login`.
- **App start** (`restoreSession()` in `App.jsx`): if the non-sensitive `localStorage` flag
  `sillypoint_session` exists it calls refresh → `GET /auth/me` and fills the store; otherwise the
  status is `unauthenticated` immediately (no pointless 401s for logged-out visitors). The store
  `status` is `loading | authenticated | unauthenticated`; guards show `FullPageLoader` while
  `loading`.
- **Guards**: `/home` is behind `RequireAuth`; `/login` and `/signup` redirect logged-in users to
  `/home` (`RedirectIfAuthed`); the Navbar shows "Dashboard" instead of Log in / Get Started when
  authenticated. **Log out** (`signOut()` on `HomePage`) calls `POST /auth/logout`, clears the store
  and the flag, and returns to `/`.
- **OTP timers** on `/verify-otp`: a "Code expires in mm:ss" countdown (10 min; mirrors backend
  `OTP_TTL_MS`, disables "Verify OTP" and shows an expired message at 0) and a "Resend OTP in
  mm:ss" countdown (30 s, **frontend-only** — the backend has no resend cooldown). The store keeps
  absolute end times (`otpExpiresAt`, `resendAvailableAt`, epoch ms) and `useCountdown` derives the
  remaining seconds from `Date.now()`, so timers survive refreshes without restarting. A note tells
  users not to refresh or close the page. The backend returns no timing fields, so these stay
  local constants; the server is still the authority (expired OTP → 400, too many resends → 429).
- `useAuthStore` (`src/store/authStore.js`): persisted to `sessionStorage` via zustand `persist`
  (only `mobile`, `userId`, `purpose`, `otpExpiresAt`, `resendAvailableAt`, so a refresh mid-OTP
  resumes); in memory: `user`, `accessToken`, `status`. Actions: `startOtp`, `restartOtpTimers`,
  `setSession`, `setAccessToken`, `clearSession`. Opening `/verify-otp` with no pending OTP
  redirects to `/login`.
- Mobile numbers are Indian 10-digit numbers (`INDIAN_MOBILE_REGEX` in `src/lib/validators.js`,
  `[6-9]\d{9}`), always shown with a fixed `+91` prefix chip. The OTP is always exactly 4 digits
  (`OTP_REGEX`, `\d{4}`).
- `OtpInput` (`src/components/OtpInput.jsx`) is the shared 4-box segmented digit input for the OTP.
  It's a controlled component (`value`/`onChange`) meant to be used via `react-hook-form`'s
  `Controller`, not `register`. It selects a box's existing content on focus so re-typing over a
  filled box overwrites it instead of silently no-op'ing against the native `maxLength=1` — don't
  remove that `onFocus` handler.
- **Toasts**: every server/API message (`getErrorMessage(error)` results, "New OTP sent. N resends
  left.", "session expired") is shown with `notifyError(...)` / `notifyInfo(...)`, never as an
  inline box. They appear top-center for `TOAST_DURATION_MS` (10 s, `src/lib/constants.js`), pause
  on hover, can be dismissed with ×, and are de-duplicated by message so repeated identical errors
  don't stack. Style follows the theme: error = red accent + solid red badge, info = black accent +
  black badge (no other hues). Only field-level validation errors (react-hook-form) stay inline
  under their input.
- `AuthLayout` (`src/components/AuthLayout.jsx`) is the shared centered-card shell for the auth
  pages and `HomePage` (logo, heading, subheading, back-to-home link) — reuse it for any future
  account-related page rather than rebuilding the card chrome.
- Adding a protected page: put it in `src/pages/`, wrap its `<Route>` element in `RequireAuth`, and
  call the API only through `src/lib/api.js` so token refresh works automatically.

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
