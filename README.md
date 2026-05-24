# Homère

Luxury home décor e-commerce platform for **Homère** — a curated catalog of furniture, lighting, fragrance, art, outdoor pieces, and designer brands. The app combines a public **storefront** (browse, cart, checkout) with an **admin panel** for catalog, orders, invoices, and store settings.

Built as a monolithic **Laravel 13** API with an **Inertia.js + React 19** frontend (TypeScript, Vite, Tailwind CSS 4).

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Catalog data & seeding](#catalog-data--seeding)
- [Development](#development)
- [Testing & quality](#testing--quality)
- [Project structure](#project-structure)
- [Storefront architecture](#storefront-architecture)
- [Admin panel](#admin-panel)
- [Payments](#payments)
- [Display currency](#display-currency)
- [Deployment notes](#deployment-notes)
- [License](#license)

---

## Features

### Storefront (public)

| Area | Description |
|------|-------------|
| **Home** | Landing page with curated sections and new arrivals from the database |
| **Shop** | Paginated catalog (24 per page), sort, refine filters (new only, max price) |
| **Categories** | `/shop/{category}` with subcategory filtering |
| **Brands** | Brand directory, brand pages, **category filter within a brand** (`?category=`) |
| **Collections** | Legacy collection URLs mapped to category handles |
| **Product detail** | Variants, images, cart, related products |
| **Search** | Live product search overlay |
| **Wishlist** | Client-side wishlist (local storage) |
| **Cart** | Variant-aware cart context |
| **Checkout** | Order creation + **Paystack** payment (NGN) |
| **Currency** | Nigeria → **NGN**, elsewhere → **USD** (with EUR→display conversion); manual override in header |
| **Navigation** | Mega menu driven from **database** categories & brands (not static JSON) |

### Admin (`/admin`)

| Area | Description |
|------|-------------|
| **Dashboard** | Commerce & catalog overview, recent orders |
| **Analytics** | 30-day metrics, order trends |
| **Categories & brands** | CRUD, nav visibility, hierarchy |
| **Products & variants** | Full catalog management, templates, specs, images |
| **Orders** | Status updates, line items |
| **Invoices** | Compose, preview, send from orders |
| **Settings** | Store profile, default product status (draft/published), invoicing |

### Customer auth (Fortify)

Optional **user** accounts at `/login`, `/register`, profile & security settings — separate from the **admin** guard.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.3+, Laravel 13 |
| Frontend | React 19, TypeScript, Inertia.js v3 |
| Styling | Tailwind CSS 4, Radix UI primitives |
| Build | Vite 8, Laravel Wayfinder (typed routes) |
| Database | SQLite (default), MySQL/MariaDB supported |
| Auth | Laravel Fortify (users), custom admin guard |
| Payments | Paystack |
| Tests | Pest PHP 4 |

---

## Requirements

- PHP 8.3+ with extensions: `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`
- Composer 2
- Node.js 20+ and npm
- SQLite (dev) or MySQL 8+ (production)

---

## Quick start

```bash
# Clone and enter the project
cd homere

# One-shot setup (install deps, .env, key, migrate, build assets)
composer setup

# Or manually:
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install
npm run build
```

Start the dev stack (HTTP server, queue, logs, Vite):

```bash
composer run dev
```

Visit:

| URL | Purpose |
|-----|---------|
| http://localhost:8000 | Storefront |
| http://localhost:8000/admin/login | Admin panel |

**Default admin** (from `AdminSeeder`):

- Email: `admin@homere.ng`
- Password: `password`

Change these immediately in production.

---

## Environment variables

Copy `.env.example` to `.env` and configure:

### Application

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Application name |
| `APP_URL` | Public URL (required for Paystack callbacks) |
| `APP_KEY` | Generated via `php artisan key:generate` |

### Database

| Variable | Description |
|----------|-------------|
| `DB_CONNECTION` | `sqlite` (default) or `mysql` |
| `DB_*` | MySQL credentials when not using SQLite |

### Paystack

| Variable | Description |
|----------|-------------|
| `PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |
| `PAYSTACK_BASE_URL` | API base (default `https://api.paystack.co`) |

Webhook endpoint: `POST /paystack/webhook` (excluded from CSRF verification).

### Storefront currency

Scraped catalog prices are stored in **EUR**. Display currency is chosen by visitor country and converted using configurable rates (`config/storefront.php`):

| Variable | Default | Description |
|----------|---------|-------------|
| `STOREFRONT_DEFAULT_COUNTRY` | `NG` | Fallback when geo headers are missing (local dev) |
| `STOREFRONT_EUR_TO_NGN` | `1700` | Display multiplier EUR → NGN |
| `STOREFRONT_EUR_TO_USD` | `1.09` | Display multiplier EUR → USD |
| `STOREFRONT_NGN_TO_USD` | `0.00065` | Optional cross-rate |
| `STOREFRONT_USD_TO_NGN` | `1550` | Optional cross-rate |

**Geo detection:** reads `CF-IPCountry` (Cloudflare), `X-Country-Code`, or `X-App-Country`. Nigeria (`NG`) → NGN; all other countries → USD. Users can override via the header currency selector (desktop).

---

## Catalog data & seeding

Product data is imported from scraped JSON under `public/output/` (collections, brands, index). This folder is **not** required for the app to run, but seeding the full catalog depends on it.

### Seed order

`php artisan db:seed` runs:

1. Test user (`test@example.com`)
2. **AdminSeeder** — admin account
3. **ProductTemplateSeeder** — variant templates
4. **CategorySeeder** — from `public/output/index.json`
5. **BrandSeeder** — from `public/output/index.json`
6. **CatalogProductSeeder** — imports all collection JSON files (`publish: true` for storefront visibility)

Full reseed (destructive):

```bash
php artisan migrate:fresh --seed
```

> Importing thousands of products can take a long time.

### Import / refresh CLI

```bash
# Import all collections (skip existing handles)
php artisan catalog:import-products --publish

# Single collection
php artisan catalog:import-products --collection=art-mirrors --limit=10 --publish

# Update prices/variants for products already in DB
php artisan catalog:import-products --refresh --publish

# Preview counts without writing
php artisan catalog:import-products --dry-run
```

### Storefront visibility

Only products with `is_active = true` appear on the shop. Imports respect **Admin → Settings → Default product status** unless `--publish` or `CatalogProductSeeder`’s `publish: true` is used.

To publish existing draft products in bulk (one-off):

```bash
php artisan tinker --execute="App\Models\Product::query()->update(['is_active' => true]);"
```

---

## Development

### Commands

| Command | Description |
|---------|-------------|
| `composer run dev` | Server + queue + Pail + Vite |
| `npm run dev` | Vite only |
| `npm run build` | Production frontend build |
| `php artisan wayfinder:generate` | Regenerate typed TS route helpers |
| `vendor/bin/pint` | Format PHP |
| `npm run lint` | ESLint fix |
| `npm run types:check` | TypeScript check |

### Key conventions

- **Wayfinder** — use generated `@/routes` and `@/actions` instead of hardcoded URLs in React.
- **Storefront presenters** — `StorefrontProductPresenter` shapes all public product JSON (images, prices, currency).
- **Shop catalog** — `ShopPageService` + `StorefrontCatalogQuery`; paginated, server-side filters.
- **Admin** — separate `admin` guard and `routes/admin.php`.
- Agent skills live under `.claude/skills/` and `.cursor/skills/` (Laravel, Pest, Fortify, Wayfinder).

---

## Testing & quality

```bash
# Full CI-style check (lint + tests)
composer run ci:check

# PHP tests only
php artisan test

# Storefront tests
php artisan test tests/Feature/Storefront/
```

Tests use an in-memory SQLite database (`phpunit.xml`). Catalog tests that need `public/output/` are grouped with `@group catalog-output` and skip when files are missing.

---

## Project structure

```
homere/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/          # Back-office CRUD
│   │   └── Storefront/     # Shop, checkout, Paystack
│   ├── Models/             # Product, Order, Category, Brand, …
│   ├── Services/           # Checkout, Paystack, catalog import, invoices
│   └── Support/
│       ├── Catalog/        # Scraped price parsing
│       └── Storefront/     # Presenters, catalog query, currency, nav
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── public/
│   └── output/             # Scraped catalog JSON (collections, brands)
├── resources/js/
│   ├── pages/
│   │   ├── admin/          # Admin Inertia pages
│   │   ├── catalog/        # Shop UI + filter bar
│   │   ├── product/        # PDP
│   │   └── landing/        # Home, header, footer
│   └── components/         # Shared UI (storefront + admin)
├── routes/
│   ├── web.php             # Storefront routes
│   ├── admin.php           # Admin routes
│   └── settings.php        # User profile settings
├── tests/
│   ├── Feature/
│   └── Unit/
└── config/
    ├── paystack.php
    └── storefront.php
```

---

## Storefront architecture

```
Request → ShopController → ShopPageService
                ↓
    StorefrontCatalogQuery (published products only)
                ↓
    paginate(24) → StorefrontProductPresenter::card()
                ↓
    Inertia: catalog/index (products + catalog meta)
```

**Routes (main):**

| Route | Name | Purpose |
|-------|------|---------|
| `/shop` | `shop` | All published products |
| `/shop/{category}` | `shop.category` | Category + descendants |
| `/shop/new-arrivals` | `shop.new` | Created in last 60 days |
| `/brands` | `brands` | Brand directory |
| `/brands/{handle}` | `brands.show` | Brand + optional `?category=` / `?sub=` |
| `/products/{handle}` | `products.show` | Product detail |
| `/checkout` | `checkout` | Checkout flow |

**Shared Inertia props** (`HandleInertiaRequests`):

- `storefrontNav` — mega menu from DB
- `storefrontCurrency` — `{ currency, country, is_nigeria }`

**Images:** `ProductImageUrl` resolves `url`, else `Storage::disk('public')->url(path)`.

---

## Admin panel

- URL prefix: `/admin`
- Guard: `admin` (model `App\Models\Admin`)
- Resources: categories, brands, products, variants, product templates, orders, invoices
- Dashboard & analytics at `/admin` and `/admin/analytics`

Product **templates** define variant option schemas (e.g. size, finish) used when creating products.

---

## Payments

- **Provider:** Paystack (Nigeria)
- **Checkout currency:** NGN on orders
- **Flow:** `CheckoutController` creates order → Paystack redirect → callback + webhook update payment status
- **International display USD** does not automatically charge USD; Stripe (or similar) would be a separate integration if the client requires non-NGN checkout.

Configure live keys in production and register the webhook URL in the Paystack dashboard.

---

## Display currency

| Visitor | Display | Source price |
|---------|---------|--------------|
| Nigeria (`NG`) | ₦ NGN | EUR in DB × `STOREFRONT_EUR_TO_NGN` |
| Other countries | $ USD | EUR in DB × `STOREFRONT_EUR_TO_USD` |
| Manual override | Session `storefront_currency` | `POST /storefront/currency` |

Checkout and Paystack remain **NGN** regardless of display currency.

---

## Deployment notes

1. Set `APP_ENV=production`, `APP_DEBUG=false`, strong `APP_KEY`.
2. Use **MySQL** (or PostgreSQL if configured) instead of SQLite.
3. Run `php artisan migrate --force` and seed or import catalog as needed.
4. Build assets: `npm ci && npm run build`.
5. Configure **Paystack** keys and webhook URL.
6. Point `php artisan queue:work` at the database queue for mail/jobs if used.
7. Ensure `storage/` and `bootstrap/cache/` are writable; run `php artisan storage:link` for public uploads.
8. **Geo currency:** put **Cloudflare** (or another proxy) in front to send `CF-IPCountry`, or set `STOREFRONT_DEFAULT_COUNTRY` and rely on the manual currency selector.

For hosts without geo headers (e.g. plain VPS / some shared hosts), set `STOREFRONT_DEFAULT_COUNTRY=NG` until a proxy is configured.

---

## License

This project is proprietary software for Homère. All rights reserved unless otherwise agreed with the client.
