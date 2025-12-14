/* ============================================
   CoCreate Platform - Product Service (Commerce)
   ============================================ */

(function () {
    const ProductService = {

        getAll() {
            return window.PRODUCTS || [];
        },

        getById(id) {
            return (window.PRODUCTS || []).find(p => p.id === id);
        },

        getBySeller(sellerId) {
            return (window.PRODUCTS || []).filter(p => p.sellerId === sellerId);
        },

        getByCategory(category) {
            return (window.PRODUCTS || []).filter(p => p.category === category);
        },

        // New method to abstract the formatting
        formatPrice(price) {
            return window.formatPrice ? window.formatPrice(price) : `€${price}`;
        },

        getPlaceholderImage(id, category) {
            return window.getPlaceholderImage ? window.getPlaceholderImage(id, category) : '';
        }
    };

    // Expose to global scope
    window.ProductService = ProductService;
})();
