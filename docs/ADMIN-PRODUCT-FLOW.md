# Admin product flow

How products, variants, templates, and images fit together in the Homère admin catalog.

---

## One-sentence summary

A **product** is the listing (name, photos, brand, specs). A **variant** is the buyable version with its **own price, stock, and options** (size, colour, etc.).

You need **at least one variant** before a customer can buy anything — even if there is only one version (e.g. “Default”).

---

## Real-world analogy

| Homère | Real life |
|--------|-----------|
| **Category** | “Sofas” aisle |
| **Brand** | Baxter |
| **Product template** | Form type (book vs wallpaper vs textile) |
| **Product** | “Miami Soft Sofa” on the website |
| **Variant** | “Large / Charcoal” — price ₦2.5M, in store |
| **Product images** | Gallery photos (shared by all variants) |

Same sofa (**product**), but you might sell:

- Large / Charcoal — in store, ₦2.5M
- Large / Ivory — remote stock, price on request
- Medium / Charcoal — sold out

Each row is **one variant**.

---

## Why two steps? (Product, then variant)

### When you create a product

You set **shared** information:

- Name, description
- Category and brand
- Images (gallery)
- Specs (dimensions, materials, ISBN, etc. — driven by the **template**)
- Published or draft

### When you add a variant

You set **per-SKU** information:

- Price (or “price on request”)
- Stock status: **in store**, **remote**, or **sold out**
- Lead times (air / sea) if remote
- Option values (size, colour, …) — the variant name can be built automatically from the template

**Price and stock live on the variant, not the product.** That is why step 2 exists.

---

## How everything connects

```
Category (e.g. "Wallpaper")
    └── has a Product Template (e.g. "Wallpaper")
            ├── spec_fields     → product form (width, repeat, etc.)
            └── variant_options → variant form (e.g. Colour)

Brand (e.g. Arte)
    └── linked on the product

Product ("Floral Roll")
    ├── images[]        → product_images table
    ├── specs{}         → shared specs JSON on the product
    └── variants[]
            ├── "Ivory"     → price, stock, SKU
            └── "Sage"      → price, stock, SKU
```

The **template comes from the category** — when you pick a category, the product and variant forms change to match.

---

## Admin workflow

1. **Categories and brands** — set up first (categories get a product template).
2. **Create product** — fill in details, upload images, save.
3. **Product show page** — shows “No variants yet” until you add at least one.
4. **Add variant** — required for selling; for simple items use name “Default” or let the template build the name from options.
5. **Publish** — product not in draft + at least one active variant = ready for the storefront (when wired up).

**Bulk import:** `php artisan catalog:import-products` creates products, variants, and images from scraped JSON in `public/output/collections/`.

---

## Stock statuses (per variant)

| Status | Meaning |
|--------|---------|
| **In store** | Available locally; delivery fees calculated at checkout |
| **In stock (remote)** | Overseas; customer chooses air or sea; you set lead times |
| **Out of stock** | Storefront shows sold out / enquire |

Remote variants require **both** air and sea lead times.

---

## Checklist after adding a product

- [ ] At least **one variant** added
- [ ] Variant has **stock status** and **price** (or price on request)
- [ ] If remote → **air and sea lead times** filled in
- [ ] Product is **published** (not draft) when ready to go live

Until a variant exists, the catalog entry is incomplete for selling.

---

## TL;DR

```
You organize:     Categories + Brands
You define forms: Product Templates (via category)
You list:         Product (story + photos + specs)
You sell:         Variants (price + stock + options)
```

**Product = the page. Variant = what goes in the cart.**

---

## Key code locations

| Area | Path |
|------|------|
| Models | `app/Models/Product.php`, `ProductVariant.php`, `ProductImage.php` |
| Admin product CRUD | `app/Http/Controllers/Admin/ProductController.php` |
| Admin variant CRUD | `app/Http/Controllers/Admin/ProductVariantController.php` |
| Templates (seeded) | `database/seeders/ProductTemplateSeeder.php` |
| Admin UI | `resources/js/pages/admin/products/` |
| **Product templates admin** | `resources/js/pages/admin/product-templates/` |
| Import command | `app/Console/Commands/ImportCatalogProducts.php` |
