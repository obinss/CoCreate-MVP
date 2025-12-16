/* ============================================
   CoCreate Platform - Product Detail Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = window.PRODUCTS.find(p => p.id === productId);

    const container = document.getElementById('product-content-container');

    if (!product) {
        container.innerHTML = `
            <div class="container section">
                <div class="card text-center product-not-found">
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist or has been sold.</p>
                    <a href="browse.html" class="btn btn-primary mt-4">
                        Browse All Materials
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // Expose for helpers
    window.currentProductData = product;

    // Derived data
    const seller = window.USERS.find(u => u.id === product.sellerId) || { name: 'Unknown Seller', businessName: 'Unknown' };
    const condition = window.CONDITIONS[product.condition] || { label: product.condition, color: 'info' };
    const isAuth = !!localStorage.getItem('cocreate_user');

    // Render
    // Image
    const imageUrl = (typeof getPlaceholderImage === 'function')
        ? getPlaceholderImage(product.id, product.category)
        : 'https://via.placeholder.com/500';

    // Savings
    let savings = 0;
    if (product.marketPrice && product.marketPrice > product.price) {
        savings = Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100);
    }

    container.innerHTML = `
        <div class="container product-detail-container">
            <div class="product-layout">
                <!-- Main Content -->
                <div>
                    <!-- Image Gallery -->
                    <div class="card product-image-gallery">
                        <img src="${imageUrl}" 
                             alt="${product.title}" />
                    </div>

                    <!-- Product Info -->
                    <div class="card">
                        <div class="product-badges">
                            <span class="badge badge-info">${product.category}</span>
                            <span class="badge badge-${condition.color}">
                                ${condition.label}
                            </span>
                            ${savings > 0 ? `
                                <span class="badge badge-success">
                                    Save ${savings}% vs. retail
                                </span>
                            ` : ''}
                        </div>

                        <h1 class="product-title">${product.title}</h1>

                        <div class="product-price-section">
                            <div>
                                <div class="text-sm text-tertiary">Price per unit</div>
                                <div class="product-price-main">
                                    ${typeof formatPrice === 'function' ? formatPrice(product.price) : '€' + product.price}
                                </div>
                                <div class="text-sm text-tertiary">per ${product.unitOfMeasure}</div>
                            </div>
                            ${product.marketPrice ? `
                                <div>
                                    <div class="text-sm text-tertiary">Market Price</div>
                                    <div class="product-market-price">
                                        ${typeof formatPrice === 'function' ? formatPrice(product.marketPrice) : '€' + product.marketPrice}
                                    </div>
                                    <div class="product-savings">
                                        You save ${typeof formatPrice === 'function' ? formatPrice(product.marketPrice - product.price) : '€' + (product.marketPrice - product.price)}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <h3>Description</h3>
                        <p>${product.description}</p>

                        <h3>Specifications</h3>
                        <div class="product-specs-grid">
                            <div>
                                <strong>Available Quantity:</strong><br/>
                                ${product.quantity} ${product.unitOfMeasure}
                            </div>
                            <div>
                                <strong>Dimensions:</strong><br/>
                                ${product.dimensions}
                            </div>
                            <div>
                                <strong>Weight per Unit:</strong><br/>
                                ${product.weightPerUnit} kg
                            </div>
                            <div>
                                <strong>Location:</strong><br/>
                                <i class="fas fa-map-marker-alt"></i> ${product.locationName}
                            </div>
                        </div>
                    </div>

                    <!-- Seller Info -->
                    <div class="card seller-info-section">
                        <h3>Seller Information</h3>
                        <div class="seller-avatar-section">
                            <div class="seller-avatar">
                                ${seller.name[0]}
                            </div>
                            <div class="seller-details">
                                <div class="seller-name">${seller.businessName || seller.name}</div>
                                ${seller.rating ? `
                                    <div class="seller-rating">
                                        ${'★'.repeat(Math.floor(seller.rating))}${'☆'.repeat(5 - Math.floor(seller.rating))} 
                                        ${seller.rating}/5.0
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Actions -->
                <div class="product-sidebar">
                    <div class="card">
                        <h3>Purchase Options</h3>
                        
                        <div class="input-group">
                            <label class="input-label">Quantity (${product.unitOfMeasure})</label>
                            <input type="number" class="input" id="quantity-input" 
                                   value="1" min="1" max="${product.quantity}" 
                                   onchange="updatePriceCalculation()" />
                        </div>

                        <div class="price-calculator">
                            <div class="price-row">
                                <span>Subtotal:</span>
                                <strong id="price-subtotal">${typeof formatPrice === 'function' ? formatPrice(product.price) : '€' + product.price}</strong>
                            </div>
                            <div class="price-row price-row-tertiary">
                                <span>Est. Delivery:</span>
                                <span id="price-delivery">€25.00</span>
                            </div>
                            <div class="price-total-row">
                                <span>Total:</span>
                                <span id="price-total">${typeof formatPrice === 'function' ? formatPrice(product.price + 25) : '€' + (product.price + 25)}</span>
                            </div>
                        </div>

                        ${isAuth ? `
                            <button class="btn btn-primary purchase-btn-primary" 
                                    onclick="handleBuyNow('${product.id}')">
                                Buy Now
                            </button>
                            <button class="btn btn-outline purchase-btn-secondary"
                                    onclick="handleAddToCart('${product.id}')">
                                Add to Cart
                            </button>
                            <button class="btn btn-ghost purchase-btn-contact"
                                    onclick="window.location.href='chat.html'">
                                <i class="fas fa-comment"></i> Contact Seller
                            </button>
                            <button class="btn btn-ghost purchase-btn-contact" style="color: var(--color-error);"
                                    onclick="flagProduct('${product.id}')">
                                <i class="fas fa-flag"></i> Report Product
                            </button>
                        ` : `
                            <div class="alert alert-info login-required-alert">
                                Please login to purchase or contact the seller
                            </div>
                            <a href="login.html" class="btn btn-primary login-required-btn">
                                Login to Continue
                            </a>
                        `}
                    </div>
                    
                    <div class="card security-card">
                        <h4><i class="fas fa-shield-halved"></i> Secure Transaction</h4>
                        <ul class="security-list">
                            <li>✓ Escrow payment protection</li>
                            <li>✓ Verified seller</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
});

// Helper functions
function updatePriceCalculation() {
    const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
    const product = window.currentProductData;
    const subtotal = product.price * quantity;
    const delivery = 25.00;
    const total = subtotal + delivery;

    document.getElementById('price-subtotal').textContent = typeof formatPrice === 'function' ? formatPrice(subtotal) : '€' + subtotal;
    document.getElementById('price-total').textContent = typeof formatPrice === 'function' ? formatPrice(total) : '€' + total;
}

function handleAddToCart(productId) {
    const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
    // Ensure access to addToCart (which needs AppState initialized)
    // We need to init AppState.cart first
    if (!window.AppState) window.AppState = {};
    if (!window.AppState.cart) window.AppState.cart = JSON.parse(localStorage.getItem('cocreate_cart') || '[]');

    window.addToCart(productId, quantity);
}

function handleBuyNow(productId) {
    handleAddToCart(productId);
    window.location.href = 'cart.html';
}

function flagProduct(productId) {
    const product = window.PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const reason = prompt('Why are you flagging this product?\n\n1. Fraudulent Activity\n2. Misleading Information\n3. Inappropriate Content\n4. Spam\n5. Wrong Category\n6. Duplicate Listing\n7. Other\n\nEnter reason number:');
    
    if (!reason) return;

    const reasons = {
        '1': 'fraudulent',
        '2': 'misleading',
        '3': 'inappropriate',
        '4': 'spam',
        '5': 'wrong_category',
        '6': 'duplicate',
        '7': 'other'
    };

    const description = prompt('Please provide details about why you are flagging this product:');
    if (!description) return;

    // In a real app, this would send to API
    console.log('Flagging product:', {
        productId,
        reason: reasons[reason] || 'other',
        description
    });

    if (typeof showNotification === 'function') {
        showNotification('Product flagged. Our team will review it shortly.', 'success');
    } else {
        alert('Product flagged. Our team will review it shortly.');
    }
}
