/* ============================================
   CoCreate Platform - Product Detail Page
   ============================================ */

function renderProductDetailPage() {
    const productId = window.currentProductId;
    const product = getProductById(productId);

    if (!product) {
        return `
            <div class="container section">
                <div class="card text-center" style="padding: 64px;">
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist or has been sold.</p>
                    <button class="btn btn-primary mt-4" onclick="navigate('browse')">
                        Browse All Materials
                    </button>
                </div>
            </div>
        `;
    }

    const seller = getUserById(product.sellerId);
    const savings = calculateSavings(product.price, product.marketPrice);
    const condition = CONDITIONS[product.condition];
    const isAuth = isAuthenticated();

    return `
        <div class="container" style="margin-top: 32px; margin-bottom: 64px;">
            <div style="display: grid; grid-template-columns: 1fr 400px; gap: 32px;">
                <!-- Main Content -->
                <div>
                    <!-- Image Gallery -->
                    <div class="card" style="padding: 0; margin-bottom: 24px; overflow: hidden;">
                        <img src="${getPlaceholderImage(product.id, product.category)}" 
                             alt="${product.title}" 
                             style="width: 100%; height: 500px; object-fit: cover;" />
                    </div>

                    <!-- Product Info -->
                    <div class="card">
                        <div style="margin-bottom: 16px;">
                            <span class="badge badge-info">${product.category}</span>
                            <span class="badge badge-${condition.color}" style="margin-left: 8px;">
                                ${condition.label}
                            </span>
                            ${savings > 0 ? `
                                <span class="badge badge-success" style="margin-left: 8px;">
                                    Save ${savings}% vs. retail
                                </span>
                            ` : ''}
                        </div>

                        <h1 style="margin-bottom: 16px;">${product.title}</h1>

                        <div style="display: flex; gap: 24px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--color-background);">
                            <div>
                                <div class="text-sm text-tertiary">Price per unit</div>
                                <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-primary);">
                                    ${formatPrice(product.price)}
                                </div>
                                <div class="text-sm text-tertiary">per ${product.unitOfMeasure}</div>
                            </div>
                            ${product.marketPrice ? `
                                <div>
                                    <div class="text-sm text-tertiary">Market Price</div>
                                    <div style="font-size: 1.5rem; text-decoration: line-through; color: var(--color-text-tertiary);">
                                        ${formatPrice(product.marketPrice)}
                                    </div>
                                    <div style="color: var(--color-success); font-weight: 600;">
                                        You save ${formatPrice(product.marketPrice - product.price)}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <h3>Description</h3>
                        <p>${product.description}</p>

                        <h3>Specifications</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
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
                                📍 ${product.locationName}
                            </div>
                        </div>
                    </div>

                    <!-- Seller Info -->
                    <div class="card" style="margin-top: 24px;">
                        <h3>Seller Information</h3>
                        <div style="display: flex; gap: 16px; align-items: center;">
                            <div style="width: 60px; height: 60px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: white;">
                                ${seller.name[0]}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 1.125rem;">${seller.businessName || seller.name}</div>
                                ${seller.rating ? `
                                    <div style="color: var(--color-warning);">
                                        ${'★'.repeat(Math.floor(seller.rating))}${'☆'.repeat(5 - Math.floor(seller.rating))} 
                                        ${seller.rating}/5.0
                                    </div>
                                ` : ''}
                                ${seller.totalSales ? `
                                    <div class="text-sm text-tertiary">${seller.totalSales} sales completed</div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Actions -->
                <div style="position: sticky; top: 88px;">
                    <div class="card">
                        <h3>Purchase Options</h3>
                        
                        <div class="input-group">
                            <label class="input-label">Quantity (${product.unitOfMeasure})</label>
                            <input type="number" class="input" id="quantity-input" 
                                   value="1" min="1" max="${product.quantity}" 
                                   onchange="updatePriceCalculation()" />
                        </div>

                        <div style="background: var(--color-background); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span>Subtotal:</span>
                                <strong id="price-subtotal">${formatPrice(product.price)}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--color-text-tertiary); font-size: 0.875rem;">
                                <span>Est. Delivery:</span>
                                <span id="price-delivery">€25.00</span>
                            </div>
                            <div style="border-top: 1px solid var(--color-background); padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; font-weight: 700; font-size: 1.25rem;">
                                <span>Total:</span>
                                <span id="price-total">${formatPrice(product.price + 25)}</span>
                            </div>
                        </div>

                        ${isAuth ? `
                            <button class="btn btn-primary" style="width: 100%; margin-bottom: 12px;" 
                                    onclick="handleBuyNow('${product.id}')">
                                Buy Now
                            </button>
                            <button class="btn btn-outline" style="width: 100%; margin-bottom: 12px;"
                                    onclick="handleAddToCart('${product.id}')">
                                Add to Cart
                            </button>
                            <button class="btn btn-ghost" style="width: 100%;"
                                    onclick="handleContactSeller('${product.id}')">
                                💬 Contact Seller
                            </button>
                        ` : `
                            <div class="alert alert-info" style="margin-bottom: 16px;">
                                Please login to purchase or contact the seller
                            </div>
                            <button class="btn btn-primary" style="width: 100%;" onclick="navigate('login')">
                                Login to Continue
                            </button>
                        `}
                    </div>

                    <div class="card" style="margin-top: 16px;">
                        <h4>🔒 Secure Transaction</h4>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--color-background);">
                                ✓ Escrow payment protection
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--color-background);">
                                ✓ Verified seller
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--color-background);">
                                ✓ Recent photos verified
                            </li>
                            <li style="padding: 8px 0;">
                                ✓ VAT invoice provided
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <script>
            window.currentProductData = ${JSON.stringify(product)};
            
            function updatePriceCalculation() {
                const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
                const product = window.currentProductData;
                const subtotal = product.price * quantity;
                const delivery = 25.00; // Mock delivery cost
                const total = subtotal + delivery;
                
                document.getElementById('price-subtotal').textContent = formatPrice(subtotal);
                document.getElementById('price-total').textContent = formatPrice(total);
            }

            function handleBuyNow(productId) {
                const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
                addToCart(productId, quantity);
                navigate('checkout');
            }

            function handleAddToCart(productId) {
                const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
                addToCart(productId, quantity);
            }

            function handleContactSeller(productId) {
                showNotification('Opening message thread with seller...', 'info');
                setTimeout(() => navigate('messages'), 1000);
            }
        </script>
    `;
}
