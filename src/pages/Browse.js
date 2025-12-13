/* ============================================
   CoCreate Platform - Browse/Marketplace Page
   ============================================ */

function renderBrowsePage() {
    const filters = AppState.searchFilters || {};

    // Use SearchEngine if search term exists, otherwise fallback/mix
    let filteredProducts = SearchEngine.search(filters.search, PRODUCTS, filters);

    // Highlight terms if searching
    if (filters.search) {
        filteredProducts = filteredProducts.map(p => ({
            ...p,
            title: SearchEngine.highlightTerms(p.title, filters.search),
            description: SearchEngine.highlightTerms(p.description, filters.search)
        }));
    }

    return `
        <div class="container" style="margin-top: 32px; margin-bottom: 64px;">
            <!-- Active Filters Display -->
            ${renderActiveFilters(filters)}
            
            <div style="display: grid; grid-template-columns: 280px 1fr; gap: 32px;">
                <!-- Filter Sidebar -->
                <aside class="filter-sidebar">
                    ${renderFilterSidebar()}
                </aside>

                <!-- Product Grid -->
                <main>
                    <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">${filteredProducts.length} Materials Available</h2>
                        <select class="input" style="width: auto;" id="sort-select" onchange="handleSortChange(this.value)">
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="distance">Nearest First</option>
                        </select>
                    </div>

                    ${filteredProducts.length === 0 ? `
                        <div class="card text-center" style="padding: 64px;">
                            <h3>No materials found</h3>
                            <p>Try adjusting your filters or search criteria</p>
                            <button class="btn" style="background: #1a1a1a; color: white; margin-top: 16px;" onclick="AppState.searchFilters = {}; renderCurrentPage();">
                                Clear Filters
                            </button>
                        </div>
                    ` : `
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            ${filteredProducts.map(product => renderProductCard(product)).join('')}
                        </div>
                    `}
                </main>
            </div>
        </div>
    `;
}

function renderActiveFilters(filters) {
    const activeFilters = [];

    if (filters.category) {
        activeFilters.push({ key: 'category', label: `Category: ${filters.category}`, value: filters.category });
    }
    if (filters.condition) {
        activeFilters.push({ key: 'condition', label: `Condition: ${CONDITIONS[filters.condition].label}`, value: filters.condition });
    }
    if (filters.minPrice || filters.maxPrice) {
        const priceLabel = filters.minPrice && filters.maxPrice
            ? `Price: €${filters.minPrice}-€${filters.maxPrice}`
            : filters.minPrice
                ? `Price: €${filters.minPrice}+`
                : `Price: up to €${filters.maxPrice}`;
        activeFilters.push({ key: 'price', label: priceLabel });
    }
    if (filters.search) {
        activeFilters.push({ key: 'search', label: `Search: "${filters.search}"`, value: filters.search });
    }

    if (activeFilters.length === 0) {
        return '';
    }

    return `
        <div style="margin-bottom: 24px; padding: 16px 20px; background: #fafafa; border-radius: 12px; border: 1px solid #e8e8e8;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-size: 0.875rem; color: #666; font-weight: 500;">Active filters:</span>
                ${activeFilters.map(filter => `
                    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 0.875rem; color: #1a1a1a;">
                        ${filter.label}
                        <button onclick="removeFilter('${filter.key}'); return false;" 
                                style="background: none; border: none; color: #999; cursor: pointer; padding: 0; display: flex; align-items: center; font-size: 1.1rem; line-height: 1;"
                                onmouseenter="this.style.color='#1a1a1a';"
                                onmouseleave="this.style.color='#999';">
                            ×
                        </button>
                    </span>
                `).join('')}
                <button onclick="AppState.searchFilters = {}; renderCurrentPage();" 
                        style="font-size: 0.875rem; color: #A6375F; background: none; border: none; cursor: pointer; font-weight: 500; padding: 6px 8px;"
                        onmouseenter="this.style.textDecoration='underline';"
                        onmouseleave="this.style.textDecoration='none';">
                    Clear all
                </button>
            </div>
        </div>
    `;
}

function renderFilterSidebar() {
    const filters = AppState.searchFilters || {};
    const recentSearches = SearchEngine.getRecentSearches();

    return `
        <div class="card" style="position: sticky; top: 88px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0;">Filters</h3>
                <button class="btn btn-sm" style="background: transparent; color: #666;" onclick="clearFilters()">Clear All</button>
            </div>

            <!-- Search Input with Recent Suggestions -->
            <div class="input-group" style="position: relative;">
                <label class="input-label">Search</label>
                <input type="text" class="input" 
                       placeholder="Search materials..." 
                       value="${filters.search || ''}"
                       onchange="handleSearch(this.value)"
                       onfocus="document.getElementById('recent-searches-dropdown').style.display = '${recentSearches.length ? 'block' : 'none'}'"
                       onblur="setTimeout(() => document.getElementById('recent-searches-dropdown').style.display = 'none', 200)"
                       />
                
                <!-- Recent Searches Dropdown -->
                <div id="recent-searches-dropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e0e0e0; border-radius: 8px; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 8px 0;">
                    <div style="padding: 8px 16px; font-size: 0.75rem; color: #999; font-weight: 600; text-transform: uppercase;">Recent Searches</div>
                    ${recentSearches.map(term => `
                        <div class="dropdown-item" onclick="handleSearch('${term}')" style="padding: 8px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <span style="color: #999;">🕒</span> ${term}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Category -->
            <div class="input-group">
                <label class="input-label">Category</label>
                <select class="input" id="filter-category" onchange="updateFilters()">
                    <option value="all">All Categories</option>
                    ${CATEGORIES.map(cat => `
                        <option value="${cat}" ${filters.category === cat ? 'selected' : ''}>
                            ${cat}
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- Condition -->
            <div class="input-group">
                <label class="input-label">Condition</label>
                <select class="input" id="filter-condition" onchange="updateFilters()">
                    <option value="all">All Conditions</option>
                    ${Object.entries(CONDITIONS).map(([key, val]) => `
                        <option value="${key}" ${filters.condition === key ? 'selected' : ''}>
                            ${val.label}
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- Price Range -->
            <div class="input-group">
                <label class="input-label">Price Range (€)</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <input type="number" class="input" id="filter-min-price" 
                           placeholder="Min" value="${filters.minPrice || ''}" 
                           onchange="updateFilters()" />
                    <input type="number" class="input" id="filter-max-price" 
                           placeholder="Max" value="${filters.maxPrice || ''}" 
                           onchange="updateFilters()" />
                </div>
            </div>

            <!-- Location (placeholder) -->
            <div class="input-group">
                <label class="input-label">Location</label>
                <input type="text" class="input" placeholder="Enter city..." 
                       value="Berlin" disabled />
                <input type="number" class="input" id="filter-radius" 
                       placeholder="Radius (km)" value="${filters.radiusKm || 50}"
                       onchange="updateFilters()" style="margin-top: 8px;" />
            </div>

            <!-- Save Search -->
            ${isAuthenticated() ? `
                <button class="btn" style="width: 100%; margin-top: 16px; background: transparent; border: 1.5px solid #e0e0e0; color: #1a1a1a;" 
                        onclick="saveCurrentSearch()">
                    💾 Save This Search
                </button>
            ` : ''}
        </div>
    `;
}

function handleSearch(term) {
    if (term) {
        SearchEngine.saveRecentSearch(term);
        AppState.searchFilters = { ...AppState.searchFilters, search: term };
    } else {
        delete AppState.searchFilters.search;
    }
    renderCurrentPage();
}

function updateFilters() {
    const category = document.getElementById('filter-category').value;
    const condition = document.getElementById('filter-condition').value;
    const minPrice = document.getElementById('filter-min-price').value;
    const maxPrice = document.getElementById('filter-max-price').value;
    const radiusKm = document.getElementById('filter-radius').value;

    AppState.searchFilters = {
        ...AppState.searchFilters,
        category: category !== 'all' ? category : null,
        condition: condition !== 'all' ? condition : null,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        radiusKm: radiusKm ? parseInt(radiusKm) : 50
    };

    renderCurrentPage();
}

function clearFilters() {
    AppState.searchFilters = {};
    renderCurrentPage();
}

function handleSortChange(sortBy) {
    // Basic sort implementation (SearchEngine handles ranking, but this overrides)
    // In a real app, you'd pass sortBy to the search engine or API
    const products = SearchEngine.search(AppState.searchFilters.search, PRODUCTS, AppState.searchFilters);

    // Sort logic here if needed, right now we just re-render which calls search again
    // For MVP we accept default ranking unless specific sort is requested
    if (sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
    } // ... others

    // For now purely re-rendering as SearchEngine.search is called in render
    renderCurrentPage();
}

function saveCurrentSearch() {
    const name = prompt('Name this search:');
    if (name) {
        const search = {
            id: 'search_' + Date.now(),
            userId: AppState.currentUser.id,
            name,
            ...AppState.searchFilters,
            createdAt: new Date().toISOString()
        };

        if (!AppState.savedSearches) AppState.savedSearches = [];
        AppState.savedSearches.push(search);
        saveToLocalStorage('savedSearches', AppState.savedSearches);
        showNotification('Search saved successfully!', 'success');
    }
}

function removeFilter(filterKey) {
    if (filterKey === 'price') {
        delete AppState.searchFilters.minPrice;
        delete AppState.searchFilters.maxPrice;
    } else {
        delete AppState.searchFilters[filterKey];
    }
    renderCurrentPage();
}
