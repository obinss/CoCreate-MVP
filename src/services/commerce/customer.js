/* ============================================
   CoCreate Platform - Customer Service
   ============================================ */

(function () {
    const CustomerService = {
        getById(id) {
            return (window.USERS || []).find(u => u.id === id);
        },

        getCurrentUser() {
            return window.AppState ? window.AppState.currentUser : null;
        },

        getAll() {
            return window.USERS || [];
        }
    };

    window.CustomerService = CustomerService;
})();
