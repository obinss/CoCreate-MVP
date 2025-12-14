/* ============================================
   CoCreate Platform - Cart Service
   ============================================ */

(function () {
    const CartService = {
        async getCart() {
            try {
                return await window.API.cart.get();
            } catch (error) {
                console.error('Error getting cart:', error);
                return { items: [], total_items: 0, subtotal: '0.00' };
            }
        },

        async addToCart(productId, quantity = 1) {
            try {
                return await window.API.cart.addItem(productId, quantity);
            } catch (error) {
                console.error('Error adding to cart:', error);
                throw error;
            }
        },

        async updateQuantity(productId, quantity) {
            try {
                return await window.API.cart.updateItem(productId, quantity);
            } catch (error) {
                console.error('Error updating cart item:', error);
                throw error;
            }
        },

        async removeFromCart(productId) {
            try {
                return await window.API.cart.removeItem(productId);
            } catch (error) {
                console.error('Error removing from cart:', error);
                throw error;
            }
        },

        async clearCart() {
            try {
                return await window.API.cart.clear();
            } catch (error) {
                console.error('Error clearing cart:', error);
                throw error;
            }
        },

        async getItemCount() {
            try {
                const cart = await this.getCart();
                return cart.total_items || 0;
            } catch (error) {
                console.error('Error getting cart item count:', error);
                return 0;
            }
        }
    };

    // Expose to global scope
    window.CartService = CartService;
})();
