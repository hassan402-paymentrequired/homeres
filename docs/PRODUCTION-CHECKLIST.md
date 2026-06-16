# Homère — Production checklist

Use this before going live. **Hosting on DigitalOcean?** → see **[docs/DIGITALOCEAN-DEPLOY.md](DIGITALOCEAN-DEPLOY.md)** (nginx 404 fix is there).

For **Laravel Cloud**, use the sections below marked Cloud.

---

## One-command deploy (Laravel Cloud)

After everything below is configured **once**, each release is:

```bash
git push origin main
```

Laravel Cloud builds assets, runs your **deploy commands**, and rolls out the app. You do **not** need to SSH in for normal releases.

### Laravel Cloud — Deploy commands (set in dashboard)

Paste this into **Environment → Deploy commands**:

```bash
php artisan migrate --force
php artisan storage:link --force
php artisan optimize
```

Do **not** put `db:seed` or `catalog:import-products` here — they are slow and only for first-time catalog setup (see [First-time catalog](#first-time-catalog-on-production)).

### Laravel Cloud — Build commands (if not auto-detected)

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
```

---

## Pre-push checklist (run locally)

One command to verify the app before you push:

```bash
composer run deploy:prep
```

That runs tests, frontend checks, and a production build.

Manual checklist:

- [ ] All changes committed (including `public/output/` if catalog JSON should ship with this release)
- [ ] `composer run deploy:prep` passes
- [ ] No `.env` or secrets in git
- [ ] Migrations are **new files** (never edit migrations already run on production)
- [ ] Paystack **live** keys ready (not test keys)
- [ ] Admin password will be changed after first login

---

## Environment variables (production)

Set these in **Laravel Cloud → Environment** (not in git).

### Required

| Variable | Example | Notes |
|----------|---------|--------|
| `APP_NAME` | `Homère` | |
| `APP_ENV` | `production` | |
| `APP_DEBUG` | `false` | **Never `true` on live** |
| `APP_URL` | `https://homere.ng` | Must match public URL (Paystack callbacks) |
| `APP_KEY` | *(generated)* | Cloud usually sets this |

### Database (Laravel Cloud provides these)

| Variable | Notes |
|----------|--------|
| `DB_CONNECTION` | `mysql` |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | From Cloud database attachment |

### Sessions, cache, queue

| Variable | Recommended (production) |
|----------|---------------------------|
| `SESSION_DRIVER` | `database` |
| `CACHE_STORE` | `database` (or Redis if attached) |
| `QUEUE_CONNECTION` | `database` |

Enable a **queue worker** in Laravel Cloud if you send order emails / notifications (otherwise jobs sit in the `jobs` table).

### Paystack (live checkout)

| Variable | Notes |
|----------|--------|
| `PAYSTACK_PUBLIC_KEY` | Live public key |
| `PAYSTACK_SECRET_KEY` | Live secret key |
| `PAYSTACK_BASE_URL` | `https://api.paystack.co` |

**Paystack dashboard → Webhooks:**

```
https://YOUR_DOMAIN/paystack/webhook
```

### Mail (order confirmations, invoices)

| Variable | Notes |
|----------|--------|
| `MAIL_MAILER` | `smtp` / `resend` / etc. |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | Your provider |
| `MAIL_FROM_ADDRESS` | e.g. `orders@homere.ng` |
| `MAIL_FROM_NAME` | `Homère` |
| `MAIL_ORDER_ADMIN` | Optional — copy of new orders |

### Storefront currency

| Variable | Default | Notes |
|----------|---------|--------|
| `STOREFRONT_DEFAULT_COUNTRY` | `NG` | Fallback when no geo header |
| `STOREFRONT_EUR_TO_NGN` | `1700` | EUR catalog → ₦ display |
| `STOREFRONT_EUR_TO_USD` | `1.09` | EUR catalog → $ display |

Put **Cloudflare** (or similar) in front of the site so `CF-IPCountry` works for NGN vs USD.

---

## First deploy (one-time)

### 1. Push code

```bash
git push origin main
```

Wait for build + migrate to succeed.

### 2. Create storage link (if deploy command didn’t)

```bash
php artisan storage:link --force
```

*(Usually handled by deploy commands above.)*

### 3. Seed structure (no products yet)

Run **once** via Laravel Cloud **Commands** (or local against production DB — careful):

```bash
php artisan db:seed --class=ProductTemplateSeeder --force
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=BrandSeeder --force
```

### 4. Change admin password

Default from `AdminSeeder`: `admin@homere.ng` / `password`

Log in at `/admin/login` and **change immediately**, or update via tinker before announcing the site.

---

## First-time catalog on production

Catalog lives in `public/output/` (scraped JSON). Either:

**Option A — Commit JSON in git** (simplest for Cloud)

- Ensure `public/output/index.json`, `public/output/collections/`, `public/output/brands/` are committed
- Push with the app

**Option B — Scrape on the server** (incremental, recommended for updates)

```bash
php artisan catalog:manifest --write
php artisan catalog:sync scented-candles
php artisan catalog:sync home-fragrance
# … one handle at a time from catalog:manifest
```

### Import everything once (slow — 10k+ products)

Only for **initial** load, run manually (not in deploy commands):

```bash
php artisan catalog:import-products --publish --refresh
```

### Verify catalog

```bash
php artisan tinker --execute="echo App\Models\Product::published()->count().' published products';"
```

Spot-check URLs:

- `/` — home, collections grid
- `/shop/scented-candles` — products visible
- `/admin/products` — admin catalog

---

## Post-deploy smoke test

- [ ] Home page loads, no console errors
- [ ] `/shop` shows products
- [ ] Product detail page, images load
- [ ] Add to cart → checkout (Paystack **test** amount first if possible)
- [ ] Paystack webhook receives events (check Paystack dashboard)
- [ ] Admin login works, password changed
- [ ] Order confirmation email (if mail configured)
- [ ] Currency: Nigeria → NGN, other countries → USD (or manual selector)

---

## Ongoing releases

```bash
# Local
composer run deploy:prep
git push origin main
```

Cloud runs: `migrate --force` → `storage:link` → `optimize` → live.

### Catalog updates (after live)

Sync one category at a time:

```bash
php artisan catalog:sync {handle}
php artisan catalog:sync assouline --brand
```

---

## Troubleshooting

### Every URL shows `404 Not Found` from nginx (not Laravel)

If the page says **`nginx/1.24.0 (Ubuntu)`** (plain nginx HTML, not your site), **PHP/Laravel is not handling requests**. This is a server/DNS issue, not an app bug.

**Step 1 — Which URL are you opening?**

| URL | What to check |
|-----|----------------|
| `https://your-app.laravel.cloud` | Laravel Cloud app URL from dashboard |
| Custom domain (`homere.ng`) | DNS must point to Cloud or your VPS |

Try the **Laravel Cloud `.laravel.cloud` URL** first. If that works but your custom domain does not, fix DNS (see below).

**Step 2 — Health check**

Open:

```
https://YOUR_DOMAIN/up
```

| Result | Meaning |
|--------|---------|
| `{"status":"ok"}` or healthy response | Laravel is running — problem may be route/cache only |
| Same nginx 404 | Web server not wired to `public/index.php` |
| 502/503 | App crashed — check Cloud deploy logs |

**Step 3 — Laravel Cloud**

1. Dashboard → **Deployments** → latest deploy **succeeded** (green).
2. **Environment → Deploy commands** include `php artisan migrate --force` (not failing).
3. **Domains** → custom domain **verified** and attached to this environment.
4. DNS for custom domain:
   - **CNAME** → target shown in Laravel Cloud (not an old VPS IP).
5. Wait 5–30 min after DNS changes.

**Step 4 — Ubuntu VPS (nginx yourself)**

The document root **must** be `public/`:

```nginx
root /var/www/homere/public;   # ✅ correct
# root /var/www/homere;       # ❌ causes 404 on every route
```

Use the example config:

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/homere
# Edit server_name and root path
sudo ln -sf /etc/nginx/sites-available/homere /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # remove default site if it steals traffic
sudo nginx -t && sudo systemctl reload nginx
```

Ensure PHP-FPM is running:

```bash
sudo systemctl status php8.3-fpm
```

**Step 5 — After nginx is fixed**

On the server (or Cloud one-off command):

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Rebuild frontend if missing:

```bash
npm ci && npm run build
```

`public/build/manifest.json` must exist or Inertia pages will error (different from nginx 404).

---

### Deploy failed on migration

- **Duplicate column** — migration already partially applied; use idempotent migrations (`Schema::hasColumn`) or mark migration run in `migrations` table after fixing.
- Read deploy log in Laravel Cloud dashboard.

### Shop empty but admin has products

- Products may be `is_active = false` — import with `--publish` or publish in admin.
- Wrong category: re-run `php artisan catalog:sync {handle}` for that collection.

### Paystack redirect fails

- `APP_URL` must exactly match the live domain (https, no trailing slash issues).
- Live keys must match Paystack app mode.

### Images broken

- Run `php artisan storage:link --force`
- Product images from scrape use external CDN URLs — should work without storage.
- Admin-uploaded images need `storage/app/public` writable + link.

### Queue / emails not sending

- Enable queue worker on Laravel Cloud
- Set `QUEUE_CONNECTION=database`
- Check `jobs` and `failed_jobs` tables

---

## Quick reference

| Task | Command |
|------|---------|
| Pre-push checks | `composer run deploy:prep` |
| Deploy to Cloud | `git push origin main` |
| List catalog handles | `php artisan catalog:manifest` |
| Sync one collection | `php artisan catalog:sync scented-candles` |
| Sync one brand | `php artisan catalog:sync assouline --brand` |
| Import existing JSON | `php artisan catalog:import-products --collection=HANDLE --publish --refresh` |
| Clear caches | `php artisan optimize:clear` |
| Rebuild caches | `php artisan optimize` |

---

## What NOT to run on every deploy

- `migrate:fresh` — wipes database
- `db:seed` — re-runs admin + full catalog seeder
- `catalog:import-products` without `--collection` — very slow
- `node z.js --full` — unreliable bulk scrape; use `catalog:sync` per handle
