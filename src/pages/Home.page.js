/* ============================================
   CoCreate Platform - Home Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Populate Product Carousel
    const carousel = document.getElementById('product-carousel');
    const featuredProducts = PRODUCTS.slice(0, 3);

    if (carousel) {
        const productHtml = featuredProducts.map(product => {
            const savings = calculateSavings(product.price, product.marketPrice);
            const condition = CONDITIONS[product.condition];

            return `
                <div style="min-width: 340px; scroll-snap-align: start;">
                    <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'" style="background: white; border: 1px solid rgba(0,0,0,0.08); border-radius: 24px; overflow: hidden; cursor: pointer; transition: transform 0.3s var(--ease-smooth), box-shadow 0.3s var(--ease-smooth);">
                        <div style="height: 240px; position: relative;">
                            <img src="${getPlaceholderImage(product.id, product.category)}" 
                                 alt="${product.title}" 
                                 style="width: 100%; height: 100%; object-fit: cover;" />
                            ${savings > 0 ? `
                                <div style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: white; padding: 6px 14px; border-radius: 100px; font-size: 0.8rem; font-weight: 600;">
                                    Save ${savings}%
                                </div>
                            ` : ''}
                        </div>
                        <div style="padding: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div>
                                    <div style="font-size: 0.75rem; font-weight: 700; color: #A6375F; text-transform: uppercase; margin-bottom: 4px;">${product.category}</div>
                                    <h3 style="font-size: 1.25rem; font-weight: 600; color: #1a1a1a; line-height: 1.3;">${product.title}</h3>
                                </div>
                                <div style="font-weight: 700; font-size: 1.25rem;">${formatPrice(product.price)}</div>
                            </div>
                            <div style="display: flex; gap: 8px; margin-top: 16px;">
                                 <span class="chip" style="background: #f5f5f5; border-radius: 6px;">${condition.label}</span>
                                 <span class="chip" style="background: #f5f5f5; border-radius: 6px;"><i class="fas fa-map-marker-alt"></i> ${product.locationName}</span>
                            </div>
                        </div>
                    </div>
                </div>
             `;
        }).join('');

        const viewAllHtml = `
            <div style="min-width: 340px; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 24px; border: 2px dashed #d0d0d0; color: #999; font-weight: 600; cursor: pointer;" onclick="window.location.href='browse.html'">
                View All Listings →
            </div>
        `;

        carousel.innerHTML = productHtml + viewAllHtml;
    }

    // Populate Category Marquee
    const marqueeContainer = document.getElementById('marquee-content-container');
    if (marqueeContainer) {
        const cats = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];
        marqueeContainer.innerHTML = cats.map(cat => `
            <div style="display: flex; align-items: center; gap: 8px; background: white; padding: 12px 24px; border-radius: 100px; border: 1px solid #e0e0e0; font-weight: 600; color: #5f6368; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <span style="font-size: 1rem; width: 20px; text-align: center;">${getCategoryIcon(cat)}</span>
                ${cat}
            </div>
        `).join('');
    }

    // Initialize Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
});

// Carousel Navigation
function scrollCarousel(direction) {
    const carousel = document.getElementById('product-carousel');
    if (!carousel) return;

    const scrollAmount = 364; // card width (340) + gap (24)
    const currentScroll = carousel.scrollLeft;

    if (direction === 'left') {
        carousel.scrollLeft = currentScroll - scrollAmount;
    } else {
        carousel.scrollLeft = currentScroll + scrollAmount;
    }
}
