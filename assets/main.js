window.addEventListener('DOMContentLoaded', function () {
  // -------------------------------
  // Helpers
  // -------------------------------
  function formatMoney(n) {
    let s = Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    if (s.endsWith('.00')) s = s.slice(0, -3);
    if (s.endsWith('.0'))  s = s.slice(0, -2);
    return s;
  }

  function updateButtonLabel(addToCartBtn, unitPrice, qty) {
    const total = Number(unitPrice) * Number(qty || 1);
    addToCartBtn.innerHTML = 'Buy ($' + formatMoney(total) + ')';
  }

  function findAddButtonFromChild(el) {
    // Find nearest product block wrapper, then its button
    // Assumes your structure: [wrapper] -> ... -> .buy-button
    let node = el;
    while (node && node !== document) {
      const btn = node.querySelector && node.querySelector('.buy-button.snipcart-add-item');
      if (btn) return btn;
      node = node.parentNode;
    }
    return null;
  }

  function getQtyForChild(el) {
    const wrap = el.closest ? el.closest('div') : null;
    if (!wrap) return 1;
    const qtyInput = wrap.querySelector('.qty');
    const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
    return Number.isFinite(qty) && qty > 0 ? qty : 1;
  }

  function getVariantSelectForChild(el) {
    const wrap = el.closest ? el.closest('div') : null;
    return wrap ? wrap.querySelector('.variant-select') : null;
  }

  function getEffectiveUnitPrice(buttonEl, variantSelectEl) {
    const base = Number(buttonEl.getAttribute('data-item-price') || 0);
    if (!variantSelectEl) return base;
    const opt = variantSelectEl.options[variantSelectEl.selectedIndex];
    const mod = Number(opt && (opt.getAttribute('data-mod') || 0));
    return base + mod;
  }

  // -------------------------------
  // INITIAL SYNC (for any visible selects on load)
  // -------------------------------
  document.querySelectorAll('.variant-select').forEach(function (select) {
    const btn = findAddButtonFromChild(select);
    if (!btn) return;
    // Ensure custom field exists & reflects default selection
    const opt = select.options[select.selectedIndex];
    if (opt) {
      btn.setAttribute('data-item-custom1-name', 'Type');
      btn.setAttribute('data-item-custom1-value', opt.value); // clean variant name
    }
    const qty = getQtyForChild(select);
    const unitPrice = getEffectiveUnitPrice(btn, select);
    updateButtonLabel(btn, unitPrice, qty);
  });

  // -------------------------------
  // EVENT DELEGATION
  // -------------------------------

  // 1) Variant change -> update custom field + button price immediately
  document.addEventListener('change', function (evt) {
    const target = evt.target;

    // Variant changed?
    if (target.classList && target.classList.contains('variant-select')) {
      const btn = findAddButtonFromChild(target);
      if (!btn) return;

      const opt = target.options[target.selectedIndex];
      const qty = getQtyForChild(target);
      const unitPrice = getEffectiveUnitPrice(btn, target);

      // Make sure Snipcart receives the selected name (must match custom1 options)
      btn.setAttribute('data-item-custom1-name', 'Type');
      btn.setAttribute('data-item-custom1-value', opt ? opt.value : '');

      updateButtonLabel(btn, unitPrice, qty);
      return;
    }

    // Quantity changed?
    if (target.classList && target.classList.contains('qty')) {
      const btn = findAddButtonFromChild(target);
      if (!btn) return;

      let qty = parseInt(target.value, 10);
      if (!Number.isFinite(qty) || qty < 1) qty = 1;

      const select = getVariantSelectForChild(target);
      const unitPrice = getEffectiveUnitPrice(btn, select);

      btn.setAttribute('data-item-quantity', String(qty));
      updateButtonLabel(btn, unitPrice, qty);
      return;
    }
  });

  // 2) Ensure selected option name is present at click time for Snipcart validation
  document.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.snipcart-add-item');
    if (!btn) return;

    const select = getVariantSelectForChild(btn);
    if (select) {
      const opt = select.options[select.selectedIndex];
      btn.setAttribute('data-item-custom1-name', 'Type');
      btn.setAttribute('data-item-custom1-value', opt ? opt.value : '');
      // Keep label consistent at click time too
      const qty = getQtyForChild(btn);
      const unitPrice = getEffectiveUnitPrice(btn, select);
      updateButtonLabel(btn, unitPrice, qty);
    }
  });

  // -------------------------------
  // OPTIONAL: global +/- controls support (kept for parity)
  // -------------------------------
  const increment = document.querySelector('.increment');
  const decrement = document.querySelector('.decrement');

  if (increment) {
    increment.addEventListener('click', () => {
      const qtyInput = document.querySelector('.qty');
      if (!qtyInput) return;
      const newQty = (parseInt(qtyInput.value, 10) || 0) + 1;
      qtyInput.value = newQty;

      const btn = findAddButtonFromChild(qtyInput);
      if (!btn) return;

      const select = getVariantSelectForChild(qtyInput);
      const unitPrice = getEffectiveUnitPrice(btn, select);
      btn.setAttribute('data-item-quantity', String(newQty));
      updateButtonLabel(btn, unitPrice, newQty);
    });
  }

  if (decrement) {
    decrement.addEventListener('click', () => {
      const qtyInput = document.querySelector('.qty');
      if (!qtyInput) return;
      const newQty = Math.max((parseInt(qtyInput.value, 10) || 0) - 1, 1);
      qtyInput.value = newQty;

      const btn = findAddButtonFromChild(qtyInput);
      if (!btn) return;

      const select = getVariantSelectForChild(qtyInput);
      const unitPrice = getEffectiveUnitPrice(btn, select);
      btn.setAttribute('data-item-quantity', String(newQty));
      updateButtonLabel(btn, unitPrice, newQty);
    });
  }

  // -------------------------------
  // Mini-cart: show custom fields under each item (same behavior)
  // -------------------------------
  function injectCustomFieldsIntoMiniCart() {
    if (!window.Snipcart) return;

    document.querySelectorAll('.snipcart-item-line').forEach(function (itemLine) {
      if (itemLine.querySelector('.variant-info')) return;

      const itemNameEl = itemLine.querySelector('.snipcart__item__info__name');
      if (!itemNameEl) return;

      const state = window.Snipcart.store && window.Snipcart.store.getState ? window.Snipcart.store.getState() : null;
      const cartItems = state && state.cart ? state.cart.items : null;
      if (!cartItems || !cartItems.length) return;

      const itemName = itemNameEl.textContent.trim();
      const matched = cartItems.find(ci => ci && ci.name === itemName && ci.customFields && ci.customFields.length);

      if (matched && matched.customFields) {
        const desc = itemLine.querySelector('.snipcart__item__info__description');
        matched.customFields.forEach(function (field) {
          if (!field || !field.value) return;
          const el = document.createElement('p');
          el.className = 'variant-info';
          el.innerHTML = `<strong>${field.name}:</strong> ${field.value}`;
          if (desc) {
            desc.insertAdjacentElement('afterend', el);
          } else {
            itemLine.appendChild(el);
          }
        });
      }
    });
  }

  const targetNode = document.body;
  if (targetNode) {
    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes && mutation.addedNodes.length &&
            document.querySelector('.snipcart-cart-summary')) {
          injectCustomFieldsIntoMiniCart();
        }
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });

    setTimeout(injectCustomFieldsIntoMiniCart, 1000);
  }
});