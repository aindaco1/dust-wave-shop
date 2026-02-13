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

  function isTicket(btn) {
    return btn.getAttribute('data-product-type') === 'ticket';
  }

  function updateButtonLabel(addToCartBtn, unitPrice, qty) {
    if (isTicket(addToCartBtn)) {
      addToCartBtn.innerHTML = 'RSVP (Free)';
      return;
    }
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
      var maxAttr = parseInt(target.max, 10);
      if (Number.isFinite(maxAttr) && qty > maxAttr) {
        qty = maxAttr;
        target.value = qty;
      }

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
  // Snipcart checkout autocomplete fix for mobile browsers
  // Injects proper autocomplete attributes into address/payment fields
  // (Kept as fallback; primary fix is via snipcart-templates.html override)
  // -------------------------------
  
  // US state abbreviation to full name mapping
  var stateAbbreviations = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia', 'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam'
  };

  function fixCheckoutAutocomplete() {
    const snipcartEl = document.querySelector('#snipcart');
    if (!snipcartEl) return;
    
    const fieldMappings = [
      { selector: 'input[id^="name_"], [name="name"]', autocomplete: 'name' },
      { selector: 'input[id^="email_"], [name="email"]', autocomplete: 'email' },
      { selector: 'input[id^="address1_"], [name="address1"]', autocomplete: 'address-line1' },
      { selector: 'input[id^="address2_"], [name="address2"]', autocomplete: 'address-line2' },
      { selector: 'input[id^="city_"], [name="city"]', autocomplete: 'address-level2' },
      { selector: 'input[id^="postalCode_"], [name="postalCode"]', autocomplete: 'postal-code' },
      { selector: 'input[id^="phone_"], [name="phone"]', autocomplete: 'tel' },
      { selector: '[name="cardNumber"], input[id^="cardNumber_"]', autocomplete: 'cc-number' },
      { selector: '[name="expiration"], input[id^="expir"]', autocomplete: 'cc-exp' },
      { selector: '[name="cvv"], [name="cvc"]', autocomplete: 'cc-csc' }
    ];

    fieldMappings.forEach(function(mapping) {
      snipcartEl.querySelectorAll(mapping.selector).forEach(function(input) {
        const current = input.getAttribute('autocomplete');
        if (!current || current === 'off' || current === 'none' || current === 'nope') {
          input.setAttribute('autocomplete', mapping.autocomplete);
        }
      });
    });
    
    // Enhance province/state typeahead search inputs to accept abbreviations
    snipcartEl.querySelectorAll('.snipcart-typeahead input').forEach(function(input) {
      if (input.dataset.stateEnhanced) return;
      input.dataset.stateEnhanced = 'true';
      
      input.addEventListener('input', function(e) {
        var val = e.target.value.toUpperCase().trim();
        // If user types a 2-letter state abbreviation, expand it
        if (val.length === 2 && stateAbbreviations[val]) {
          // Small delay to let Snipcart's typeahead process first
          setTimeout(function() {
            // Find dropdown options and click the matching one
            var options = snipcartEl.querySelectorAll('.snipcart-typeahead__dropdown-content li, .snipcart-dropdown__list-item');
            options.forEach(function(opt) {
              if (opt.textContent.trim() === stateAbbreviations[val]) {
                opt.click();
              }
            });
          }, 150);
        }
      });
    });
    
    // Add hidden autofill proxy inputs for password managers
    injectAutofillProxyForState(snipcartEl);
  }
  
  // Inject a hidden native input that password managers can autofill
  // Then transfer the value to Snipcart's typeahead dropdown
  function injectAutofillProxyForState(snipcartEl) {
    // Find form fields that contain province/state
    var formFields = snipcartEl.querySelectorAll('.snipcart-form__field');
    
    formFields.forEach(function(el) {
      // Check if this element contains a province field
      var hasProvinceName = el.innerHTML.indexOf('province') > -1 || el.innerHTML.indexOf('Province') > -1;
      if (!hasProvinceName) return;
      
      var field = el.closest('.snipcart-form__field') || el;
      if (field.querySelector('.autofill-proxy-state')) return;
      
      // Create subtle but visible input for password manager autofill
      // Proton Pass requires actually visible inputs
      var proxy = document.createElement('input');
      proxy.type = 'text';
      proxy.name = 'state';
      proxy.id = 'autofill-state-proxy';
      proxy.className = 'autofill-proxy-state';
      proxy.autocomplete = 'address-level1';
      proxy.placeholder = 'State (for autofill)';
      proxy.tabIndex = -1;
      // Password managers require visible inputs at detection time
      // Start visible, then hide after password manager detects it
      proxy.style.cssText = 'display:block;width:100%;height:20px;padding:4px 8px;margin:0 0 -20px 0;border:1px solid #e0e0e0;background:#fafafa;color:#888;font-size:11px;box-sizing:border-box;border-radius:3px;';
      
      field.insertBefore(proxy, field.firstChild);
      
      // Hide after password manager has time to detect the field
      setTimeout(function() {
        proxy.style.cssText = 'display:block;width:1%;height:1px;padding:9px;margin:0 0 -20px 0;border:1px solid transparent;background:transparent;color:transparent;font-size:1px;box-sizing:border-box;border-radius:3px;';
      }, 500);
      
      // Monitor for autofill (password managers trigger 'input' or 'change' events)
      function handleProxyFill() {
        var val = proxy.value.trim().toUpperCase();
        if (!val) return;
        
        // Match abbreviation or full name
        var stateName = stateAbbreviations[val] || null;
        if (!stateName) {
          // Check if it's already a full state name
          for (var abbr in stateAbbreviations) {
            if (stateAbbreviations[abbr].toUpperCase() === val) {
              stateName = stateAbbreviations[abbr];
              break;
            }
          }
        }
        
        if (stateName) {
          // Find the typeahead input and set value to trigger search
          var typeaheadInput = field.querySelector('.snipcart-typeahead input');
          if (typeaheadInput) {
            typeaheadInput.value = stateName;
            typeaheadInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Wait for dropdown to populate, then click matching option
            setTimeout(function() {
              var options = snipcartEl.querySelectorAll('.snipcart-typeahead__dropdown-content li, .snipcart-dropdown__list-item, .snipcart-dropdown__content li');
              options.forEach(function(opt) {
                if (opt.textContent.trim() === stateName) {
                  opt.click();
                }
              });
            }, 200);
          }
        }
        
        // Clear proxy after processing
        proxy.value = '';
      }
      
      proxy.addEventListener('input', handleProxyFill);
      proxy.addEventListener('change', handleProxyFill);
      
      // Also check periodically for autofill (some managers don't trigger events)
      var checkInterval = setInterval(function() {
        if (!document.body.contains(proxy)) {
          clearInterval(checkInterval);
          return;
        }
        if (proxy.value) {
          handleProxyFill();
        }
      }, 500);
    });
  }

  function setupCheckoutAutocompleteObserver() {
    if (!window.Snipcart) return;

    Snipcart.events.on('theme.routechanged', function(routes) {
      if (routes.to && (
        routes.to.includes('checkout') ||
        routes.to.includes('billing') ||
        routes.to.includes('shipping') ||
        routes.to.includes('payment')
      )) {
        setTimeout(fixCheckoutAutocomplete, 100);
        setTimeout(fixCheckoutAutocomplete, 500);
      }
    });

    const checkoutObserver = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const hasFormField = Array.from(mutation.addedNodes).some(function(node) {
            return node.querySelector && node.querySelector('.snipcart-form__field');
          });
          if (hasFormField) {
            setTimeout(fixCheckoutAutocomplete, 50);
          }
        }
      }
    });

    checkoutObserver.observe(document.body, { childList: true, subtree: true });
  }

  function initSnipcartAutocomplete() {
    if (window.Snipcart && window.Snipcart.events) {
      setupCheckoutAutocompleteObserver();
    } else {
      setTimeout(initSnipcartAutocomplete, 100);
    }
  }
  initSnipcartAutocomplete();

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