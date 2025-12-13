/* ============================================
   CoCreate Platform - Buyer Dashboard
   ============================================ */

function renderBuyerDashboardPage() {
    if (!requireAuth()) return '';

    const user = AppState.currentUser;
    const myOrders = ORDERS.filter(o => o.buyerId === user.id);
    const watchlist = PRODUCTS.filter(p => user.watchlist?.includes(p.id)) || [];
    const cart = AppState.cart || [];
    const projects = user.projects || [];

    // Default tab from state or 'orders'
    const currentTab = AppState.dashboardTab || 'orders';

    return `
        <div class="container section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                <h1>My Dashboard</h1>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style="gap: 16px; margin-bottom: 32px;">
                <div class="card">
                    <div class="text-sm text-tertiary">Active Orders</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${myOrders.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Projects</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${projects.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Watchlist</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">${watchlist.length}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-tertiary">Messages</div>
                    <div class="text-3xl font-bold" style="color: var(--color-primary);">2</div>
                </div>
            </div>

            <!-- Become a Seller CTA (if not a seller yet) -->
            ${!user.isSeller ? `
                <div style="background: linear-gradient(135deg, #A6375F 0%, #7e2a49 100%); border-radius: 12px; padding: 40px; margin-bottom: 32px; color: white; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; right: 0; bottom: 0; width: 50%; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"2\" fill=\"white\" opacity=\"0.1\"/></svg>') repeat; opacity: 0.1;"></div>
                    <div style="position: relative; z-index: 1; max-width: 600px;">
                        <h3 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 12px; color: white;">Have Surplus Materials?</h3>
                        <p style="font-size: 1.125rem; margin-bottom: 24px; color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
                            Turn your excess inventory into revenue. List materials for free and reach thousands of buyers.
                        </p>
                        <button class="btn" style="background: white; color: #A6375F; font-weight: 600; padding: 12px 28px; border: none;" 
                                onclick="navigate('seller-application')">
                            Become a Seller →
                        </button>
                    </div>
                </div>
            ` : user.verificationStatus === 'pending' ? `
                <div class="card" style="background: #fef7e8; border: 1px solid #f4d398; margin-bottom: 32px; padding: 24px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="font-size: 2rem;">⏳</div>
                        <div>
                            <h4 style="margin: 0 0 6px 0; font-weight: 600; color: #1a1a1a;">Seller Application Pending</h4>
                            <p style="margin: 0; color: #666;">Your seller application is under review. You'll be notified within 24-48 hours.</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Tabs -->
            <div class="tabs">
                <button class="tab ${currentTab === 'orders' ? 'active' : ''}" onclick="switchBuyerTab('orders')">Orders</button>
                <button class="tab ${currentTab === 'projects' ? 'active' : ''}" onclick="switchBuyerTab('projects')">Projects</button>
                <button class="tab ${currentTab === 'watchlist' ? 'active' : ''}" onclick="switchBuyerTab('watchlist')">Watchlist</button>
                <button class="tab ${currentTab === 'messages' ? 'active' : ''}" onclick="switchBuyerTab('messages')">Messages</button>
                <button class="tab ${currentTab === 'profile' ? 'active' : ''}" onclick="switchBuyerTab('profile')">Profile</button>
            </div>

            <div id="buyer-dashboard-content">
                ${renderTabContent(currentTab, { myOrders, projects, watchlist, user })}
            </div>
        </div>
    `;
}

function switchBuyerTab(tab) {
    AppState.dashboardTab = tab;
    navigate('buyer-dashboard'); // Re-render to update classes and content cleanly
}

function renderTabContent(tab, data) {
    switch (tab) {
        case 'orders': return renderOrdersTab(data.myOrders);
        case 'projects': return renderProjectsTab(data.projects, data.myOrders);
        case 'watchlist': return renderWatchlistTab(data.watchlist);
        case 'messages': return renderMessagesTab();
        case 'profile': return renderProfileTab(data.user);
        default: return renderOrdersTab(data.myOrders);
    }
}

// --- Tab Renderers ---

function renderOrdersTab(orders) {
    if (!orders || orders.length === 0) {
        return `
            <div class="card text-center" style="padding: 64px;">
                <h3>No orders yet</h3>
                <p>Start browsing materials to make your first purchase</p>
                <button class="btn btn-primary mt-4" onclick="navigate('browse')">Browse Materials</button>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1" style="gap: 16px;">
            ${orders.map(order => {
        const seller = getUserById(order.sellerId);
        const item = order.items[0]; // Assuming single item for MVP display
        const product = getProductById(item.productId);

        // Safety check if product/seller deleted
        if (!product || !seller) return '';

        const statusColors = {
            'funds_held': 'warning',
            'funds_released': 'success',
            'refunded': 'error',
            'disputed': 'error'
        };
        const statusLabels = {
            'funds_held': 'Payment Held',
            'funds_released': 'Completed',
            'refunded': 'Refunded',
            'disputed': 'Disputed'
        };

        return `
                    <div class="card">
                        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
                            <img src="${getPlaceholderImage(product.id, product.category)}" 
                                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
                            <div style="flex: 1; min-width: 200px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div>
                                        <h4 style="margin: 0 0 4px 0;">${product.title}</h4>
                                        <p class="text-sm text-tertiary">Order #${order.id.slice(0, 8)}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="text-xl font-bold" style="color: var(--color-primary);">${formatPrice(order.totalAmount)}</div>
                                        <span class="badge badge-${statusColors[order.escrowStatus]}">${statusLabels[order.escrowStatus] || order.escrowStatus}</span>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; margin-top: 12px; font-size: 0.9rem;">
                                    <div><span class="text-tertiary">Seller:</span> ${seller.businessName || seller.name}</div>
                                    <div><span class="text-tertiary">Date:</span> ${formatDate(order.createdAt)}</div>
                                    ${order.projectId ? `<div><span class="text-tertiary">Project:</span> ${order.projectId}</div>` : ''}
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; display: flex; gap: 12px;">
                            <button class="btn btn-sm btn-outline">View Invoice</button>
                            <button class="btn btn-sm btn-ghost" onclick="switchBuyerTab('messages')">Contact Seller</button>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function renderProjectsTab(projects, orders) {
    if (!projects || projects.length === 0) {
        return `
            <div class="card text-center" style="padding: 64px;">
                <h3>Organize your work</h3>
                <p>Create projects to track expenses and materials for specific jobs.</p>
                <button class="btn btn-primary mt-4" onclick="showCreateProjectModal()">+ Create New Project</button>
            </div>
            ${renderCreateProjectModal()}
        `;
    }

    return `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
            <button class="btn btn-primary" onclick="showCreateProjectModal()">+ New Project</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2" style="gap: 24px;">
            ${projects.map(proj => {
        const projOrders = orders.filter(o => o.projectId === proj.id);
        const spent = projOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const progress = Math.min((spent / proj.budget) * 100, 100);

        return `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <h3 style="margin: 0;">${proj.name}</h3>
                            <button class="btn btn-sm btn-ghost" style="color: #999;" onclick="deleteProject('${proj.id}')">×</button>
                        </div>
                        <p class="text-sm text-tertiary" style="margin-bottom: 24px;">${proj.description || 'No description'}</p>
                        
                        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span>Budget Used</span>
                            <span class="${spent > proj.budget ? 'text-error' : ''}">${formatPrice(spent)} / ${formatPrice(proj.budget)}</span>
                        </div>
                        <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 24px;">
                            <div style="background: var(--color-primary); width: ${progress}%; height: 100%;"></div>
                        </div>

                        <div style="display: flex; gap: 24px; font-size: 0.9rem; color: #666;">
                            <div>📦 ${projOrders.length} Orders</div>
                            <div>📅 Created ${formatDate(proj.createdAt)}</div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
        ${renderCreateProjectModal()}
    `;
}

function renderCreateProjectModal() {
    return `
        <dialog id="create-project-modal" style="padding: 0; border: none; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            <div style="padding: 24px; width: 400px;">
                <h3 style="margin-top: 0;">Create Project</h3>
                <div class="input-group">
                    <label class="input-label">Project Name</label>
                    <input type="text" class="input" id="new-project-name" placeholder="e.g. Kitchen Renovation">
                </div>
                <div class="input-group">
                    <label class="input-label">Budget (€)</label>
                    <input type="number" class="input" id="new-project-budget" placeholder="5000">
                </div>
                <div class="input-group">
                    <label class="input-label">Description</label>
                    <textarea class="input" id="new-project-desc" rows="3"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                    <button class="btn btn-ghost" onclick="document.getElementById('create-project-modal').close()">Cancel</button>
                    <button class="btn btn-primary" onclick="handleCreateProject()">Create</button>
                </div>
            </div>
        </dialog>
    `;
}

function showCreateProjectModal() {
    document.getElementById('create-project-modal').showModal();
}

function handleCreateProject() {
    const name = document.getElementById('new-project-name').value;
    const budget = parseFloat(document.getElementById('new-project-budget').value) || 0;
    const desc = document.getElementById('new-project-desc').value;

    if (!name) return alert('Project name is required');

    const newProject = {
        id: 'proj_' + Date.now(),
        name,
        budget,
        description: desc,
        createdAt: new Date().toISOString()
    };

    if (!AppState.currentUser.projects) AppState.currentUser.projects = [];
    AppState.currentUser.projects.push(newProject);
    saveToLocalStorage('currentUser', AppState.currentUser); // Should ideally update USERS array too but local state for prototype

    document.getElementById('create-project-modal').close();
    renderCurrentPage();
}

function deleteProject(id) {
    if (confirm('Delete this project?')) {
        AppState.currentUser.projects = AppState.currentUser.projects.filter(p => p.id !== id);
        saveToLocalStorage('currentUser', AppState.currentUser);
        renderCurrentPage();
    }
}


function renderWatchlistTab(watchlist) {
    if (!watchlist || watchlist.length === 0) {
        return `
            <div class="card text-center" style="padding: 64px;">
                <h3>Your Watchlist is empty</h3>
                <p>Save items you're interested in while browsing.</p>
                <button class="btn btn-primary mt-4" onclick="navigate('browse')">Browse Materials</button>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style="gap: 24px;">
            ${watchlist.map(product => `
                <div class="product-card" onclick="navigate('product-detail', '${product.id}')">
                    <img src="${getPlaceholderImage(product.id, product.category)}" class="product-card-image" />
                    <div class="product-card-body">
                        <h4>${product.title}</h4>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                            <span style="font-weight: bold;">${formatPrice(product.price)}</span>
                             <button class="btn btn-sm btn-ghost" style="color: var(--color-error);" 
                                    onclick="event.stopPropagation(); removeFromWatchlist('${product.id}')">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function removeFromWatchlist(id) {
    if (!AppState.currentUser.watchlist) return;
    AppState.currentUser.watchlist = AppState.currentUser.watchlist.filter(pid => pid !== id);
    saveToLocalStorage('currentUser', AppState.currentUser);
    renderCurrentPage();
}


function renderMessagesTab() {
    const thread = CONVERSATIONS[0]; // Mock showing first thread
    if (!thread) return '<div class="card p-8">No messages yet.</div>';

    // Mock messages view
    return `
        <div style="display: grid; grid-template-columns: 300px 1fr; gap: 24px; height: 600px;">
            <!-- Thread List -->
            <div class="card" style="padding: 0; overflow-y: auto;">
                <div style="padding: 16px; border-bottom: 1px solid #eee; font-weight: bold;">Inbox</div>
                ${['Seller A', 'Seller B'].map((s, i) => `
                    <div style="padding: 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer; background: ${i === 0 ? '#fafafa' : 'white'}; border-left: 3px solid ${i === 0 ? 'var(--color-primary)' : 'transparent'};">
                        <div style="font-weight: 600;">${s}</div>
                        <div class="text-sm text-tertiary" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Regarding your order #123...</div>
                    </div>
                `).join('')}
            </div>

            <!-- Thread View -->
            <div class="card" style="display: flex; flex-direction: column;">
                <div style="padding-bottom: 16px; border-bottom: 1px solid #eee; margin-bottom: 16px;">
                    <h3 style="margin: 0;">Conversation with Seller A</h3>
                    <p class="text-sm text-tertiary">Regarding Product: Oak Flooring Batch #4</p>
                </div>
                
                <div style="flex: 1; overflow-y: auto; padding: 16px; background: #fafafa; border-radius: 8px; margin-bottom: 16px;">
                    <!-- Mock Chat Bubbles -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
                        <div style="background: var(--color-primary); color: white; padding: 12px 16px; border-radius: 12px 12px 0 12px; max-width: 70%;">
                            Is this still available for pickup this weekend?
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-start; margin-bottom: 12px;">
                        <div style="background: white; border: 1px solid #eee; padding: 12px 16px; border-radius: 12px 12px 12px 0; max-width: 70%;">
                            Yes, Saturday morning works best for us.
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 12px;">
                    <input type="text" class="input" placeholder="Type a message..." style="flex: 1;">
                    <button class="btn btn-primary" onclick="alert('Message sent (Mock)')">Send</button>
                </div>
            </div>
        </div>
    `;
}

function renderProfileTab(user) {
    return `
        <div class="card" style="max-width: 600px; margin: 0 auto;">
            <div style="display: flex; gap: 24px; align-items: center; margin-bottom: 32px; border-bottom: 1px solid #f0f0f0; padding-bottom: 24px;">
                <div style="width: 80px; height: 80px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: white;">
                    ${user.name[0]}
                </div>
                <div>
                    <h2 style="margin: 0; font-size: 1.5rem;">${user.name}</h2>
                    <p class="text-tertiary">${user.email}</p>
                    <span class="badge badge-${user.isVerified ? 'success' : 'warning'}">
                        ${user.isVerified ? 'Verified Account' : 'Unverified'}
                    </span>
                </div>
            </div>

            <div class="input-group">
                <label class="input-label">Full Name</label>
                <input type="text" class="input" value="${user.name}">
            </div>
            
            <div class="input-group">
                <label class="input-label">Email Address</label>
                <input type="email" class="input" value="${user.email}" disabled style="background: #fafafa;">
                <p class="text-xs text-tertiary mt-1">Contact support to change email</p>
            </div>

            <div class="input-group">
                <label class="input-label">Phone</label>
                <input type="tel" class="input" value="+49 123 456789">
            </div>

            ${user.isSeller ? `
                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0;">
                    <h3>Seller Profile</h3>
                    <div class="input-group">
                        <label class="input-label">Business Name</label>
                        <input type="text" class="input" value="${user.businessName || ''}">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Pickup Address</label>
                        <input type="text" class="input" value="${user.defaultPickupAddress || ''}">
                    </div>
                </div>
            ` : ''}

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
                <button class="btn btn-ghost">Cancel</button>
                <button class="btn btn-primary" onclick="showNotification('Profile updated!', 'success')">Save Changes</button>
            </div>
        </div>
    `;
}
