window.addEventListener('DOMContentLoaded', function(event) {
    document.addEventListener('change', function(evt) {
        console.log(evt.target.classList[0])
        if (evt.target.classList[0] === 'qty') {
            var button = evt.target.parentNode.querySelector('.buy-button')
            var qty = parseInt(evt.target.value)
            button.setAttribute('data-item-quantity', qty)
        }
    })
});

const addToCart = document.querySelector(".snipcart-add-item");
const increment = document.querySelector(".increment");
const decrement = document.querySelector(".decrement");

var qtyInputs = document.getElementsByClassName('qty');

for (var i = 0; i < qtyInputs.length; i++) {
    qtyInputs[i].addEventListener('change', function() {
        var button = this.parentNode.querySelector('.buy-button');
        var qty = parseInt(this.value);
        button.setAttribute('data-item-quantity', qty);
    });
}

if (increment) {
    increment.addEventListener("click", () => {
        const newQuantity = (parseInt(quantity.value) || 0) + 1;
        quantity.value = newQuantity;
        addToCart.setAttribute("data-item-quantity", newQuantity);
    });
}

if (decrement) {
    decrement.addEventListener("click", () => {
        const newQuantity = (parseInt(quantity.value) || 0) - 1;
        quantity.value = newQuantity;
        addToCart.setAttribute("data-item-quantity", newQuantity);
    });
}
