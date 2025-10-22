# ARCHITECTURE
- Static site via **Jekyll 4**; content in Markdown w/ YAML front matter.
- **Snipcart** provides cart/checkout; crawler validates product pages server-side.
- **Includes**: `product-definition.html` builds the buy UI per product `type` (shirt/digital/sold-out/other).
- **JS** (`assets/main.js`): syncs selected variant → button dataset; updates “Buy ($X)” labels; mirrors selection into mini-cart view.
- **SCSS**: variables → mixins → components; snipcart overrides isolated; all under `assets/`.
- **Deploy**: any static host/CDN; ensure public hostname matches `data-item-url`.