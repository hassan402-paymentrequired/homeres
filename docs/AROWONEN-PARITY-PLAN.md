# Homère Storefront — AROWONEN Parity & Enhancement Plan

**Reference site:** [AROWONEN](https://arowonen.com/) (UX benchmark only — not a content clone)  
**Goal:** Match or exceed reference interaction quality for client UI approval, while keeping Homère Nigeria branding, NGN pricing, and preview-mode transparency.  
**Constraint:** UI-only — no database, models, or real payments in this phase.

---

## How we track progress

Use the status column when reviewing with the client:

| Status | Meaning |
|--------|---------|
| `done` | Shipped in preview build |
| `in-progress` | Currently being built |
| `planned` | Not started |
| `skipped` | Intentionally not in Homère scope |

---

## Phase 0 — Foundation (done)

| ID | Feature | Status | Notes |
|----|---------|--------|-------|
| P0-1 | Central mock catalog (`mock-products.ts`) | done | Single source for PLP, PDP, homepage |
| P0-2 | Category config (`categories.ts`) | done | Nav + shop routes |
| P0-3 | Brand constants (`brand.ts`) | done | Contact, USP, testimonials |
| P0-4 | Preview banner (no real orders) | done | Top of every page |
| P0-5 | About / Services / Contact pages | done | Homère-specific content |
| P0-6 | Shop routes (`/shop`, `/shop/{category}`, `/shop/new-arrivals`) | done | |
| P0-7 | PDP wired to `/products/{id}` | done | |
| P0-8 | Why Homère + testimonials (homepage) | done | Better than reference |
| P0-9 | Checkout preview alert | done | |
| P0-10 | `StorefrontShell` layout | done | Inner pages; home unified in Phase 1 |

---

## Phase 1 — High-impact shopping UX (priority)

| ID | Feature | AROWONEN | Homère target | Status |
|----|---------|----------|---------------|--------|
| P1-1 | **Mega menu** — multi-column flyouts, “View all” links | Yes | Match layout; Homère categories only | done |
| P1-2 | **Search overlay** — full-screen/modal, suggested terms | Yes | Mock results from `mock-products.ts` | done |
| P1-3 | **Quick Shop** on product cards — inline add without full PDP | Yes | Mini panel: qty + Add to bag | done |
| P1-4 | **Cart drawer** — order note field | Yes | Preview: note stored in cart state only | done |
| P1-5 | **Cart drawer** — “Shipping calculated at checkout” line | Yes | NGN / Nigeria copy | done |
| P1-6 | **Empty cart** state — illustration + CTA | Yes | Link to `/shop` | done |
| P1-7 | **Hero CTAs** — real routes (`/shop`, `/services`, etc.) | — | Replace `#` hashes | done |
| P1-8 | **Unify homepage** on `StorefrontShell` | — | Consistent header/footer/banner | done |

---

## Phase 2 — Trust, help & store (client confidence)

| ID | Feature | Status | Route |
|----|---------|--------|-------|
| P2-1 | FAQ page (static) | done | `/help/faq` |
| P2-2 | Shipping & delivery (static) | done | `/help/shipping` |
| P2-3 | Returns & refunds (static) | done | `/help/returns` |
| P2-4 | Terms of service (static) | done | `/help/terms` |
| P2-5 | Privacy policy (static) | done | `/help/privacy` |
| P2-6 | Help hub / index linking all above | done | `/help` |
| P2-7 | Footer links → real help routes | done | |
| P2-8 | **Store: opening hours** + Google Maps link | done | Homepage + Contact |
| P2-9 | Newsletter — “preview only” success copy | planned | Footer |

---

## Phase 3 — Catalog & product polish

| ID | Feature | Status | Notes |
|----|---------|--------|-------|
| P3-1 | PLP price range filter (mock) | done | Client-side on catalog |
| P3-2 | PLP “New only” toggle | done | |
| P3-3 | PLP grid / list view toggle | done | |
| P3-4 | PLP breadcrumbs | done | |
| P3-5 | PDP image lightbox / zoom | done | Click main image |
| P3-6 | PDP sticky “Add to bag” (mobile) | done | |
| P3-7 | Related products use `ProductCard` + quick shop | done | |

---

## Phase 4 — Delight & parity extras

| ID | Feature | Status | Notes |
|----|---------|--------|-------|
| P4-1 | **Wishlist** (localStorage) — heart on cards + `/wishlist` | done | No backend |
| P4-2 | Skip to content (a11y) | done | |
| P4-3 | Cart wired to `addItem` from quick shop / PDP | done | Context already exists |
| P4-4 | Search: recent searches (localStorage) | done | |
| P4-5 | Subcategory links in mega menu → PLP with query `?sub=` | done | |

---

## Intentionally skipped (not “less” — different business)

| Item | Reason |
|------|--------|
| Brands A–Z directory | Homère is curated house brand, not multi-brand marketplace |
| Outdoor collection (full tree) | Not in Homère product brief |
| EU multi-store (Amsterdam, Dubai) | Single flagship + Nigeria focus |
| 100+ country currency selector | NGN + Nigeria only for launch |
| Jobs & careers | Add only when hiring is real |
| Coffee table books as top nav | Optional later; not in core brief |

---

## File structure (target)

```
resources/js/
├── data/
│   ├── brand.ts
│   ├── categories.ts
│   ├── mock-products.ts
│   ├── navigation.ts
│   └── content/
│       └── help-pages.ts          # FAQ, shipping, returns copy
├── components/storefront/
│   ├── storefront-shell.tsx
│   ├── preview-banner.tsx
│   ├── product-card.tsx
│   ├── mega-menu.tsx              # Phase 1
│   ├── search-overlay.tsx         # Phase 1
│   └── quick-shop-panel.tsx       # Phase 1
├── context/
│   ├── CartContext.tsx            # + orderNote
│   └── WishlistContext.tsx        # Phase 4
└── pages/
    ├── welcome.tsx
    ├── catalog/index.tsx
    ├── product/show.tsx
    ├── help/                      # Phase 2
    │   ├── index.tsx
    │   ├── faq.tsx
    │   └── ...
    └── wishlist/index.tsx         # Phase 4
```

---

## Routes (target)

| Method | Path | Page |
|--------|------|------|
| GET | `/` | Home |
| GET | `/shop` | All products |
| GET | `/shop/new-arrivals` | New products |
| GET | `/shop/{category}` | Category PLP |
| GET | `/products/{id}` | PDP |
| GET | `/checkout` | Checkout preview |
| GET | `/about` | About |
| GET | `/services` | Design studio |
| GET | `/contact` | Contact |
| GET | `/help` | Help hub |
| GET | `/help/{slug}` | FAQ, shipping, returns, terms, privacy |
| GET | `/wishlist` | Saved items |

---

## Implementation order (execution)

1. **Phase 1** — Mega menu, search, quick shop, cart polish, hero links, shell unify  
2. **Phase 2** — Help pages + footer + store hours  
3. **Phase 3** — PLP filters, PDP lightbox, mobile sticky CTA  
4. **Phase 4** — Wishlist, a11y, cart integration everywhere  

---

## Client demo script (after Phase 1–2)

1. Show preview banner — “no real orders”  
2. Browse mega menu → category → product → quick shop → cart → checkout alert  
3. Search for “lamp” or “candle”  
4. About + Services + Contact + Store hours  
5. Help: Shipping & Returns  
6. Compare mentally to AROWONEN — same flow, Homère content  

---

## Changelog

| Date | Phase | Summary |
|------|-------|---------|
| 2026-05-19 | Plan created | Initial roadmap from AROWONEN gap analysis |
| 2026-05-19 | Phases 1–4 | Mega menu, search, quick shop, cart, help pages, wishlist, PLP/PDP polish |

*Update the Status column and Changelog as each item ships.*
