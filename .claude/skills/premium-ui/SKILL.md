---
name: premium-ui
description: Sillypoint's premium red & white UI style (landing page look). Use whenever building or restyling any page, section, card, form, button, modal or empty/loading state in the frontend, so it matches the landing page and auth screens.
---

# Sillypoint premium UI

The landing page (`src/pages/LandingPage.jsx` and its components) and the auth screens
(`AuthLayout`, `MobileEntryPage`, `VerifyOtpPage`, `ScorerLoginPage`) are the reference. This look is the
default for every page. Palette is red / gray / white only, with the custom deep `red-*` scale from
`src/index.css`. No dark sections, no dark variants, no other hues, no emojis (lucide icons).

## Source of truth: import, don't paste

- `src/lib/premiumStyles.js`: `eyebrowClass`, `headingClass`, `primaryButtonClass`, `secondaryButtonClass`.
- `src/lib/formStyles.js`: `inputClass(hasError)`, `fieldGroupClass(hasError)` + `fieldAddonClass` (input with a leading chip/icon), `labelClass`.
- `src/components/RingsBackdrop.jsx`: concentric white rings for red panels (parent needs `relative overflow-hidden`).
- `src/components/AuthLayout.jsx`: shell for any account / access screen.
- `src/lib/premiumStyles.js` also has `dangerOutlineButtonClass`, `compactPrimaryButtonClass` / `compactSecondaryButtonClass` (card-level actions), `cardClass` / `cardHoverClass`, `iconTileClass`, `infoNoteClass`.
- `src/components/PageHeader.jsx`: eyebrow + black headline (`title` may contain one `<span className="text-red-600">` accent) + subtitle + `action`. Use it as the top of every list/app page; `size="md"` inside cards.
- `src/components/EmptyState.jsx`: solid card with an icon tile, title, text and optional action. Never write a dashed empty box. Load failures use `RetryPanel`; full-page failures use `LoadErrorScreen` / `NotFoundScreen`.
- `src/components/AppFormShell.jsx` + `LogoField.jsx`: shell for create/edit forms (flat on mobile, glass card from `sm`, keeps `pb-16 sm:pb-0` for the bottom tabs).
- `src/components/ModalShell.jsx` + `ModalFooter.jsx`: every dialog. `busy` blocks Escape/backdrop close; `size` is `sm | md | xl`; put the form `id` on the `<form>` and `form="<id>"` on `ModalFooter` so the submit button can live in the pinned footer. Never roll a new overlay.
- `SectionHeading`, `TournamentCard`, `StatusBadge`, `Skeleton`, `RetryPanel`, `FullPageLoader`, `Select`, `StatTile`: reuse as they are.
- If a pattern isn't there and you need it twice, add it to `premiumStyles.js` (a `.js` file, so lint's only-export-components stays happy) rather than copying class strings.

## Recipe

**Page / section rhythm.** Page root `min-h-screen bg-white text-gray-900`; sections alternate `bg-white` and `bg-gray-50`, `py-16 sm:py-24`, container `mx-auto max-w-6xl px-5 sm:px-6`. App pages (dashboard etc.) may use `bg-gray-50` roots with white cards.

**No glow.** Don't put red radial-gradient glows behind headers, cards, forms, loaders or the scoring page; they looked bad. The soft glow lives only in the landing sections (`Hero`, `FeaturedTournaments`, `HowItWorks`). Keep app pages plain white / `bg-gray-50`.

**Heading block.** `<span className={eyebrowClass}>Eyebrow</span>` then
`<h1 className={`mt-4 text-3xl sm:text-5xl ${headingClass}`}>Plain <span className="text-red-600">accent</span></h1>`,
then `mt-4 text-gray-600 sm:text-lg`. Section titles `text-3xl sm:text-4xl md:text-5xl`; compact card titles `text-2xl sm:text-3xl`.

**Cards.** `rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5`. Clickable: add
`transition hover:-translate-y-0.5 hover:border-red-600 hover:shadow-md`. Icon tile: `flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600`. Floating card (auth): `rounded-3xl bg-white/90 shadow-xl shadow-red-600/10 backdrop-blur` with a `h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700` top stripe. Info note: `rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3`.

**Buttons.** Primary `className={`px-7 ${primaryButtonClass}`}`, secondary `secondaryButtonClass`; add `w-full` for form submits or `inline-flex items-center gap-2` with a lucide icon. Constants carry no horizontal padding so you set `px-*` yourself. Disabled states are built in. On a red panel: white button `bg-white text-red-700 hover:bg-red-50`, outline `border border-white/50 text-white hover:bg-white/10`.

**Inputs.** `inputClass(Boolean(errors.x))`, labels `labelClass`, errors `mt-1.5 text-xs font-medium text-red-600` (field errors inline; server errors via `notifyError` toasts). Segmented inputs (OTP) tint red once filled.

**Red hero panel.** `relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white shadow-2xl shadow-red-600/25 ring-1 ring-white/15` + `<RingsBackdrop className="h-[42rem] w-[42rem]" />` + `relative` content. One per page.

**Motifs.** Dotted orbit ring: SVG circle `stroke="#9ca3af"` `strokeDasharray="2 12"` inside `<g className="origin-center animate-orbit motion-reduce:animate-none [transform-box:fill-box]">`. Divider stripe: `h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700`.

## Rules

- Mobile-first: base classes for phones, `sm:`/`md:`/`lg:` to scale; check 320px, no horizontal scroll, tap targets at least 44px. Keep the scoring screen's one-viewport guarantee (see CLAUDE.md).
- Every animation has a `motion-reduce:` fallback; decoration is `aria-hidden`.
- Use `red-*` utilities, never hex colors, except inside SVG art.
- Files under 215 lines: split pages into components / hooks / lib.
- Toasts for API messages stay in `AppToast` style.

## The scoring screen is style-only

`ScorerScoringPage` and everything it renders live in one non-scrolling viewport (`h-dvh`, pad buttons at least 48px). Restyle them with color, border, shadow and font-weight only (inset red hairline/stripe via `shadow-[inset_0_3px_0_0_#a6192e]`, `font-black`, red-tinted 4/6 chips, `hover:bg-red-50`). Do not touch paddings, text sizes, heights, grid/flex classes or `short:` overrides, and do not use `primaryButtonClass` inside the run pad. Re-check 320x568 up to 1920x1080 after any change there.

## New page checklist

1. Wrapper: `AuthLayout` for account / access screens, `AppFormShell` for forms; otherwise white root + navbar (`Navbar` for public, `AppNavbar` for logged in) + `Footer` where the page already uses one, with a `PageHeader` at the top.
2. Eyebrow + black headline + gray subtext at the top; one red accent word.
3. Content in white cards on white / `bg-gray-50`; no glows or gradient backgrounds.
4. Buttons / inputs from the shared constants; no pasted class strings.
5. Loading = `Skeleton` shimmer or `FullPageLoader`; error = `RetryPanel`; empty = `EmptyState`.
6. `npm run lint && npm run build`, then look at it at 320, 768 and 1280px.
