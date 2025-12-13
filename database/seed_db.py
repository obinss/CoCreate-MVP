import sqlite3
import random
import uuid
import datetime
import json
import os

# Configuration
DB_FILE = 'cocreate.db'
SCHEMA_FILE = 'database/schema.sql'

# Constants for generation
CATEGORIES = [
    'Wood', 'Metal', 'Masonry', 'Electrical', 'Plumbing',
    'Insulation', 'Flooring', 'Roofing', 'Paint & Coating',
    'Doors & Windows', 'Hardware', 'Concrete'
]

CONDITIONS = ['new', 'opened_unused', 'cut_undamaged', 'slightly_damaged']
UNITS = ['kg', 'ton', 'sqm', 'count', 'linear_meter']
CITIES = [
    {'name': 'Berlin', 'lat': 52.5200, 'lon': 13.4050},
    {'name': 'Munich', 'lat': 48.1351, 'lon': 11.5820},
    {'name': 'Hamburg', 'lat': 53.5511, 'lon': 9.9937},
    {'name': 'Cologne', 'lat': 50.9375, 'lon': 6.9603},
    {'name': 'Frankfurt', 'lat': 50.1109, 'lon': 8.6821}
]

# Random Generators
def generate_id(prefix):
    return f"{prefix}_{str(uuid.uuid4())[:8]}"

def random_date(start_days_ago=90, end_days_ago=0):
    start = datetime.datetime.now() - datetime.timedelta(days=start_days_ago)
    end = datetime.datetime.now() - datetime.timedelta(days=end_days_ago)
    return start + (end - start) * random.random()

class DataGenerator:
    def __init__(self):
        self.first_names = ["James", "Maria", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "Thomas", "Sarah"]
        self.last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Schmidt", "Weber", "Müller"]
        self.companies = ["Construction Co", "Solutions", "Builders", "Supplies", "Renovations", "Projects", "Designs", "Works"]

    def name(self):
        return f"{random.choice(self.first_names)} {random.choice(self.last_names)}"

    def company(self):
        return f"{random.choice(self.last_names)} {random.choice(self.companies)}"

generator = DataGenerator()

def init_db():
    print(f"Initializing database: {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Read and execute schema
    with open(SCHEMA_FILE, 'r') as f:
        schema = f.read()
        cursor.executescript(schema)
    
    conn.commit()
    return conn

def seed_users(conn, count=20):
    print(f"Seeding {count} users...")
    users = []
    sellers = []
    
    cursor = conn.cursor()
    
    # Create Admin
    admin_id = generate_id('user')
    cursor.execute("INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_seller, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
                  (admin_id, 'admin@cocreate.com', 'hashed_pass', 'Admin User', 'admin', 0, 1))

    for i in range(count):
        uid = generate_id('user')
        first = random.choice(generator.first_names)
        last = random.choice(generator.last_names)
        name = f"{first} {last}"
        email = f"{first.lower()}.{last.lower()}{i}@example.com"
        
        is_seller = random.random() < 0.3 # 30% are sellers
        
        cursor.execute("INSERT OR IGNORE INTO users (id, email, password_hash, name, is_seller, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
                      (uid, email, 'hashed_pass', name, 1 if is_seller else 0, 1))
        
        users.append(uid)
        
        if is_seller:
            sellers.append(uid)
            cursor.execute("INSERT OR IGNORE INTO seller_profiles (user_id, business_name, tax_id, verification_status, default_pickup_address, rating, total_sales) VALUES (?, ?, ?, ?, ?, ?, ?)",
                          (uid, f"{last} {random.choice(generator.companies)}", f"DE{random.randint(100000000, 999999999)}", 
                           'approved', f"Sample St {random.randint(1,100)}, {random.choice(CITIES)['name']}", 
                           round(3.5 + random.random() * 1.5, 1), random.randint(0, 500)))

    conn.commit()
    return users, sellers

def seed_products(conn, sellers, count=50):
    print(f"Seeding {count} products...")
    products = []
    cursor = conn.cursor()
    
    materials = [
        ("Oak Flooring", "Flooring", 35, 80),
        ("Copper Pipes", "Plumbing", 10, 25),
        ("Steel Beams", "Metal", 150, 500),
        ("Insulation Rolls", "Insulation", 20, 50),
        ("Ceramic Tiles", "Flooring", 15, 40),
        ("Roof Tiles", "Roofing", 1, 5),
        ("Exterior Paint", "Paint & Coating", 30, 80),
        ("Circuit Breakers", "Electrical", 10, 30),
        ("Pine Planks", "Wood", 5, 15),
        ("Concrete Mix", "Concrete", 8, 20)
    ]

    for i in range(count):
        pid = generate_id('prod')
        seller_id = random.choice(sellers)
        item = random.choice(materials)
        city = random.choice(CITIES)
        
        price = round(random.uniform(item[2], item[3]) * 0.7, 2) # 30% discount roughly
        market_price = round(price * 1.4, 2)
        
        cursor.execute("""
            INSERT INTO products (id, seller_id, title, description, category, condition, quantity, unit_of_measure, price, market_price, location_lat, location_long, location_name, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            pid, seller_id, 
            f"{item[0]} - Batch {i+1}", 
            f"Surplus {item[0].lower()} from project. Excellent quality.",
            item[1], random.choice(CONDITIONS),
            random.randint(5, 100), random.choice(UNITS),
            price, market_price,
            city['lat'], city['lon'], city['name'],
            'active'
        ))
        products.append(pid)

    conn.commit()
    return products

def seed_orders(conn, users, products):
    print("Seeding orders...")
    cursor = conn.cursor()
    
    # Create some projects first
    projects = []
    for user_id in users[:5]: # First 5 users have projects
        pid = generate_id('proj')
        cursor.execute("INSERT INTO projects (id, owner_id, name, budget) VALUES (?, ?, ?, ?)",
                      (pid, user_id, f"Project {random.randint(100, 999)}", random.randint(5000, 50000)))
        projects.append(pid)
    
    # Create orders
    for _ in range(30):
        oid = generate_id('order')
        buyer_id = random.choice(users)
        
        # Select product details
        try:
            prod_id = random.choice(products)
            cursor.execute("SELECT seller_id, price FROM products WHERE id=?", (prod_id,))
            res = cursor.fetchone()
            if not res: continue
            seller_id, price = res
        except: continue
        
        if buyer_id == seller_id: continue # Can't buy own product
        
        qty = random.randint(1, 10)
        total = price * qty
        project_id = random.choice(projects) if random.random() > 0.5 else None
        
        cursor.execute("""
            INSERT INTO orders (id, buyer_id, seller_id, project_id, total_amount, escrow_status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (oid, buyer_id, seller_id, project_id, total, random.choice(['funds_held', 'funds_released', 'completed']), random_date()))
        
        cursor.execute("INSERT INTO order_items (id, order_id, product_id, quantity_sold, price_at_purchase) VALUES (?, ?, ?, ?, ?)",
                      (generate_id('item'), oid, prod_id, qty, price))

    conn.commit()

def main():
    if not os.path.exists('database'):
        os.makedirs('database')
        
    conn = init_db()
    users, sellers = seed_users(conn)
    if not sellers:
        print("Warning: No sellers generated. Retrying user generation.")
        return main()
        
    products = seed_products(conn, sellers)
    seed_orders(conn, users, products)
    
    print("Database seeded successfully!")
    conn.close()

if __name__ == '__main__':
    main()
