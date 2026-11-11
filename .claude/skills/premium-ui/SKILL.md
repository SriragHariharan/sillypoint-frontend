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

- `src/lib/premiumStyles.js`: `eyebrowClass`, `headingClass`, `primaryButtonClass`, `secondaryButtonClass`, `redGlow(size, position, alpha)`.
- `src/lib/formStyles.js`: `inputClass(hasError)`, `fieldGroupClass(hasError)` + `fieldAddonClass` (input with a leading chip/icon), `labelClass`.
- `src/components/RingsBackdrop.jsx`: concentric white rings for red panels (parent needs `relative overflow-hidden`).
- `src/components/AuthLayout.jsx`: shell for any account / access screen.
- `SectionHeading`, `TournamentCard`, `StatusBadge`, `Skeleton`, `RetryPanel`, `FullPageLoader`, `Select`: reuse as they are.
- If a pattern isn't there and you need it twice, add it to `premiumStyles.js` (a `.js` file, so lint's only-export-components stays happy) rather than copying class strings.

## Recipe

**Page / section rhythm.** Page root `min-h-screen bg-white text-gray-900`; sections alternate `bg-white` and `bg-gray-50`, `py-16 sm:py-24`, container `mx-auto max-w-6xl px-5 sm:px-6`. App pages (dashboard etc.) may use `bg-gray-50` roots with white cards.

**Glow.** First child of a `relative overflow-hidden` section:
```jsx
<div aria-hidden="true" className="pointer-events-none absolute inset-0"
     style={{ background: `${redGlow('55% 60%', '12% 18%', 0.1)}, ${redGlow('45% 50%', '90% 85%', 0.06)}` }} />
```
Keep alpha 0.06 to 0.12; content gets `relative`.

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
- Use `red-*` utilities, never hex colors, except inside SVG art and the inline glow rgba.
- Files under 215 lines: split pages into components / hooks / lib.
- Toasts for API messages stay in `AppToast` style.

## New page checklist

1. Wrapper: `AuthLayout` for account / access screens; otherwise white root + navbar (`Navbar` for public, `AppNavbar` for logged in) + `Footer` where the page already uses one.
2. Eyebrow + black headline + gray subtext at the top; one red accent word.
3. Content in white cards on white / `bg-gray-50`; glows behind the hero area only.
4. Buttons / inputs from the shared constants; no pasted class strings.
5. Loading = `Skeleton` shimmer or `FullPageLoader`; empty / error = `RetryPanel` style card.
6. `npm run lint && npm run build`, then look at it at 320, 768 and 1280px.
