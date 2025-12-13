/* ============================================
   CoCreate Platform - Home Page (High-End Redesign)
   "Better than Chrome" Aesthetic
   ============================================ */

function renderHomePage() {
    const featuredProducts = PRODUCTS.slice(0, 3);

    // Initialize IntersectionObserver for scroll animations
    setTimeout(() => {
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
    }, 100);

    return `
        <!-- Global Styles for High-End Look -->
        <style>
            :root {
                --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
                --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
            }

            /* Scroll Reveal Base Styles */
            .scroll-reveal {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 1s var(--ease-smooth), transform 1s var(--ease-smooth);
            }
            .scroll-reveal.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .delay-100 { transition-delay: 0.1s; }
            .delay-200 { transition-delay: 0.2s; }
            .delay-300 { transition-delay: 0.3s; }

            /* Marquee Animation */
            .marquee-container {
                overflow: hidden;
                white-space: nowrap;
                position: relative;
                mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
            .marquee-content {
                display: inline-flex;
                animation: marquee 30s linear infinite;
                gap: 24px;
            }
            .marquee-content:hover {
                animation-play-state: paused;
            }
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }

            /* Hero Blob Animation */
            .hero-blob {
                position: absolute;
                filter: blur(80px);
                opacity: 0.6;
                z-index: 0;
                animation: blob-float 10s ease-in-out infinite;
            }
            @keyframes blob-float {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
            }

            /* Bento Grid */
            .bento-grid {
                display: grid;
                grid-template-columns: repeat(12, 1fr);
                gap: 24px;
            }
            .bento-card {
                background: #f8f9fa;
                border-radius: 32px;
                padding: 40px;
                position: relative;
                overflow: hidden;
                transition: transform 0.3s var(--ease-smooth), box-shadow 0.3s var(--ease-smooth);
            }
            .bento-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            }
            .bento-light { background: #ffffff; border: 1px solid #f0f0f0; }
            .bento-primary { background: #A6375F; color: white; }
            .bento-dark { background: #1a1a1a; color: white; }
            
            .col-span-12 { grid-column: span 12; }
            .col-span-8 { grid-column: span 8; }
            .col-span-6 { grid-column: span 6; }
            .col-span-4 { grid-column: span 4; }

            @media (max-width: 968px) {
                .col-span-8, .col-span-6, .col-span-4 { grid-column: span 12; }
            }

            /* Massive Pill Button */
            .btn-pill {
                border-radius: 100px;
                padding: 20px 48px;
                font-size: 1.1rem;
                font-weight: 600;
                transition: transform 0.2s var(--ease-smooth);
            }
            .btn-pill:hover { transform: scale(1.05); }

        </style>

        <!-- New Hero Section -->
        <section style="position: relative; min-height: 90vh; display: flex; align-items: center; overflow: hidden; padding-top: 80px;">
            <!-- Background Blobs -->
            <div class="hero-blob" style="top: -10%; right: -5%; width: 600px; height: 600px; background: #ffe0e9;"></div>
            <div class="hero-blob" style="bottom: 0%; left: -10%; width: 500px; height: 500px; background: #e0f2fe; animation-delay: -5s;"></div>

            <div class="container" style="position: relative; z-index: 1;">
                <div style="text-align: center; max-width: 900px; margin: 0 auto;">
                    <!-- Animated Badge -->
                    <div class="scroll-reveal" style="display: inline-flex; align-items: center; gap: 8px; background: white; padding: 6px 16px 6px 6px; border-radius: 100px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin-bottom: 32px; border: 1px solid rgba(0,0,0,0.05);">
                        <span style="background: #A6375F; color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700;">NEW</span>
                        <span style="font-size: 0.85rem; font-weight: 500; color: #666;">CoCreate for Enterprise is here</span>
                        <span style="color: #A6375F;">→</span>
                    </div>

                    <!-- Massive Headline -->
                    <h1 class="scroll-reveal delay-100" style="font-size: clamp(3rem, 8vw, 6rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: #1a1a1a; margin-bottom: 32px;">
                        The sustainable<br>
                        <span style="color: #A6375F;">material marketplace.</span>
                    </h1>

                    <!-- Subhead -->
                    <p class="scroll-reveal delay-200" style="font-size: 1.35rem; color: #5f6368; max-width: 600px; margin: 0 auto 48px; line-height: 1.6;">
                        Connect contractors with surplus inventory. Reduce waste, save money, and build better.
                    </p>

                    <!-- CTAs -->
                    <div class="scroll-reveal delay-300" style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary btn-pill" onclick="navigate('browse')">
                            Explore Marketplace
                        </button>
                        <button class="btn btn-outline btn-pill" onclick="navigate('signup')" style="background: white; border-color: #e0e0e0; color: #1a1a1a;">
                            Become a Seller
                        </button>
                    </div>

                    <!-- Hero UI Interactive Demo Preview -->
                    <div class="scroll-reveal delay-300" style="margin-top: 80px; position: relative;">
                         <div style="background: white; border-radius: 24px 24px 0 0; box-shadow: 0 40px 100px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); padding: 24px; max-width: 1000px; margin: 0 auto; overflow: hidden;">
                            <!-- Fake Browser Nav -->
                            <div style="display: flex; gap: 8px; margin-bottom: 24px; padding-left: 8px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></div>
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
                            </div>
                            <!-- Mock UI Grid -->
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; opacity: 0.8;">
                                <div style="height: 180px; background: #f0f0f0; border-radius: 16px;"></div>
                                <div style="height: 180px; background: #f0f0f0; border-radius: 16px;"></div>
                                <div style="height: 180px; background: #f0f0f0; border-radius: 16px;"></div>
                                <div style="height: 180px; background: #f0f0f0; border-radius: 16px;"></div>
                            </div>
                            <!-- Hovering Detail Card Animation -->
                            <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -20%); background: white; padding: 20px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 300px; text-align: left; animation: float 6s ease-in-out infinite;">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                    <div style="width: 40px; height: 40px; background: #A6375F; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">🧱</div>
                                    <div>
                                        <div style="font-weight: 700;">Red Bricks</div>
                                        <div style="font-size: 0.8rem; color: #10B981;">Save 45% vs retail</div>
                                    </div>
                                </div>
                                <div style="height: 6px; background: #f0f0f0; border-radius: 3px; width: 100%; margin-bottom: 8px;">
                                    <div style="width: 70%; height: 100%; background: #A6375F; border-radius: 3px;"></div>
                                </div>
                                <div style="font-size: 0.8rem; color: #999;">Only 12 pallets left</div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Infinite Marquee Section -->
        <section style="padding: 60px 0; background: #fafafa; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;">
            <div style="text-align: center; margin-bottom: 32px; font-size: 0.9rem; font-weight: 600; color: #9aa0a6; text-transform: uppercase; letter-spacing: 1px;">Trusted Categories</div>
            <div class="marquee-container">
                <div class="marquee-content">
                    <!-- Duplicated twice for seamless loop -->
                    ${[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map(cat => `
                        <div style="display: flex; align-items: center; gap: 8px; background: white; padding: 12px 24px; border-radius: 100px; border: 1px solid #e0e0e0; font-weight: 600; color: #5f6368; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <span style="font-size: 1.2rem;">${getCategoryIcon(cat)}</span>
                            ${cat}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Bento Grid Features Section -->
        <section style="padding: 120px 0; background: white;">
            <div class="container">
                <div style="max-width: 600px; margin: 0 auto 80px; text-align: center;">
                    <h2 class="scroll-reveal" style="font-size: 3rem; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em; margin-bottom: 16px;">
                        Why CoCreate?
                    </h2>
                    <p class="scroll-reveal delay-100" style="font-size: 1.2rem; color: #5f6368;">
                        Built for the modern contractor. Streamlined, secure, and sustainable.
                    </p>
                </div>

                <div class="bento-grid">
                    <!-- Card 1: Large Primary -->
                    <div class="bento-card col-span-8 bento-light scroll-reveal delay-100" style="height: 500px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="max-width: 400px;">
                            <h3 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.01em;">Save up to 60% on materials.</h3>
                            <p style="font-size: 1.1rem; color: #5f6368; margin-bottom: 32px;">Every listing is priced to sell. Find high-quality surplus from verified professional job sites.</p>
                            <button class="btn btn-primary" style="border-radius: 100px; padding: 12px 24px;" onclick="navigate('browse')">Start Saving</button>
                        </div>
                        <div style="position: absolute; right: -50px; top: 50%; transform: translateY(-50%); width: 400px; height: 400px; background: url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800') center/cover; border-radius: 24px; box-shadow: 0 40px 80px rgba(0,0,0,0.1);"></div>
                    </div>

                    <!-- Card 2: Speed Stats -->
                    <div class="bento-card col-span-4 bento-primary scroll-reveal delay-200" style="display: flex; flex-direction: column; justify-content: space-between;">
                         <div>
                            <div style="font-size: 4rem; font-weight: 800; margin-bottom: 8px;">24h</div>
                            <h3 style="font-size: 1.5rem; font-weight: 600;">Fast Pickup</h3>
                         </div>
                         <p style="opacity: 0.9; line-height: 1.6;">Most materials are ready for pickup within 24 hours of purchase.</p>
                    </div>

                    <!-- Card 3: Security -->
                    <div class="bento-card col-span-4 bento-dark scroll-reveal delay-100" style="height: 350px;">
                         <div style="font-size: 3rem; margin-bottom: 24px;">🔒</div>
                         <h3 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 16px;">Escrow Secure</h3>
                         <p style="color: #9aa0a6; line-height: 1.6;">Payments are held safely until you verify the goods manually. No risk, just trust.</p>
                    </div>

                    <!-- Card 4: Eco Impact -->
                    <div class="bento-card col-span-8 bento-light scroll-reveal delay-200" style="background: #e6f4ea; border: none; height: 350px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="padding-right: 40px; flex: 1;">
                            <div style="display: inline-block; background: #ceead6; color: #137333; font-weight: 700; padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; margin-bottom: 16px;">ECO-FRIENDLY</div>
                            <h3 style="font-size: 2rem; font-weight: 700; color: #0d652d; margin-bottom: 16px;">Zero Waste Goal</h3>
                            <p style="color: #0d652d; opacity: 0.8;">Join our mission to divert 10,000 tons of construction waste from landfills by 2026.</p>
                        </div>
                        <div style="font-size: 8rem; opacity: 0.2; transform: rotate(15deg);">🌱</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Product Carousel Section (Scroll Snap) -->
        <section style="padding: 100px 0; background: #fafafa; overflow: hidden;">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px;">
                    <h2 class="scroll-reveal" style="font-size: 2.5rem; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em;">Fresh Listings</h2>
                    <div style="display: flex; gap: 8px;">
                         <button class="btn btn-icon" style="border-radius: 50%; width: 48px; height: 48px; background: white; border: 1px solid #e0e0e0;">←</button>
                         <button class="btn btn-icon" style="border-radius: 50%; width: 48px; height: 48px; background: white; border: 1px solid #e0e0e0;">→</button>
                    </div>
                </div>
                
                <!-- Horizontal Scroll Container -->
                <div class="scroll-reveal delay-200" style="display: flex; gap: 24px; overflow-x: auto; padding-bottom: 40px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
                    ${featuredProducts.map(product => `
                        <div style="min-width: 340px; scroll-snap-align: start;">
                            ${renderProductCard(product)}
                        </div>
                    `).join('')}
                    <!-- Placeholders to fill visual space -->
                     <div style="min-width: 340px; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 24px; border: 2px dashed #d0d0d0; color: #999; font-weight: 600; cursor: pointer;" onclick="navigate('browse')">
                        View All Listings →
                     </div>
                </div>
            </div>
        </section>

        <!-- Large footer CTA -->
        <section style="padding: 140px 0; background: #1a1a1a; text-align: center;">
            <div class="container">
                 <h2 class="scroll-reveal" style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; color: white; margin-bottom: 32px; letter-spacing: -0.03em;">
                    Ready to build different?
                 </h2>
                 <button class="btn btn-primary btn-pill scroll-reveal delay-100" style="padding: 24px 64px; font-size: 1.25rem;" onclick="navigate('signup')">
                    Get Started for Free
                 </button>
            </div>
        </section>
    `;
}

// Re-using the product card function but ensuring it fits the new style
function renderProductCard(product) {
    const savings = calculateSavings(product.price, product.marketPrice);
    const condition = CONDITIONS[product.condition];

    return `
        <div class="product-card" onclick="navigate('product-detail', '${product.id}')" style="background: white; border: 1px solid rgba(0,0,0,0.08); border-radius: 24px; overflow: hidden; cursor: pointer; transition: transform 0.3s var(--ease-smooth), box-shadow 0.3s var(--ease-smooth);">
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
                     <span class="chip" style="background: #f5f5f5; border-radius: 6px;">📍 ${product.locationName}</span>
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
