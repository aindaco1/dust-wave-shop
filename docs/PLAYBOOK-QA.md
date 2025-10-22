# QA PLAYBOOK
- Product w/ no variants (e.g., Mug): Buy button exists; price equals front matter; label “Buy ($N)”.
- Event/digital item: `data-item-shippable=false`; base price correct.
- Variant item: each option updates label; `Snipcart` mini-cart shows chosen Type.
- View source: each `data-item-url` absolute and matches deployed host.
- Add-to-cart from multiple products → totals correct; no $0/$NaN anywhere.