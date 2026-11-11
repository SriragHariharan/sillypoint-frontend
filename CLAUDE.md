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
- **lucide-react** for icons (see Icons below).
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
  `VerifyOtpPage`, `DashboardPage`, `NotFoundPage`). `NotFoundPage` is wired up as the catch-all
  `<Route path="*" element={<NotFoundPage />} />` in `App.jsx` — keep it last in the `<Routes>`
  list so it only matches unmatched paths. A page composes components and/or forms and is what a `<Route element={...}>`
  points to.
- `src/components/` — reusable/presentational pieces, both landing-page sections (`PublicNavbar`,
  `Hero` (light hero "Every ball counts" with `HeroGround`, an animated top-down cricket ground that replays one delivery to a SIX on a 10 s loop using native SVG animation plus the flat `HeroHud` overlay; `usePrefersReducedMotion` swaps it for a still frame, and the CSS animation tokens live in `index.css`), `FeaturedTournaments`, `HowItWorks`, `CTASection`, `Footer`; the whole landing page follows the app's red & white theme: white sections alternating with `bg-gray-50`, gray-900/600 text, red-600 accents, soft low-opacity red radial glows, white cards (`border-gray-200 bg-white shadow-sm`, red-600 hover border), the pill eyebrow (`border-red-200 bg-red-50 text-red-700`) + big black-weight headline from `SectionHeading`, and a red gradient CTA panel with concentric rings; `TournamentCard`, `TournamentCardSkeleton`, `StatusBadge` and `Skeleton` are light-only, there is no dark variant; `Footer` is light) and shared UI
  (`AuthLayout`, `OtpInput`, `FullPageLoader`) and route guards (`RequireAuth`, `RedirectIfAuthed`). Landing sections take no props and keep content as local const
  arrays; shared UI components (like `OtpInput`) do take props since they're reused across pages.
- **Navbars** (three, flat in `src/components/`): `PublicNavbar` is the marketing bar for logged-out
  visitors (logo, Tournaments / How it works, Log in / Get Started, full-width mobile menu
  with the CTAs; the landing page always uses it with the `glass` prop, which floats the bar over the page as frosted white glass, so the hero has top padding for it; other public pages keep the solid sticky bar; it shows a Dashboard button when logged in).
  `AppNavbar` is the logged-in bar: logo, Dashboard / Tournaments / Create links, and `ProfileMenu`
  (the avatar account menu: photo, mobile number, Add/Change photo, Remove photo with an inline confirm,
  links on mobile, Log out). Nav link data lives in `src/lib/navLinks.js`; from `sm` the desktop links are icon-only (with `aria-label` / `title`) and the labels only appear from `lg` (1024px), so the bar never overflows at tablet widths. Profile photo upload/remove goes
  through `useAvatar` (`src/hooks/useAvatar.js`: validates with `validateAvatar`, calls `userApi.js`
  `PUT`/`DELETE /users/me/avatar`, toasts, and `updateUser({ avatar })` in `authStore` so the navbar,
  dashboard and other views update instantly). The photo also shows on the dashboard profile card and
  as the organizer photo on tournament details. With `bottomTabs` (default) it also renders a
  fixed mobile bottom tab bar (Dashboard, Tournaments, Mine, Teams, Create) — pages using it must add `pb-16 sm:pb-0`
  to their root so content isn't hidden (`DashboardPage`, `AddTournamentPage`). `Navbar` is the switch
  for public pages shared by both audiences (`/tournaments*`): `AppNavbar` when authenticated, without
  the bottom tabs by default (so it doesn't clash with the sticky "Add my team" bar on
  `TournamentDetailsPage`); pages without a sticky bar (`TournamentsPage`, `MatchDetailsPage` via
  `TournamentPageShell`) pass `bottomTabs` and add `pb-16 sm:pb-0` for logged-in users, a logo-only bar while the
  session is `loading` (no flash), else `PublicNavbar`. Auth screens keep `AuthLayout` (no navbar).
- `AddTournamentPage` (`/tournaments/new`, behind `RequireAuth`, linked from `DashboardPage`): create-tournament
  form (name, description, logo, location, last date of registration (required, not in the past, on or before the start date; `lastRegistrationDateValidation`; the API returns it as `lastRegistrationDate` plus a server-derived `registrationClosed`: once closed, `TournamentDetailsPage` hides "Add my team" and shows `RegistrationClosedNote`, the "Last date to register" callout (`RegistrationDeadline`) sits above the Add my team button in `TournamentSidebar` and `MobileAddTeamBar`, and `ManageRescheduleForm` won't allow a start date before it), start/end date, registration fee, prize money, players per side (5-11, default 11) and substitutes per side (0-4, default 4); the last two are fixed after creation, validated by `playersPerSideValidation` / `substitutesPerSideValidation`, and the page composes `TournamentDateFields`, `TournamentMoneyFields` and `TournamentSquadSizeFields`) inside `AppNavbar` (flat on mobile, card from `sm`). Description uses `RichTextEditor`
  (TipTap: bold, italic, underline, bullet/numbered lists) via `Controller` and is submitted as an
  HTML string. `src/lib/tournamentApi.js` sends `POST /tournaments` as multipart `FormData`
  (matches the backend's `POST /api/tournaments`). Validation rules live in `validators.js`.
- `DashboardPage` (`/home`, behind `RequireAuth`; the post-login landing page): profile card (photo, mobile number, verified badge,
  log out; hidden below `sm`, where the `AppNavbar` avatar menu covers it — names are not supported yet), stat tiles (organized / live / upcoming
  from `GET /tournaments?organizerId=<me>` totals), quick actions, and the user's recent
  tournaments as `TournamentCard`s with shimmer, empty and retry states. It uses the `user` from
  `useAuthStore`.
- `TeamsPage` (`/teams`) lists the user's teams as `TeamCard`s: the whole card opens `TeamDetailsPage` (the name is a stretched link) while the Edit button stays a separate, higher button. `TeamDetailsPage` (`/teams/:id`, behind `RequireAuth`, `AppNavbar`) shows the team (logo, name, manager, mobile, Edit), `TeamSummary` tiles (Played, Won, Lost, Tied, Upcoming from `summary`), status chips (`FilterChips`: All, Upcoming, Live, Completed, Cancelled, kept in the URL `?status=`) and the team's match history as `TeamMatchCard`s with Load more. Data comes from `useTeamMatches(teamId)` (`src/hooks/useTeamMatches.js`: `fetchTeam` once per team plus `GET /teams/:id/matches` through `fetchTeamMatches` in `src/lib/teamApi.js`, page size 10); a team that is missing or belongs to someone else shows "Team not found". `TeamMatchCard` shows tournament and stage, the state / result badge for this team (Won solid red, Lost gray, Tied outline, Live / Upcoming / Cancelled via `StatusBadge`, "Not started" when the date has passed without scoring), both sides with logos and scores (the team's own side highlighted), the result text and the date, and links to `/matches/:id`.
- `MyTournamentsPage` (`/my-tournaments`, behind `RequireAuth`, `AppNavbar`; nav link "My tournaments" ("Mine" on the mobile bottom tab; `NAV_LINKS` entries may carry a `desktopLabel`), plus a "View all" link on the Dashboard's "Your tournaments" block): every tournament the logged-in user created, including past and cancelled ones, via `GET /tournaments?organizerId=<me>` (no extra backend endpoint; the list endpoint already filters by organizer). It shares the list with the public `TournamentsPage` through `useTournamentList({ organizerId? })` (`src/hooks/useTournamentList.js`: URL-synced `q` / `status`, 300 ms debounced search, page size 12, Load more, retry) and the `TournamentList` component (search box, status chips, count, skeletons, error, empty state with page-specific text and optional action, grid of `TournamentCard`). Cards open the normal tournament details page.
- `TournamentsPage` (`/tournaments`) and `TournamentDetailsPage` (`/tournaments/:id`) are **public**
  (no `RequireAuth`) and mobile-first. `TournamentDetailsPage` only composes `Tournament*` components
  (`TournamentHeader` (logo, status, name, and the location and dates below the name), `TournamentTabs`, `TournamentOverviewTab`, `TournamentTeamsTab`, `TournamentMatchesTab`, `TournamentSidebar`, …).
  The tab bar sits directly under the header; the Overview tab holds all the details (`TournamentInfoGrid`: last date to register, fee, prize money, players and substitutes per side; the location and dates live in `TournamentHeader`) and the description, while Teams and Matches are their own tabs (no info cards above the tabs). The sidebar (organizer, manage, deadline callout + Add my team) stays beside the tab content
  and the `useTournamentDetails` / `useTournamentTeams` / `useTournamentMatches` / `useAddTeamFlow` hooks, which own
  the data loading and flows; tab definitions are in `src/lib/tournamentTabs.js`. Both are backed by the real API through `fetchTournaments` /
  `fetchTournamentDetails` in `src/lib/tournamentApi.js` (`GET /tournaments?q&status&page&limit` →
  `{ tournaments, page, limit, total }`; `GET /tournaments/:id` → `{ tournament }` with
  `organizer: { id, mobile }`; 404 = not found). The API has no format, team count or organizer
  name/photo, so the UI doesn't show them. The Matches tab lists `GET /tournaments/:id/matches` as `MatchCard`s; the organizer (while upcoming/live) gets an "Add Match" button opening `AddMatchModal` (team A VS team B selects from the enrolled teams, date, time, optional stage label from `src/lib/matchStages.js` shown as a badge on `MatchCard`, optional notes; `POST /tournaments/:id/matches` via `src/lib/matchApi.js`). Each `MatchCard` links to the public `MatchDetailsPage` (`/matches/:id`, `GET /matches/:id`: teams, stage, date/time in IST, tournament location, notes; the top card header links the tournament name to its details page and leaves room for a live score/scorecard block under the teams); the tournament's organizer can reschedule a not-yet-started match there via `RescheduleMatchModal` (`PATCH /matches/:id/reschedule`) and, for its organizer, the scorer access card (there is no scorer to add: every match gets its login link and PIN when it is created). `MatchDetailsPage` loads and saves through `useMatchDetails`. The organizer of a match sees `ScorerAccessCard` (via `useScorerAccess`, `GET /matches/:id/scorer/access`): the login link (`scorerLinkUrl` in `src/lib/scorerApi.js`, `<origin>/scorer/<token>`) as a compact strip (about 130px tall on a phone, 82px from `sm` up where the link and PIN sit side by side): the login link on one truncated line and the 6-digit PIN masked as dots (rendered as real text only while revealed with the eye button, so it is not in the page while masked), each with an icon-only Copy button that copies the real value, to share with whoever will score. The scorer is not a user: `/scorer/:token` (`ScorerLoginPage`, the 6-digit PIN only, `POST /scorer/login`, listed in `AUTH_PATHS` so a wrong PIN doesn't trigger a user token refresh) leads to `/scorer/:token/welcome` (`ScorerWelcomePage`, the placeholder for the scoring UI, behind `RequireScorer`). The scorer's single JWT (plus the link token it belongs to) is persisted in `localStorage` by `useScorerStore` (`src/store/scorerStore.js`, key `sillypoint-scorer`; this is the one token allowed in localStorage, the user access token stays memory-only), so a refresh keeps them logged in. `RequireScorer` / `useScorerSession` re-read the session from `GET /scorer/me` (`match`, `serverTime`, `scoringOpensAt`; no scorer name; kept in memory, `serverOffsetMs` = server clock minus device clock): 401/409 clears the session and sends them to the login page of the same link, a network error shows a retry panel and does not log them out. A persisted session for the same link also skips the login page. `api.js` sends the scorer token (not the user token) on `/scorer/*` calls and never tries a user refresh for them. Scoring opens 30 minutes before the match starts: before `scoringOpensAt`, `ScorerWelcomePage` shows `ScorerWaitingScreen` (match details, countdown via `useCountdown` and `formatDuration`, log out); at 0 it re-checks with the server (`requestRefresh`), which also picks up a reschedule.
  Once scoring is open, `ScorerWelcomePage` also renders `ScorerMatchActions` with two buttons. **Add players** links to `ScorerPlayersPage` (`/scorer/:token/players`, behind `RequireScorer`; redirects back to the welcome page while scoring is not open): one wide page (`max-w-5xl`) with both teams in two columns side by side from `sm` up, and on phones as a swipeable slider showing one team card at a time (`SquadSlider`: CSS scroll-snap strip plus a sticky two-tab team switcher with logo, name and `n/15`; tapping a tab slides to that team, swiping updates the tab, both cards stay mounted so one Save still saves both teams; pressing Save with an error on the other team slides to it and puts a red dot on its tab), one name input per row, each team with as many player rows and substitute rows as its tournament allows (`squadLimits(match.tournament)` in `src/lib/squad.js`, from `playersPerSide` / `substitutesPerSide`; the Substitutes section is hidden when that is 0; the server also rejects more) (names only for now, no roles; each player is `{ name }` so more fields can be added later) and a live `n/total` count. `SquadForm` (react-hook-form, one form for both teams) is built from `SquadColumn` / `PlayerRow`; the rule is `playerNameValidation` in `validators.js` (max 60 characters, no duplicate name within a team). Blank rows are dropped on save, so saving fewer than 15 is allowed and the rest can be added later; `useSquads` loads `GET /scorer/players` and saves `PUT /scorer/players` (both teams in one request, replace-all), and the saved players keep their order (the playing XI order is the batting order). **Toss** opens `TossModal` (team `Select` + Batting/Bowling radio buttons, `PUT /scorer/toss`, pre-filled when already set); the result is written into the store with `setMatch` and shown as "X won the toss and chose to bat/bowl." (`tossSummary`). The toss and the players can be changed until scoring starts. **Overs per side** opens `OversModal` (one number input, digits only via blocked keys and paste cleaning plus `oversPerSideValidation`; 1-50 from `src/lib/overs.js`; `PUT /scorer/overs` saves `oversPerSide`, which is written into the store with `setMatch` and shown as "N overs per side" by `oversSummary`; can be changed until scoring starts). **Start scoring** checks `isMatchReady(match, squads)` (`src/lib/squad.js`: toss made, overs per side set and the full playing XI saved for both teams; substitutes optional): if not ready it shows an error toast ("Before the start of the match, players must be nominated, the toss must be made and overs per side must be set."), otherwise it goes to `ScorerScoringPage` (see Scoring below; it redirects back to the welcome page if scoring isn't open or the match isn't ready). Once the first innings has started (`match.scoringStartedAt`) the Add players / Toss / Overs buttons are disabled (the server rejects those changes) and Start scoring reads "Continue scoring". `handleScorerError` (`src/lib/scorerErrors.js`) toasts scorer API errors and clears the session on a 401. The Teams tab
  lists enrolled teams from `GET /tournaments/:id/teams`.
  List filters (search debounced 300 ms, status) live in the URL query string and are applied
  server-side, with "Load more" paging; the details tab lives in the URL. Loading uses shimmer
  skeletons (`Skeleton`, `TournamentCardSkeleton`, `TournamentDetailsSkeleton`; the `shimmer`
  animation is in `index.css`). Requests use an `AbortController` and pages derive `loading` from a
  request key instead of setting state in effects. The organizer never sees "Add my team" (the backend also returns 403); instead
  `ManageTournament` offers Reschedule (`PATCH /tournaments/:id/reschedule`) and Cancel
  (`POST /tournaments/:id/cancel`) and Edit prize money (`PATCH /tournaments/:id`, only `prizeMoney`; the registration fee set at creation can never change) while the tournament is upcoming or live. "Add my team" sends logged-out users to `/login`, adds
  a single team directly, or opens `AddTeamsModal` for several (`POST /tournaments/:id/teams`);
  `EnrolledTeamCard` shows the manager name, plus the manager mobile only for the tournament's organizer (the API returns `manager_mobile` only to them; `useTournamentTeams` reloads when the logged-in user changes), and Remove (`DELETE /tournaments/:id/teams/:teamId`) to the organizer and to
  whoever added the team. Tournaments carry `registrationFee` (0 shows "Free") and `prizeMoney` (hidden when 0) on cards and details, and `playersPerSide` / `substitutesPerSide` (shown as "Players per side" / "Substitutes per side", "None" when 0) in `TournamentInfoGrid` on the details page. `FeaturedTournaments` shows tournaments still open for registration (`GET /tournaments?registrationOpen=true`, closing soonest first) on the
  landing page. The Navbar hash links are absolute (`/#features`) so they work from non-landing
  pages. Creating a tournament navigates to its details page.
## Scoring (scorer)
`ScorerScoringPage` (`/scorer/:token/scoring`) loads `GET /scorer/scoring` through `useScoring` (`src/hooks/useScoring.js`) into `useScoringStore` (`src/store/scoringStore.js`: `data` = the last server response, `preview`, `busy`; reset on leave) and picks the view: `InningsSetup` (opening batters and bowler via `Select`; also the innings break with the target and an Undo for the first innings), `ScoringScreen` (innings in progress) or `MatchResultCard`; a Scoring / Scorecard tab bar shows the generated scorecard (`ScorecardPanel` → `ScorecardView`). The server is the source of truth: every action returns the whole state, `useScoring.run` allows one request at a time, a 409 (stale version / repeated tap) toasts the message and refetches, other errors go through `handleScorerError`. All calls are in `src/lib/scoringApi.js`; each change sends `expectedVersion` (`current.version`).
**The scoring page never scrolls: it fits in one viewport (`h-dvh`) on phones, tablets and laptops.** `ScorerScoringPage` is `h-dvh flex flex-col overflow-hidden`: a one-row header (`← Back`, teams, and a Score / Card toggle) and a `<main>` that only scrolls as a safety net on extremely short screens (the Scorecard tab and its tables scroll inside that pane). In portrait the screen is one column (score card, players card, then the run pad taking all remaining height); in landscape and from `lg` it is two columns (`landscape:` / `lg:` variants: score + players on the left, run pad full height on the right). `src/index.css` defines the custom variant `short` (`max-height: 700px`) used to tighten padding and font sizes on short screens. Verified at 320x568 up to 1920x1080 (portrait and landscape phones, tablets, laptops): no page or pane overflow and pad buttons at least 48px tall. When changing this layout, keep that guarantee.
`ScoringScreen` = `ScoreHeader` (one card: score, overs, run rate, the chase line "Target, need X off Y, RRR", a **Free hit** badge and the single-row "Over" ball chips via `BallChips compact`), one bordered "players" card made of `CreaseCard` (two one-line batter rows, striker highlighted with `*`, and a **Swap** button) and `BowlerCard` (one line with O-M-R-W and **Change** while allowed), and `ScoringControls`, whose `RunPad` is a 4x4 grid that fills the remaining height: `0 1 2 3` / `4 5 6 Wicket` / `Wide No ball Bye Leg bye` / `Overthrow Undo Retire End innings` (4 and 6 are boundaries; a free hit tints the pad border red; End innings asks for a confirm). `BallSheet` handles wide / no ball / bye / leg bye / overthrow (overthrow: runs completed before the throw + overthrow runs 1-3 or 4 = boundary; it shows the total and who will be on strike); `WicketModal` (ball type, how out, who is out for a run out, fielder, runs completed; the types are filtered for a wide, a no ball and a free hit); `RetireModal`. Dialogs use `ModalShell` (`max-h-[92dvh]`, pinned footer, scrolls inside if needed). After a wicket or an over `PlayerPickerModal` opens and **cannot be dismissed**: it is driven by `current.pending` from the server (so it also appears after a refresh or an Undo), the run pad is disabled meanwhile, and bowlers who bowled the last over or are at their quota are disabled with the reason. Crease-dependent dialogs are only rendered while both batters are present. `src/lib/scoringRules.js` mirrors the strike-rotation rule (`runsRunOf`, `predictCrease`) so the batters flip instantly while the request is on its way; the server response replaces it. Team / player helpers are in `src/lib/scoringTeams.js`.
**The match concludes by itself:** the moment the second innings decides it (the last ball, all out, target reached, or End innings on the 2nd innings, whose confirm says "End the match?") the backend saves the result (`match.completedAt`, `winnerTeamId`, `resultSummary`) and the match is final. There is no Conclude button. The server then rejects every change, undo included (409 `MATCH_OVER`), and `current.canUndo` is false, so `ScorerScoringPage` shows `MatchResultCard` (result, "Match completed" label, only Back to match). `isMatchCompleted(match)` / `winnerOf(match)` live in `src/lib/matchResult.js`. On the welcome page a completed match replaces `ScorerMatchActions` (no Add players / Toss / Overs / Start or Continue scoring) with `ConcludedResult` ("Match completed", the winner's logo and name or "Match tied", `resultSummary`, a View scorecard link) and the title becomes "Match completed"; a match still in progress keeps Continue scoring.
The public `MatchDetailsPage` shows `MatchScorecardSection` once scoring has started (result banner + `ScorecardPanel`, `GET /matches/:id/scorecard` via `useScorecard`): batting card (R, B, 4s, 6s, SR, how out, did not bat), extras, fall of wickets, bowling card (O, M, R, W, Wd, Nb, Econ) and an over-by-over timeline per innings. No polling or WebSocket yet.

- **Icons**: use `lucide-react` icons (or inline SVG) instead of emojis. Size them with Tailwind (`h-4 w-4 shrink-0`),
  color with theme classes (`text-red-600`) and mark decorative ones `aria-hidden="true"`. `TournamentCard` uses `MapPin`
  (location), `Calendar` (dates), `Ticket` (entry fee) and `Trophy` (prize money).
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

## Design system (default for every page)

The landing page's **premium red & white style is the default for all pages, new and existing** —
build or restyle any page/component in it (load the `premium-ui` skill, `.claude/skills/premium-ui/SKILL.md`,
for the full recipe). The essentials:

- White surfaces, alternating with `bg-gray-50`; never a dark section or `dark` variants.
- No red radial glows or gradient backgrounds behind headers, cards, forms, loaders or the scoring page (they looked bad). The soft glow exists only in the landing sections (`Hero`, `FeaturedTournaments`, `HowItWorks`); don't add it elsewhere. Decoration is limited to faint dotted orbit rings and the concentric-ring red panel (`RingsBackdrop`).
- Pill eyebrow (`eyebrowClass`) + black-weight headline (`headingClass`) with one red accent word; body `text-gray-600`.
- White cards `rounded-2xl border border-gray-200 bg-white shadow-sm`, red hover border (`hover:border-red-600 hover:shadow-md`) when clickable; glass (`bg-white/90 backdrop-blur`) for floating surfaces.
- Buttons are rounded-full: `primaryButtonClass` (red, `shadow-red-600/25`) and `secondaryButtonClass` (white, gray border, red on hover). Inputs: `inputClass` / `fieldGroupClass` (`formStyles.js`). Don't paste these class strings again; import them.
- Red gradient panel with rings (`from-red-600 via-red-700 to-red-900`) for the one hero moment on a page (CTA, countdown).
- Mobile-first, `motion-reduce:` on every animation, `aria-hidden` on decoration, lucide icons only.
- **Shared building blocks (use these, don't rebuild them):** `PageHeader` (eyebrow + black headline + subtitle + action, for every list/app page), `EmptyState` (solid card with icon tile; never a dashed box), `RetryPanel` (load errors), `LoadErrorScreen` / `NotFoundScreen` (full-page states), `AppFormShell` (flat-on-mobile, glass card from `sm`; Add/Edit forms) with `LogoField`, `ModalShell` + `ModalFooter` (every dialog; `busy` blocks Escape/backdrop close, `size` = `sm|md|xl`, submit buttons outside the form use `form="<id>"`), `MatchScheduleFields` (date + time), `StatTile`, `RingsBackdrop`. Style constants live in `src/lib/premiumStyles.js` (`primaryButtonClass`, `secondaryButtonClass`, `dangerOutlineButtonClass`, compact variants for card actions, `cardClass` / `cardHoverClass`, `iconTileClass`, `infoNoteClass`) and `src/lib/formStyles.js`.
- **The scoring page is the exception for layout, not for style:** restyle `ScorerScoringPage`, `ScoringScreen` and its children with colors, borders, shadows and font weight only. Never change paddings, font sizes, heights, grid/flex structure or the `short:` overrides (see "Scoring (scorer)"); the pad uses its own button classes, not `primaryButtonClass` (which carries `py-3`).

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
  authenticated. **Log out** (`signOut()` on `DashboardPage`) calls `POST /auth/logout`, clears the store
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
- `AuthLayout` (`src/components/AuthLayout.jsx`) is the shared premium shell for the auth and
  scorer-access screens (faint orbit rings on plain white, glass card with a red gradient
  stripe, optional `eyebrow` pill, black-weight heading, subheading, back-to-home pill) — reuse it
  for any future account-related page rather than rebuilding the card chrome. Fields use
  `inputClass` / `fieldGroupClass` / `fieldAddonClass` (`src/lib/formStyles.js`, the `+91` and PIN
  fields), buttons use `primaryButtonClass` / `secondaryButtonClass` (`src/lib/premiumStyles.js`,
  add `w-full` / `px-*` at the call site). `OtpInput` boxes tint red once filled.
  `ScorerWaitingScreen` shows the countdown on the red gradient ring panel (`RingsBackdrop`).
- Adding a protected page: put it in `src/pages/`, wrap its `<Route>` element in `RequireAuth`, and
  call the API only through `src/lib/api.js` so token refresh works automatically.

## Conventions

- Dropdowns: always use `src/components/Select.jsx` (custom listbox with optional option logos, keyboard support; use via `Controller` in react-hook-form forms). Never a native `<select>`.
- Mobile-first layout: base (unprefixed) Tailwind classes target mobile; use `sm:`/`md:`/`lg:` to
  scale up padding, font sizes, and grid columns for larger screens. Grids default to a single
  column and expand via `sm:grid-cols-*`/`lg:grid-cols-*`. Button groups stack (`flex-col`) on
  mobile and switch to a row (`sm:flex-row`) on larger screens.
- Keep new landing-page sections as separate components in `src/components/`, composed from
  `src/pages/LandingPage.jsx`; keep new routes as separate pages in `src/pages/`, wired up in
  `src/App.jsx`.
- No comments in JSX/config for self-explanatory code; keep components free of unused
  boilerplate from the original Vite template.
- **File size**: keep every frontend source file (`.jsx`/`.js` under `src/`) under 215 lines. When a file
  nears the limit, split it: pages compose components, data loading and multi-step flows go in
  `src/hooks/`, constants and helpers go in `src/lib/`. Fix any file you touch that is already over the limit.

## Commands

```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

Always run `npm run lint` and `npm run build` after making changes to verify nothing is broken.
