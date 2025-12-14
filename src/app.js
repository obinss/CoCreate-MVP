/* ============================================
   CoCreate Platform - Main Application Entry
   ============================================ */

// Global state initialization
window.currentPage = 'home'; // Legacy support just in case
window.currentProductId = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AppState from localStorage
    if (typeof initializeAppState === 'function') {
        initializeAppState();
    }

    // Update badge if cart has items
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }

    console.log('CoCreate Platform Loaded');

    // Show onboarding for first-time visitors
    if (typeof OnboardingFlow !== 'undefined') {
        OnboardingFlow.show();
    }
});
