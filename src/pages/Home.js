/* ============================================
   CoCreate Platform - Home Page
   ============================================ */

function renderHomePage() {
    const featuredProducts = PRODUCTS.slice(0, 6);

    return `
        <!-- Hero Section -->
        <section class="gradient-primary text-inverse" style="padding: 80px 0;">
            <div class="container">
                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    <h1 style="color: white; font-size: 3rem; margin-bottom: 24px;">
                        Turn Construction Waste into Value
                    </h1>
                    <p style="font-size: 1.25rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 32px;">
                        The B2B2C marketplace connecting contractors with excess inventory
to SMEs, tradespeople, and DIYers. Professional-grade materials at below-market rates.
                    </p>
                    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-lg" style="background: white; color: var(--color-primary);" 
                                onclick="navigate('browse')">
                            Browse Materials
                        </button>
                        <button class="btn btn-outline btn-lg" style="border-color: white; color: white;"
                                onclick="navigate('signup')">
                            Become a Seller
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trust Indicators -->
        <section class="section" style="background: white;">
            <div class="container">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style="gap: 32px;">
                    <div class="text-center">
                        <div style="font-size: 3rem; color: var(--color-primary); font-weight: 800;">500+</div>
                        <p style="color: var(--color-text-secondary);">Active Listings</p>
                    </div>
                    <div class="text-center">
                        <div style="font-size: 3rem; color: var(--color-primary); font-weight: 800;">€1.2M</div>
                        <p style="color: var(--color-text-secondary);">Saved by Buyers</p>
                    </div>
                    <div class="text-center">
                        <div style="font-size: 3rem; color: var(--color-primary); font-weight: 800;">100%</div>
                        <p style="color: var(--color-text-secondary);">Secure Escrow</p>
                    </div>
                    <div class="text-center">
                        <div style="font-size: 3rem; color: var(--color-primary); font-weight: 800;">4.8★</div>
                        <p style="color: var(--color-text-secondary);">Average Rating</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section class="section" style="background: var(--color-background);">
            <div class="container">
                <h2 class="text-center mb-6" style="font-size: 2.5rem;">How CoCreate Works</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style="gap: 32px;">
                    <div class="card text-center">
                        <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: 50%; 
                                    display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; 
                                    color: white; font-size: 2rem; font-weight: bold;">1</div>
                        <h3>Browse Quality Materials</h3>
                        <p>Search through verified listings of professional-grade construction materials at discounted prices.</p>
                    </div>
                    <div class="card text-center">
                        <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: 50%; 
                                    display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; 
                                    color: white; font-size: 2rem; font-weight: bold;">2</div>
                        <h3>Secure Purchase</h3>
                        <p>Buy with confidence using our escrow system. Funds are held until you confirm delivery.</p>
                    </div>
                    <div class="card text-center">
                        <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: 50%; 
                                    display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; 
                                    color: white; font-size: 2rem; font-weight: bold;">3</div>
                        <h3>Choose Delivery</h3>
                        <p>Select from integrated freight carriers or arrange your own pickup. Transparent pricing always.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories -->
        <section class="section" style="background: white;">
            <div class="container">
                <h2 class="text-center mb-6" style="font-size: 2.5rem;">Browse by Category</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style="gap: 16px;">
                    ${CATEGORIES.map(cat => `
                        <button class="card card-clickable text-center" 
                                onclick="AppState.searchFilters = { category: '${cat}' }; navigate('browse');"
                                style="padding: 24px;">
                            <div style="font-size: 2rem; margin-bottom: 8px;">${getCategoryIcon(cat)}</div>
                            <h4 style="margin: 0;">${cat}</h4>
                            <p class="text-sm text-tertiary" style="margin: 0;">
                                ${getProductsByCategory(cat).length} items
                            </p>
                        </button>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Featured Products -->
        <section class="section" style="background: var(--color-background);">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h2 style="font-size: 2.5rem; margin: 0;">Featured Listings</h2>
                    <button class="btn btn-outline" onclick="navigate('browse')">
                        View All
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    ${featuredProducts.map(product => renderProductCard(product)).join('')}
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="gradient-primary text-inverse" style="padding: 80px 0;">
            <div class="container">
                <div style="max-width: 700px; margin: 0 auto; text-align: center;">
                    <h2 style="color: white; font-size: 2.5rem; margin-bottom: 24px;">
                        Ready to Start Saving?
                    </h2>
                    <p style="font-size: 1.125rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 32px;">
                        Join thousands of contractors and tradespeople already benefiting from sustainable material recovery.
                    </p>
                    <button class="btn btn-lg" style="background: white; color: var(--color-primary);"
                            onclick="navigate('signup')">
                        Create Free Account
                    </button>
                </div>
            </div>
        </section>
    `;
}

function renderProductCard(product) {
    const seller = getUserById(product.sellerId);
    const savings = calculateSavings(product.price, product.marketPrice);
    const condition = CONDITIONS[product.condition];

    return `
        <div class="product-card" onclick="navigate('product-detail', '${product.id}')">
            <img src="${getPlaceholderImage(product.id, product.category)}" 
                 alt="${product.title}" 
                 class="product-card-image" />
            <div class="product-card-body">
                <div class="product-card-category">${product.category}</div>
                <h3 class="product-card-title">${product.title}</h3>
                <p class="product-card-description">${product.description}</p>
                <div class="product-card-meta">
                    <span class="badge badge-${condition.color}">${condition.label}</span>
                    ${savings > 0 ? `<span class="badge badge-success">Save ${savings}%</span>` : ''}
                </div>
                <div class="product-card-footer">
                    <div>
                        <div class="product-card-price">${formatPrice(product.price)}</div>
                        <div class="text-xs text-tertiary">per ${product.unitOfMeasure}</div>
                    </div>
                    <div class="product-card-location">
                        📍 ${product.locationName}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getCategoryIcon(category) {
    const icons = {
        'Wood': '🪵',
        'Metal': '🔩',
        'Masonry': '🧱',
        'Electrical': '⚡',
        'Plumbing': '🚰',
        'Insulation': '🏠',
        'Flooring': '🟫',
        'Roofing': '🏗️',
        'Paint & Coating': '🎨',
        'Doors & Windows': '🚪',
        'Hardware': '🔧',
        'Concrete': '🏗️'
    };
    return icons[category] || '📦';
}
