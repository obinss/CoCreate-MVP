/* ============================================
   CoCreate Platform - Product Service (Commerce)
   ============================================ */

(function () {
    const ProductService = {
        async getAll(filters = {}) {
            try {
                const response = await window.API.products.getAll(filters);
                // Handle paginated response
                return response.results || response;
            } catch (error) {
                console.error('Error fetching products:', error);
                // Fallback to mock data if API fails
                return window.PRODUCTS || [];
            }
        },

        async getById(id) {
            try {
                return await window.API.products.getById(id);
            } catch (error) {
                console.error('Error fetching product:', error);
                // Fallback to mock data
                return (window.PRODUCTS || []).find(p => p.id === id);
            }
        },

        async getBySeller(sellerId) {
            try {
                const response = await window.API.products.getBySeller(sellerId);
                return response.results || response;
            } catch (error) {
                console.error('Error fetching seller products:', error);
                return (window.PRODUCTS || []).filter(p => p.sellerId === sellerId);
            }
        },

        async getByCategory(category) {
            try {
                const response = await window.API.products.getByCategory(category);
                return response.results || response;
            } catch (error) {
                console.error('Error fetching category products:', error);
                return (window.PRODUCTS || []).filter(p => p.category === category);
            }
        },

        async create(productData) {
            try {
                return await window.API.products.create(productData);
            } catch (error) {
                console.error('Error creating product:', error);
                throw error;
            }
        },

        async update(id, productData) {
            try {
                return await window.API.products.update(id, productData);
            } catch (error) {
                console.error('Error updating product:', error);
                throw error;
            }
        },

        async delete(id) {
            try {
                await window.API.products.delete(id);
            } catch (error) {
                console.error('Error deleting product:', error);
                throw error;
            }
        },

        async incrementViews(id) {
            try {
                await window.API.products.incrementViews(id);
            } catch (error) {
                console.error('Error incrementing views:', error);
            }
        },

        // Helper methods
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
