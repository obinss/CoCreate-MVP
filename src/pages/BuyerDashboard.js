/* ============================================
   CoCreate Platform - Buyer Dashboard
   ============================================ */

function renderBuyerDashboardPage() {
    if (!requireAuth()) return '';

    const user = AppState.currentUser;
    const userOrders = ORDERS.filter(o => o.buyerId === user.id);

    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">My Dashboard</h1>

            <div class="tabs">
                <button class="tab active" onclick="switchDashboardTab('orders')">
                    Orders
                </button>
                <button class="tab" onclick="switchDashboardTab('watchlist')">
                    Watchlist
                </button>
                <button class="tab" onclick="switchDashboardTab('messages')">
                    Messages
                </button>
                <button class="tab" onclick="switchDashboardTab('profile')">
                    Profile
                </button>
            </div>

            <div id="dashboard-content">
                ${renderOrdersTab(userOrders)}
            </div>
        </div>

        <script>
            function switchDashboardTab(tab) {
                const tabs = document.querySelectorAll('.tab');
                tabs.forEach(t => t.classList.remove('active'));
                event.target.classList.add('active');

                const content = document.getElementById('dashboard-content');
                switch(tab) {
                    case 'orders':
                        content.innerHTML = \`${renderOrdersTab(userOrders).replace(/`/g, '\\`')}\`;
                        break;
                    case 'watchlist':
                        content.innerHTML = \`${renderWatchlistTab().replace(/`/g, '\\`')}\`;
                        break;
                    case 'messages':
                        navigate('messages');
                        break;
                    case 'profile':
                        navigate('profile');
                        break;
                }
            }
        </script>
    `;
}

function renderOrdersTab(orders) {
    if (orders.length === 0) {
        return `
            <div class="card text-center" style="padding: 64px;">
                <h3>No orders yet</h3>
                <p>Start browsing materials to make your first purchase</p>
                <button class="btn btn-primary mt-4" onclick="navigate('browse')">
                    Browse Materials
                </button>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1" style="gap: 16px;">
            ${orders.map(order => {
        const seller = getUserById(order.sellerId);
        const item = order.items[0];
        const product = getProductById(item.productId);
        const escrowBadge = {
            'funds_held': { label: 'Payment Held', color: 'warning' },
            'funds_released': { label: 'Completed', color: 'success' },
            'refunded': { label: 'Refunded', color: 'error' },
            'disputed': { label: 'Disputed', color: 'error' }
        }[order.escrowStatus];

        return `
                    <div class="card">
                        <div style="display: flex; gap: 24px;">
                            <img src="${getPlaceholderImage(product.id, product.category)}" 
                                 style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-md);" />
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div>
                                        <h4 style="margin: 0 0 4px 0;">${product.title}</h4>
                                        <p class="text-sm text-tertiary">Order #${order.id}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="text-2xl font-bold" style="color: var(--color-primary);">
                                            ${formatPrice(order.totalAmount)}
                                        </div>
                                        <span class="badge badge-${escrowBadge.color}">
                                            ${escrowBadge.label}
                                        </span>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
                                    <div>
                                        <div class="text-xs text-tertiary">Seller</div>
                                        <div class="text-sm font-medium">${seller.businessName || seller.name}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-tertiary">Quantity</div>
                                        <div class="text-sm font-medium">${item.quantity} ${product.unitOfMeasure}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-tertiary">Order Date</div>
                                        <div class="text-sm font-medium">${formatDate(order.createdAt)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-background); display: flex; gap: 12px;">
                            <button class="btn btn-sm btn-outline">View Details</button>
                            <button class="btn btn-sm btn-ghost" onclick="navigate('messages')">
                                Contact Seller
                            </button>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function renderWatchlistTab() {
    const savedSearches = AppState.savedSearches || [];

    if (savedSearches.length === 0) {
        return `
            <div class="card text-center" style="padding: 64px;">
                <h3>No saved searches</h3>
                <p>Save your search criteria to get notified when matching items are listed</p>
                <button class="btn btn-primary mt-4" onclick="navigate('browse')">
                    Browse and Save Searches
                </button>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1" style="gap: 16px;">
            ${savedSearches.map(search => `
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4>${search.name}</h4>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                ${search.category ? `<span class="badge badge-info">${search.category}</span>` : ''}
                                ${search.maxPrice ? `<span class="badge badge-success">Max €${search.maxPrice}</span>` : ''}
                                ${search.radiusKm ? `<span class="badge badge-warning">Within ${search.radiusKm}km</span>` : ''}
                            </div>
                            <p class="text-sm text-tertiary" style="margin-top: 8px;">
                                Created ${formatDate(search.createdAt)}
                            </p>
                        </div>
                        <button class="btn btn-sm btn-outline" 
                                onclick="loadSavedSearch('${search.id}')">
                            Search Now
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        <script>
            function loadSavedSearch(searchId) {
                const search = AppState.savedSearches.find(s => s.id === searchId);
                if (search) {
                    AppState.searchFilters = { ...search };
                    navigate('browse');
                }
            }
        </script>
    `;
}
