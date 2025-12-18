# DECISIONS (ADR)

- 2025-09-xx: Keep Snipcart v3; validate via public URL; local checkout confirmation not required.
- 2025-09-xx: Variant base = min price; deltas via `[+X]`; JS mirrors selection to `data-item-custom1-*`.
- 2025-09-xx: SCSS refactor → variables/mixins/components; **no visual changes** allowed.
- 2025-12-13: Upgrade Snipcart v3.2.2 → v3.7.4; use `window.SnipcartSettings` lazy-load pattern via `_includes/snipcart.html`.
- 2025-12-13: Checkout autofill fixes: JS proxy input for Province/State (password managers require visible fields). CC expiration/CVV unfixable (Stripe iframe PCI compliance).
- 2025-12-13: Auto-select "United States" as default country on checkout via JS (`snipcart.html`). Triggers typeahead input and clicks US option on `theme.routechanged` to `/checkout` or `/billing`. This ensures Province/State renders as dropdown (required for US states).
- 2025-12-13: Product descriptions use `strip_html` filter to avoid escaped HTML in Snipcart cart view.
- 2025-12-15: Integrate Pages CMS for non-programmer content editing. Config in `.pages.yml`.
- 2025-12-15: Rename `mug` product type to `physical` for clarity (covers all non-variant shippable items).
- 2025-12-15: Add `archive` and `unarchive` product types with GitHub Action automation to move files between `_products/` and `out-of-stock/`.
- 2025-12-15: Archive workflow preserves original product type using `git show HEAD~1` to read previous value.
- 2025-12-15: Product display order uses increments of 10 (10, 20, 30...) to allow insertion without renumbering.
- 2025-12-15: Shirt sizes configurable via `sizes` field (multi-select in Pages CMS, stored as YAML array).
- 2025-12-15: Deploy via GitHub Actions (`deploy.yml`) instead of manual upload. Uses `actions/deploy-pages` with concurrency control.
- 2025-12-15: Cloudflare cache purge added to deploy workflow (enabled via `CLOUDFLARE_ENABLED` repository variable).
- 2025-12-15: Pages CMS select fields must use `options.values` format, not bare `options: [...]` arrays.
- 2025-12-18: Adopt `main` → `production` branch sync pattern (from fronteras-website) to prevent conflicts between git users and Pages CMS.
- 2025-12-18: Deploy workflow syncs main to production before build; archive workflow pulls latest before committing. Both prevent race conditions.
