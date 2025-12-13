-- CoCreate Platform Database Schema
-- Based on requirements.txt

-- 1. User Management
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'buyer', -- 'buyer' or 'admin'
    is_seller BOOLEAN DEFAULT 0,
    is_verified BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_profiles (
    user_id TEXT PRIMARY KEY,
    business_name TEXT,
    tax_id TEXT,
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    stripe_account_id TEXT,
    default_pickup_address TEXT,
    rating REAL DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 2. Inventory
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- Enum from app
    condition TEXT, -- Enum
    quantity INTEGER DEFAULT 0,
    unit_of_measure TEXT,
    weight_per_unit REAL,
    dimensions TEXT,
    price REAL NOT NULL,
    market_price REAL,
    location_lat REAL,
    location_long REAL,
    location_name TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'reserved', 'sold', 'archived'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- 3. Transactions & Escrow
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    budget REAL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    project_id TEXT, -- Optional link to project
    total_amount REAL NOT NULL,
    tax_amount REAL,
    escrow_status TEXT DEFAULT 'funds_held', -- 'funds_held', 'funds_released', 'refunded', 'disputed'
    payment_intent_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(buyer_id) REFERENCES users(id),
    FOREIGN KEY(seller_id) REFERENCES users(id),
    FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity_sold INTEGER NOT NULL,
    price_at_purchase REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- 4. Logistics
CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    method TEXT, -- 'carrier', 'pickup'
    carrier_name TEXT,
    tracking_number TEXT,
    pickup_time_slot TIMESTAMP,
    delivery_status TEXT DEFAULT 'pending', -- 'pending', 'shipped', 'delivered', 'returned'
    estimated_delivery TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- 5. Communication
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(buyer_id) REFERENCES users(id),
    FOREIGN KEY(seller_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id),
    FOREIGN KEY(sender_id) REFERENCES users(id)
);

-- 6. Administration & Trust
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    reviewer_id TEXT NOT NULL,
    reviewee_id TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(reviewer_id) REFERENCES users(id),
    FOREIGN KEY(reviewee_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS saved_searches (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT,
    keywords TEXT,
    category TEXT,
    max_price REAL,
    radius_km INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
