# Homère on DigitalOcean (nginx + PHP)

Guide for the **Ubuntu VPS** at `/var/www/homere`. Use this when redeploying after losing a droplet or bringing a fresh server to production.

**Current state:** app is cloned, built, and serving. What remains is **catalog import** (products one collection/brand at a time) and a short final checklist.

---

## Quick checklist (redeploy)

Run on the server:

```bash
cd /var/www/homere
```

| Step | Done? | Command / check |
|------|-------|-----------------|
| App responds | ☐ | `curl -s http://127.0.0.1/up` |
| `.env` production values set | ☐ | `APP_DEBUG=false`, `APP_URL`, DB, Paystack, mail |
| Migrations ran | ☐ | `php artisan migrate:status` |
| Structure seeded (no products yet) | ☐ | See [§2](#2-database-structure-one-time) |
| Frontend built | ☐ | `ls public/build/manifest.json` |
| Storage linked | ☐ | `ls -la public/storage` |
| Queue worker running | ☐ | See [§6](#6-queue-worker) |
| **Catalog imported** | ☐ | See [§4](#4-catalog-import-products-one-by-one) |
| Nav groups synced | ☐ | `php artisan brands:sync-nav-groups` |
| Admin password changed | ☐ | `/admin/login` |
| Site lock (preview) | ☐ | `SITE_LOCK_*` in `.env` if sharing privately |
| HTTPS | ☐ | `certbot --nginx` |

---

## 1. Verify the app is running

```bash
cd /var/www/homere

curl -s http://127.0.0.1/up          # Laravel health
curl -sI http://127.0.0.1/ | head -5 # should not be nginx 404
ls public/build/manifest.json          # Inertia assets
php artisan about | grep -E 'Environment|Debug|URL'
```

If every URL shows **nginx 404**, fix nginx first → [§8 Reference: nginx](#8-reference-nginx--first-time-server).

After any `.env` change:

```bash
php artisan config:clear
php artisan optimize
```

---

## 2. Database structure (one-time)

Run **once** on a fresh database. Safe to re-run seeders (they use `firstOrCreate`).

```bash
cd /var/www/homere

php artisan migrate --force

php artisan db:seed --class=ProductTemplateSeeder --force
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=BrandSeeder --force
php artisan db:seed --class=AdminSeeder --force

php artisan storage:link --force
```

Default admin (change immediately): `admin@homere.ng` / `password` → `/admin/login`

**Do not** run `CatalogProductSeeder` or `db:seed` without `--class` on production — that bulk-loads products and is slow. Use §4 instead.

---

## 3. Production `.env`

Edit on the server:

```bash
nano /var/www/homere/.env
```

### Required

| Variable | Value |
|----------|--------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://homere.ng` (exact public URL, no trailing slash) |
| `DB_*` | MySQL credentials |

### Sessions / cache / queue

| Variable | Value |
|----------|--------|
| `SESSION_DRIVER` | `database` |
| `CACHE_STORE` | `database` |
| `QUEUE_CONNECTION` | `database` |

### Paystack (live)

| Variable | Notes |
|----------|--------|
| `PAYSTACK_PUBLIC_KEY` | Live key |
| `PAYSTACK_SECRET_KEY` | Live key |
| `PAYSTACK_BASE_URL` | `https://api.paystack.co` |

Webhook URL in Paystack dashboard:

```
https://homere.ng/paystack/webhook
```

### Stripe (if used)

| Variable | Notes |
|----------|--------|
| `STRIPE_PUBLIC_KEY` | |
| `STRIPE_SECRET_KEY` | |
| `STRIPE_WEBHOOK_SECRET` | |

Webhook: `https://homere.ng/stripe/webhook`

### Mail

| Variable | Notes |
|----------|--------|
| `MAIL_MAILER` | `smtp` / provider |
| `MAIL_FROM_ADDRESS` | e.g. `orders@homere.ng` |
| `MAIL_ORDER_ADMIN` | Copy of new orders |

### Storefront currency

| Variable | Typical |
|----------|---------|
| `STOREFRONT_DEFAULT_COUNTRY` | `NG` |
| `STOREFRONT_EUR_TO_NGN` | `1700` |
| `STOREFRONT_EUR_TO_USD` | `1.09` |

Put **Cloudflare** in front of the site so `CF-IPCountry` works for NGN vs USD.

### Site lock (private preview)

| Variable | Value |
|----------|--------|
| `SITE_LOCK_ENABLED` | `true` while sharing with reviewers |
| `SITE_LOCK_PASSWORD` | Password you give clients |
| `SITE_LOCK_BYPASS_ADMIN` | `true` (admins skip the gate) |

```bash
php artisan config:clear && php artisan optimize
```

---

## 4. Catalog import — products one by one

Catalog JSON lives in `public/output/` (committed in git). On redeploy you usually **import from existing JSON** — no scrape needed unless files are missing or stale.

### Before you start

```bash
cd /var/www/homere

# Confirm JSON is present (from git pull)
ls public/output/index.json
ls public/output/collections/*.json | wc -l   # expect ~100+
ls public/output/brands/*.json | wc -l       # expect 42

# List every handle in order
php artisan catalog:manifest
```

Use a **persistent terminal** — imports can take minutes per collection:

```bash
sudo apt install -y tmux    # if needed
tmux new -s catalog
# Ctrl+B then D to detach; tmux attach -t catalog to return
```

### Option A — Import from JSON (recommended on redeploy)

Faster. Uses files already in `public/output/`. Run **one command per collection/brand**, wait for it to finish, then run the next.

**Collection:**

```bash
php artisan catalog:import-products --collection=HANDLE --publish --refresh
```

**Brand:**

```bash
php artisan catalog:import-products --collection=HANDLE --brand --publish --refresh
```

Dry-run first (optional):

```bash
php artisan catalog:import-products --collection=scented-candles --publish --refresh --dry-run
```

### Option B — Scrape then import (fresh data from Arowonen)

Use when JSON is missing or you need updated prices/stock. Requires Node on the server (already installed for `npm run build`).

```bash
php artisan catalog:sync HANDLE
php artisan catalog:sync assouline --brand
```

Scrape-only or import-only:

```bash
php artisan catalog:sync scented-candles --scrape-only
php artisan catalog:sync scented-candles --import-only
```

---

### Collections (99) — run in order

Copy/paste each line on the server. Wait for `Imported:` / `Updated:` before the next.

```bash
cd /var/www/homere

php artisan catalog:import-products --collection=new-arrivals-1 --publish --refresh
php artisan catalog:import-products --collection=home-fragrance --publish --refresh
php artisan catalog:import-products --collection=scented-candles --publish --refresh
php artisan catalog:import-products --collection=home-sprays --publish --refresh
php artisan catalog:import-products --collection=totems-diffusers --publish --refresh
php artisan catalog:import-products --collection=fragrance-accessories --publish --refresh
php artisan catalog:import-products --collection=refills --publish --refresh
php artisan catalog:import-products --collection=furniture --publish --refresh
php artisan catalog:import-products --collection=bedroom --publish --refresh
php artisan catalog:import-products --collection=beds --publish --refresh
php artisan catalog:import-products --collection=night-stands --publish --refresh
php artisan catalog:import-products --collection=cabinets-dressers-chests --publish --refresh
php artisan catalog:import-products --collection=closets --publish --refresh
php artisan catalog:import-products --collection=rugs-carpets --publish --refresh
php artisan catalog:import-products --collection=sofas --publish --refresh
php artisan catalog:import-products --collection=linear-sofas --publish --refresh
php artisan catalog:import-products --collection=corner-sofas --publish --refresh
php artisan catalog:import-products --collection=modular-sofas --publish --refresh
php artisan catalog:import-products --collection=ottomans --publish --refresh
php artisan catalog:import-products --collection=chaise-longues --publish --refresh
php artisan catalog:import-products --collection=benches --publish --refresh
php artisan catalog:import-products --collection=pouf --publish --refresh
php artisan catalog:import-products --collection=chairs-arm-chairs --publish --refresh
php artisan catalog:import-products --collection=armchairs --publish --refresh
php artisan catalog:import-products --collection=dining-chairs-bar-stools --publish --refresh
php artisan catalog:import-products --collection=office-chairs --publish --refresh
php artisan catalog:import-products --collection=bar-counterstools --publish --refresh
php artisan catalog:import-products --collection=tables-desks --publish --refresh
php artisan catalog:import-products --collection=coffee-tables --publish --refresh
php artisan catalog:import-products --collection=side-tables --publish --refresh
php artisan catalog:import-products --collection=dining-tables --publish --refresh
php artisan catalog:import-products --collection=console-tables --publish --refresh
php artisan catalog:import-products --collection=vanity --publish --refresh
php artisan catalog:import-products --collection=desk --publish --refresh
php artisan catalog:import-products --collection=living-systems-bookshelves --publish --refresh
php artisan catalog:import-products --collection=single-units --publish --refresh
php artisan catalog:import-products --collection=trolleys-bars --publish --refresh
php artisan catalog:import-products --collection=leisure --publish --refresh
php artisan catalog:import-products --collection=home-office --publish --refresh
php artisan catalog:import-products --collection=lighting --publish --refresh
php artisan catalog:import-products --collection=lanterns-chandeliers --publish --refresh
php artisan catalog:import-products --collection=ceiling-lamps --publish --refresh
php artisan catalog:import-products --collection=wall-lamps-ceiling-lamps --publish --refresh
php artisan catalog:import-products --collection=floor-lamps --publish --refresh
php artisan catalog:import-products --collection=table-lamps-floor-lamps --publish --refresh
php artisan catalog:import-products --collection=decor-accessories --publish --refresh
php artisan catalog:import-products --collection=candle-holders-accessories --publish --refresh
php artisan catalog:import-products --collection=coasters --publish --refresh
php artisan catalog:import-products --collection=boxes --publish --refresh
php artisan catalog:import-products --collection=games --publish --refresh
php artisan catalog:import-products --collection=watch-winders --publish --refresh
php artisan catalog:import-products --collection=objects --publish --refresh
php artisan catalog:import-products --collection=picture-frames --publish --refresh
php artisan catalog:import-products --collection=bowls --publish --refresh
php artisan catalog:import-products --collection=coffee-table-books-1 --publish --refresh
php artisan catalog:import-products --collection=travel-series --publish --refresh
php artisan catalog:import-products --collection=design-architecture-1 --publish --refresh
php artisan catalog:import-products --collection=fashion-luxury-brands-books --publish --refresh
php artisan catalog:import-products --collection=design-architecture --publish --refresh
php artisan catalog:import-products --collection=the-ultimate-collection --publish --refresh
php artisan catalog:import-products --collection=special-edditions --publish --refresh
php artisan catalog:import-products --collection=bookends-book-stands --publish --refresh
php artisan catalog:import-products --collection=art-mirrors --publish --refresh
php artisan catalog:import-products --collection=art --publish --refresh
php artisan catalog:import-products --collection=mirrors --publish --refresh
php artisan catalog:import-products --collection=textiles --publish --refresh
php artisan catalog:import-products --collection=decorative-cushions-pillows --publish --refresh
php artisan catalog:import-products --collection=plaids --publish --refresh
php artisan catalog:import-products --collection=plaids-bedspreads --publish --refresh
php artisan catalog:import-products --collection=wallpaper --publish --refresh
php artisan catalog:import-products --collection=dining-serveware --publish --refresh
php artisan catalog:import-products --collection=dinnerware --publish --refresh
php artisan catalog:import-products --collection=drinkware --publish --refresh
php artisan catalog:import-products --collection=tabletop-accents --publish --refresh
php artisan catalog:import-products --collection=trays-servings --publish --refresh
php artisan catalog:import-products --collection=flowers-vases --publish --refresh
php artisan catalog:import-products --collection=artificial-flowers-plants --publish --refresh
php artisan catalog:import-products --collection=vases --publish --refresh
php artisan catalog:import-products --collection=pots-big-vases --publish --refresh
php artisan catalog:import-products --collection=outdoor-collection --publish --refresh
php artisan catalog:import-products --collection=outdoor-sofas-daybeds --publish --refresh
php artisan catalog:import-products --collection=outdoor-linear-sofas --publish --refresh
php artisan catalog:import-products --collection=outdoor-corner-sofas --publish --refresh
php artisan catalog:import-products --collection=outdoor-ottomans --publish --refresh
php artisan catalog:import-products --collection=outdoor-benches --publish --refresh
php artisan catalog:import-products --collection=outdoor-poufs --publish --refresh
php artisan catalog:import-products --collection=outdoor-daybeds-sunbeds --publish --refresh
php artisan catalog:import-products --collection=outdoor-daybeds --publish --refresh
php artisan catalog:import-products --collection=outdoor-sunbeds --publish --refresh
php artisan catalog:import-products --collection=outdoor-chairs --publish --refresh
php artisan catalog:import-products --collection=outdoor-dining-chairs --publish --refresh
php artisan catalog:import-products --collection=outdoor-arm-chairs --publish --refresh
php artisan catalog:import-products --collection=outdoor-tables --publish --refresh
php artisan catalog:import-products --collection=outdoor-coffee-table --publish --refresh
php artisan catalog:import-products --collection=outdoor-side-tables --publish --refresh
php artisan catalog:import-products --collection=outdoor-dining-tables --publish --refresh
php artisan catalog:import-products --collection=outdoor-carpets --publish --refresh
php artisan catalog:import-products --collection=outdoor-accessories --publish --refresh
php artisan catalog:import-products --collection=outdoor-lighting --publish --refresh
```

> **Tip:** To resume after a break, run `php artisan catalog:manifest` and skip handles you already imported. Re-running a handle is safe with `--refresh`.

---

### Brands (42) — run after collections

```bash
php artisan catalog:import-products --collection=anissa-kermiche --brand --publish --refresh
php artisan catalog:import-products --collection=armani-casa --brand --publish --refresh
php artisan catalog:import-products --collection=arowonen --brand --publish --refresh
php artisan catalog:import-products --collection=arte --brand --publish --refresh
php artisan catalog:import-products --collection=assouline --brand --publish --refresh
php artisan catalog:import-products --collection=baccarat --brand --publish --refresh
php artisan catalog:import-products --collection=baobab-collection --brand --publish --refresh
php artisan catalog:import-products --collection=baxter-made-in-italy --brand --publish --refresh
php artisan catalog:import-products --collection=boca-do-lobo --brand --publish --refresh
php artisan catalog:import-products --collection=bosa --brand --publish --refresh
php artisan catalog:import-products --collection=culti-milano --brand --publish --refresh
php artisan catalog:import-products --collection=dr-vranjes-firenze --brand --publish --refresh
php artisan catalog:import-products --collection=disney --brand --publish --refresh
php artisan catalog:import-products --collection=eichholtz --brand --publish --refresh
php artisan catalog:import-products --collection=fendi-casa --brand --publish --refresh
php artisan catalog:import-products --collection=ferire --brand --publish --refresh
php artisan catalog:import-products --collection=flos --brand --publish --refresh
php artisan catalog:import-products --collection=fornasetti --brand --publish --refresh
php artisan catalog:import-products --collection=gaggenau --brand --publish --refresh
php artisan catalog:import-products --collection=glas-italia --brand --publish --refresh
php artisan catalog:import-products --collection=guaxs --brand --publish --refresh
php artisan catalog:import-products --collection=helle-mardahl-studio --brand --publish --refresh
php artisan catalog:import-products --collection=jonathan-adler --brand --publish --refresh
php artisan catalog:import-products --collection=lobjet --brand --publish --refresh
php artisan catalog:import-products --collection=linari --brand --publish --refresh
php artisan catalog:import-products --collection=missoni-home --brand --publish --refresh
php artisan catalog:import-products --collection=molteni-c --brand --publish --refresh
php artisan catalog:import-products --collection=pinetti --brand --publish --refresh
php artisan catalog:import-products --collection=reflections-copenhagen --brand --publish --refresh
php artisan catalog:import-products --collection=rizzoli --brand --publish --refresh
php artisan catalog:import-products --collection=roberte-cavalli --brand --publish --refresh
php artisan catalog:import-products --collection=seletti --brand --publish --refresh
php artisan catalog:import-products --collection=skogsberg-smart --brand --publish --refresh
php artisan catalog:import-products --collection=studio-zar --brand --publish --refresh
php artisan catalog:import-products --collection=taschen --brand --publish --refresh
php artisan catalog:import-products --collection=teckell --brand --publish --refresh
php artisan catalog:import-products --collection=teneues --brand --publish --refresh
php artisan catalog:import-products --collection=tom-dixon --brand --publish --refresh
php artisan catalog:import-products --collection=transparent --brand --publish --refresh
php artisan catalog:import-products --collection=versacehome --brand --publish --refresh
php artisan catalog:import-products --collection=visionnaire-home-philosophy --brand --publish --refresh
php artisan catalog:import-products --collection=wolf-1834 --brand --publish --refresh
```

---

### After all imports

```bash
php artisan brands:sync-nav-groups
php artisan categories:sync-home-accessories-nav
php artisan optimize
```

### Verify catalog

```bash
php artisan tinker --execute="echo App\Models\Product::published()->count().' published products';"
```

Spot-check in the browser:

| URL | Expect |
|-----|--------|
| `/` | Home, collection grid |
| `/shop/scented-candles` | Products visible |
| `/brands/assouline` | Brand products |
| `/admin/products` | Same products in admin |

Check logs if a handle fails:

```bash
tail -50 storage/logs/laravel.log
```

---

## 5. Permissions

```bash
cd /var/www/homere
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## 6. Queue worker

Required for order emails and notifications.

```bash
sudo nano /etc/systemd/system/homere-queue.service
```

```ini
[Unit]
Description=Homère queue worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
WorkingDirectory=/var/www/homere
ExecStart=/usr/bin/php artisan queue:work database --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable homere-queue
sudo systemctl start homere-queue
sudo systemctl status homere-queue
```

---

## 7. Deploy updates (after git push)

On the server:

```bash
cd /var/www/homere
bash deploy/update.sh
```

Or manually:

```bash
cd /var/www/homere
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan storage:link --force
php artisan optimize
sudo chown -R www-data:www-data storage bootstrap/cache
```

**Do not** put `catalog:import-products` or `db:seed` in `deploy/update.sh` — too slow; run catalog imports manually (§4).

### Catalog updates later (one handle at a time)

```bash
php artisan catalog:sync scented-candles              # scrape + import
php artisan catalog:sync assouline --brand
# or import only if JSON already updated in git:
php artisan catalog:import-products --collection=scented-candles --publish --refresh
```

---

## 8. Reference: nginx & first-time server

### nginx 404 on every URL

`root` **must** be `public/`:

```nginx
root /var/www/homere/public;
```

```bash
sudo ln -sf /etc/nginx/sites-available/homere /etc/nginx/sites-enabled/homere
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Full example: `deploy/nginx.conf.example`

### First-time packages (new droplet)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-cli php8.3-mysql \
  php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath \
  git unzip curl tmux

curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Clone, `.env`, migrate, seed → §2 and §3.

### HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d homere.ng -d www.homere.ng
```

---

## 9. Smoke test before handoff

- [ ] `https://homere.ng/up` healthy
- [ ] Home page loads, no console errors
- [ ] `/shop` shows products
- [ ] Product detail — images load
- [ ] Add to cart → checkout (small Paystack test if possible)
- [ ] Admin login — password changed from default
- [ ] Site lock works if enabled (`SITE_LOCK_ENABLED=true`)
- [ ] Order email sends (queue worker + mail configured)

---

## 10. Troubleshooting

| Symptom | Fix |
|---------|-----|
| nginx 404 on all URLs | `root` → `.../public`; remove `sites-enabled/default` |
| 502 Bad Gateway | `sudo systemctl status php8.3-fpm`; fix socket in nginx |
| 500 after nginx works | `tail storage/logs/laravel.log`; `php artisan config:clear` |
| Blank / white Inertia page | `npm run build` — need `public/build/manifest.json` |
| Shop empty, admin has products | Import with `--publish` or publish in admin |
| Import: missing brand | Run `BrandSeeder` first (§2) |
| Import: missing category | Run `CategorySeeder` first (§2) |
| `No products in …json` | JSON missing — run `catalog:sync HANDLE` instead |
| Emails not sending | Queue worker (§6); check `jobs` / `failed_jobs` |
| Paystack redirect fails | `APP_URL` must match live domain exactly |

---

## Quick reference

| Task | Command |
|------|---------|
| List all handles | `php artisan catalog:manifest` |
| Import one collection | `php artisan catalog:import-products --collection=HANDLE --publish --refresh` |
| Import one brand | `php artisan catalog:import-products --collection=HANDLE --brand --publish --refresh` |
| Scrape + import one | `php artisan catalog:sync HANDLE` |
| Published product count | `php artisan tinker --execute="echo App\Models\Product::published()->count();"` |
| Deploy code update | `bash deploy/update.sh` |
| Clear caches | `php artisan optimize:clear` |

### Never run on every deploy

- `migrate:fresh` — wipes database
- `db:seed` (full) — includes bulk catalog seeder
- `catalog:import-products` without `--collection` — very slow, 10k+ products
- `node z.js --full` — unreliable; use `catalog:sync` per handle

---

See also: [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md) (Laravel Cloud + shared env notes).
