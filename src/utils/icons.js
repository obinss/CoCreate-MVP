/* ============================================
   CoCreate Platform - Icon Utility
   Centralized icon management using Font Awesome
   ============================================ */

/**
 * Get Font Awesome icon HTML for a category
 * @param {string} category - Category name
 * @returns {string} HTML string with icon element
 */
function getCategoryIcon(category) {
    const iconMap = {
        'Wood': 'fa-tree',
        'Metal': 'fa-screwdriver-wrench',
        'Masonry': 'fa-building',
        'Electrical': 'fa-bolt',
        'Plumbing': 'fa-faucet',
        'Insulation': 'fa-house',
        'Flooring': 'fa-square',
        'Roofing': 'fa-hammer',
        'Paint & Coating': 'fa-paint-roller',
        'Doors & Windows': 'fa-door-open',
        'Hardware': 'fa-wrench',
        'Concrete': 'fa-hammer'
    };

    const iconClass = iconMap[category] || 'fa-box';
    return `<i class="fas ${iconClass}"></i>`;
}

/**
 * Common UI icons
 */
const ICONS = {
    // Location & Map
    location: '<i class="fas fa-map-marker-alt"></i>',
    mapPin: '<i class="fas fa-location-dot"></i>',

    // Communication
    message: '<i class="fas fa-comment"></i>',
    chat: '<i class="fas fa-comments"></i>',
    envelope: '<i class="fas fa-envelope"></i>',

    // Security
    lock: '<i class="fas fa-lock"></i>',
    shield: '<i class="fas fa-shield-alt"></i>',
    secure: '<i class="fas fa-shield-halved"></i>',

    // E-commerce
    cart: '<i class="fas fa-shopping-cart"></i>',
    box: '<i class="fas fa-box"></i>',
    package: '<i class="fas fa-boxes"></i>',

    // Environmental
    leaf: '<i class="fas fa-leaf"></i>',
    recycle: '<i class="fas fa-recycle"></i>',
    seedling: '<i class="fas fa-seedling"></i>',

    // User & Account
    user: '<i class="fas fa-user"></i>',
    users: '<i class="fas fa-users"></i>',
    profile: '<i class="fas fa-user-circle"></i>',

    // Actions
    search: '<i class="fas fa-magnifying-glass"></i>',
    filter: '<i class="fas fa-filter"></i>',
    heart: '<i class="fas fa-heart"></i>',
    heartOutline: '<i class="far fa-heart"></i>',

    // Status
    check: '<i class="fas fa-check"></i>',
    close: '<i class="fas fa-times"></i>',
    info: '<i class="fas fa-info-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',

    // Navigation
    chevronRight: '<i class="fas fa-chevron-right"></i>',
    chevronLeft: '<i class="fas fa-chevron-left"></i>',
    chevronDown: '<i class="fas fa-chevron-down"></i>',
    arrowRight: '<i class="fas fa-arrow-right"></i>',

    // Tools & Construction
    hammer: '<i class="fas fa-hammer"></i>',
    tools: '<i class="fas fa-toolbox"></i>',
    wrench: '<i class="fas fa-wrench"></i>',

    // Other
    star: '<i class="fas fa-star"></i>',
    starOutline: '<i class="far fa-star"></i>',
    clock: '<i class="fas fa-clock"></i>',
    calendar: '<i class="fas fa-calendar"></i>',
};
