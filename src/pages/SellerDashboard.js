/* ============================================
   CoCreate Platform - Seller Dashboard
   ============================================ */

function renderSellerDashboardPage() {
    if (!requireAuth()) return '';

    const user = AppState.currentUser;

    // Check if user has seller privileges and is approved
    if (!user.isSeller || user.verificationStatus !== 'approved') {
        return `
    < div class="container section" >
        <div class="card text-center" style="padding: 64px;">
            <h2>${user.isSeller && user.verificationStatus === 'pending' ? 'Verification Pending' : 'Seller Access Required'}</h2>
            <p>${user.isSeller && user.verificationStatus === 'pending'
                ? 'Your seller application is pending admin approval. You can continue browsing while you wait.'
                : 'You need seller privileges to access this page. Apply to become a seller from your profile.'}</p>
            <button class="btn btn-primary mt-4" onclick="navigate('browse')">
                Browse Materials
            </button>
        </div>
            </div >
    `;
    }

    const sellerProducts = getProductsBySeller(user.id);
    const activeProducts = sellerProducts.filter(p => p.status === 'active');
    const soldProducts = sellerProducts.filter(p => p.status === 'sold');
    const totalRevenue = 850.50; // Mock data

    return `
    < div class="container section" >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                <h1>Seller Dashboard</h1>
                <button class="btn btn-primary" onclick="navigate('add-product')">
                    + Add New Listing
                </button>
            </div>

            <!--Stats Overview-- >
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style="gap: 16px; margin-bottom: 32px;">
                <div class="card">
                    <div class="text-sm text-tertiary">Active Listings</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${activeProducts.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Total Sales</div>
                    <div class="text-3xl font-bold" style="color: var(--color-success);">${soldProducts.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Total Revenue</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${formatPrice(totalRevenue)}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Rating</div>
                    <div class="text-3xl font-bold" style="color: var(--color-warning);">
                        ${user.rating || 0}★
                    </div>
                </div>
            </div>

            <!--Tabs -->
            <div class="tabs">
                <button class="tab active" onclick="switchSellerTab('inventory')">
                    Inventory
                </button>
                <button class="tab" onclick="switchSellerTab('orders')">
                    Orders
                </button>
                <button class="tab" onclick="switchSellerTab('analytics')">
                    Analytics
                </button>
            </div>

            <div id="seller-content">
                ${renderInventoryTab(sellerProducts)}
            </div>
        </div >

    <script>
        function switchSellerTab(tab) {
                const tabs = document.querySelectorAll('.tab');
                tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const content = document.getElementById('seller-content');
        const products = ${JSON.stringify(sellerProducts)};

        switch(tab) {
                    case 'inventory':
        content.innerHTML = renderInventoryTab(products);
        break;
        case 'orders':
        content.innerHTML = renderSellerOrdersTab();
        break;
        case 'analytics':
        content.innerHTML = renderAnalyticsTab();
        break;
                }
            }
    </script>
`;
}

function renderInventoryTab(products) {
    if (products.length === 0) {
        return `
    < div class="card text-center" style = "padding: 64px;" >
                <h3>No products listed yet</h3>
                <p>Add your first product to start selling</p>
                <button class="btn btn-primary mt-4" onclick="navigate('add-product')">
                    Add Product
                </button>
            </div >
    `;
    }

    return `
    < div class="grid grid-cols-1" style = "gap: 16px;" >
        ${products.map(product => {
        const statusBadge = {
            'active': { label: 'Active', color: 'success' },
            'sold': { label: 'Sold', color: 'info' },
            'reserved': { label: 'Reserved', color: 'warning' },
            'archived': { label: 'Archived', color: 'error' }
        }[product.status];

        return `
                    <div class="card">
                        <div style="display: flex; gap: 24px;">
                            <img src="${getPlaceholderImage(product.id, product.category)}" 
                                 style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-md);" />
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <h4 style="margin: 0 0 4px 0;">${product.title}</h4>
                                        <p class="text-sm text-tertiary">${product.category}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="text-2xl font-bold" style="color: var(--color-primary);">
                                            ${formatPrice(product.price)}
                                        </div>
                                        <span class="badge badge-${statusBadge.color}">${statusBadge.label}</span>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
                                    <div>
                                        <div class="text-xs text-tertiary">Quantity</div>
                                        <div class="text-sm font-medium">${product.quantity} ${product.unitOfMeasure}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-tertiary">Views</div>
                                        <div class="text-sm font-medium">${product.views || 0}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-tertiary">Saves</div>
                                        <div class="text-sm font-medium">${product.saves || 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-background); display: flex; gap: 12px;">
                            <button class="btn btn-sm btn-outline" onclick="navigate('product-detail', '${product.id}')">
                                View Listing
                            </button>
                            <button class="btn btn-sm btn-ghost">Edit</button>
                            <button class="btn btn-sm btn-ghost">Archive</button>
                        </div>
                    </div>
                `;
    }).join('')
        }
        </div >
    `;
}

function renderSellerOrdersTab() {
    return `
    < div class="card text-center" style = "padding: 64px;" >
            <h3>Orders</h3>
            <p>View and manage your orders here</p>
        </div >
    `;
}

function renderAnalyticsTab() {
    return `
    < div class="grid grid-cols-1 lg:grid-cols-2" style = "gap: 24px;" >
            <div class="card">
                <h3>Revenue Trend</h3>
                <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: var(--color-background); border-radius: var(--radius-md);">
                    <p class="text-tertiary">Chart visualization would go here</p>
                </div>
            </div>
            <div class="card">
                <h3>Top Products</h3>
                <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: var(--color-background); border-radius: var(--radius-md);">
                    <p class="text-tertiary">Product performance metrics</p>
                </div>
            </div>
        </div >
    `;
}
