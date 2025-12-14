/* ============================================
   CoCreate Platform - API Layer
   ============================================ */

(function () {
    const API = {
        // Commerce Services
        products: {
            getAll: () => window.ProductService.getAll(),
            getById: (id) => window.ProductService.getById(id),
            getBySeller: (sellerId) => window.ProductService.getBySeller(sellerId),
            getByCategory: (category) => window.ProductService.getByCategory(category)
        },
        customer: {
            getById: (id) => window.CustomerService.getById(id),
            getCurrent: () => window.CustomerService.getCurrentUser(),
            getAll: () => window.CustomerService.getAll()
        },
        orders: {
            getAll: () => window.OrdersService.getAll(),
            getById: (id) => window.OrdersService.getById(id),
            getByBuyer: (id) => window.OrdersService.getByBuyer(id)
        },

        // Additional Services
        search: {
            find: (query, items, filters) => window.SearchService.search(query, items, filters),
            highlight: (text, query) => window.SearchService.highlightTerms(text, query),
            saveRecent: (query) => window.SearchService.saveRecentSearch(query),
            getRecent: () => window.SearchService.getRecentSearches()
        },

        // Helper to expose other services as they are built
        cms: {},
        customer: {},
        business: {}
    };

    window.API = API;
})();
