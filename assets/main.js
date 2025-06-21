window.addEventListener('DOMContentLoaded', function(event) {
    // Helper to update button label for a product
    function updateButtonLabel(addToCartBtn, price, qty) {
        let displayPrice = parseFloat(price) * qty;
        displayPrice = Number(displayPrice).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
        if (displayPrice.endsWith('.00')) displayPrice = displayPrice.replace('.00', '');
        if (displayPrice.endsWith('.0')) displayPrice = displayPrice.replace('.0', '');
        addToCartBtn.innerHTML = 'Buy ($' + displayPrice + ')';
    }

    // Handle qty changes for buy buttons
    document.addEventListener('change', function(evt) {
        if (evt.target.classList[0] === 'qty') {
            var button = evt.target.parentNode.querySelector('.buy-button');
            var qty = parseInt(evt.target.value);

            // Find related variant-select, if any
            var parent = evt.target.parentNode;
            var variantSelect = parent.querySelector('.variant-select');
            var unitPrice;
            if (variantSelect) {
                unitPrice = variantSelect.options[variantSelect.selectedIndex].getAttribute('data-price');
            } else {
                unitPrice = button.getAttribute('data-item-price');
            }

            button.setAttribute('data-item-quantity', qty);
            updateButtonLabel(button, unitPrice, qty);
        }
    });

    // Variant select logic (NEW)
    document.querySelectorAll('.variant-select').forEach(function(select) {
        var identifier = select.id.replace('variant-', '');
        var addToCartBtn = document.getElementById('add-to-cart-' + identifier);

        select.addEventListener('change', function() {
            const selectedOption = select.options[select.selectedIndex];
            const newSku = selectedOption.value;
            const newPrice = selectedOption.getAttribute('data-price');

            if (addToCartBtn) {
                addToCartBtn.setAttribute('data-item-id', newSku);
                addToCartBtn.setAttribute('data-item-price', newPrice);
                // Set the variant name as the custom field value
                addToCartBtn.setAttribute('data-item-custom1-value', selectedOption.text.split(' - $')[0]);

                // Get current quantity
                var parent = select.parentNode;
                var qtyInput = parent.querySelector('.qty');
                var qty = qtyInput ? parseInt(qtyInput.value) : 1;

                updateButtonLabel(addToCartBtn, newPrice, qty);
            }
        });
    });

    // Remainings of your quantity control logic (if still used elsewhere)
    const addToCart = document.querySelector(".snipcart-add-item");
    const increment = document.querySelector(".increment");
    const decrement = document.querySelector(".decrement");

    var qtyInputs = document.getElementsByClassName('qty');

    for (var i = 0; i < qtyInputs.length; i++) {
        qtyInputs[i].addEventListener('change', function() {
            var button = this.parentNode.querySelector('.buy-button');
            var qty = parseInt(this.value);

            // Find related variant-select, if any
            var parent = this.parentNode;
            var variantSelect = parent.querySelector('.variant-select');
            var unitPrice;
            if (variantSelect) {
                unitPrice = variantSelect.options[variantSelect.selectedIndex].getAttribute('data-price');
            } else {
                unitPrice = button.getAttribute('data-item-price');
            }

            button.setAttribute('data-item-quantity', qty);
            // Use new helper for consistent price label
            if (typeof updateButtonLabel === 'function') {
                updateButtonLabel(button, unitPrice, qty);
            }
        });
    }

    if (increment) {
        increment.addEventListener("click", () => {
            const newQuantity = (parseInt(quantity.value) || 0) + 1;
            quantity.value = newQuantity;
            addToCart.setAttribute("data-item-quantity", newQuantity);

            // Update label (if using global increment buttons)
            if (typeof updateButtonLabel === 'function') {
                let unitPrice = addToCart.getAttribute('data-item-price');
                updateButtonLabel(addToCart, unitPrice, newQuantity);
            }
        });
    }

    if (decrement) {
        decrement.addEventListener("click", () => {
            const newQuantity = (parseInt(quantity.value) || 0) - 1;
            quantity.value = newQuantity;
            addToCart.setAttribute("data-item-quantity", newQuantity);

            // Update label (if using global decrement buttons)
            if (typeof updateButtonLabel === 'function') {
                let unitPrice = addToCart.getAttribute('data-item-price');
                updateButtonLabel(addToCart, unitPrice, newQuantity);
            }
        });
    }

    // ---- VARIANT INFO IN MINI-CART ----

    function injectCustomFieldsIntoMiniCart() {
        if (!window.Snipcart) return;

        document.querySelectorAll('.snipcart-item-line').forEach(function(itemLine) {
            // Avoid inserting multiple times
            if (itemLine.querySelector('.variant-info')) return;

            // Try to find custom field display (Snipcart renders these in the full cart, not in mini-cart)
            const itemId = itemLine.querySelector('.snipcart__item__info__name');
            if (!itemId) return;

            // Get the cart items from the Snipcart API
            const cartItems = window.Snipcart.store.getState().cart.items;

            // Find the matching item by name (or by id if available)
            let matched;
            cartItems.forEach(ci => {
                if (itemId.textContent.trim() === ci.name && ci.customFields && ci.customFields.length) {
                    matched = ci;
                }
            });

            if (matched && matched.customFields && matched.customFields.length) {
                matched.customFields.forEach(function(field) {
                    if (field.value) {
                        // Insert under description
                        const desc = itemLine.querySelector('.snipcart__item__info__description');
                        if (desc) {
                            const el = document.createElement('p');
                            el.className = 'variant-info';
                            el.innerHTML = `<strong>${field.name}:</strong> ${field.value}`;
                            desc.insertAdjacentElement('afterend', el);
                        }
                    }
                });
            }
        });
    }

    // Safe MutationObserver
    const targetNode = document.body;
    if (targetNode) {
        const config = { childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (
                    mutation.addedNodes.length &&
                    document.querySelector('.snipcart-cart-summary') // only run if mini-cart is open
                ) {
                    injectCustomFieldsIntoMiniCart();
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        // Also run on page load (if cart already open)
        setTimeout(injectCustomFieldsIntoMiniCart, 1000);
    }
});