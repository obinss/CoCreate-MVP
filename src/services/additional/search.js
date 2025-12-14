/* ============================================
   CoCreate Platform - Search Service
   ============================================ */

(function () {
    const SearchService = {
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
         * @param {Array} items - Array of items to search
         * @param {Object} filters - Optional filters
         * @returns {Array} - Ranked and filtered results
         */
        search(query, items, filters = {}) {
            if (!query && Object.keys(filters).length === 0) {
                return items;
            }

            const normalizedQuery = query ? query.toLowerCase().trim() : '';
            let results = items;

            // 1. Apply Hard Filters
            results = this.applyFilters(results, filters);

            // 2. Perform Text Search & Ranking if query exists
            if (normalizedQuery) {
                results = results.map(item => {
                    const score = this.calculateRelevance(item, normalizedQuery);
                    return { ...item, searchScore: score };
                })
                    .filter(item => item.searchScore > 0)
                    .sort((a, b) => b.searchScore - a.searchScore);
            }

            return results.slice(0, this.options.maxResults);
        },

        /**
         * Apply property-based filters
         */
        applyFilters(items, filters) {
            return items.filter(item => {
                // Category filter
                if (filters.category && filters.category !== 'All Categories' && item.category !== filters.category) {
                    return false;
                }

                // Price filters
                if (filters.minPrice && item.price < parseFloat(filters.minPrice)) return false;
                if (filters.maxPrice && item.price > parseFloat(filters.maxPrice)) return false;

                // Location filter
                if (filters.location && !item.locationName.toLowerCase().includes(filters.location.toLowerCase())) {
                    return false;
                }

                // Condition filter
                if (filters.condition && item.condition !== filters.condition) return false;

                return true;
            });
        },

        /**
         * Calculate relevance score
         */
        calculateRelevance(item, query) {
            let score = 0;
            const tokens = query.split(/\s+/);

            // Fields to search (check if they exist on the item)
            // Use empty string fallback
            const title = (item.title || '').toLowerCase();
            const description = (item.description || '').toLowerCase();
            const category = (item.category || '').toLowerCase();

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
            if (!query || !text) return text;
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

    // Expose to global scope
    window.SearchService = SearchService;
})();
