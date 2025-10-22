# AGENTS.md
**Build/Serve**
- Install: `bundle install`
- Local dev (with reload): `bundle exec jekyll serve --livereload --open-url`
- Prod build: `JEKYLL_ENV=production bundle exec jekyll build`
- Single SCSS sanity check: edit `assets/main.scss` → site rebuilds; no unit tests.

**Structure**
- Jekyll site → pages from Markdown in root; products are markdown files with front matter.
- Snipcart v3 injected via script; products defined by `data-item-*` (see `product-definition.html` include).
- Styling: `assets/partials/` → `_variables.scss`, `_mixins.scss`, `_components.scss`, `_snipcart-overrides.scss`.
- JS: `assets/main.js` (variants/qty/labels sync).

**Conventions**
- Guard Liquid collections: `variants and variants != '' and variants.size > 0`.
- Always use absolute `data-item-url` in prod (publicly crawlable).
- Variant pricing: base = lowest; others use `[+delta]`. Keep `custom1` name/value synced on change and click.

**Gotchas**
- Snipcart cart confirmation fails on `localhost` (use ngrok for end-to-end).
- EventMachine C-ext error: build with OpenSSL flags or use pure-Ruby reactor.

**Cursor/Claude/Windsurf/Copilot rules**
- None present as files; if added, mirror them here.