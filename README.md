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

### Deployment

Deploys automatically via GitHub Actions on push to `main`:
1. Jekyll builds the site
2. Deploys to GitHub Pages
3. Purges Cloudflare cache (if enabled)

### Product Types

| Type | Description |
|------|-------------|
| `shirt` | T-shirts with size selector (XS-3XL) |
| `physical` | Shippable items (mugs, posters, etc.) |
| `digital` | Event tickets with price variants |
| `sold-out` | Visible but buy button hidden |
| `archive` | Triggers move to out-of-stock folder |

### Key Files

- `_products/` — Product markdown files
- `out-of-stock/` — Archived products
- `_includes/product-definition.html` — Product UI template
- `.pages.yml` — Pages CMS configuration
- `.github/workflows/deploy.yml` — Build & deploy workflow
- `.github/workflows/archive-products.yml` — Archive automation
