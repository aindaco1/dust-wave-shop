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

                // Get current quantity
                var parent = select.parentNode;
                var qtyInput = parent.querySelector('.qty');
                var qty = qtyInput ? parseInt(qtyInput.value) : 1;

                updateButtonLabel(addToCartBtn, newPrice, qty);
            }
        });
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