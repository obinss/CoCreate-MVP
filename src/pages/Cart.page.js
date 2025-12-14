/* ============================================
   CoCreate Platform - Cart Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    window.addEventListener('storage', () => renderCart()); // Update if changed elsewhere
});

function renderCart() {
    const cartItems = JSON.parse(localStorage.getItem('cocreate_cart') || '[]');
    const container = document.getElementById('cart-content');

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding: 64px;">
                <h2>Your cart is empty</h2>
                <p>Add some materials to get started</p>
                <a href="browse.html" class="btn btn-primary mt-4">
                    Browse Materials
                </a>
            </div>
        `;
        return;
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
        const product = window.PRODUCTS.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const itemsHtml = cartItems.map(item => {
        const product = window.PRODUCTS.find(p => p.id === item.productId);
        if (!product) return '';

        const imageUrl = (typeof getPlaceholderImage === 'function')
            ? getPlaceholderImage(product.id, product.category)
            : 'https://via.placeholder.com/120';

        return `
            <div class="card" style="margin-bottom: 16px;">
                <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
                    <img src="${imageUrl}" 
                         style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-md);" />
                    <div style="flex: 1; min-width: 200px;">
                        <h3>${product.title}</h3>
                        <p class="text-sm text-tertiary">${product.category}</p>
                        <div style="margin-top: 16px;">
                            <label>Quantity: </label>
                            <input type="number" value="${item.quantity}" min="1" max="${product.quantity}" 
                                   class="input" style="width: 80px; padding: 4px 8px; display: inline-block;"
                                   onchange="updateQuantity('${product.id}', this.value)" />
                        </div>
                    </div>
                    <div style="text-align: right; min-width: 120px;">
                        <div class="text-2xl font-bold" style="color: var(--color-primary);">
                            ${typeof formatPrice === 'function' ? formatPrice(product.price * item.quantity) : '€' + (product.price * item.quantity)}
                        </div>
                        <button class="btn btn-sm btn-ghost mt-2" onclick="removeItem('${product.id}')">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 400px; gap: 32px;" class="cart-layout">
            <div>${itemsHtml}</div>
            <div style="position: sticky; top: 120px; height: fit-content;">
                <div class="card">
                    <h3>Order Summary</h3>
                    <div style="margin: 24px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span>Subtotal:</span>
                            <strong>${typeof formatPrice === 'function' ? formatPrice(total) : '€' + total}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span>Delivery:</span>
                            <span>€25.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span>Tax (19%):</span>
                            <span>${typeof formatPrice === 'function' ? formatPrice((total + 25) * 0.19) : '€' + ((total + 25) * 0.19).toFixed(2)}</span>
                        </div>
                        <div style="border-top: 2px solid var(--color-background); padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 700;">
                            <span>Total:</span>
                            <span>${typeof formatPrice === 'function' ? formatPrice((total + 25) * 1.19) : '€' + ((total + 25) * 1.19).toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="startCheckout()">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add responsive style for cart layout
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 900px) {
            .cart-layout { grid-template-columns: 1fr !important; }
        }
    `;
    document.head.appendChild(style);
}

window.updateQuantity = function (productId, qty) {
    const cart = JSON.parse(localStorage.getItem('cocreate_cart') || '[]');
    const item = cart.find(i => i.productId === productId);
    if (item) {
        item.quantity = parseInt(qty);
        if (item.quantity < 1) item.quantity = 1;
        localStorage.setItem('cocreate_cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge(); // from utils/loadComponents injected logic or utils.js
    }
};

window.removeItem = function (productId) {
    let cart = JSON.parse(localStorage.getItem('cocreate_cart') || '[]');
    cart = cart.filter(i => i.productId !== productId);
    localStorage.setItem('cocreate_cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
};

window.startCheckout = function () {
    showNotification('Checkout functionality coming soon!', 'info');
};
