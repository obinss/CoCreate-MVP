/* ============================================
   CoCreate Platform - Browse Page Logic
   ============================================ */

const BrowseState = {
    filters: {},
    sortBy: 'newest'
};

document.addEventListener('DOMContentLoaded', () => {
    // initialize state from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.has('search')) BrowseState.filters.search = params.get('search');
    if (params.has('category')) BrowseState.filters.category = params.get('category');
    if (params.has('minPrice')) BrowseState.filters.minPrice = params.get('minPrice');
    if (params.has('maxPrice')) BrowseState.filters.maxPrice = params.get('maxPrice');

    // Populate Dropdowns
    populateDropdowns();

    // Set initial input values
    syncInputsWithState();

    // Initial Render
    renderBrowse();

    // Event Listeners
    setupEventListeners();
});

function populateDropdowns() {
    const catSelect = document.getElementById('filter-category');
    if (catSelect && window.CATEGORIES) {
        window.CATEGORIES.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            catSelect.appendChild(option);
        });
    }

    const condSelect = document.getElementById('filter-condition');
    if (condSelect && window.CONDITIONS) {
        Object.entries(window.CONDITIONS).forEach(([key, val]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = val.label;
            condSelect.appendChild(option);
        });
    }
}

function syncInputsWithState() {
    if (BrowseState.filters.search) document.getElementById('filter-search').value = BrowseState.filters.search;
    if (BrowseState.filters.category) document.getElementById('filter-category').value = BrowseState.filters.category;
    if (BrowseState.filters.condition) document.getElementById('filter-condition').value = BrowseState.filters.condition;
    if (BrowseState.filters.minPrice) document.getElementById('filter-min-price').value = BrowseState.filters.minPrice;
    if (BrowseState.filters.maxPrice) document.getElementById('filter-max-price').value = BrowseState.filters.maxPrice;
}

function renderBrowse() {
    // 1. Filter Products
    // Use SearchEngine if available, else simple filter
    let results = window.PRODUCTS || [];

    if (window.SearchEngine) {
        results = window.SearchEngine.search(BrowseState.filters.search, results, BrowseState.filters);
    } else {
        // Fallback filter
        results = filterProducts(BrowseState.filters); // from utils.js
    }

    // 2. Sort
    sortResults(results);

    // 3. Render Grid
    const grid = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');
    const countLabel = document.getElementById('results-count');

    if (countLabel) countLabel.textContent = `${results.length} Materials Available`;

    if (results.length === 0) {
        if (grid) grid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
    } else {
        if (grid) {
            grid.style.display = 'grid';
            grid.innerHTML = results.map(p => window.renderProductCard(p)).join('');
        }
        if (noResults) noResults.style.display = 'none';
    }

    // 4. Render Active Filters
    renderActiveFiltersDisplay();
}

function sortResults(results) {
    const sort = document.getElementById('sort-select')?.value || 'newest';
    if (sort === 'price-low') {
        results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        results.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
        // Mock newest (preserving order or random if no date)
    }
}

function setupEventListeners() {
    // Inputs
    ['filter-search', 'filter-min-price', 'filter-max-price', 'filter-radius'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateFiltersFromUI);
        if (id === 'filter-search') {
            // Debounced search for typing
            document.getElementById(id)?.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') updateFiltersFromUI();
            });
        }
    });

    ['filter-category', 'filter-condition', 'sort-select'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            updateFiltersFromUI();
        });
    });

    // Clear buttons
    document.getElementById('clear-filters-btn')?.addEventListener('click', clearFilters);
    document.getElementById('clear-filters-action')?.addEventListener('click', clearFilters);
}

function updateFiltersFromUI() {
    const search = document.getElementById('filter-search').value;
    const category = document.getElementById('filter-category').value;
    const condition = document.getElementById('filter-condition').value;
    const minPrice = document.getElementById('filter-min-price').value;
    const maxPrice = document.getElementById('filter-max-price').value;

    BrowseState.filters = {};
    if (search) BrowseState.filters.search = search;
    if (category && category !== 'all') BrowseState.filters.category = category;
    if (condition && condition !== 'all') BrowseState.filters.condition = condition;
    if (minPrice) BrowseState.filters.minPrice = parseFloat(minPrice);
    if (maxPrice) BrowseState.filters.maxPrice = parseFloat(maxPrice);

    updateURL();
    renderBrowse();
}

function clearFilters() {
    BrowseState.filters = {};
    syncInputsWithState();
    // Reset selects to 'all'
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-condition').value = 'all';
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';

    updateURL();
    renderBrowse();
}

function updateURL() {
    const url = new URL(window.location);
    url.search = ''; // clear params

    if (BrowseState.filters.search) url.searchParams.set('search', BrowseState.filters.search);
    if (BrowseState.filters.category) url.searchParams.set('category', BrowseState.filters.category);
    if (BrowseState.filters.minPrice) url.searchParams.set('minPrice', BrowseState.filters.minPrice);
    if (BrowseState.filters.maxPrice) url.searchParams.set('maxPrice', BrowseState.filters.maxPrice);

    window.history.replaceState({}, '', url);
}

function renderActiveFiltersDisplay() {
    const container = document.getElementById('active-filters-container');
    if (!container) return;

    const filters = BrowseState.filters;
    const activeFilters = [];

    if (filters.category) activeFilters.push({ label: `Category: ${filters.category}`, key: 'category' });
    if (filters.condition) activeFilters.push({ label: `Condition: ${filters.condition}`, key: 'condition' });
    if (filters.search) activeFilters.push({ label: `Search: "${filters.search}"`, key: 'search' });
    if (filters.minPrice) activeFilters.push({ label: `Min: €${filters.minPrice}`, key: 'minPrice' });

    if (activeFilters.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom: 24px; padding: 16px 20px; background: #fafafa; border-radius: 12px; border: 1px solid #e8e8e8;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-size: 0.875rem; color: #666; font-weight: 500;">Active filters:</span>
                ${activeFilters.map(f => `
                    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 0.875rem; color: #1a1a1a;">
                        ${f.label}
                        <button onclick="removeBrowseFilter('${f.key}')" 
                                style="background: none; border: none; color: #999; cursor: pointer; padding: 0; display: flex; align-items: center; font-size: 1.1rem; line-height: 1;">
                            ×
                        </button>
                    </span>
                `).join('')}
                <button onclick="clearFilters()" 
                        style="font-size: 0.875rem; color: #A6375F; background: none; border: none; cursor: pointer; font-weight: 500;">
                    Clear all
                </button>
            </div>
        </div>
    `;
}

// Global helper for the inline onclick in active filters
window.removeBrowseFilter = function (key) {
    if (BrowseState.filters[key]) {
        delete BrowseState.filters[key];
        // Special handle inputs
        if (key === 'search') document.getElementById('filter-search').value = '';
        if (key === 'category') document.getElementById('filter-category').value = 'all';
        if (key === 'condition') document.getElementById('filter-condition').value = 'all';
        if (key === 'minPrice') document.getElementById('filter-min-price').value = '';

        updateURL();
        renderBrowse();
    }
};
