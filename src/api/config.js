/* ============================================
   CoCreate Platform - API Configuration
   ============================================ */

(function () {
    // API Configuration
    const API_CONFIG = {
        BASE_URL: 'http://127.0.0.1:8001/api',
        TIMEOUT: 10000,
        HEADERS: {
            'Content-Type': 'application/json',
        }
    };

    // Auth token management
    const AuthManager = {
        getToken() {
            return localStorage.getItem('auth_token');
        },

        setToken(token) {
            localStorage.setItem('auth_token', token);
        },

        clearToken() {
            localStorage.removeItem('auth_token');
        },

        getAuthHeaders() {
            const token = this.getToken();
            if (token) {
                return {
                    ...API_CONFIG.HEADERS,
                    'Authorization': `Token ${token}`
                };
            }
            return API_CONFIG.HEADERS;
        }
    };

    // HTTP Client
    const HttpClient = {
        async request(url, options = {}) {
            const config = {
                ...options,
                headers: {
                    ...API_CONFIG.HEADERS,
                    ...AuthManager.getAuthHeaders(),
                    ...(options.headers || {})
                }
            };

            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, config);

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
                }

                // Handle empty responses
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }
                return null;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },

        async get(url, params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;
            return this.request(fullUrl, { method: 'GET' });
        },

        async post(url, data) {
            return this.request(url, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        async put(url, data) {
            return this.request(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        async patch(url, data) {
            return this.request(url, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        },

        async delete(url) {
            return this.request(url, { method: 'DELETE' });
        }
    };

    // Main API Object
    const API = {
        // Auth
        auth: {
            async login(username, password) {
                const response = await HttpClient.post('/users/login/', { username, password });
                if (response.token) {
                    AuthManager.setToken(response.token);
                }
                return response;
            },

            async register(userData) {
                const response = await HttpClient.post('/users/', userData);
                if (response.token) {
                    AuthManager.setToken(response.token);
                }
                return response;
            },

            async logout() {
                await HttpClient.post('/users/logout/');
                AuthManager.clearToken();
            },

            async getCurrentUser() {
                return HttpClient.get('/users/me/');
            },

            isAuthenticated() {
                return !!AuthManager.getToken();
            }
        },

        // Products
        products: {
            async getAll(params = {}) {
                return HttpClient.get('/products/', params);
            },

            async getById(id) {
                return HttpClient.get(`/products/${id}/`);
            },

            async getBySeller(sellerId) {
                return HttpClient.get('/products/', { seller: sellerId });
            },

            async getByCategory(categoryId) {
                return HttpClient.get('/products/', { category: categoryId });
            },

            async create(productData) {
                return HttpClient.post('/products/', productData);
            },

            async update(id, productData) {
                return HttpClient.patch(`/products/${id}/`, productData);
            },

            async delete(id) {
                return HttpClient.delete(`/products/${id}/`);
            },

            async incrementViews(id) {
                return HttpClient.post(`/products/${id}/increment_views/`);
            }
        },

        // Categories
        categories: {
            async getAll() {
                return HttpClient.get('/categories/');
            },

            async getById(id) {
                return HttpClient.get(`/categories/${id}/`);
            }
        },

        // Cart
        cart: {
            async get() {
                return HttpClient.get('/cart/');
            },

            async addItem(productId, quantity = 1) {
                return HttpClient.post('/cart/add_item/', { product_id: productId, quantity });
            },

            async updateItem(productId, quantity) {
                return HttpClient.post('/cart/update_item/', { product_id: productId, quantity });
            },

            async removeItem(productId) {
                return HttpClient.post('/cart/remove_item/', { product_id: productId });
            },

            async clear() {
                return HttpClient.post('/cart/clear/');
            }
        },

        // Wishlist
        wishlist: {
            async getAll() {
                return HttpClient.get('/wishlist/');
            },

            async toggle(productId) {
                return HttpClient.post('/wishlist/toggle/', { product_id: productId });
            },

            async add(productId) {
                return HttpClient.post('/wishlist/', { product: productId });
            },

            async remove(id) {
                return HttpClient.delete(`/wishlist/${id}/`);
            }
        },

        // Orders
        orders: {
            async getAll() {
                return HttpClient.get('/orders/');
            },

            async getById(id) {
                return HttpClient.get(`/orders/${id}/`);
            },

            async create(orderData) {
                return HttpClient.post('/orders/', orderData);
            }
        },

        // Users
        users: {
            async updateProfile(userData) {
                return HttpClient.put('/users/update_profile/', userData);
            },

            async applySeller(sellerData) {
                return HttpClient.post('/users/apply_seller/', sellerData);
            },

            async getPendingSellers() {
                return HttpClient.get('/users/pending_sellers/');
            },

            async verifySeller(userId, approved) {
                return HttpClient.post('/users/verify_seller/', { user_id: userId, approved });
            }
        },

        // Utilities
        utils: {
            getAuthToken: () => AuthManager.getToken(),
            setAuthToken: (token) => AuthManager.setToken(token),
            clearAuthToken: () => AuthManager.clearToken(),
            isAuthenticated: () => !!AuthManager.getToken()
        }
    };

    // Expose to global scope
    window.API = API;
    window.API_CONFIG = API_CONFIG;
})();
