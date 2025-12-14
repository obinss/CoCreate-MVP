/* ============================================
   CoCreate Platform - Orders Service
   ============================================ */

(function () {
    const OrdersService = {
        async getAll() {
            try {
                const response = await window.API.orders.getAll();
                return response.results || response;
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Fallback to mock data
                return window.ORDERS || [];
            }
        },

        async getById(id) {
            try {
                return await window.API.orders.getById(id);
            } catch (error) {
                console.error('Error fetching order:', error);
                return (window.ORDERS || []).find(o => o.id === id);
            }
        },

        async getByBuyer(buyerId) {
            try {
                const orders = await this.getAll();
                return orders.filter(o => o.buyer === buyerId);
            } catch (error) {
                console.error('Error fetching buyer orders:', error);
                return [];
            }
        },

        async create(orderData) {
            try {
                return await window.API.orders.create(orderData);
            } catch (error) {
                console.error('Error creating order:', error);
                throw error;
            }
        },

        // Helper to create order from cart
        async createFromCart(sellerId, deliveryMethod = 'carrier') {
            try {
                const cart = await window.CartService.getCart();

                if (!cart.items || cart.items.length === 0) {
                    throw new Error('Cart is empty');
                }

                // Build order items from cart
                const items = cart.items.map(item => ({
                    product_id: item.product,
                    quantity: item.quantity
                }));

                return await this.create({
                    seller: sellerId,
                    delivery_method: deliveryMethod,
                    items: items
                });
            } catch (error) {
                console.error('Error creating order from cart:', error);
                throw error;
            }
        }
    };

    // Expose to global scope
    window.OrdersService = OrdersService;
})();
