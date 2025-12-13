/* ============================================
   CoCreate Platform - Admin Dashboard (Simplified)
   ============================================ */

function renderAdminDashboardPage() {
    if (!requireAuth()) return '';

    const user = AppState.currentUser;
    if (user.role !== 'admin') {
        return `
            <div class="container section">
                <div class="card text-center" style="padding: 64px;">
                    <h2>Access Denied</h2>
                    <p>You need admin privileges to access this page</p>
                    <button class="btn btn-primary mt-4" onclick="navigate('home')">
                        Go Home
                    </button>
                </div>
            </div>
        `;
    }

    const pendingSellers = USERS.filter(u => u.verificationStatus === 'pending');

    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Admin Dashboard</h1>

            <!-- Platform Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style="gap: 16px; margin-bottom: 32px;">
                <div class="card">
                    <div class="text-sm text-tertiary">Total Users</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${USERS.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Active Listings</div>
                    <div class="text-3xl font-bold" style="color: var(--color-success);">
                        ${PRODUCTS.filter(p => p.status === 'active').length}
                    </div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Total Orders</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${ORDERS.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Pending Verifications</div>
                    <div class="text-3xl font-bold" style="color: var(--color-warning);">${pendingSellers.length}</div>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active">Verifications</button>
                <button class="tab">Users</button>
                <button class="tab">Products</button>
                <button class="tab">CMS</button>
            </div>

            <div class="card" style="margin-top: 24px;">
                <h3>Pending Seller Verifications</h3>
                ${pendingSellers.length === 0 ? `
                    <p class="text-tertiary">No pending verifications</p>
                ` : `
                    <div class="grid grid-cols-1" style="gap: 16px; margin-top: 16px;">
                        ${pendingSellers.map(seller => `
                            <div style="padding: 16px; background: var(--color-background); border-radius: var(--radius-md);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <h4 style="margin: 0;">${seller.businessName || seller.name}</h4>
                                        <p class="text-sm text-tertiary">${seller.email}</p>
                                        <p class="text-sm">Tax ID: ${seller.taxId || 'N/A'}</p>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button class="btn btn-sm btn-primary">Approve</button>
                                        <button class="btn btn-sm btn-outline">Reject</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}
