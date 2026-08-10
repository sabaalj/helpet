# Helpet — Everything your pet needs. 🐾

A production-ready **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**
frontend, faithfully reproducing the *Pet Paradise* Figma design system —
adapted into a pet platform with Lost & Found, Adoption and Breeding Requests.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **First run note:** before `dev`/`build`, `scripts/fetch-assets.mjs` runs
> automatically and downloads the **original image assets exported from the
> Figma file** (photos, illustrations, decorations) into `public/assets/`.
> This needs internet access and takes a few seconds — it only happens once.
> The Figma asset URLs are valid for ~7 days after export; if any expire, the
> script warns and continues (the site still runs).

## Design fidelity

Everything visual comes straight from the Figma file, inspected through the
Figma MCP server:

- **Colors** — the file's variables (`Primary/Purple1–5`, `Secondary/Green`,
  `Secondary/Red`, `Neutral/*`, `System/Yellow`) are mapped 1:1 in
  `tailwind.config.ts`.
- **Typography** — Assistant (the design's typeface, self-hosted via
  Fontsource) with the file's exact text styles (36/48 display, 28/36 header,
  24/30, 20/26 title, 18/22 content, 14/18, 12).
- **Icons** — the design uses the **Phosphor** icon set (confirmed via Figma
  component metadata: `BellSimple`, `Envelope`, `InstagramLogo`, …), so the
  site uses `@phosphor-icons/react` — the same glyphs as the file.
- **Logo & vectors** — the paw badge, circular logo mark and footer wave are
  committed SVGs exported directly from the file
  (`public/assets/logo-badge.svg`, `logo-circle.svg`, `footer-wave.svg`).
- **Layout patterns** — navbar (120px, lilac 44px chips), hero arch + floating
  rating cards, concentric-circle section, pill tab filters, floating-label
  form fields, checkout-style stepper forms, dashboard tabs, lavender wave
  footer with the tilted polaroid — all rebuilt from the file's reference
  code and measurements.

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero, Lost & Found / Adoption / Breeding / My Account previews, Pet News, Pet Facts, Statistics, Testimonials, FAQ |
| `/lost-found` | Browse lost pets — pet-type + city filters, pagination |
| `/lost-found/report` | Report a lost pet (stepper form) |
| `/adoption` | Browse pets — type, age, vaccination, city filters |
| `/adoption/publish` | Publish an adoption listing |
| `/breeding` | Browse breeding requests — type + city filters |
| `/breeding/create` | Create a breeding request |
| `/login` / `/signup` | Auth screens (split-panel design) |
| `/account` | Dashboard: Profile, My Pets, My Listings (edit/delete/status) |

## Structure

```
src/
  app/               # App Router pages
  components/
    layout/          # Navbar, Footer
    sections/        # Home page sections
    cards/           # LostPetCard, AdoptionCard, BreedingCard, NewsCard, …
    forms/           # FormShell (stepper forms), AuthLayout
    ui/              # fields, FilterBar, Pagination, SectionTitle, motion
  data/content.ts    # demo content (typed)
  lib/utils.ts
scripts/
  fetch-assets.mjs   # downloads original Figma assets on first run
  assets-manifest.json
design-reference/    # raw Figma reference code (for future iterations)
```
