/* ============================================
   CoCreate Platform - Navbar Component
   ============================================ */

function renderNavbar() {
    const isAuth = isAuthenticated();
    const user = AppState.currentUser;
    const cartCount = getCartItemCount();

    return `
        <nav class="navbar">
            <div class="container navbar-container">
                <!-- Logo -->
                <a href="#" class="navbar-logo" onclick="navigate('home'); return false;">
                    <div class="navbar-logo-icon">CC</div>
                    <span>CoCreate</span>
                </a>

                <!-- Search Bar (Desktop) -->
                <div class="navbar-search">
                    <div class="input-group" style="margin-bottom: 0;">
                        <input 
                            type="text" 
                            class="input" 
                            placeholder="Search for materials..."
                            id="navbar-search-input"
                            onkeyup="handleNavbarSearch(event)"
                        />
                    </div>
                </div>

                <!-- Mobile Hamburger -->
                <button class="navbar-hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <!-- Navigation Menu -->
                <ul class="navbar-menu" id="navbar-menu">
                    <li>
                        <a href="#" class="navbar-link ${window.currentPage === 'browse' ? 'active' : ''}" 
                           onclick="navigate('browse'); return false;">
                            Browse
                        </a>
                    </li>
                    ${isAuth ? `
                        ${user.role === 'buyer' || user.role === 'seller' || user.role === 'admin' ? `
                            <li>
                                <a href="#" class="navbar-link ${window.currentPage === 'buyer-dashboard' ? 'active' : ''}" 
                                   onclick="navigate('buyer-dashboard'); return false;">
                                    My Orders
                                </a>
                            </li>
                        ` : ''}
                        ${(user.role === 'seller' || (user.isSeller && user.verificationStatus === 'approved')) || user.role === 'admin' ? `
                            <li>
                                <a href="#" class="navbar-link ${window.currentPage === 'seller-dashboard' ? 'active' : ''}" 
                                   onclick="navigate('seller-dashboard'); return false;">
                                    ${user.role === 'admin' ? 'Seller View' : 'Dashboard'}
                                </a>
                            </li>
                        ` : ''}
                        ${user.role === 'admin' ? `
                            <li>
                                <a href="#" class="navbar-link ${window.currentPage === 'admin-dashboard' ? 'active' : ''}" 
                                   onclick="navigate('admin-dashboard'); return false;">
                                    Admin
                                </a>
                            </li>
                        ` : ''}
                        <li>
                            <a href="#" class="navbar-link ${window.currentPage === 'messages' ? 'active' : ''}" 
                               onclick="navigate('messages'); return false;">
                                Messages
                            </a>
                        </li>
                        <li style="position: relative;">
                            <a href="#" class="navbar-link ${window.currentPage === 'cart' ? 'active' : ''}" 
                               onclick="navigate('cart'); return false;">
                                Cart
                                <span id="cart-badge" class="badge badge-primary" 
                                      style="display: ${cartCount > 0 ? 'flex' : 'none'}; 
                                             position: absolute; 
                                             top: -8px; 
                                             right: -8px; 
                                             min-width: 20px; 
                                             height: 20px; 
                                             justify-content: center; 
                                             align-items: center; 
                                             padding: 2px 6px;">
                                    ${cartCount}
                                </span>
                            </a>
                        </li>
                        <li style="position: relative;">
                            <button class="btn btn-ghost" onclick="toggleUserMenu(); return false;" style="white-space: nowrap;">
                                ${user.name}
                            </button>
                            <div class="dropdown-menu" id="user-menu" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; min-width: 200px; background: white; border-radius: var(--radius-md); box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 1000; padding: 8px 0;">
                                <a href="#" class="dropdown-item" onclick="navigate('profile'); return false;" style="display: block; padding: 12px 16px; color: var(--color-text); text-decoration: none; transition: background 0.2s;">
                                    Profile
                                </a>
                                ${user.role === 'buyer' && !user.isSeller ? `
                                    <div class="dropdown-divider" style="height: 1px; background: var(--color-background); margin: 8px 0;"></div>
                                    <a href="#" class="dropdown-item" onclick="navigate('seller-application'); return false;" style="display: block; padding: 12px 16px; color: var(--color-primary); text-decoration: none; font-weight: 600; transition: background 0.2s;">
                                        Request Seller Verification
                                    </a>
                                ` : ''}
                                <div class="dropdown-divider" style="height: 1px; background: var(--color-background); margin: 8px 0;"></div>
                                <a href="#" class="dropdown-item" onclick="logout(); return false;" style="display: block; padding: 12px 16px; color: var(--color-text); text-decoration: none; transition: background 0.2s;">
                                    Logout
                                </a>
                            </div>
                        </li>
                    ` : `
                        <li>
                            <a href="#" class="btn btn-outline btn-sm" 
                               onclick="navigate('login'); return false;">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="#" class="btn btn-primary btn-sm" 
                               onclick="navigate('signup'); return false;">
                                Sign Up
                            </a>
                        </li>
                    `}
                </ul>
            </div>
        </nav>
    `;
}

function toggleMobileMenu() {
    const menu = document.getElementById('navbar-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) {
        // Toggle between display none and block
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }
}

function handleNavbarSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        AppState.searchFilters = { search: query };
        navigate('browse');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
    const userMenu = document.getElementById('user-menu');
    if (userMenu && !event.target.closest('li[style*="position: relative"]') && !event.target.closest('#user-menu')) {
        userMenu.style.display = 'none';
    }
});
