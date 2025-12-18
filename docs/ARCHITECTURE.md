# ARCHITECTURE

## Overview
- Static site via **Jekyll 4**; content in Markdown w/ YAML front matter.
- **Snipcart** provides cart/checkout; crawler validates product pages server-side.
- **Pages CMS** for non-programmer content editing via GitHub.
- **GitHub Actions** for automated deployment and product archiving.

## Components

### Product System
- **Includes**: `product-definition.html` builds the buy UI per product `type` (shirt/physical/digital/sold-out).
- **Types**:
  - `shirt` — Size selector, configurable via `sizes` field
  - `physical` — Simple buy button, shippable
  - `digital` — Price variants for tickets/downloads, non-shippable
  - `sold-out` — Visible, no buy button
  - `archive` / `unarchive` — Trigger file moves via GitHub Action

### Frontend
- **JS** (`assets/main.js`): syncs selected variant → button dataset; updates "Buy ($X)" labels; mirrors selection into mini-cart view.
- **SCSS**: variables → mixins → components; snipcart overrides isolated; all under `assets/`.

### Content Management
- **Pages CMS** (`.pages.yml`): Web UI for editing products
- **Collections**: `_products/` (live) and `out-of-stock/` (archived)
- **Media**: `assets/images/` for product images

### Deployment
- **GitHub Actions** (`deploy.yml`):
  1. Syncs `main` → `production` branch (single source of truth)
  2. Builds Jekyll with `JEKYLL_ENV=production` from `production` branch
  3. Deploys to GitHub Pages via `actions/deploy-pages`
  4. Purges Cloudflare cache (if enabled)
- **Archive Action** (`archive-products.yml`):
  - Watches for `type: archive` or `type: unarchive`
  - Pulls latest, moves files, restores original type from git history
  - Triggers deploy workflow on completion
- **Concurrency**: Deploy uses `cancel-in-progress: true` to handle rapid changes; archive queues separately

### Branching Strategy
- **`main`**: Working branch for both git users and Pages CMS
- **`production`**: Auto-synced from `main`, used for builds (never edit directly)

This prevents conflicts when multiple people edit simultaneously.

## Data Flow

```
Git Users ─────┐
               ├──→ main ──→ GitHub Actions
Pages CMS ─────┘                   │
                                   ├──→ archive-products.yml (if type=archive/unarchive)
                                   │         │
                                   │         ↓
                                   │    Commit to main
                                   │         │
                                   ↓         ↓
                              Sync main → production
                                   │
                                   ↓
                             Jekyll build
                                   │
                                   ↓
                            GitHub Pages → Cloudflare
```

## File Structure

```
_products/           # Live products (markdown)
out-of-stock/        # Archived products
_includes/
  product-definition.html  # Product UI template
  snipcart.html           # Snipcart initialization
assets/
  images/            # Product images
  main.js            # Frontend JS
  main.scss          # Styles entry point
  partials/          # SCSS partials
.pages.yml           # Pages CMS config
.github/workflows/
  deploy.yml         # Build & deploy
  archive-products.yml  # Archive automation
```
