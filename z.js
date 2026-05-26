/**
 * AROWONEN.COM — catalog scraper (Shopify storefront JSON)
 *
 * Discovers collections from /collections.json (no hardcoded handle lists),
 * splits brand vs category files, paginates products, and writes JSON for:
 *   public/output/collections/{handle}.json  → catalog:import-products
 *   public/output/brands/{handle}.json        → BrandSeeder / index
 *   public/output/index.json
 *
 * Usage:
 *   node z.js                    # nav + storefront categories (default)
 *   node z.js --full             # every non-brand collection with products
 *   node z.js --handle=sofas     # single collection or brand
 *   node z.js --brands-only
 *   node z.js --collections-only
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = "arowonen.com";
const OUTPUT_DIR = path.join(__dirname, "public", "output");
const DELAY_MS = 600;
const MAX_RETRIES = 4;
const PRODUCTS_PER_PAGE = 250;
const COLLECTIONS_PER_PAGE = 250;

/** Shopify mega-collection — duplicates entire catalog. */
const SKIP_HANDLES = new Set(["all-items"]);

/**
 * Brand collection handles (Arowonen “View all Brands” nav).
 * Labels come from Shopify collection titles at scrape time.
 */
const BRAND_HANDLES = new Set([
  "anissa-kermiche",
  "armani-casa",
//   "arowonen",
  "arte",
  "assouline",
  "baccarat",
  "baobab-collection",
  "baxter-made-in-italy",
  "boca-do-lobo",
  "bosa",
  "culti-milano",
  "dr-vranjes-firenze",
  "disney", // Leblon Delienne on storefront
  "eichholtz",
  "fendi-casa",
  "ferire",
  "flos",
  "fornasetti",
  "gaggenau",
  "glas-italia",
  "guaxs",
  "helle-mardahl-studio",
  "jonathan-adler",
  "lobjet",
  "linari",
  "missoni-home",
  "molteni-c",
  "pinetti",
  "reflections-copenhagen",
  "rizzoli",
  "roberte-cavalli",
  "seletti",
  "skogsberg-smart",
  "studio-zar",
  "taschen",
  "teckell",
  "teneues",
  "tom-dixon",
  "transparent",
  "versacehome",
  "visionnaire-home-philosophy",
  "wolf-1834",
]);

/**
 * Handles referenced by CategorySeeder navigation (always scraped for collections/).
 * Empty Shopify counts are still written so categories exist before import.
 */
const NAV_COLLECTION_HANDLES = new Set([
  "new-arrivals-1",
  "home-fragrance",
  "scented-candles",
  "home-sprays",
  "totems-diffusers",
  "fragrance-accessories",
  "refills",
  "furniture",
  "bedroom",
  "beds",
  "night-stands",
  "cabinets-dressers-chests",
  "closets",
  "rugs-carpets",
  "sofas",
  "linear-sofas",
  "corner-sofas",
  "modular-sofas",
  "ottomans",
  "chaise-longues",
  "benches",
  "pouf",
  "chairs-arm-chairs",
  "armchairs",
  "dining-chairs-bar-stools",
  "office-chairs",
  "bar-counterstools",
  "tables-desks",
  "coffee-tables",
  "side-tables",
  "dining-tables",
  "console-tables",
  "vanity",
  "desk",
  "living-systems-bookshelves",
  "single-units",
  "trolleys-bars",
  "leisure",
  "home-office",
  "lighting",
  "lanterns-chandeliers",
  "ceiling-lamps",
  "wall-lamps-ceiling-lamps",
  "floor-lamps",
  "table-lamps-floor-lamps",
  "decor-accessories",
  "candle-holders-accessories",
  "coasters",
  "boxes",
  "games",
  "watch-winders",
  "objects",
  "picture-frames",
  "bowls",
  "coffee-table-books-1",
  "travel-series",
  "design-architecture-1",
  "fashion-luxury-brands-books",
  "design-architecture",
  "the-ultimate-collection",
  "special-edditions",
  "bookends-book-stands",
  "art-mirrors",
  "art",
  "mirrors",
  "textiles",
  "decorative-cushions-pillows",
  "plaids",
  "plaids-bedspreads",
  "wallpaper",
  "dining-serveware",
  "dinnerware",
  "drinkware",
  "tabletop-accents",
  "trays-servings",
  "flowers-vases",
  "artificial-flowers-plants",
  "vases",
  "pots-big-vases",
  "outdoor-collection",
  "outdoor-sofas-daybeds",
  "outdoor-linear-sofas",
  "outdoor-corner-sofas",
  "outdoor-ottomans",
  "outdoor-benches",
  "outdoor-poufs",
  "outdoor-daybeds-sunbeds",
  "outdoor-daybeds",
  "outdoor-sunbeds",
  "outdoor-chairs",
  "outdoor-dining-chairs",
  "outdoor-arm-chairs",
  "outdoor-tables",
  "outdoor-coffee-table",
  "outdoor-side-tables",
  "outdoor-dining-tables",
  "outdoor-carpets",
  "outdoor-accessories",
  "outdoor-lighting",
]);

/** Gift / campaign collections — skipped unless --full. */
const PROMO_HANDLE_RE =
  /^(gifts?(-|$)|gift-|for-(her|him|the)|cozy-gifts|must-have-pieces|easter$|fathers-day|home-fragrance-gifts|dining-gifts|for-him-her$|gifts-giftcard|gifts-above|gifts-for-|gifts-under|house-of-|international-womens|mothers-day|valentines|christmas|black-friday|sale-|outlet)/i;

// ─── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
  full: args.includes("--full"),
  brandsOnly: args.includes("--brands-only"),
  collectionsOnly: args.includes("--collections-only"),
  handle: (args.find((a) => a.startsWith("--handle=")) || "").split("=")[1] || null,
};

// ─── HTTP ─────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function httpsGet(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: urlPath.startsWith("/") ? urlPath : `/${urlPath}`,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; homere-scraper/2.0)",
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location;
        const parsed = loc.startsWith("http")
          ? new URL(loc)
          : { pathname: loc.split("?")[0], search: loc.includes("?") ? `?${loc.split("?")[1]}` : "" };
        return resolve(httpsGet(parsed.pathname + parsed.search));
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 404) return resolve(null);
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode} for ${urlPath}`));
        }
        try {
          resolve(data ? JSON.parse(data) : null);
        } catch {
          reject(new Error(`Invalid JSON from ${urlPath}`));
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(20000, () => req.destroy(new Error(`Timeout: ${urlPath}`)));
    req.end();
  });
}

async function fetchJson(urlPath) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await httpsGet(urlPath);
    } catch (err) {
      lastError = err;
      const wait = DELAY_MS * attempt * 2;
      console.log(`    ↻ retry ${attempt}/${MAX_RETRIES} (${err.message}), wait ${wait}ms`);
      await sleep(wait);
    }
  }
  throw lastError;
}

// ─── DISCOVERY ────────────────────────────────────────────────────────────────
async function fetchAllCollections() {
  const all = [];
  let page = 1;

  while (true) {
    const data = await fetchJson(
      `/collections.json?limit=${COLLECTIONS_PER_PAGE}&page=${page}`,
    );
    const batch = data?.collections ?? [];
    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < COLLECTIONS_PER_PAGE) break;
    page++;
    await sleep(DELAY_MS);
  }

  const byHandle = new Map();
  for (const c of all) {
    byHandle.set(c.handle, c);
  }

  return { list: all, byHandle };
}

function isPromoCollection(handle) {
  return PROMO_HANDLE_RE.test(handle);
}

function shouldScrapeAsCollection(meta, fullMode) {
  if (SKIP_HANDLES.has(meta.handle) || BRAND_HANDLES.has(meta.handle)) {
    return false;
  }
  if (NAV_COLLECTION_HANDLES.has(meta.handle)) {
    return true;
  }
  if (fullMode) {
    return (meta.products_count ?? 0) > 0;
  }
  if (isPromoCollection(meta.handle)) {
    return false;
  }
  return (meta.products_count ?? 0) > 0;
}

function shouldScrapeAsBrand(meta) {
  return BRAND_HANDLES.has(meta.handle);
}

function titleCaseLabel(handle) {
  return handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── PRODUCT FORMAT ───────────────────────────────────────────────────────────
function formatProduct(p) {
  const prices = (p.variants ?? [])
    .map((v) => parseFloat(v.price))
    .filter((n) => !Number.isNaN(n));

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    url: `https://${BASE_URL}/products/${p.handle}`,
    vendor: p.vendor,
    product_type: p.product_type,
    tags: p.tags,
    created_at: p.created_at,
    updated_at: p.updated_at,
    published_at: p.published_at,
    available: p.variants?.some((v) => v.available) ?? false,
    price_min: prices.length ? Math.min(...prices) : 0,
    price_max: prices.length ? Math.max(...prices) : 0,
    compare_at_price: p.variants?.[0]?.compare_at_price ?? null,
    currency: "EUR",
    variants_count: p.variants?.length ?? 0,
    variants: p.variants?.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      price: v.price,
      compare_at_price: v.compare_at_price,
      available: v.available,
      option1: v.option1,
      option2: v.option2,
      option3: v.option3,
    })),
    options: p.options?.map((o) => ({ name: o.name, values: o.values })),
    images: p.images?.map((img) => ({
      src: img.src,
      alt: img.alt || null,
      width: img.width,
      height: img.height,
    })),
    featured_image: p.featured_image || p.images?.[0]?.src || null,
    description_html: p.body_html || null,
  };
}

async function enrichProductDescription(product) {
  if (product.description_html) {
    return product;
  }

  const data = await fetchJson(`/products/${product.handle}.json`);
  if (data?.product?.body_html) {
    product.description_html = data.product.body_html;
  }

  await sleep(DELAY_MS / 2);
  return product;
}

// ─── SCRAPE COLLECTION ────────────────────────────────────────────────────────
async function scrapeCollectionProducts(handle) {
  const products = [];
  const seen = new Set();
  let page = 1;

  while (true) {
    const data = await fetchJson(
      `/collections/${handle}/products.json?limit=${PRODUCTS_PER_PAGE}&page=${page}`,
    );

    if (!data?.products?.length) {
      break;
    }

    for (const raw of data.products) {
      if (seen.has(raw.id)) continue;
      seen.add(raw.id);
      let formatted = formatProduct(raw);
      if (!formatted.description_html) {
        formatted = await enrichProductDescription(formatted);
      }
      products.push(formatted);
    }

    process.stdout.write(`\r    page ${page}: ${products.length} products`);
    if (data.products.length < PRODUCTS_PER_PAGE) break;
    page++;
    await sleep(DELAY_MS);
  }

  if (products.length > 0) process.stdout.write("\n");
  return products;
}

async function scrapeCollectionEntry(meta) {
  const handle = meta.handle;
  const label = meta.title || titleCaseLabel(handle);
  const shopifyCount = meta.products_count ?? 0;

  console.log(`  ${label} (${handle}) — Shopify: ${shopifyCount}`);

  const products = await scrapeCollectionProducts(handle);
  const scrapedCount = products.length;

  if (shopifyCount > 0 && scrapedCount === 0) {
    console.log(`    ⚠️  Shopify reports ${shopifyCount} products but scrape returned 0`);
  } else if (shopifyCount > 0 && scrapedCount < shopifyCount * 0.9) {
    console.log(
      `    ⚠️  Scraped ${scrapedCount} vs Shopify ${shopifyCount} (pagination or visibility)`,
    );
  }

  return {
    handle,
    label,
    url: `https://${BASE_URL}/collections/${handle}`,
    scraped_at: new Date().toISOString(),
    shopify_product_count: shopifyCount,
    product_count: scrapedCount,
    products,
  };
}

// ─── IO ───────────────────────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("AROWONEN catalog scraper\n");
  console.log(`  output : ${OUTPUT_DIR}`);
  console.log(`  mode   : ${flags.full ? "full (all product collections)" : "catalog (nav + storefront categories)"}`);
  if (flags.handle) console.log(`  filter : ${flags.handle}`);
  console.log("");

  const brandsDir = path.join(OUTPUT_DIR, "brands");
  const collectionsDir = path.join(OUTPUT_DIR, "collections");
  ensureDir(brandsDir);
  ensureDir(collectionsDir);

  const { list, byHandle } = await fetchAllCollections();
  console.log(`Discovered ${list.length} collections on ${BASE_URL}\n`);

  const index = {
    scraped_at: new Date().toISOString(),
    source: `https://${BASE_URL}`,
    scrape_mode: flags.full ? "full" : "catalog",
    brands: [],
    collections: [],
  };

  let brandTargets = list.filter((c) => shouldScrapeAsBrand(c));
  let collectionTargets = list.filter((c) => shouldScrapeAsCollection(c, flags.full));

  if (flags.handle) {
    const one = byHandle.get(flags.handle) ?? {
      handle: flags.handle,
      title: titleCaseLabel(flags.handle),
      products_count: 0,
    };
    brandTargets = !flags.collectionsOnly && BRAND_HANDLES.has(one.handle) ? [one] : [];
    collectionTargets =
      !flags.brandsOnly && !BRAND_HANDLES.has(one.handle) ? [one] : [];
  }

  // Ensure nav handles exist in index even if missing from Shopify (rare)
  for (const handle of NAV_COLLECTION_HANDLES) {
    if (!byHandle.has(handle)) {
      collectionTargets.push({
        handle,
        title: titleCaseLabel(handle),
        products_count: 0,
      });
    }
  }

  // Dedupe targets
  const dedupe = (arr) => {
    const m = new Map();
    for (const item of arr) m.set(item.handle, item);
    return [...m.values()];
  };
  brandTargets = dedupe(brandTargets);
  collectionTargets = dedupe(collectionTargets).filter(
    (meta) => !BRAND_HANDLES.has(meta.handle),
  );

  if (!flags.collectionsOnly && brandTargets.length) {
    console.log(`BRANDS (${brandTargets.length})\n${"─".repeat(50)}`);
    for (let i = 0; i < brandTargets.length; i++) {
      const meta = brandTargets[i];
      console.log(`[${i + 1}/${brandTargets.length}]`);
      const result = await scrapeCollectionEntry(meta);
      const filePath = path.join(brandsDir, `${meta.handle}.json`);
      saveJSON(filePath, result);
      index.brands.push({
        label: result.label,
        handle: meta.handle,
        url: result.url,
        shopify_product_count: result.shopify_product_count,
        product_count: result.product_count,
        file: `brands/${meta.handle}.json`,
      });
      console.log(`    → brands/${meta.handle}.json\n`);
      await sleep(DELAY_MS);
    }
  }

  if (!flags.brandsOnly && collectionTargets.length) {
    console.log(`COLLECTIONS (${collectionTargets.length})\n${"─".repeat(50)}`);
    for (let i = 0; i < collectionTargets.length; i++) {
      const meta = collectionTargets[i];
      console.log(`[${i + 1}/${collectionTargets.length}]`);
      const result = await scrapeCollectionEntry(meta);
      const filePath = path.join(collectionsDir, `${meta.handle}.json`);
      saveJSON(filePath, result);
      index.collections.push({
        label: result.label,
        handle: meta.handle,
        url: result.url,
        shopify_product_count: result.shopify_product_count,
        product_count: result.product_count,
        in_nav: NAV_COLLECTION_HANDLES.has(meta.handle),
        file: `collections/${meta.handle}.json`,
      });
      console.log(`    → collections/${meta.handle}.json\n`);
      await sleep(DELAY_MS);
    }
  }

  index.collections.sort((a, b) => a.label.localeCompare(b.label));
  index.brands.sort((a, b) => a.label.localeCompare(b.label));

  saveJSON(path.join(OUTPUT_DIR, "index.json"), index);

  const brandProducts = index.brands.reduce((s, b) => s + b.product_count, 0);
  const collectionProducts = index.collections.reduce((s, c) => s + c.product_count, 0);
  const emptyNav = index.collections.filter(
    (c) => c.in_nav && c.product_count === 0 && (c.shopify_product_count ?? 0) === 0,
  );

  console.log("Done\n");
  console.log(`  Brand files       : ${index.brands.length} (${brandProducts} products)`);
  console.log(`  Collection files  : ${index.collections.length} (${collectionProducts} products)`);
  console.log(`  Index             : ${path.join(OUTPUT_DIR, "index.json")}`);
  if (emptyNav.length) {
    console.log(`\n  Nav categories with 0 products on Shopify (${emptyNav.length}):`);
    emptyNav.forEach((c) => console.log(`    - ${c.handle}`));
  }
  console.log("\nNext: php artisan catalog:import-products --publish");
  console.log("      php artisan catalog:import-products --refresh --publish  # update existing\n");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
