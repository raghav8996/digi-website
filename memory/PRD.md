# DigiConnect — Product Requirements Document

## Original Problem Statement
> Build a redefined, modern, elegant, SEO-optimized website to redesign https://digiconnect.net.in/ so it ranks well on Google and appears in AI search results (ChatGPT, Gemini, Claude).

## Company Snapshot
DigiConnect is an authorized **Samsung-EXCLUSIVE Experience Store & SmartCafé partner** in Greater Noida, India (established 2021, sole proprietorship). Two mall locations:
- **Gaur City Mall** — GF 29, Ground Floor, Samsung Store, Greater Noida West · +91 7302441893 · digiconnect.gm@gmail.com
- **Grand Venice Mall** — LGF 57, Lower Ground Floor, Samsung Store, Greater Noida · +91 9205497881 · digiconnect.gv@gmail.com
- Instagram: `@digi.connect_`

## User Personas
1. **Local shopper (Greater Noida)** — searches "Samsung store near me", wants location, offers, WhatsApp chat.
2. **Enthusiast** — wants to demo the latest Galaxy (S25 Ultra, Fold, A-series) before buying.
3. **Pre-launch reservation seeker** — hunting for Galaxy Z Fold8 pre-reserve.
4. **Store owner (admin)** — updates featured products, in-store offers, and announcements without dev help.

## Core Requirements (Static)
- **Next.js 15 App Router** frontend (SSR/ISR for SEO) + FastAPI + MongoDB backend
- Samsung-EXCLUSIVE positioning (no "multi-brand", no "after sales/service center" language)
- Live demos across S, Z, **and A series** + tablets, wearables, audio
- Contact ONLY via Instagram + per-location WhatsApp (no email forms)
- Two-location prominence ("Visit Us")
- **In-Store Offers** section — admin-managed with title, description, tag, valid-until, image, per-store scope
- **Galaxy Z Fold8 pre-reserve banner** with per-store WhatsApp CTAs
- Admin dashboard (JWT email+password) — Products / Offers / Announcements
- SEO-first: SSR HTML, next-metadata, LocalBusiness JSON-LD x2, sitemap.xml, robots.txt (disallow /admin)
- Design: obsidian black (#050505) + laser magenta (#FF007F) · Outfit / Manrope · aurora backdrops, glassmorphism, static chip announcements (replaced marquee)

## Architecture
- **Backend** (`/app/backend/server.py`): FastAPI · motor · JWT (HS256, 12h) · bcrypt · idempotent admin seed on startup · CRUD APIs for `products`, `announcements`, and `offers`
- **Frontend** (`/app/frontend`): **Next.js 15 App Router** · React 19 · Tailwind CSS · lucide-react · axios · next/font (Outfit + Manrope) · ISR revalidate=60 on public pages
- **Route groups**: `(public)/` for public pages (Header/Footer/FloatingWhatsApp), `admin/` for CMS
- **Auth**: JWT stored in `localStorage[dc_admin_token]` → sent via axios `Authorization: Bearer` interceptor
- **SEO**: root-layout metadata, per-page metadata, JSON-LD (ElectronicsStore x2), `app/sitemap.js`, `app/robots.js`

## Implementation History
### Iteration 1 (Jan 2026) — CRA + FastAPI MVP
- Home, Stores, About, Contact + Admin (Products/Announcements)
- 17/17 backend + 19/19 frontend passing

### Iteration 2 (Jan 2026) — Next.js migration + brand refinement
- **Migrated frontend from CRA → Next.js 15 App Router** for SSR/ISR SEO
- Removed "after sales/service" and "multi-brand" language site-wide
- Updated product roster: added **Galaxy A55 5G**, **Galaxy Tab S10**; S25 Ultra + Fold6 + Buds3 Pro + Watch7
- Added **Galaxy Z Fold8 pre-reserve banner** (home + /offers) with per-store WhatsApp deep links
- Added **In-Store Offers** collection + `/offers` page + home slice
- Replaced top scrolling marquee with subtle static **AnnouncementStrip** chips inside hero (more premium)
- Added `sitemap.xml`, `robots.txt` (disallow /admin)
- New admin tab: **Offers** (title, description, tag, valid_until, image, store scope, order, active)
- **25/25** backend pytest + full frontend Playwright — passing

### Iteration 3 (Jan 2026) — Code hygiene + DX polish
- **Split admin dashboard** (595 → 133 LOC shell) into 3 panel modules under `/src/components/admin/`: `ProductsPanel`, `OffersPanel`, `AnnouncementsPanel` + shared primitives (`shared.jsx`).
- **Replaced `window.confirm` with a proper `<AlertDialog>` + `useConfirm()` hook**: keyboard-accessible (Enter=confirm, Esc=cancel), backdrop click cancels, scroll-locked, danger styling with product/offer/announcement name interpolated in the description.
- **GA4 + Google Search Console integration wired but no-op** (env-driven): `NEXT_PUBLIC_GA_ID` → renders `gtag.js` via `next/script`; `GOOGLE_SITE_VERIFICATION` → `metadata.verification.google`. Both empty in `.env` today; verified 0 GA scripts / 0 verification meta in HTML. Just drop the IDs in `.env` when production domain is finalized.
- **FastAPI startup/shutdown → lifespan API**: `@asynccontextmanager lifespan(app: FastAPI)` replaces `@app.on_event(...)`. Zero deprecation warnings in logs.
- Regression: 25/25 backend + full frontend Playwright — passing. No functional changes.

## Testing Status
- Backend: `pytest /app/backend/tests/backend_test.py -v` → 25/25 passing (auth, CRUD for products/announcements/offers, seeding, indexes, guards)
- Frontend: full Playwright suite — all pages, admin flows, protected routes, SEO (JSON-LD, sitemap, robots), Fold8 CTAs, mobile menu — passing

## Backlog / Next Actions
### P1
- Tighten CORS_ORIGINS from `*` when switching to cookie-based auth (harmless today — auth is Bearer header)
- Move CORS middleware ahead of `app.include_router(...)` (convention only; works either way)

### P2
- **Instagram feed embed** — user asked about fetching latest IG posts. Options for a future pass: LightWidget/SnapWidget iframe embed (no API tokens) OR Instagram Graph API for verified business account (requires FB Business setup + long-lived token)
- Newsletter / WhatsApp opt-in flow
- In-store appointment / demo booking system with calendar
- Google reviews / testimonial carousel per store
- OpenGraph image auto-generation per page (Next.js `opengraph-image.tsx`)
- Extend Fold8 pre-reserve pattern to every product (per-product "Reserve at" WhatsApp deep links)

### Completed / Ready
- ✅ Split admin panel modules
- ✅ AlertDialog replaces window.confirm
- ✅ GA4 + Search Console env-driven hooks (drop IDs in `.env` to activate)
- ✅ FastAPI lifespan API migration

## Enhancement Idea (for future roadmap)
**"Reserve any device"** — expand the Fold8 pre-reserve pattern into a small per-product reservation flow. Click any Galaxy product → pick store → land in WhatsApp with a pre-filled message including device name, colour, and preferred pickup time. Same zero-friction pattern, applied across the whole catalogue. Turns the site into a real conversion engine.
