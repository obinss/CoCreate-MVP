/* ============================================
   CoCreate Platform - Utility Functions
   ============================================ */

// DOM manipulation helpers
function createElement(tag, className, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Local Storage helpers
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// URL/Navigation helpers
function navigate(pageName, productId = null) {
    window.currentPage = pageName;
    if (productId) {
        window.currentProductId = productId;
    }
    renderCurrentPage();
}

function getURLParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Authentication helpers
function login(email, password) {
    // Mock login - find user by email
    const user = USERS.find(u => u.email === email);
    if (user) {
        AppState.currentUser = user;
        saveToLocalStorage('currentUser', user);
        return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('currentUser');
    navigate('home');
}

function isAuthenticated() {
    return AppState.currentUser !== null;
}

function requireAuth() {
    if (!isAuthenticated()) {
        navigate('login');
        return false;
    }
    return true;
}

// Product filtering
function filterProducts(filters = {}) {
    let filtered = [...PRODUCTS];

    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.condition && filters.condition !== 'all') {
        filtered = filtered.filter(p => p.condition === filters.condition);
    }

    if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );
    }

    if (filters.location && filters.radiusKm) {
        filtered = filtered.filter(p => {
            const distance = calculateDistance(
                filters.location.lat,
                filters.location.long,
                p.locationLat,
                p.locationLong
            );
            return distance <= filters.radiusKm;
        });
    }

    return filtered;
}

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;

    const existingItem = AppState.cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        AppState.cart.push({
            productId,
            quantity,
            addedAt: new Date().toISOString()
        });
    }

    saveToLocalStorage('cart', AppState.cart);
    updateCartBadge();
    showNotification('Added to cart', 'success');
    return true;
}

function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(item => item.productId !== productId);
    saveToLocalStorage('cart', AppState.cart);
    updateCartBadge();
}

function getCartTotal() {
    return AppState.cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product.price * item.quantity);
    }, 0);
}

function getCartItemCount() {
    return AppState.cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = createElement('div', `alert alert-${type} animate-slide-in`);
    notification.innerHTML = `
        <span>${message}</span>
        <button class="modal-close" onclick="this.parentElement.remove()">×</button>
    `;

    const container = document.getElementById('notifications');
    if (container) {
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

// Modal functions
function showModal(title, content, footerButtons = []) {
    const backdrop = createElement('div', 'modal-backdrop');

    const modal = createElement('div', 'modal');

    const header = createElement('div', 'modal-header');
    header.innerHTML = `
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="closeModal()">×</button>
    `;

    const body = createElement('div', 'modal-body');
    body.innerHTML = content;

    const footer = createElement('div', 'modal-footer');
    footerButtons.forEach(btn => {
        const button = createElement('button', `btn ${btn.className || 'btn-primary'}`);
        button.textContent = btn.text;
        button.onclick = btn.onClick;
        footer.appendChild(button);
    });

    modal.appendChild(header);
    modal.appendChild(body);
    if (footerButtons.length > 0) {
        modal.appendChild(footer);
    }

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.onclick = (e) => {
        if (e.target === backdrop) closeModal();
    };
}

function closeModal() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

// Image placeholder generator
function getPlaceholderImage(productId, category) {
    const colors = {
        'Wood': '#8B4513',
        'Metal': '#808080',
        'Masonry': '#D2691E',
        'Electrical': '#FFD700',
        'Plumbing': '#4169E1',
        'Insulation': '#F0E68C',
        'Flooring': '#CD853F',
        'Roofing': '#696969',
        'Paint & Coating': '#FF6347',
        'Doors & Windows': '#4682B4',
        'Hardware': '#A9A9A9',
        'Concrete': '#BEBEBE'
    };

    const color = colors[category] || '#999999';

    // Return a data URL with a colored rectangle and category name
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="${color}"/>
            <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${category}</text>
        </svg>
    `;

    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Date formatting
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize app state from localStorage
function initializeAppState() {
    const savedUser = getFromLocalStorage('currentUser');
    if (savedUser) {
        AppState.currentUser = savedUser;
    }

    const savedCart = getFromLocalStorage('cart');
    if (savedCart) {
        AppState.cart = savedCart;
    }

    const savedSearches = getFromLocalStorage('savedSearches');
    if (savedSearches) {
        AppState.savedSearches = savedSearches;
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
if (typeof window !== 'undefined') {
    window.createElement = createElement;
    window.clearElement = clearElement;
    window.saveToLocalStorage = saveToLocalStorage;
    window.getFromLocalStorage = getFromLocalStorage;
    window.navigate = navigate;
    window.getURLParam = getURLParam;
    window.login = login;
    window.logout = logout;
    window.isAuthenticated = isAuthenticated;
    window.requireAuth = requireAuth;
    window.filterProducts = filterProducts;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.getCartTotal = getCartTotal;
    window.getCartItemCount = getCartItemCount;
    window.updateCartBadge = updateCartBadge;
    window.showNotification = showNotification;
    window.showModal = showModal;
    window.closeModal = closeModal;
    window.getPlaceholderImage = getPlaceholderImage;
    window.validateEmail = validateEmail;
    window.validateRequired = validateRequired;
    window.formatDateTime = formatDateTime;
    window.initializeAppState = initializeAppState;
    window.debounce = debounce;
}
