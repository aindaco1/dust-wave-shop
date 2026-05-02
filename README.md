**For AI tooling (Amp, Cursor, Code Assist, etc.)**:

Start with [`docs/AGENTS.md`](docs/AGENTS.md).  
Architecture, runbooks & QA: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/RUNBOOKS.md`](docs/RUNBOOKS.md), [`docs/PLAYBOOK-QA.md`](docs/PLAYBOOK-QA.md).

# The DUST WAVE Snipcart Shop

A Jekyll-based e-commerce site using Snipcart for cart/checkout and Pages CMS for content management.

## For Non-Programmers

**Edit products via Pages CMS:** [app.pagescms.org](https://app.pagescms.org)

- Sign in with GitHub, select this repo
- **🛒 Products** — Add, edit, or archive products
- **📦 Out of Stock** — View/restore archived products
- To archive: Change Product Type to "archive" and save
- To restore: Change Product Type to "unarchive" and save

See the [Content Editor Guide](docs/CONTENT-EDITOR-GUIDE.md) for detailed instructions.

## For Developers

### Local Development

```bash
bundle install
bundle exec jekyll serve --livereload --open-url
```

### Production Build

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

### Product Rich Previews

Live products also generate shareable preview pages at `/products/<product-file-name>/`.

Example:

```text
https://shop.dustwave.xyz/products/jho-t-shirt/
```

These pages use the product front matter and body from `_products/` to render product-specific Open Graph and Twitter Card tags, then redirect browsers back to the single-page shop anchor, such as `/#t-shirt-7`.

Use the `/products/.../` URL when sharing a product and expecting a rich preview. Hash-only URLs like `https://shop.dustwave.xyz/#t-shirt-7` still scroll to the product, but preview crawlers do not send fragments to the server, so they cannot receive product-specific metadata.

### Deployment

Deploys automatically via GitHub Actions on push to `main`:
1. Syncs `main` → `production` branch
2. Builds Jekyll from `production`
3. Deploys to GitHub Pages
4. Purges Cloudflare cache (if enabled)

### Branching

| Branch | Purpose |
|--------|---------|
| `main` | Working branch — both git users and Pages CMS commit here |
| `production` | Auto-synced from main, used for builds (never edit directly) |

This prevents conflicts when multiple people edit simultaneously.

### Product Types

| Type | Description |
|------|-------------|
| `shirt` | T-shirts with size selector (XS-3XL) |
| `physical` | Shippable items (mugs, posters, etc.) |
| `digital` | Event tickets with price variants |
| `sold-out` | Visible but buy button hidden |
| `archive` | Triggers move to out-of-stock folder |
| `unarchive` | Triggers restore from out-of-stock folder |

### Key Files

- `_products/` — Product markdown files
- `_layouts/product-preview.html` — Generated product preview pages with anchor redirect
- `_includes/head.html` — Site/product meta tags for rich previews
- `out-of-stock/` — Archived products
- `_includes/product-definition.html` — Product UI template
- `.pages.yml` — Pages CMS configuration
- `.github/workflows/deploy.yml` — Build & deploy workflow
- `.github/workflows/archive-products.yml` — Archive automation
