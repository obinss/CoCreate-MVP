/* ============================================
   CoCreate Platform - Advanced Search Engine
   ============================================ */

const SearchEngine = {
    // Configuration
    options: {
        fuzzyThreshold: 3, // Max edit distance
        weights: {
            title: 10,
            category: 5,
            description: 2,
            keywords: 8
        },
        maxResults: 20
    },

    /**
     * Main search function
     * @param {string} query - The search query
     * @param {Array} products - Array of product objects
     * @param {Object} filters - Optional filters (minPrice, maxPrice, category, etc.)
     * @returns {Array} - Ranked and filtered results
     */
    search(query, products, filters = {}) {
        if (!query && Object.keys(filters).length === 0) {
            return products;
        }

        const normalizedQuery = query ? query.toLowerCase().trim() : '';
        let results = products;

        // 1. Apply Hard Filters
        results = this.applyFilters(results, filters);

        // 2. Perform Text Search & Ranking if query exists
        if (normalizedQuery) {
            results = results.map(product => {
                const score = this.calculateRelevance(product, normalizedQuery);
                return { ...product, searchScore: score };
            })
                .filter(product => product.searchScore > 0)
                .sort((a, b) => b.searchScore - a.searchScore);
        }

        return results.slice(0, this.options.maxResults);
    },

    /**
     * Apply property-based filters (price, category, location)
     */
    applyFilters(products, filters) {
        return products.filter(product => {
            // Category filter
            if (filters.category && filters.category !== 'All Categories' && product.category !== filters.category) {
                return false;
            }

            // Price filters
            if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
            if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;

            // Location filter
            if (filters.location && !product.locationName.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Condition filter
            if (filters.condition && product.condition !== filters.condition) return false;

            return true;
        });
    },

    /**
     * Calculate relevance score based on weighted fields and fuzzy matching
     */
    calculateRelevance(product, query) {
        let score = 0;
        const tokens = query.split(/\s+/);

        // Fields to search
        const title = product.title.toLowerCase();
        const description = product.description.toLowerCase();
        const category = product.category.toLowerCase();

        tokens.forEach(token => {
            // Exact Matches
            if (title.includes(token)) score += this.options.weights.title;
            if (category.includes(token)) score += this.options.weights.category;
            if (description.includes(token)) score += this.options.weights.description;

            // Fuzzy Matches (if no exact match found in title)
            if (!title.includes(token)) {
                if (this.levensteinDistance(token, title) <= this.options.fuzzyThreshold) {
                    score += this.options.weights.title * 0.5; // Partial credit
                }
            }
        });

        return score;
    },

    /**
     * Highlight matching terms in text
     */
    highlightTerms(text, query) {
        if (!query) return text;
        const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
        if (tokens.length === 0) return text;

        let highlighted = text;
        tokens.forEach(token => {
            const regex = new RegExp(`(${token})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark class="highlight">$1</mark>');
        });
        return highlighted;
    },

    /**
     * Simple Levenshtein distance for fuzzy matching
     */
    levensteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1  // deletion
                        )
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    },

    // Recent Searches Management
    saveRecentSearch(query) {
        if (!query) return;
        let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (!recent.includes(query)) {
            recent.unshift(query);
            recent = recent.slice(0, 5); // Keep last 5
            localStorage.setItem('recentSearches', JSON.stringify(recent));
        }
    },

    getRecentSearches() {
        return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    }
};

window.SearchEngine = SearchEngine;
