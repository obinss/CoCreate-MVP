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

    const pendingSellers = USERS.filter(u => u.isSeller && u.verificationStatus === 'pending');

    // Set up approval handlers
    setTimeout(() => {
        window.approveSeller = function (userId) {
            const user = USERS.find(u => u.id === userId);
            if (user) {
                user.verificationStatus = 'approved';
                user.isVerified = true;
                saveToLocalStorage('users', USERS);
                showNotification(`Approved ${user.name} as seller`, 'success');
                renderCurrentPage();
            }
        };

        window.rejectSeller = function (userId) {
            const user = USERS.find(u => u.id === userId);
            if (user) {
                user.verificationStatus = 'rejected';
                user.isSeller = false;
                saveToLocalStorage('users', USERS);
                showNotification(`Rejected ${user.name} seller application`, 'error');
                renderCurrentPage();
            }
        };
    }, 100);

    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Admin Dashboard</h1>

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
                <button class="tab">Reports</button>
            </div>

            <div class="card" style="margin-top: 24px;">
                <h3>Pending Seller Verifications</h3>
                <p class="text-sm text-tertiary">Review and approve users who want to sell materials on the platform</p>
                ${pendingSellers.length === 0 ? `
                    <p class="text-tertiary" style="margin-top: 16px;">No pending verifications</p>
                ` : `
                    <div class="grid grid-cols-1" style="gap: 16px; margin-top: 16px;">
                        ${pendingSellers.map(seller => `
                            <div style="padding: 20px; background: var(--color-background); border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.05);">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 4px 0;">${seller.businessName || seller.name}</h4>
                                        <p class="text-sm text-tertiary" style="margin: 0 0 8px 0;">${seller.email}</p>
                                        <div style="display: grid; grid-template-columns: 140px 1fr; gap: 8px; margin-top: 12px;">
                                            <div class="text-sm text-tertiary">Applicant Name:</div>
                                            <div class="text-sm">${seller.name}</div>
                                            
                                            <div class="text-sm text-tertiary">Business Name:</div>
                                            <div class="text-sm">${seller.businessName || 'Individual Seller'}</div>
                                            
                                            <div class="text-sm text-tertiary">Tax ID:</div>
                                            <div class="text-sm">${seller.taxId || 'Not provided'}</div>
                                            
                                            <div class="text-sm text-tertiary">Pickup Address:</div>
                                            <div class="text-sm">${seller.defaultPickupAddress || 'Not provided'}</div>
                                            
                                            <div class="text-sm text-tertiary">Applied:</div>
                                            <div class="text-sm">${formatDate(seller.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 8px; margin-left: 24px;">
                                        <button class="btn btn-sm btn-primary" onclick="approveSeller('${seller.id}')">
                                            Approve
                                        </button>
                                        <button class="btn btn-sm btn-outline" onclick="rejectSeller('${seller.id}')">
                                            Reject
                                        </button>
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
