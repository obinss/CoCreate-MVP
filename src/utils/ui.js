/* ============================================
   CoCreate Platform - Shared UI Functions
   ============================================ */

function renderProductCard(product) {
    if (!product) return '';

    // Check if formatPrice is available, otherwise basic format
    const priceFormatted = typeof formatPrice === 'function' ? formatPrice(product.price) : `€${product.price}`;

    // Calculate savings if marketPrice exists
    let savings = 0;
    if (product.marketPrice && product.marketPrice > product.price) {
        savings = Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100);
    }

    const conditionLabel = (window.CONDITIONS && window.CONDITIONS[product.condition]) ? window.CONDITIONS[product.condition].label : product.condition;

    // Use window.getPlaceholderImage or fallback
    const imageUrl = (typeof getPlaceholderImage === 'function')
        ? getPlaceholderImage(product.id, product.category)
        : 'https://via.placeholder.com/400x300?text=' + product.category;

    return `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'" style="background: white; border: 1px solid rgba(0,0,0,0.08); border-radius: 24px; overflow: hidden; cursor: pointer; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1); height: 100%; display: flex; flex-direction: column;">
            <div style="height: 240px; position: relative; flex-shrink: 0;">
                <img src="${imageUrl}" 
                     alt="${product.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;" />
                ${savings > 0 ? `
                    <div style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: white; padding: 6px 14px; border-radius: 100px; font-size: 0.8rem; font-weight: 600;">
                        Save ${savings}%
                    </div>
                ` : ''}
            </div>
            <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: #A6375F; text-transform: uppercase; margin-bottom: 4px;">${product.category}</div>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: #1a1a1a; line-height: 1.3;">${product.title}</h3>
                    </div>
                    <div style="font-weight: 700; font-size: 1.25rem;">${priceFormatted}</div>
                </div>
                <div style="display: flex; gap: 8px; margin-top: auto;">
                     <span class="chip" style="background: #f5f5f5; border-radius: 6px; padding: 4px 8px; font-size: 0.85rem;">${conditionLabel}</span>
                     <span class="chip" style="background: #f5f5f5; border-radius: 6px; padding: 4px 8px; font-size: 0.85rem;"><i class="fas fa-map-marker-alt"></i> ${product.locationName}</span>
                </div>
            </div>
        </div>
    `;
}

// Make sure it's available globally
if (typeof window !== 'undefined') {
    window.renderProductCard = renderProductCard;
}
