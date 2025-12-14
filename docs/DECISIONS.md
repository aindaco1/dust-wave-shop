# DECISIONS (ADR)
- 2025-09-xx: Keep Snipcart v3; validate via public URL; local checkout confirmation not required.
- 2025-09-xx: Variant base = min price; deltas via `[+X]`; JS mirrors selection to `data-item-custom1-*`.
- 2025-09-xx: SCSS refactor → variables/mixins/components; **no visual changes** allowed.
- 2025-12-13: Upgrade Snipcart v3.2.2 → v3.7.4; use `window.SnipcartSettings` lazy-load pattern via `_includes/snipcart.html`.
- 2025-12-13: Checkout autofill fixes: JS proxy input for Province/State (password managers require visible fields). CC expiration/CVV unfixable (Stripe iframe PCI compliance).
- 2025-12-13: Auto-select "United States" as default country on checkout via JS (`snipcart.html`). Triggers typeahead input and clicks US option on `theme.routechanged` to `/checkout` or `/billing`. This ensures Province/State renders as dropdown (required for US states).
- 2025-12-13: Product descriptions use `strip_html` filter to avoid escaped HTML in Snipcart cart view.