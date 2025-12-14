/* ============================================
   CoCreate Platform - Customer Service
   ============================================ */

(function () {
    const CustomerService = {
        async getCurrentUser() {
            try {
                return await window.API.auth.getCurrentUser();
            } catch (error) {
                console.error('Error fetching current user:', error);
                return null;
            }
        },

        async getById(id) {
            try {
                return await window.API.users.getById(id);
            } catch (error) {
                console.error('Error fetching user:', error);
                return null;
            }
        },

        async getAll() {
            try {
                return await window.API.users.getAll();
            } catch (error) {
                console.error('Error fetching users:', error);
                return [];
            }
        },

        async login(username, password) {
            try {
                return await window.API.auth.login(username, password);
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },

        async register(userData) {
            try {
                return await window.API.auth.register(userData);
            } catch (error) {
                console.error('Registration error:', error);
                throw error;
            }
        },

        async logout() {
            try {
                await window.API.auth.logout();
            } catch (error) {
                console.error('Logout error:', error);
            }
        },

        async updateProfile(userData) {
            try {
                return await window.API.users.updateProfile(userData);
            } catch (error) {
                console.error('Error updating profile:', error);
                throw error;
            }
        },

        async applySeller(sellerData) {
            try {
                return await window.API.users.applySeller(sellerData);
            } catch (error) {
                console.error('Error applying for seller:', error);
                throw error;
            }
        },

        isAuthenticated() {
            return window.API.utils.isAuthenticated();
        }
    };

    // Expose to global scope
    window.CustomerService = CustomerService;
})();
