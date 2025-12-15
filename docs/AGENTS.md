# AGENTS.md

**Build/Serve**
- Install: `bundle install`
- Local dev (with reload): `bundle exec jekyll serve --livereload --open-url`
- Prod build: `JEKYLL_ENV=production bundle exec jekyll build`
- Deploy: Push to `main` → GitHub Actions builds and deploys to GitHub Pages

**Structure**
- Jekyll site → pages from Markdown in root; products are markdown files with front matter.
- Snipcart v3.7.4 via `_includes/snipcart.html` (uses `window.SnipcartSettings` pattern with lazy loading).
- Products defined by `data-item-*` (see `product-definition.html` include).
- Styling: `assets/partials/` → `_variables.scss`, `_mixins.scss`, `_components.scss`, `_snipcart-overrides.scss`.
- JS: `assets/main.js` (variants/qty/labels sync + checkout autofill fixes).
- Checkout: auto-selects "United States" on load; Province/State becomes dropdown. See `snipcart.html`.

**Product Types**
- `shirt` — T-shirts with size selector (configurable via `sizes` field, defaults to XS-3XL)
- `physical` — Shippable items without variants (mugs, posters, VHS, etc.)
- `digital` — Event tickets/downloads with price variants
- `sold-out` — Visible on shop, buy button hidden
- `archive` — Triggers GitHub Action to move to `out-of-stock/`
- `unarchive` — Triggers GitHub Action to restore to `_products/`

**Pages CMS Integration**
- Config: `.pages.yml` at repo root
- Collections: Products (`_products/`) and Out of Stock (`out-of-stock/`)
- Media uploads: `assets/images/`
- Select fields use `options.values` format (not bare arrays)
- Archive/unarchive triggers GitHub Action that moves files and restores original type

**GitHub Actions**
- `deploy.yml` — Builds Jekyll, deploys to GitHub Pages, purges Cloudflare cache
- `archive-products.yml` — Moves products between folders based on type field
- Both use `concurrency.group: "pages"` to prevent conflicts

**Conventions**
- Guard Liquid collections: `variants and variants != '' and variants.size > 0`.
- Always use absolute `data-item-url` in prod (publicly crawlable).
- Variant pricing: base = lowest; others use `[+delta]`. Keep `custom1` name/value synced on change and click.
- Product order uses increments of 10 (10, 20, 30...) for easy insertion.

**Gotchas**
- Snipcart cart confirmation fails on `localhost` (use ngrok for end-to-end).
- EventMachine C-ext error: build with OpenSSL flags or use pure-Ruby reactor.
- Province/State autofill requires visible proxy input (password managers need visible fields); see `injectAutofillProxyForState()` in main.js.
- CC expiration/CVV autofill cannot be fixed—Stripe iframes are PCI-locked.
- Pages CMS select fields: use `options.values` array, not `options: [...]`.

**Cursor/Claude/Windsurf/Copilot rules**
- None present as files; if added, mirror them here.
