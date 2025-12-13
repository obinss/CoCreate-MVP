/* ============================================
   CoCreate Platform - Main Application
   ============================================ */

// Global state initialization
window.currentPage = 'home';
window.currentProductId = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeAppState();
    updateCartBadge();
    renderCurrentPage();
});

// Main render function
function renderCurrentPage() {
    const app = document.getElementById('app');

    if (!app) {
        console.error('App container not found');
        return;
    }

    // Add notifications container if not exists
    if (!document.getElementById('notifications')) {
        const notifContainer = createElement('div', '');
        notifContainer.id = 'notifications';
        notifContainer.style.cssText = 'position: fixed; top: 88px; right: 24px; z-index: 9999; max-width: 400px;';
        document.body.appendChild(notifContainer);
    }

    // Render page structure
    let content = '';

    switch (window.currentPage) {
        case 'home':
            content = renderHomePage();
            break;
        case 'browse':
            content = renderBrowsePage();
            break;
        case 'product-detail':
            content = renderProductDetailPage();
            break;
        case 'login':
            content = renderLoginPage();
            break;
        case 'signup':
            content = renderSignupPage();
            break;
        case 'buyer-dashboard':
            content = renderBuyerDashboardPage();
            break;
        case 'seller-dashboard':
            content = renderSellerDashboardPage();
            break;
        case 'admin-dashboard':
            content = renderAdminDashboardPage();
            break;
        case 'cart':
            content = renderCartPage();
            break;
        case 'checkout':
            content = renderCheckoutPage();
            break;
        case 'messages':
            content = renderMessagesPage();
            break;
        case 'profile':
            content = renderProfilePage();
            break;
        case 'help':
            content = renderHelpPage();
            break;
        case 'terms':
            content = renderTermsPage();
            break;
        case 'privacy':
            content = renderPrivacyPage();
            break;
        default:
            content = renderHomePage();
    }

    app.innerHTML = renderNavbar() + content + renderFooter();

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Simple placeholder pages
function renderCartPage() {
    const cartItems = AppState.cart || [];
    const total = getCartTotal();

    if (cartItems.length === 0) {
        return `
            <div class="container section">
                <div class="card text-center" style="padding: 64px;">
                    <h2>Your cart is empty</h2>
                    <p>Add some materials to get started</p>
                    <button class="btn btn-primary mt-4" onclick="navigate('browse')">
                        Browse Materials
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Shopping Cart</h1>
            <div style="display: grid; grid-template-columns: 1fr 400px; gap: 32px;">
                <div>
                    ${cartItems.map(item => {
        const product = getProductById(item.productId);
        return `
                            <div class="card" style="margin-bottom: 16px;">
                                <div style="display: flex; gap: 24px;">
                                    <img src="${getPlaceholderImage(product.id, product.category)}" 
                                         style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-md);" />
                                    <div style="flex: 1;">
                                        <h3>${product.title}</h3>
                                        <p class="text-sm text-tertiary">${product.category}</p>
                                        <div style="margin-top: 16px;">
                                            <label>Quantity: </label>
                                            <input type="number" value="${item.quantity}" min="1" max="${product.quantity}" 
                                                   style="width: 80px; padding: 4px 8px; border: 1px solid var(--color-background); border-radius: 4px;" />
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="text-2xl font-bold" style="color: var(--color-primary);">
                                            ${formatPrice(product.price * item.quantity)}
                                        </div>
                                        <button class="btn btn-sm btn-ghost mt-2" onclick="removeFromCart('${product.id}'); renderCurrentPage();">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
                <div style="position: sticky; top: 88px;">
                    <div class="card">
                        <h3>Order Summary</h3>
                        <div style="margin: 24px 0;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                <span>Subtotal:</span>
                                <strong>${formatPrice(total)}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                <span>Delivery:</span>
                                <span>€25.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                <span>Tax (19%):</span>
                                <span>${formatPrice((total + 25) * 0.19)}</span>
                            </div>
                            <div style="border-top: 2px solid var(--color-background); padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 700;">
                                <span>Total:</span>
                                <span>${formatPrice((total + 25) * 1.19)}</span>
                            </div>
                        </div>
                        <button class="btn btn-primary" style="width: 100%;" onclick="navigate('checkout')">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCheckoutPage() {
    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Checkout</h1>
            <div class="card">
                <div class="alert alert-info">
                    <strong>Mock Checkout</strong><br/>
                    This is a frontend prototype. In production, this would integrate with Stripe for payment processing.
                </div>
                <button class="btn btn-primary mt-4" onclick="handleMockCheckout()">
                    Complete Order (Demo)
                </button>
            </div>
        </div>
        
        <script>
            function handleMockCheckout() {
                showNotification('Order placed successfully! (Demo)', 'success');
                AppState.cart = [];
                saveToLocalStorage('cart', []);
                setTimeout(() => navigate('buyer-dashboard'), 1500);
            }
        </script>
    `;
}

function renderMessagesPage() {
    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Messages</h1>
            <div class="card">
                <p class="text-center text-tertiary" style="padding: 64px;">
                    In-platform messaging interface would be implemented here.<br/>
                    Secure conversations linked to specific products and orders.
                </p>
            </div>
        </div>
    `;
}

function renderProfilePage() {
    const user = AppState.currentUser;
    if (!user) {
        navigate('login');
        return '';
    }

    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">My Profile</h1>
            <div class="card">
                <div style="display: flex; gap: 24px; align-items: center; margin-bottom: 32px;">
                    <div style="width: 80px; height: 80px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: white;">
                        ${user.name[0]}
                    </div>
                    <div>
                        <h2 style="margin: 0;">${user.name}</h2>
                        <p class="text-tertiary">${user.email}</p>
                        <span class="badge badge-${user.isVerified ? 'success' : 'warning'}">
                            ${user.isVerified ? '✓ Verified' : 'Not Verified'}
                        </span>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Full Name</label>
                    <input type="text" class="input" value="${user.name}" />
                </div>
                
                <div class="input-group">
                    <label class="input-label">Email</label>
                    <input type="email" class="input" value="${user.email}" disabled />
                </div>
                
                ${user.role === 'seller' ? `
                    <div class="input-group">
                        <label class="input-label">Business Name</label>
                        <input type="text" class="input" value="${user.businessName || ''}" />
                    </div>
                ` : ''}
                
                <button class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    `;
}

function renderHelpPage() {
    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Help Center</h1>
            <div class="card">
                <h3>Frequently Asked Questions</h3>
                <div style="margin-top: 24px;">
                    <details style="padding: 16px; border: 1px solid var(--color-background); border-radius: var(--radius-md); margin-bottom: 12px;">
                        <summary style="cursor: pointer; font-weight: 600;">How does the escrow system work?</summary>
                        <p style="margin-top: 12px;">Your payment is held securely until you confirm delivery of the materials. This protects both buyers and sellers.</p>
                    </details>
                    <details style="padding: 16px; border: 1px solid var(--color-background); border-radius: var(--radius-md); margin-bottom: 12px;">
                        <summary style="cursor: pointer; font-weight: 600;">How is delivery calculated?</summary>
                        <p style="margin-top: 12px;">Delivery costs are calculated based on weight, dimensions, and distance using integrated freight APIs.</p>
                    </details>
                    <details style="padding: 16px; border: 1px solid var(--color-background); border-radius: var(--radius-md);">
                        <summary style="cursor: pointer; font-weight: 600;">Can I become both a buyer and seller?</summary>
                        <p style="margin-top: 12px;">Yes! One account can be used for both buying and selling. Just complete the seller verification process.</p>
                    </details>
                </div>
            </div>
        </div>
    `;
}

function renderTermsPage() {
    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Terms of Service</h1>
            <div class="card">
                <p>Terms of Service content would be managed through the CMS in the admin panel.</p>
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using CoCreate, you accept and agree to be bound by these terms.</p>
                <h3>2. User Accounts</h3>
                <p>You are responsible for maintaining the security of your account...</p>
            </div>
        </div>
    `;
}

function renderPrivacyPage() {
    return `
        <div class="container section">
            <h1 style="margin-bottom: 32px;">Privacy Policy</h1>
            <div class="card">
                <p>Privacy Policy content would be managed through the CMS in the admin panel.</p>
                <h3>1. Information We Collect</h3>
                <p>We collect information you provide directly to us...</p>
                <h3>2. How We Use Your Information</h3>
                <p>We use the information we collect to operate and improve the platform...</p>
            </div>
        </div>
    `;
}
