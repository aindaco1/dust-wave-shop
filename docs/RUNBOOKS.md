# RUNBOOKS

## Local Development
1. `bundle install`
2. `bundle exec jekyll serve --livereload --open-url`
3. For end-to-end cart confirmation: run `ngrok http 4000` and use that URL in `data-item-url`.

## Deployment
Push to `main` → GitHub Actions automatically:
1. Builds Jekyll site
2. Deploys to GitHub Pages
3. Purges Cloudflare cache (if `CLOUDFLARE_ENABLED=true`)

### Manual Build
```bash
JEKYLL_ENV=production bundle exec jekyll build
```
Output: `_site/`

## Pages CMS Setup
1. Go to [app.pagescms.org](https://app.pagescms.org)
2. Sign in with GitHub
3. Select `aindaco1/dust-wave-shop` repo
4. Select `main` branch
5. You'll see 🛒 Products and 📦 Out of Stock collections

## Adding a Product (via Pages CMS)
1. Go to 🛒 Products → New
2. Fill in: Identifier, Product Name, Price, Image, Product Type
3. For shirts: Select available sizes
4. For digital: Add ticket variants
5. Write description (HTML)
6. Set Display Order (use 10s: 10, 20, 30...)
7. Save

## Archiving a Product
1. Open product in Pages CMS
2. Change Product Type to **"⚠️ ARCHIVE"**
3. Save
4. Wait ~30 seconds for GitHub Action to move file to Out of Stock

## Restoring a Product
1. Go to 📦 Out of Stock collection
2. Open the archived product
3. Change Product Type to **"⚠️ UNARCHIVE"**
4. Save
5. Wait ~30 seconds for GitHub Action to move file back to Products

## Enabling Cloudflare Cache Purge
1. Go to repo Settings → Secrets and variables → Actions
2. Add variable: `CLOUDFLARE_ENABLED` = `true`
3. Add secrets (if not already set):
   - `CLOUDFLARE_ZONE`
   - `CLOUDFLARE_EMAIL`
   - `CLOUDFLARE_KEY`

## Common Fixes

### Domain crawling failed
- Ensure `data-item-url` is public; avoid `localhost`

### Price NaN / $0
- Check variant guards
- Ensure base price is numeric
- Keep `data-item-custom1-*` set on change/click

### Liquid "undefined method map for ''"
- Use guard: `variants and variants != '' and variants.size > 0`

### EventMachine error
- Rebuild eventmachine with OpenSSL flags OR use pure-Ruby reactor

### Pages CMS "Z.options.values.map is not a function"
- Select fields must use `options.values: [...]` format, not `options: [...]`

### Archive/unarchive not working
- Check GitHub Actions tab for errors
- Ensure file has `type: archive` or `type: unarchive` in front matter
- Action only runs on push to `main` branch
