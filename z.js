/**
 * AROWONEN.COM — catalog scraper (Shopify storefront JSON)
 *
 * Discovers collections from /collections.json (no hardcoded handle lists),
 * splits brand vs category files, paginates products, and writes JSON for:
 *   public/output/collections/{handle}.json  → catalog:import-products
 *   public/output/brands/{handle}.json        → BrandSeeder / index
 *   public/output/index.json
 *
 * Usage (incremental — recommended):
 *   php artisan catalog:manifest --write
 *   php artisan catalog:sync home-fragrance
 *   php artisan catalog:sync assouline --brand
 *
 *   node z.js --handle=lanterns-chandeliers --collections-only
 *   node z.js --handle=assouline --brands-only
 *
 * Bulk (legacy, can miss products under rate limits):
 *   node z.js --full
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = "arowonen.com";
const OUTPUT_DIR = path.join(__dirname, "public", "output");
const DEBUG_DIR = path.join(OUTPUT_DIR, "scrape-debug");
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
  "arowonen",
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
  verbose: args.includes("--verbose"),
  handle: (args.find((a) => a.startsWith("--handle=")) || "").split("=")[1] || null,
};

/** Brand handle → vendor strings to match in /products.json or scraped JSON. */
const BRAND_VENDOR_NAMES = {
  "roberte-cavalli": ["ROBERTO CAVALLI", "ROBERTE CAVALLI"],
  disney: ["LEBLON DELIENNE", "DISNEY"],
  "missoni-home": ["MISSONI HOME", "MISSONI"],
  arowonen: ["AROWONEN"],
  "molteni-c": ["MOLTENI&C", "MOLTENI"],
  "baxter-made-in-italy": ["BAXTER", "BAXTER MADE IN ITALY"],
  "dr-vranjes-firenze": ["DR. VRANJES", "DR VRANJES FIRENZE"],
  "helle-mardahl-studio": ["HELLE MARDAHL", "HELLE MARDAHL STUDIO"],
  versacehome: ["VERSACE", "VERSACE HOME"],
};

const MANIFEST_PATH = path.join(OUTPUT_DIR, "catalog-manifest.json");
const INDEX_PATH = path.join(OUTPUT_DIR, "index.json");

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  }
  return {
    collections: [...NAV_COLLECTION_HANDLES],
    brands: [...BRAND_HANDLES],
  };
}

function loadExistingIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    return {
      scraped_at: new Date().toISOString(),
      source: `https://${BASE_URL}`,
      scrape_mode: "incremental",
      brands: [],
      collections: [],
    };
  }
  return JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
}

function mergeIndexEntry(index, listKey, entry) {
  const list = index[listKey] ?? [];
  const i = list.findIndex((e) => e.handle === entry.handle);
  if (i >= 0) {
    list[i] = { ...list[i], ...entry };
  } else {
    list.push(entry);
  }
  index[listKey] = list;
  index.scraped_at = new Date().toISOString();
}

// ─── HTTP ─────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function httpsGet(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: urlPath.startsWith("/") ? urlPath : `/${urlPath}`,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "en-NL,en;q=0.9",
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
        const statusCode = res.statusCode ?? 0;
        if (statusCode === 404) {
          return resolve({ statusCode, json: null, raw: data, urlPath });
        }
        if (statusCode >= 400) {
          return reject(new Error(`HTTP ${statusCode} for ${urlPath}`));
        }
        try {
          resolve({
            statusCode,
            json: data ? JSON.parse(data) : null,
            raw: data,
            urlPath,
          });
        } catch {
          reject(new Error(`Invalid JSON from ${urlPath} (${data.slice(0, 120)}…)`));
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
      const res = await httpsGet(urlPath);
      return res.json;
    } catch (err) {
      lastError = err;
      const wait = DELAY_MS * attempt * 2;
      console.log(`    ↻ retry ${attempt}/${MAX_RETRIES} (${err.message}), wait ${wait}ms`);
      await sleep(wait);
    }
  }
  throw lastError;
}

async function fetchJsonDetailed(urlPath) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await httpsGet(urlPath);
    } catch (err) {
      lastError = err;
      await sleep(DELAY_MS * attempt * 2);
    }
  }
  throw lastError;
}

function logVerbose(...parts) {
  if (flags.verbose) console.log("    [debug]", ...parts);
}

function writeScrapeDebug(handle, payload) {
  ensureDir(DEBUG_DIR);
  const file = path.join(DEBUG_DIR, `${handle}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ handle, logged_at: new Date().toISOString(), ...payload }, null, 2),
    "utf8",
  );
  return file;
}

function vendorNamesForBrand(handle, label) {
  const names = new Set();
  for (const name of BRAND_VENDOR_NAMES[handle] ?? []) {
    names.add(name.toUpperCase());
  }
  if (label) names.add(String(label).toUpperCase());
  names.add(handle.replace(/-/g, " ").toUpperCase());
  return [...names];
}

function vendorMatches(vendor, names) {
  const v = String(vendor ?? "").trim().toUpperCase();
  if (!v) return false;
  return names.some((n) => v === n || v.includes(n) || n.includes(v));
}

async function scrapeProductsByVendor(handle, label) {
  const names = vendorNamesForBrand(handle, label);
  const products = [];
  const seen = new Set();
  let page = 1;

  console.log(`    ↪ vendor fallback: scanning /products.json for ${names.join(" | ")}`);

  while (page <= 50) {
    const res = await fetchJsonDetailed(
      `/products.json?limit=${PRODUCTS_PER_PAGE}&page=${page}`,
    );
    const batch = res.json?.products ?? [];
    logVerbose(`products.json page ${page}: status ${res.statusCode}, batch ${batch.length}`);

    if (batch.length === 0) break;

    for (const raw of batch) {
      if (!vendorMatches(raw.vendor, names) || seen.has(raw.id)) continue;
      seen.add(raw.id);
      let formatted = formatProduct(raw);
      if (!formatted.description_html) {
        formatted = await enrichProductDescription(formatted);
      }
      products.push(formatted);
    }

    if (batch.length < PRODUCTS_PER_PAGE) break;
    page++;
    await sleep(DELAY_MS);
  }

  return products;
}

function harvestFromLocalCollections(handle, label) {
  const names = vendorNamesForBrand(handle, label);
  const products = [];
  const seen = new Set();
  const dir = path.join(OUTPUT_DIR, "collections");

  if (!fs.existsSync(dir)) return products;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch {
      continue;
    }
    for (const p of data.products ?? []) {
      if (!vendorMatches(p.vendor, names) || seen.has(p.id)) continue;
      seen.add(p.id);
      products.push(p);
    }
  }

  if (products.length > 0) {
    console.log(`    ↪ local fallback: ${products.length} products from output/collections/ by vendor`);
  }

  return products;
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
async function scrapeCollectionProducts(handle, debug) {
  const products = [];
  const seen = new Set();
  let page = 1;
  const pageLog = [];

  while (true) {
    const urlPath = `/collections/${handle}/products.json?limit=${PRODUCTS_PER_PAGE}&page=${page}`;
    const res = await fetchJsonDetailed(urlPath);
    const batch = res.json?.products ?? [];

    pageLog.push({
      page,
      url: `https://${BASE_URL}${urlPath}`,
      status: res.statusCode,
      raw_bytes: res.raw?.length ?? 0,
      products_in_response: batch.length,
    });

    logVerbose("collection page", page, "→", batch.length, "products", `(HTTP ${res.statusCode})`);

    if (batch.length === 0) {
      if (page === 1 && flags.verbose && res.raw) {
        logVerbose("response preview:", res.raw.slice(0, 200));
      }
      break;
    }

    for (const raw of batch) {
      if (seen.has(raw.id)) continue;
      seen.add(raw.id);
      let formatted = formatProduct(raw);
      if (!formatted.description_html) {
        formatted = await enrichProductDescription(formatted);
      }
      products.push(formatted);
    }

    process.stdout.write(`\r    page ${page}: ${products.length} products`);
    if (batch.length < PRODUCTS_PER_PAGE) break;
    page++;
    await sleep(DELAY_MS);
  }

  if (products.length > 0) process.stdout.write("\n");

  debug.collection_api = { pages: pageLog, total: products.length };
  return products;
}

async function scrapeCollectionEntry(meta, isBrand = false) {
  const handle = meta.handle;
  const label = meta.title || titleCaseLabel(handle);
  const shopifyCount = meta.products_count ?? 0;
  const debug = { shopify_reported_count: shopifyCount, is_brand: isBrand };

  console.log(`  ${label} (${handle}) — Shopify: ${shopifyCount}`);

  let products = await scrapeCollectionProducts(handle, debug);
  let scrapeMethod = "collection_api";

  if (products.length === 0 && isBrand) {
    const vendorProducts = await scrapeProductsByVendor(handle, label);
    if (vendorProducts.length > 0) {
      products = vendorProducts;
      scrapeMethod = "vendor_catalog_scan";
      debug.vendor_fallback = { count: vendorProducts.length };
    }
  }

  if (products.length === 0 && isBrand) {
    const local = harvestFromLocalCollections(handle, label);
    if (local.length > 0) {
      products = local;
      scrapeMethod = "local_collection_harvest";
      debug.local_fallback = { count: local.length };
    }
  }

  const scrapedCount = products.length;
  debug.scrape_method = scrapeMethod;
  debug.scraped_count = scrapedCount;

  if (shopifyCount > 0 && scrapedCount === 0) {
    console.log(
      `    ⚠️  Shopify metadata says ${shopifyCount} products, but the public JSON API returned 0.`,
    );
    console.log(
      `       This usually means products are not published to the Online Store channel on Arowonen.`,
    );
    console.log(`       Debug log: ${writeScrapeDebug(handle, debug)}`);
  } else if (shopifyCount > 0 && scrapedCount < shopifyCount * 0.9) {
    console.log(
      `    ⚠️  Scraped ${scrapedCount} vs Shopify ${shopifyCount} (pagination or visibility)`,
    );
    writeScrapeDebug(handle, debug);
  } else if (flags.verbose || scrapedCount === 0) {
    writeScrapeDebug(handle, debug);
  }

  return {
    handle,
    label,
    url: `https://${BASE_URL}/collections/${handle}`,
    scraped_at: new Date().toISOString(),
    shopify_product_count: shopifyCount,
    product_count: scrapedCount,
    scrape_method: scrapeMethod,
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
  if (!flags.handle && !flags.full) {
    console.log(`AROWONEN scraper — use one handle at a time (recommended):

  node z.js --handle=home-fragrance --collections-only
  node z.js --handle=assouline --brands-only

Or run: php artisan catalog:sync {handle}
List handles: php artisan catalog:manifest

Bulk legacy: node z.js --full
`);
    process.exit(0);
  }

  console.log("AROWONEN catalog scraper\n");
  console.log(`  output : ${OUTPUT_DIR}`);
  console.log(`  mode   : ${flags.handle ? `single (${flags.handle})` : flags.full ? "full" : "catalog"}`);
  if (flags.handle) console.log(`  filter : ${flags.handle}`);
  console.log("");

  const brandsDir = path.join(OUTPUT_DIR, "brands");
  const collectionsDir = path.join(OUTPUT_DIR, "collections");
  ensureDir(brandsDir);
  ensureDir(collectionsDir);

  const { list, byHandle } = await fetchAllCollections();
  console.log(`Discovered ${list.length} collections on ${BASE_URL}\n`);

  const index = flags.handle ? loadExistingIndex() : {
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
      const result = await scrapeCollectionEntry(meta, true);
      const filePath = path.join(brandsDir, `${meta.handle}.json`);
      saveJSON(filePath, result);
      const brandEntry = {
        label: result.label,
        handle: meta.handle,
        url: result.url,
        shopify_product_count: result.shopify_product_count,
        product_count: result.product_count,
        file: `brands/${meta.handle}.json`,
      };
      if (flags.handle) {
        mergeIndexEntry(index, "brands", brandEntry);
      } else {
        index.brands.push(brandEntry);
      }
      console.log(`    → brands/${meta.handle}.json\n`);
      await sleep(DELAY_MS);
    }
  }

  if (!flags.brandsOnly && collectionTargets.length) {
    console.log(`COLLECTIONS (${collectionTargets.length})\n${"─".repeat(50)}`);
    for (let i = 0; i < collectionTargets.length; i++) {
      const meta = collectionTargets[i];
      console.log(`[${i + 1}/${collectionTargets.length}]`);
      const result = await scrapeCollectionEntry(meta, false);
      const filePath = path.join(collectionsDir, `${meta.handle}.json`);
      saveJSON(filePath, result);
      const collectionEntry = {
        label: result.label,
        handle: meta.handle,
        url: result.url,
        shopify_product_count: result.shopify_product_count,
        product_count: result.product_count,
        in_nav: NAV_COLLECTION_HANDLES.has(meta.handle),
        file: `collections/${meta.handle}.json`,
      };
      if (flags.handle) {
        mergeIndexEntry(index, "collections", collectionEntry);
      } else {
        index.collections.push(collectionEntry);
      }
      console.log(`    → collections/${meta.handle}.json\n`);
      await sleep(DELAY_MS);
    }
  }

  if (!flags.handle) {
    index.collections.sort((a, b) => a.label.localeCompare(b.label));
    index.brands.sort((a, b) => a.label.localeCompare(b.label));
  }

  saveJSON(INDEX_PATH, index);

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
  if (flags.handle) {
    const kind = flags.brandsOnly ? "brand" : "collection";
    console.log(`\nNext: php artisan catalog:sync ${flags.handle}${flags.brandsOnly ? " --brand" : ""}`);
    console.log(`      (or: php artisan catalog:import-products --collection=${flags.handle} --publish --refresh${flags.brandsOnly ? " --brand" : ""})\n`);
  } else {
    console.log("\nPrefer incremental sync: php artisan catalog:manifest && php artisan catalog:sync {handle}\n");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
