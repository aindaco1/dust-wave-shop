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
const quantity = document.querySelector(".qty");
const increment = document.querySelector(".increment");
const decrement = document.querySelector(".decrement");

quantity.addEventListener("change", () => {
    addToCart.setAttribute("data-item-quantity", quantity.value);
});

increment.addEventListener("click", () => {
    const newQuantity = (parseInt(quantity.value) || 0) + 1;
    quantity.value = newQuantity;
    addToCart.setAttribute("data-item-quantity", newQuantity);
});

decrement.addEventListener("click", () => {
    const newQuantity = (parseInt(quantity.value) || 0) - 1;
    quantity.value = newQuantity;
    addToCart.setAttribute("data-item-quantity", newQuantity);
});
