/* ============================================
   CoCreate Platform - Orders Service
   ============================================ */

(function () {
    const OrdersService = {
        getAll() {
            return window.ORDERS || [];
        },

        getById(id) {
            return (window.ORDERS || []).find(o => o.id === id);
        },

        getByBuyer(buyerId) {
            return (window.ORDERS || []).filter(o => o.buyerId === buyerId);
        }
    };

    window.OrdersService = OrdersService;
})();
