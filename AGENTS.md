## Build & Serve
- **Install dependencies**: `bundle install`
- **Dev server**: `bundle exec jekyll serve --livereload`
- **Production build**: `JEKYLL_ENV=production bundle exec jekyll build`
- **Clean build artifacts**: `bundle exec jekyll clean`

## Lint & Test
- No formal linting/tests included by default.
- Suggested JS linting: `npx eslint assets/**/*.js`
  - Single file: `npx eslint assets/main.js`
- If adding tests (e.g. Vitest/Jest): run a single test with  
  `npm test -- path/to/file.test.ts`

## Architecture
- **Framework**: Jekyll (Liquid templating, Markdown content).
- **Products**: Markdown files with YAML front-matter (`identifier`, `name`, `price`/`variants`, `image`, `type`, etc.).
- **Templates**: `_includes/product-definition.html` renders Snipcart buttons.
- **Entry page**: `index.markdown` loops over `_products/`.
- **Frontend JS**: `assets/main.js` handles variant/qty → button updates.
- **Commerce**: Snipcart v3 (`snipcart.js` + `<div id="snipcart">`).
- **Validation**: Snipcart crawls `data-item-url` on production domain.

## Conventions
- **IDs**: `data-item-id="{{ product.identifier }}"` must be stable.
- **URLs**: `data-item-url="{{ '/?pid=' | append: product.identifier | absolute_url }}"`.
- **Variants**: first variant = base; others use Snipcart `[+delta]` modifiers.
- **Digital items**: always set `data-item-shippable="false"`.
- **Liquid style**: use explicit emptiness checks:  
  `variants and variants != '' and variants.size > 0`.
- **JS style**: vanilla DOM, scoped queries, update `data-item-*` before clicks.
- **Formatting**: 2-space indent, UTF-8, trailing newline, attributes on new lines.
- **Error handling**: defensive checks (null/empty) in both Liquid and JS.

## Tooling Rules
If present, follow repo-specific guidance in:
- `.cursor/rules/`
- `CLAUDE.md`
- `.windsurfrules`
- `.clinerules`
- `.goosehints`
- `.github/copilot-instructions.md`

These override the general guidelines above.