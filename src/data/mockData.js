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
        createdAt: '2024-01-15',
        projects: [
            { id: 'proj_1', name: 'Kitchen Renovation', description: 'Full remodel of kitchen in Apt 4B', budget: 15000, status: 'active', createdAt: '2024-11-01' },
            { id: 'proj_2', name: 'Backyard Deck', description: 'New 20sqm deck with composite materials', budget: 5000, status: 'planning', createdAt: '2024-12-05' }
        ],
        watchlist: ['prod_2', 'prod_5', 'prod_8']
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
    },
    {
        id: 'user_5',
        email: 'hans.electric@example.com',
        name: 'Hans Weber',
        role: 'seller',
        isSeller: true,
        isVerified: true,
        businessName: 'Weber Elektro',
        taxId: 'DE555666777',
        verificationStatus: 'approved',
        defaultPickupAddress: 'Stromweg 88, 80331 Munich',
        rating: 4.9,
        totalSales: 45,
        avatar: null,
        createdAt: '2023-08-20'
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
        title: 'Copper Piping - 15mm (Unused)',
        description: 'Surplus copper pipes, 15mm diameter. Stored indoors, excellent condition. 20 lengths of 3m each.',
        category: 'Plumbing',
        condition: 'new',
        quantity: 60,
        unitOfMeasure: 'linear_meter',
        price: 8.50,
        marketPrice: 12.00,
        locationName: 'Berlin',
        status: 'active',
        createdAt: '2024-12-05',
        views: 156,
        saves: 12
    },
    {
        id: 'prod_3',
        sellerId: 'user_2',
        title: 'Rockwool Insulation Rolls',
        description: 'Excess Rockwool thermal insulation. 100mm thickness. 12 rolls available. Packaging slightly dusty but seals intact.',
        category: 'Insulation',
        condition: 'opened_unused',
        quantity: 12,
        unitOfMeasure: 'count',
        price: 25.00,
        marketPrice: 45.00,
        locationName: 'Potsdam',
        status: 'active',
        createdAt: '2024-12-08',
        views: 89,
        saves: 5
    },
    {
        id: 'prod_4',
        sellerId: 'user_5',
        title: 'Schneider Electric Circuit Breakers',
        description: 'Box of 10 Schneider Electric Acti9 iC60N MCBs. 16A, C-curve. Brand new in box.',
        category: 'Electrical',
        condition: 'new',
        quantity: 10,
        unitOfMeasure: 'count',
        price: 12.00,
        marketPrice: 22.50,
        locationName: 'Munich',
        status: 'active',
        createdAt: '2024-12-10',
        views: 210,
        saves: 45
    },
    {
        id: 'prod_5',
        sellerId: 'user_5',
        title: 'Heavy Duty Power Cable 5x2.5mm²',
        description: 'NYM-J installation cable. Remainder of large drum. Approx 85 meters left.',
        category: 'Electrical',
        condition: 'cut_undamaged',
        quantity: 85,
        unitOfMeasure: 'linear_meter',
        price: 1.50,
        marketPrice: 2.80,
        locationName: 'Munich',
        status: 'active',
        createdAt: '2024-12-11',
        views: 67,
        saves: 8
    },
    {
        id: 'prod_6',
        sellerId: 'user_2',
        title: 'Ceramic Wall Tiles - Gloss White',
        description: 'Classic white subway tiles (10x20cm). 5 boxes left over. Approx 5 sqm total.',
        category: 'Flooring',
        condition: 'new',
        quantity: 5,
        unitOfMeasure: 'sqm',
        price: 15.00,
        marketPrice: 32.00,
        locationName: 'Berlin',
        status: 'active',
        createdAt: '2024-11-25',
        views: 112,
        saves: 15
    },
    {
        id: 'prod_7',
        sellerId: 'user_2',
        title: 'Steel I-Beams (HEB 140)',
        description: 'Two steel beams, HEB 140, 4.5m length each. Primed red oxide. Leftover from structural reinforcement.',
        category: 'Metal',
        condition: 'new',
        quantity: 2,
        unitOfMeasure: 'count',
        price: 200.00,
        marketPrice: 450.00,
        locationName: 'Hamburg',
        status: 'active',
        createdAt: '2024-11-20',
        views: 34,
        saves: 3
    },
    {
        id: 'prod_8',
        sellerId: 'user_5',
        title: 'LED Panel Lights 60x60cm',
        description: 'Office ceiling LED panels. 4000K neutral white. 6 pieces available. Boxes opened to check contents but never installed.',
        category: 'Electrical',
        condition: 'opened_unused',
        quantity: 6,
        unitOfMeasure: 'count',
        price: 18.00,
        marketPrice: 40.00,
        locationName: 'Munich',
        status: 'active',
        createdAt: '2024-12-01',
        views: 145,
        saves: 22
    },
    {
        id: 'prod_9',
        sellerId: 'user_2',
        title: 'Exterior Facade Paint - Grey',
        description: 'High quality silicone resin facade paint. RAL 7016 Anthracite Grey. 2 buckets of 12.5L each.',
        category: 'Paint & Coating',
        condition: 'new',
        quantity: 2,
        unitOfMeasure: 'count',
        price: 45.00,
        marketPrice: 95.00,
        locationName: 'Berlin',
        status: 'active',
        createdAt: '2024-12-05',
        views: 78,
        saves: 9
    },
    {
        id: 'prod_10',
        sellerId: 'user_2',
        title: 'Roofing Tiles - Clay Red',
        description: 'Classic clay roofing tiles. Approx 200 pieces. Good for small repairs or shed roofing.',
        category: 'Roofing',
        condition: 'new',
        quantity: 200,
        unitOfMeasure: 'count',
        price: 0.80,
        marketPrice: 1.50,
        locationName: 'Leipzig',
        status: 'active',
        createdAt: '2024-11-15',
        views: 56,
        saves: 6
    }
];

// Mock Orders
const ORDERS = [
    {
        id: 'order_1',
        buyerId: 'user_1',
        sellerId: 'user_2',
        projectId: 'proj_1', // Linked to Kitchen Renovation
        items: [
            { productId: 'prod_1', quantity: 10, priceAtPurchase: 35.00, title: 'Premium Oak Hardwood Flooring' }
        ],
        totalAmount: 395.00,
        taxAmount: 75.05,
        escrowStatus: 'funds_held',
        createdAt: '2024-12-12T10:00:00',
        deliveryMethod: 'carrier',
        deliveryStatus: 'pending'
    },
    {
        id: 'order_2',
        buyerId: 'user_1',
        sellerId: 'user_5',
        projectId: 'proj_1', // Linked to Kitchen Renovation
        items: [
            { productId: 'prod_4', quantity: 5, priceAtPurchase: 12.00, title: 'Schneider Electric Circuit Breakers' },
            { productId: 'prod_5', quantity: 20, priceAtPurchase: 1.50, title: 'Heavy Duty Power Cable' }
        ],
        totalAmount: 101.70, // (60 + 30) * 1.13 approx (assuming tax included logic or added)
        taxAmount: 11.70,
        escrowStatus: 'released',
        createdAt: '2024-11-20T14:30:00',
        deliveryMethod: 'carrier',
        deliveryStatus: 'delivered'
    },
    {
        id: 'order_3',
        buyerId: 'user_1',
        sellerId: 'user_2',
        projectId: 'proj_2', // Linked to Backyard Deck
        items: [
            { productId: 'prod_9', quantity: 1, priceAtPurchase: 45.00, title: 'Exterior Facade Paint - Grey' }
        ],
        totalAmount: 53.55,
        taxAmount: 8.55,
        escrowStatus: 'funds_held',
        createdAt: '2024-12-10T09:15:00',
        deliveryMethod: 'pickup',
        deliveryStatus: 'ready_for_pickup'
    },
    {
        id: 'order_4',
        buyerId: 'user_1',
        sellerId: 'user_5',
        projectId: null, // No project
        items: [
            { productId: 'prod_8', quantity: 2, priceAtPurchase: 18.00, title: 'LED Panel Lights 60x60cm' }
        ],
        totalAmount: 42.84,
        taxAmount: 6.84,
        escrowStatus: 'disputed',
        createdAt: '2024-12-05T16:45:00',
        deliveryMethod: 'carrier',
        deliveryStatus: 'shipped'
    }
];

// Mock Deliveries
const DELIVERIES = [
    {
        id: 'del_1',
        orderId: 'order_1',
        carrier: 'DHL Freight',
        trackingNumber: 'JD0002345678DE',
        status: 'processing',
        estimatedDelivery: '2024-12-16',
        updates: [
            { status: 'Order Processed', timestamp: '2024-12-12T11:00:00', location: 'Berlin' }
        ]
    },
    {
        id: 'del_2',
        orderId: 'order_2',
        carrier: 'Hermes',
        trackingNumber: '0987654321',
        status: 'delivered',
        deliveredAt: '2024-11-23T14:00:00',
        updates: [
            { status: 'Delivered', timestamp: '2024-11-23T14:00:00', location: 'Munich' },
            { status: 'Out for Delivery', timestamp: '2024-11-23T08:30:00', location: 'Munich' },
            { status: 'Shipped', timestamp: '2024-11-21T18:00:00', location: 'Berlin' }
        ]
    },
    {
        id: 'del_3',
        orderId: 'order_4',
        carrier: 'DPD',
        trackingNumber: '155023958291',
        status: 'in_transit',
        estimatedDelivery: '2024-12-14',
        updates: [
            { status: 'In Transit', timestamp: '2024-12-06T10:00:00', location: 'Nuremberg' },
            { status: 'Shipped', timestamp: '2024-12-05T19:00:00', location: 'Munich' }
        ]
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
    },
    {
        id: 'conv_2',
        productId: 'prod_7',
        buyerId: 'user_1',
        sellerId: 'user_2',
        status: 'active',
        lastMessage: 'Can you hold them until Tuesday?',
        lastMessageAt: '2024-11-22T15:00:00',
        messages: [
            {
                id: 'msg_4',
                senderId: 'user_1',
                content: 'What is the exact weight of these beams?',
                sentAt: '2024-11-22T14:00:00',
                readAt: '2024-11-22T14:10:00'
            },
            {
                id: 'msg_5',
                senderId: 'user_2',
                content: 'Roughly 150kg each.',
                sentAt: '2024-11-22T14:15:00',
                readAt: '2024-11-22T14:20:00'
            }
        ]
    }
];

// Mock Reviews
const REVIEWS = [
    {
        id: 'review_1',
        orderId: 'order_2',
        reviewerId: 'user_1',
        revieweeId: 'user_5',
        rating: 5,
        comment: 'Excellent quality materials, exactly as described. Fast delivery!',
        createdAt: '2024-11-24'
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

function calculateSavings(price, marketPrice) {
    if (!price || !marketPrice) return 0;
    return Math.round(((marketPrice - price) / marketPrice) * 100);
}

function getPlaceholderImage(id, category) {
    // Return placeholder colors/patterns based on category
    // In a real app, this would return actual image URLs
    const colors = {
        'Wood': '8B4513',
        'Metal': '708090',
        'Masonry': 'CD853F',
        'Electrical': 'FFFF00',
        'Plumbing': '4682B4',
        'Insulation': 'FFC0CB',
        'Flooring': 'DEB887',
        'Roofing': '8B0000',
        'Paint & Coating': 'F0F8FF',
        'Doors & Windows': '87CEEB',
        'Hardware': 'C0C0C0',
        'Concrete': '808080'
    };

    const color = colors[category] || 'CCCCCC';
    return `https://placehold.co/400x300/${color}/FFFFFF?text=${category}`;
}

function formatPrice(price) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('de-DE');
}

// Export for usage
window.PRODUCTS = PRODUCTS;
window.USERS = USERS;
window.ORDERS = ORDERS;
window.DELIVERIES = DELIVERIES;
window.CATEGORIES = CATEGORIES;
window.CONDITIONS = CONDITIONS;
window.CONVERSATIONS = CONVERSATIONS;
window.AppState = AppState;
window.getUserById = getUserById;
window.getProductById = getProductById;
window.getProductsBySeller = getProductsBySeller;
window.getProductsByCategory = getProductsByCategory;
window.calculateSavings = calculateSavings;
window.getPlaceholderImage = getPlaceholderImage;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
