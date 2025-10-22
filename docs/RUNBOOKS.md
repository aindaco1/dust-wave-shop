# RUNBOOKS

## Local dev
1. `bundle install`
2. `bundle exec jekyll serve --livereload --open-url`
3. For end-to-end cart confirmation: run `ngrok http 4000` and use that URL in `data-item-url`.

## Release
- `JEKYLL_ENV=production bundle exec jekyll build` → upload `_site/` to host/CDN.

## Common fixes
- **Domain crawling failed**: ensure `data-item-url` is public; avoid `localhost`.
- **Price NaN / $0**: check variant guards; ensure base price numeric; keep `data-item-custom1-*` set on change/click.
- **Liquid “undefined method map for ''”**: `variants and variants != '' and variants.size > 0`.
- **EventMachine error**: rebuild eventmachine with OpenSSL flags OR use pure-Ruby reactor.