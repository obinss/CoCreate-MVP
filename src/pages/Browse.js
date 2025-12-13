/* ============================================
   CoCreate Platform - Browse/Marketplace Page
   ============================================ */

function renderBrowsePage() {
    const filters = AppState.searchFilters || {};
    const filtered Products = filterProducts(filters);

    return `
        <div class="container" style="margin-top: 32px; margin-bottom: 64px;">
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
                            <button class="btn btn-primary mt-4" onclick="AppState.searchFilters = {}; renderCurrentPage();">
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

function renderFilterSidebar() {
    const filters = AppState.searchFilters || {};

    return `
        <div class="card" style="position: sticky; top: 88px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0;">Filters</h3>
                <button class="btn btn-ghost btn-sm" onclick="clearFilters()">Clear All</button>
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
                <button class="btn btn-outline" style="width: 100%; margin-top: 16px;" 
                        onclick="saveCurrentSearch()">
                    💾 Save This Search
                </button>
            ` : ''}
        </div>
    `;
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
    const products = filterProducts(AppState.searchFilters);

    // Apply sorting (would normally update products array)
    // For now, just re-render
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

        AppState.savedSearches.push(search);
        saveToLocalStorage('savedSearches', AppState.savedSearches);
        showNotification('Search saved successfully!', 'success');
    }
}
