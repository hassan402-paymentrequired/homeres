#!/usr/bin/env bash
set -euo pipefail

# Run on the DigitalOcean server after git pull.
# Usage: cd /var/www/homere && bash deploy/update.sh

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

echo "→ Pulling latest code…"
git pull origin main

echo "→ Composer…"
composer install --no-dev --optimize-autoloader

echo "→ Frontend build…"
npm ci
npm run build

echo "→ Migrations…"
php artisan migrate --force

echo "→ Storage link…"
php artisan storage:link --force 2>/dev/null || true

echo "→ Cache…"
php artisan optimize

echo "→ Permissions…"
if id www-data &>/dev/null; then
  sudo chown -R www-data:www-data storage bootstrap/cache
  sudo chmod -R 775 storage bootstrap/cache
fi

echo "✓ Deploy complete. Test: curl -sS \"\${APP_URL:-http://127.0.0.1}/up\""
