# Homère on DigitalOcean (nginx + PHP)

Your **nginx 404 on every URL** happens when the site `root` is not `public/` or PHP-FPM is not wired up. Follow this guide on the droplet.

---

## 1. Fix nginx (do this first)

SSH into the droplet:

```bash
ssh root@YOUR_DROPLET_IP
```

Find where the app lives (common paths):

```bash
ls /var/www/homere/public/index.php
# or
ls /home/deploy/homere/public/index.php
```

Edit nginx site config:

```bash
sudo nano /etc/nginx/sites-available/homere
```

Paste this (change `server_name` and `root` to match your paths):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name homere.ng www.homere.ng YOUR_DROPLET_IP;

    root /var/www/homere/public;
    index index.php;

    charset utf-8;
    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site and **disable the default** (it often steals traffic and shows nginx 404):

```bash
sudo ln -sf /etc/nginx/sites-available/homere /etc/nginx/sites-enabled/homere
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Check PHP-FPM socket (adjust version if needed):

```bash
ls /var/run/php/
sudo systemctl status php8.3-fpm
```

If the socket is `php8.2-fpm.sock`, update `fastcgi_pass` in the config.

**Test:** open `http://YOUR_DROPLET_IP/up` — you should see a healthy JSON response, not nginx 404.

---

## 2. First-time server setup (new droplet)

On Ubuntu 24.04:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-cli php8.3-mysql \
  php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath \
  git unzip curl

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Clone the app:

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/YOUR_ORG/homere.git homere
cd homere
```

Environment:

```bash
cp .env.example .env
nano .env   # set APP_URL, DB_*, PAYSTACK_*, APP_DEBUG=false, APP_ENV=production
php artisan key:generate
```

Database (MySQL):

```bash
sudo mysql
```

```sql
CREATE DATABASE homere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'homere'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL ON homere.* TO 'homere'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Put DB credentials in `.env`, then:

```bash
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan storage:link --force
php artisan db:seed --class=ProductTemplateSeeder --force
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=BrandSeeder --force
php artisan optimize
```

Permissions:

```bash
sudo chown -R www-data:www-data /var/www/homere/storage /var/www/homere/bootstrap/cache
sudo chmod -R 775 /var/www/homere/storage /var/www/homere/bootstrap/cache
```

Configure nginx (section 1 above), then HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d homere.ng -d www.homere.ng
```

---

## 3. Deploy updates (after git push)

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

---

## 4. Queue worker (emails / notifications)

Create a systemd service so queued jobs run:

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
sudo systemctl enable homere-queue
sudo systemctl start homere-queue
```

---

## 5. Checklist

| Check | Command / URL |
|-------|----------------|
| nginx config valid | `sudo nginx -t` |
| PHP-FPM running | `sudo systemctl status php8.3-fpm` |
| Laravel health | `curl -s http://127.0.0.1/up` |
| Build exists | `ls public/build/manifest.json` |
| Storage link | `ls -la public/storage` |
| App URL in `.env` | `APP_URL=https://homere.ng` |

---

## 6. Common errors

| Symptom | Fix |
|---------|-----|
| nginx 404 on all URLs | `root` must be `.../public`; remove `sites-enabled/default` |
| 502 Bad Gateway | PHP-FPM down or wrong socket path in nginx |
| 500 after nginx works | `storage/logs/laravel.log`; run `php artisan config:clear` |
| White / blank Inertia page | `npm run build` — need `public/build/manifest.json` |
| CSS/JS missing | `APP_URL` wrong or build not run |

Example nginx config is also in `deploy/nginx.conf.example`.
