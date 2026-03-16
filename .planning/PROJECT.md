# Real Estate NH

## What This Is

A bilingual (EN/AR) real estate marketing site for New Hampshire properties. Visitors browse property listings, submit contact inquiries, and make reservations. A Filament v4 admin panel manages content and CRM operations.

## Core Value

Visitors can discover and inquire about properties in both English and Arabic — every feature must work in both locales.

## Requirements

### Validated

- ✓ Property listing gallery with filtering/search — existing
- ✓ Property detail pages with slug-based routing — existing
- ✓ Reservation form with duplicate prevention — existing
- ✓ Contact inquiry form — existing
- ✓ Bilingual support (EN/AR) with locale switching — existing
- ✓ RTL layout support for Arabic — existing
- ✓ Filament v4 admin panel (CMS + CRM) — existing
- ✓ Email notifications via observers — existing

### Active

- [ ] Dark/light theme toggle in navbar, persisted to localStorage, defaulting to system preference (`prefers-color-scheme`)

### Out of Scope

- Mobile app — web-first
- Real-time chat — not core to marketing site
- Payment processing — reservations are lead capture only

## Context

Built on Laravel 12 + Inertia.js v2 + React 19 + TypeScript + Tailwind CSS 4. Bilingual with RTL support is a hard constraint — any UI change must work in both locales. The site has a "Desert Luxury Editorial" aesthetic established in a recent redesign.

## Constraints

- **Tech Stack**: Laravel 12, React 19, Tailwind CSS 4, TypeScript (strict) — no deviations
- **Translations**: User-facing strings must use `usePage().props.translations` — no hardcoded strings
- **Auto-generated files**: `resources/js/actions/*`, `resources/js/routes/*`, `resources/js/wayfinder/*`, `resources/js/components/ui/*` — never edit these
- **RTL**: Arabic locale requires `dir="rtl"` — theme toggle must render correctly in both directions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| localStorage for theme persistence | Survives page refresh, no server round-trip needed | — Pending |
| System preference as default | Respects user's OS setting on first visit | — Pending |
| Navbar placement | Visible on all pages without intruding on content | — Pending |

---
*Last updated: 2026-03-16 after initialization*
