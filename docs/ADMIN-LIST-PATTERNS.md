# Admin list patterns — tables vs cards

When to use each layout in the Homère admin portal.

---

## Use a **table** when

- The list will **grow large** (products, orders, invoices, variants).
- Admins need to **compare rows** across columns (status, counts, dates, prices).
- The primary task is **scan, sort, and act** — not browse visually.
- Rows are **data-heavy** with many attributes per item.

**Examples in this project**

| Module | Layout | Why |
|--------|--------|-----|
| Products index | Table | Many SKUs; compare category, brand, draft/published, variant count |
| Product templates index | Table | Compare spec fields, variant options, category usage |
| Product variants (show) | Table | Compare stock, price, lead times per variant |
| Orders (planned) | Table | Status, customer, total, date |
| Invoices (planned) | Table | Reference, amount, paid/unpaid |

---

## Use **cards** when

- The list is **small or browsable** (tens, not hundreds).
- **Visual identity** matters (thumbnail, logo, hero image).
- Each item is a **destination** — click through to a detail hub.
- There are **few comparable columns** — mostly name + one or two stats.

**Examples in this project**

| Module | Layout | Why |
|--------|--------|-----|
| Categories index | Cards | Nav tree nodes; subcategory counts; visual hierarchy |
| Brands index | Cards | Curated directory; brand identity |
| Category / brand show → products | Cards | Subset of catalog under a parent; exploratory |
| Dashboard modules | Cards | Navigation tiles, not operational data |

---

## Rule of thumb

> **Table** = “Which row needs my attention?”  
> **Cards** = “Which item do I want to open?”

When in doubt for **catalog inventory** (products, orders, line items) → **table**.  
When in doubt for **structure or discovery** (categories, brands, dashboard) → **cards**.

---

## Shared conventions

Both layouts use:

- `AdminEmptyState` when empty
- `AdminPagination` at 15 items per page
- Primary action in the page header (e.g. “Add product”)
- Same border / typography as variant tables on product show
