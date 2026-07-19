# DigiConnect — Product Requirements Document

## Original Problem Statement
> Build a redefined, modern, elegant, SEO-optimized website to redesign https://digiconnect.net.in/ so it ranks well on Google and appears in AI search results (ChatGPT, Gemini, Claude).

## Company Snapshot
DigiConnect is an authorized **Samsung Experience Store & SmartCafé partner** in Greater Noida, India (established 2021, sole proprietorship). Two mall locations:
- **Gaur City Mall** — GF 29, Greater Noida West · +91 7302441893 · digiconnect.gm@gmail.com
- **Grand Venice Mall** — LGF 57, Greater Noida · +91 9205497881 · digiconnect.gv@gmail.com
- Instagram: `@digi.connect_`

## User Personas
1. **Local shopper (Greater Noida)** — searches "Samsung store near me" and wants directions, price info, and a WhatsApp chat.
2. **Enthusiast** — wants to touch the latest Galaxy device before buying, values a demo experience.
3. **Admin (store owner)** — updates featured products & rolling announcements without dev help.

## Core Requirements (Static)
- Full React 19 rebuild, FastAPI + MongoDB backend
- Contact ONLY via Instagram + per-location WhatsApp (no email forms)
- Two-location prominence with per-store CTAs
- Admin dashboard (JWT email+password) to manage featured products + announcements
- SEO first: semantic HTML, meta tags, LocalBusiness JSON-LD schema x2, sitemap-ready
- Design: dark obsidian (#050505) + laser magenta (#FF007F) accent · Outfit / Manrope fonts · no blue, no amber/gold
- Distinctive motion, glassmorphism, bento layouts, floating WhatsApp CTA with store chooser

## Architecture
- **Backend** (`/app/backend/server.py`): FastAPI · motor (MongoDB async) · JWT (HS256, 12h) · bcrypt · idempotent admin seed on startup · CRUD APIs for products & announcements
- **Frontend** (`/app/frontend`): React 19 · react-router-dom v7 · Tailwind CSS · react-helmet-async (SEO) · axios · lucide-react icons
- **DB collections**: `users`, `products`, `announcements`
- **Auth flow**: `POST /api/auth/login` → JWT stored in `localStorage[dc_admin_token]` → sent as `Authorization: Bearer` header via axios interceptor

## What's Been Implemented (Jan 2026)
### Public site
- Home: hero (huge display type + gradient), animated marquee, bento "Why DigiConnect", featured products (live from DB), 2-location cards, WhatsApp CTA section, footer
- Stores page with both location cards (WhatsApp + Get Directions)
- About & Vision (story, 6 core values, mission)
- Contact (location cards + Instagram CTA)
- Floating WhatsApp FAB with store chooser popover
- 404 page
- SEO: title, meta description, canonical, OG/Twitter, LocalBusiness JSON-LD for both stores, Manrope/Outfit fonts preconnected

### Admin CMS (`/admin/login`, `/admin`)
- JWT login, protected dashboard route
- Products: create/edit/delete/toggle-active, ordering, image URL, price display text, category, highlight
- Announcements: create/edit/delete/toggle-active, ordering — powers the marquee banner
- Logout, view-site shortcut, toast notifications

## Testing Status
- Backend: **17/17** pytest passing (auth, CRUD, seeding, indexes, guards)
- Frontend: **19/19** Playwright checks passing (all pages, admin flows, protected routes, SEO, mobile menu)
- Regression suite at `/app/backend/tests/backend_test.py`

## Backlog / Next Actions
### P1 (nice to have soon)
- Skeleton loaders in Admin panels (products/announcements briefly show empty state before fetch resolves)
- Migrate FastAPI startup/shutdown to lifespan context manager
- Replace `window.confirm` with shadcn `AlertDialog` for delete actions

### P2 (future)
- Blog/insights section for SEO long-tail (Samsung tips, comparison guides)
- Newsletter capture (WhatsApp opt-in flow)
- In-store appointment / demo booking system
- Google Analytics 4 + Search Console verification tag
- Sitemap.xml + robots.txt generation
- Multi-brand support (once DigiConnect onboards new brands beyond Samsung)
- Google reviews / testimonial carousel

## Enhancement Idea
**"Book a live demo"** — a one-click WhatsApp intent that pre-fills the customer's device of interest (e.g., "I'd like to demo the Galaxy Z Fold6 at Gaur City today at 5 PM"). This turns your site into a conversion tool: browsers pick a Samsung device from the featured grid, tap "Book demo", and land in WhatsApp with a ready-to-send message — no forms, no friction.
