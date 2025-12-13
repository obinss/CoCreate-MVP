/* ============================================
   CoCreate Platform - Mock Data
   ============================================ */

// Global state
const AppState = {
    currentUser: null,
    cart: [],
    notifications: [],
    activeConversations: [],
    searchFilters: {},
    savedSearches: []
};

// Mock Users
const USERS = [
    {
        id: 'user_1',
        email: 'john.buyer@example.com',
        name: 'John Smith',
        role: 'buyer',
        isSeller: false,
        isVerified: true,
        verificationStatus: null,
        avatar: null,
        createdAt: '2024-01-15'
    },
    {
        id: 'user_2',
        email: 'maria.contractor@example.com',
        name: 'Maria Schmidt',
        role: 'buyer', // Buyers can also be sellers
        isSeller: true,
        isVerified: true,
        businessName: 'Schmidt Construction GmbH',
        taxId: 'DE123456789',
        verificationStatus: 'approved',
        defaultPickupAddress: 'Baustraße 45, 10115 Berlin',
        rating: 4.8,
        totalSales: 127,
        avatar: null,
        createdAt: '2023-06-10'
    },
    {
        id: 'user_3',
        email: 'admin@cocreate.com',
        name: 'Admin User',
        role: 'admin',
        isSeller: false,
        isVerified: true,
        verificationStatus: null,
        avatar: null,
        createdAt: '2023-01-01'
    },
    {
        id: 'user_4',
        email: 'pending.seller@example.com',
        name: 'Thomas Müller',
        role: 'buyer',
        isSeller: true,
        isVerified: false,
        businessName: 'Müller Renovations',
        taxId: 'DE987654321',
        verificationStatus: 'pending',
        defaultPickupAddress: 'Hauptstraße 12, 10117 Berlin',
        avatar: null,
        createdAt: '2024-12-10'
    }
];

// Categories
const CATEGORIES = [
    'Wood', 'Metal', 'Masonry', 'Electrical', 'Plumbing',
    'Insulation', 'Flooring', 'Roofing', 'Paint & Coating',
    'Doors & Windows', 'Hardware', 'Concrete'
];

// Conditions
const CONDITIONS = {
    new: { label: 'New', color: 'success' },
    opened_unused: { label: 'Opened/Unused', color: 'info' },
    cut_undamaged: { label: 'Cut/Undamaged', color: 'warning' },
    slightly_damaged: { label: 'Slightly Damaged', color: 'error' }
};

// Units of Measure
const UNITS = ['kg', 'ton', 'sqm', 'count', 'linear_meter'];

// Mock Products (Construction Materials)
const PRODUCTS = [
    {
        id: 'prod_1',
        sellerId: 'user_2',
        title: 'Premium Oak Hardwood Flooring',
        description: 'High-quality oak hardwood flooring planks, 15mm thickness. Leftover from luxury apartment renovation. Perfect condition, never installed.',
        category: 'Flooring',
        condition: 'new',
        quantity: 45,
        unitOfMeasure: 'sqm',
        price: 35.00,
        marketPrice: 75.00,
        weightPerUnit: 12.5,
        dimensions: '1200x180x15mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['oak-floor.jpg'],
        createdAt: '2024-12-01',
        views: 342,
        saves: 28
    },
    {
        id: 'prod_2',
        sellerId: 'user_2',
        title: 'Industrial Steel I-Beams 6m',
        description: 'Heavy-duty steel I-beams, 200mm height. Surplus from commercial construction. Excellent for structural supports.',
        category: 'Metal',
        condition: 'new',
        quantity: 12,
        unitOfMeasure: 'count',
        price: 180.00,
        marketPrice: 320.00,
        weightPerUnit: 156.0,
        dimensions: '6000x200x100mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['steel-beams.jpg'],
        createdAt: '2024-12-05',
        views: 156,
        saves: 12
    },
    {
        id: 'prod_3',
        sellerId: 'user_2',
        title: 'Rockwool Insulation Panels 100mm',
        description: 'Mineral wool insulation panels, fire-rated A1. Leftover from office building project. Unopened packages.',
        category: 'Insulation',
        condition: 'opened_unused',
        quantity: 120,
        unitOfMeasure: 'sqm',
        price: 8.50,
        marketPrice: 18.00,
        weightPerUnit: 3.5,
        dimensions: '1200x600x100mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['insulation.jpg'],
        createdAt: '2024-12-08',
        views: 89,
        saves: 15
    },
    {
        id: 'prod_4',
        sellerId: 'user_2',
        title: 'Ceramic Floor Tiles - Anthracite',
        description: 'Large format porcelain tiles, anthracite grey. Modern matte finish. Leftover from bathroom renovation, 8 boxes.',
        category: 'Flooring',
        condition: 'new',
        quantity: 15,
        unitOfMeasure: 'sqm',
        price: 22.00,
        marketPrice: 45.00,
        weightPerUnit: 22.0,
        dimensions: '600x600x10mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['tiles.jpg'],
        createdAt: '2024-12-10',
        views: 234,
        saves: 31
    },
    {
        id: 'prod_5',
        sellerId: 'user_2',
        title: 'Copper Piping 22mm - 50m Roll',
        description: 'Professional grade copper piping for plumbing. Partial roll from hotel renovation. Never used.',
        category: 'Plumbing',
        condition: 'new',
        quantity: 50,
        unitOfMeasure: 'linear_meter',
        price: 4.80,
        marketPrice: 9.50,
        weightPerUnit: 0.8,
        dimensions: '22mm diameter',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['copper-pipe.jpg'],
        createdAt: '2024-12-03',
        views: 178,
        saves: 22
    },
    {
        id: 'prod_6',
        sellerId: 'user_2',
        title: 'Exterior White Paint - Premium',
        description: 'High-quality exterior facade paint, brilliant white. UV resistant, 15L buckets. 8 buckets available.',
        category: 'Paint & Coating',
        condition: 'new',
        quantity: 120,
        unitOfMeasure: 'count',
        price: 45.00,
        marketPrice: 85.00,
        weightPerUnit: 18.0,
        dimensions: '15L bucket',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['paint.jpg'],
        createdAt: '2024-12-06',
        views: 142,
        saves: 18
    },
    {
        id: 'prod_7',
        sellerId: 'user_2',
        title: 'Laminate Flooring - Oak Effect',
        description: 'AC4 rated laminate flooring with oak wood effect. 8mm thickness. From office renovation, 12 packages. Some packages opened but planks unused.',
        category: 'Flooring',
        condition: 'opened_unused',
        quantity: 35,
        unitOfMeasure: 'sqm',
        price: 12.50,
        marketPrice: 28.00,
        weightPerUnit: 8.5,
        dimensions: '1380x193x8mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['laminate-oak.jpg'],
        createdAt: '2024-12-09',
        views: 198,
        saves: 24
    },
    {
        id: 'prod_8',
        sellerId: 'user_2',
        title: 'Vinyl Plank Flooring - Waterproof',
        description: 'Click-system vinyl planks, waterproof SPC core. Grey oak design. Leftover from bathroom project, perfect for wet areas.',
        category: 'Flooring',
        condition: 'new',
        quantity: 28,
        unitOfMeasure: 'sqm',
        price: 18.00,
        marketPrice: 42.00,
        weightPerUnit: 9.2,
        dimensions: '1220x180x5mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['vinyl-plank.jpg'],
        createdAt: '2024-12-11',
        views: 267,
        saves: 35
    },
    {
        id: 'prod_9',
        sellerId: 'user_2',
        title: 'Bamboo Flooring - Natural Color',
        description: 'Sustainable bamboo hardwood flooring. Some planks were cut to shape but never used. Excellent eco-friendly option.',
        category: 'Flooring',
        condition: 'cut_undamaged',
        quantity: 22,
        unitOfMeasure: 'sqm',
        price: 25.00,
        marketPrice: 55.00,
        weightPerUnit: 11.0,
        dimensions: '960x96x14mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['bamboo-floor.jpg'],
        createdAt: '2024-12-07',
        views: 145,
        saves: 19
    },
    {
        id: 'prod_10',
        sellerId: 'user_2',
        title: 'Parquet Flooring Herringbone - Walnut',
        description: 'Premium walnut parquet in herringbone pattern. A few pieces have minor edge chips from storage. Still excellent quality.',
        category: 'Flooring',
        condition: 'slightly_damaged',
        quantity: 18,
        unitOfMeasure: 'sqm',
        price: 38.00,
        marketPrice: 95.00,
        weightPerUnit: 14.0,
        dimensions: '600x120x15mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['parquet-walnut.jpg'],
        createdAt: '2024-12-04',
        views: 212,
        saves: 28
    },
    {
        id: 'prod_11',
        sellerId: 'user_2',
        title: 'Cork Flooring Tiles - Natural',
        description: 'Eco-friendly cork tiles, excellent sound insulation. Opened packages from sustainable building project. Tiles in perfect condition.',
        category: 'Flooring',
        condition: 'opened_unused',
        quantity: 26,
        unitOfMeasure: 'sqm',
        price: 20.00,
        marketPrice: 48.00,
        weightPerUnit: 6.5,
        dimensions: '600x300x10mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['cork-tiles.jpg'],
        createdAt: '2024-12-08',
        views: 87,
        saves: 11
    },
    {
        id: 'prod_12',
        sellerId: 'user_2',
        title: 'Engineered Oak Wide Planks',
        description: 'Extra-wide engineered oak planks, 220mm width. Premium grade. Some planks were cut for door frames. Most planks full length.',
        category: 'Flooring',
        condition: 'cut_undamaged',
        quantity: 31,
        unitOfMeasure: 'sqm',
        price: 42.00,
        marketPrice: 88.00,
        weightPerUnit: 13.5,
        dimensions: '2200x220x15mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['eng-oak-wide.jpg'],
        createdAt: '2024-12-05',
        views: 289,
        saves: 42
    },
    {
        id: 'prod_13',
        sellerId: 'user_2',
        title: 'Marble Effect Porcelain Tiles',
        description: 'Luxury large-format porcelain tiles with Carrara marble effect. A couple tiles have tiny corner chips, rest are perfect.',
        category: 'Flooring',
        condition: 'slightly_damaged',
        quantity: 12,
        unitOfMeasure: 'sqm',
        price: 28.00,
        marketPrice: 72.00,
        weightPerUnit: 25.0,
        dimensions: '800x800x10mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['marble-tiles.jpg'],
        createdAt: '2024-12-10',
        views: 178,
        saves: 23
    },
    {
        id: 'prod_14',
        sellerId: 'user_2',
        title: 'Industrial Concrete Effect Tiles',
        description: 'Modern concrete-look rectified tiles. Perfect for contemporary spaces. Brand new, unopened boxes from warehouse project.',
        category: 'Flooring',
        condition: 'new',
        quantity: 42,
        unitOfMeasure: 'sqm',
        price: 24.00,
        marketPrice: 52.00,
        weightPerUnit: 21.0,
        dimensions: '600x600x9mm',
        locationLat: 52.5200,
        locationLong: 13.4050,
        locationName: 'Berlin',
        status: 'active',
        images: ['concrete-tiles.jpg'],
        createdAt: '2024-12-11',
        views: 156,
        saves: 20
    }
];

// Mock Orders
const ORDERS = [
    {
        id: 'order_1',
        buyerId: 'user_1',
        sellerId: 'user_2',
        items: [
            { productId: 'prod_1', quantity: 10, priceAtPurchase: 35.00 }
        ],
        totalAmount: 395.00,
        taxAmount: 75.05,
        escrowStatus: 'funds_held',
        createdAt: '2024-12-12',
        deliveryMethod: 'carrier',
        deliveryStatus: 'pending'
    }
];

// Mock Messages/Conversations
const CONVERSATIONS = [
    {
        id: 'conv_1',
        productId: 'prod_3',
        buyerId: 'user_1',
        sellerId: 'user_2',
        status: 'open',
        lastMessage: 'Is delivery available to Munich?',
        lastMessageAt: '2024-12-13T10:30:00',
        messages: [
            {
                id: 'msg_1',
                senderId: 'user_1',
                content: 'Hi, is this insulation still available?',
                sentAt: '2024-12-13T09:15:00',
                readAt: '2024-12-13T09:20:00'
            },
            {
                id: 'msg_2',
                senderId: 'user_2',
                content: 'Yes, all 120sqm are still available!',
                sentAt: '2024-12-13T09:22:00',
                readAt: '2024-12-13T10:00:00'
            },
            {
                id: 'msg_3',
                senderId: 'user_1',
                content: 'Is delivery available to Munich?',
                sentAt: '2024-12-13T10:30:00',
                readAt: null
            }
        ]
    }
];

// Mock Reviews
const REVIEWS = [
    {
        id: 'review_1',
        orderId: 'order_1',
        reviewerId: 'user_1',
        revieweeId: 'user_2',
        rating: 5,
        comment: 'Excellent quality materials, exactly as described. Fast delivery!',
        createdAt: '2024-12-11'
    }
];

// Mock Saved Searches
const SAVED_SEARCHES = [
    {
        id: 'search_1',
        userId: 'user_1',
        name: 'Oak Flooring under €500',
        keywords: 'oak',
        category: 'Flooring',
        maxPrice: 500,
        radiusKm: 50,
        createdAt: '2024-11-20'
    }
];

// Helper Functions
function getUserById(id) {
    return USERS.find(u => u.id === id);
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

function getProductsBySeller(sellerId) {
    return PRODUCTS.filter(p => p.sellerId === sellerId);
}

function getProductsByCategory(category) {
    return PRODUCTS.filter(p => p.category === category);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Simplified distance calculation (in km)
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function formatPrice(price) {
    return `€${price.toFixed(2).replace('.', ',')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('de-DE');
}

function calculateSavings(price, marketPrice) {
    return Math.round((1 - price / marketPrice) * 100);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    window.USERS = USERS;
    window.CATEGORIES = CATEGORIES;
    window.CONDITIONS = CONDITIONS;
    window.UNITS = UNITS;
    window.PRODUCTS = PRODUCTS;
    window.ORDERS = ORDERS;
    window.CONVERSATIONS = CONVERSATIONS;
    window.REVIEWS = REVIEWS;
    window.SAVED_SEARCHES = SAVED_SEARCHES;
    window.getUserById = getUserById;
    window.getProductById = getProductById;
    window.getProductsBySeller = getProductsBySeller;
    window.getProductsByCategory = getProductsByCategory;
    window.calculateDistance = calculateDistance;
    window.formatPrice = formatPrice;
    window.formatDate = formatDate;
    window.calculateSavings = calculateSavings;
}
