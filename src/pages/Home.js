/* ============================================
   CoCreate Platform - Home Page
   ============================================ */

function renderHomePage() {
    const featuredProducts = PRODUCTS.slice(0, 6);

    return `
        <!-- Hero Section - Arc.net inspired -->
        <section style="background: #ffffff; padding: 140px 0 100px; position: relative;">
            <div class="container">
                <div style="max-width: 880px; margin: 0 auto; text-align: center;">
                    <h1 style="font-size: 4.5rem; font-weight: 700; margin-bottom: 28px; line-height: 1.1; color: #1a1a1a; letter-spacing: -0.02em;">
                        Construction Materials,<br/>
                        <span style="background: linear-gradient(135deg, #A6375F 0%, #7e2a49 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Reimagined</span>
                    </h1>
                    <p style="font-size: 1.25rem; color: #666; margin-bottom: 48px; line-height: 1.7; max-width: 640px; margin-left: auto; margin-right: auto;">
                        Connect builders with surplus materials. Professional-grade inventory at prices that make sense.
                    </p>
                    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn" style="background: #1a1a1a; color: white; font-weight: 500; padding: 14px 32px; font-size: 1rem; border-radius: 12px; border: none;" 
                                onclick="navigate('browse')">
                            Explore Materials
                        </button>
                        <button class="btn" style="background: transparent; color: #1a1a1a; font-weight: 500; padding: 14px 32px; font-size: 1rem; border-radius: 12px; border: 1.5px solid #e0e0e0;"
                                onclick="navigate('signup')">
                            List Materials
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trust Metrics - Clean -->
        <section style="background: #fafafa; padding: 80px 0; border-top: 1px solid #f0f0f0;">
            <div class="container">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 64px; max-width: 900px; margin: 0 auto;">
                    <div style="text-align: center;">
                        <div style="font-size: 3.25rem; color: #1a1a1a; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.02em;">€1.2M</div>
                        <p style="color: #999; font-size: 0.95rem; margin: 0; font-weight: 500;">Total Savings</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 3.25rem; color: #1a1a1a; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.02em;">100%</div>
                        <p style="color: #999; font-size: 0.95rem; margin: 0; font-weight: 500;">Secure Payments</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 3.25rem; color: #1a1a1a; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.02em;">500+</div>
                        <p style="color: #999; font-size: 0.95rem; margin: 0; font-weight: 500;">Active Listings</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works - Minimal -->
        <section style="background: white; padding: 120px 0;">
            <div class="container">
                <div style="text-align: center; margin-bottom: 80px;">
                    <h2 style="font-size: 3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 16px; letter-spacing: -0.01em;">Simple Process</h2>
                    <p style="font-size: 1.125rem; color: #666; max-width: 540px; margin: 0 auto;">Three steps to start buying or selling</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 48px; max-width: 1100px; margin: 0 auto;">
                    <div style="padding: 40px 0; transition: transform 0.2s;" 
                         onmouseenter="this.style.transform='translateY(-8px)';" 
                         onmouseleave="this.style.transform='translateY(0)';">
                        <div style="width: 56px; height: 56px; background: #f5f5f5; border-radius: 14px; 
                                    display: flex; align-items: center; justify-content: center; margin-bottom: 24px; 
                                    color: #1a1a1a; font-size: 1.5rem; font-weight: 600;">1</div>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: #1a1a1a; margin-bottom: 12px;">Browse</h3>
                        <p style="color: #666; line-height: 1.7; margin: 0; font-size: 0.95rem;">Search verified listings. Filter by category, location, and price range.</p>
                    </div>
                    <div style="padding: 40px 0; transition: transform 0.2s;" 
                         onmouseenter="this.style.transform='translateY(-8px)';" 
                         onmouseleave="this.style.transform='translateY(0)';">
                        <div style="width: 56px; height: 56px; background: #f5f5f5; border-radius: 14px; 
                                    display: flex; align-items: center; justify-content: center; margin-bottom: 24px; 
                                    color: #1a1a1a; font-size: 1.5rem; font-weight: 600;">2</div>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: #1a1a1a; margin-bottom: 12px;">Purchase</h3>
                        <p style="color: #666; line-height: 1.7; margin: 0; font-size: 0.95rem;">Funds held in escrow. Released when you confirm delivery.</p>
                    </div>
                    <div style="padding: 40px 0; transition: transform 0.2s;" 
                         onmouseenter="this.style.transform='translateY(-8px)';" 
                         onmouseleave="this.style.transform='translateY(0)';">
                        <div style="width: 56px; height: 56px; background: #f5f5f5; border-radius: 14px; 
                                    display: flex; align-items: center; justify-content: center; margin-bottom: 24px; 
                                    color: #1a1a1a; font-size: 1.5rem; font-weight: 600;">3</div>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: #1a1a1a; margin-bottom: 12px;">Deliver</h3>
                        <p style="color: #666; line-height: 1.7; margin: 0; font-size: 0.95rem;">Integrated freight or self-pickup. Transparent pricing, always.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories - Clean Grid -->
        <section style="background: #fafafa; padding: 100px 0; border-top: 1px solid #f0f0f0;">
            <div class="container">
                <div style="text-align: center; margin-bottom: 64px;">
                    <h2 style="font-size: 2.5rem; font-weight: 600; color: #1a1a1a; margin-bottom: 12px; letter-spacing: -0.01em;">Categories</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; max-width: 1000px; margin: 0 auto;">
                    ${CATEGORIES.map(cat => `
                        <button 
                                onclick="AppState.searchFilters = { category: '${cat}' }; navigate('browse');"
                                style="padding: 32px 20px; text-align: center; cursor: pointer; background: white; border: 1px solid #e8e8e8; border-radius: 12px; transition: all 0.2s;"
                                onmouseenter="this.style.borderColor='#1a1a1a'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.06)';" 
                                onmouseleave="this.style.borderColor='#e8e8e8'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            <div style="font-size: 2rem; margin-bottom: 12px;">${getCategoryIcon(cat)}</div>
                            <h4 style="margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 500; color: #1a1a1a;">${cat}</h4>
                            <p style="font-size: 0.8rem; color: #999; margin: 0;">
                                ${getProductsByCategory(cat).length}
                            </p>
                        </button>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Featured Products -->
        <section style="background: white; padding: 100px 0;">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px;">
                    <div>
                        <h2 style="font-size: 2.25rem; font-weight: 600; color: #1a1a1a; margin: 0 0 8px 0; letter-spacing: -0.01em;">Featured</h2>
                        <p style="color: #999; margin: 0; font-size: 0.95rem;">Handpicked listings</p>
                    </div>
                    <button class="btn" style="background: transparent; color: #1a1a1a; font-weight: 500; padding: 10px 20px; border-radius: 10px; border: 1.5px solid #e0e0e0;" onclick="navigate('browse')">
                        View All
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    ${featuredProducts.map(product => renderProductCard(product)).join('')}
                </div>
            </div>
        </section>

        <!-- CTA - Minimalist -->
        <section style="background: #1a1a1a; padding: 120px 0; position: relative;">
            <div class="container">
                <div style="max-width: 680px; margin: 0 auto; text-align: center;">
                    <h2 style="color: white; font-size: 3rem; font-weight: 600; margin-bottom: 20px; line-height: 1.2; letter-spacing: -0.01em;">
                        Start Today
                    </h2>
                    <p style="font-size: 1.125rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 40px; line-height: 1.7;">
                        Join the sustainable materials marketplace
                    </p>
                    <button class="btn" style="background: white; color: #1a1a1a; font-weight: 500; padding: 14px 40px; font-size: 1rem; border-radius: 12px;"
                            onclick="navigate('signup')">
                        Create Account
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
        <div class="product-card" onclick="navigate('product-detail', '${product.id}')" style="border: 1px solid #e8e8e8; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" 
             onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1)';"
             onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <img src="${getPlaceholderImage(product.id, product.category)}" 
                 alt="${product.title}" 
                 class="product-card-image" style="border-radius: 12px 12px 0 0;" />
            <div class="product-card-body" style="padding: 20px;">
                <div style="font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 500;">${product.category}</div>
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; line-height: 1.4;">${product.title}</h3>
                <p style="font-size: 0.875rem; color: #666; margin-bottom: 16px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.description}</p>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                    <span style="display: inline-flex; align-items: center; padding: 4px 10px; font-size: 0.75rem; font-weight: 500; border-radius: 6px; background: #f5f5f5; color: #666;">${condition.label}</span>
                    ${savings > 0 ? `<span style="display: inline-flex; align-items: center; padding: 4px 10px; font-size: 0.75rem; font-weight: 500; border-radius: 6px; background: #e8f5e9; color: #2e7d32;">Save ${savings}%</span>` : ''}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f0f0f0;">
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 600; color: #1a1a1a;">${formatPrice(product.price)}</div>
                        <div style="font-size: 0.75rem; color: #999;">per ${product.unitOfMeasure}</div>
                    </div>
                    <div style="font-size: 0.8rem; color: #999; display: flex; align-items: center; gap: 4px;">
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
