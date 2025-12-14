#!/usr/bin/env python
"""
Initialize CoCreate database with sample data.
Run this after migrations: python init_data.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from commerce.models import Category, Product, ProductImage
from decimal import Decimal

User = get_user_model()


def create_users():
    """Create sample users."""
    print("Creating users...")
    
    # Create admin
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@cocreate.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        admin.role = 'admin'
        admin.save()
        print("✓ Admin user created (username: admin, password: admin123)")
    
    # Create sample seller
    if not User.objects.filter(username='seller1').exists():
        seller = User.objects.create_user(
            username='seller1',
            email='seller@example.com',
            password='seller123',
            first_name='John',
            last_name='Builder'
        )
        seller.role = 'seller'
        seller.is_seller = True
        seller.verification_status = 'approved'
        seller.is_verified = True
        seller.business_name = 'BuildCo Construction'
        seller.phone = '+31612345678'
        seller.default_pickup_address = 'Industrieweg 12, 1234 AB Amsterdam'
        seller.save()
        print("✓ Seller user created (username: seller1, password: seller123)")
    
    # Create sample buyer
    if not User.objects.filter(username='buyer1').exists():
        buyer = User.objects.create_user(
            username='buyer1',
            email='buyer@example.com',
            password='buyer123',
            first_name='Jane',
            last_name='Renovator'
        )
        buyer.role = 'buyer'
        buyer.phone = '+31687654321'
        buyer.save()
        print("✓ Buyer user created (username: buyer1, password: buyer123)")


def create_categories():
    """Create product categories."""
    print("\nCreating categories...")
    
    categories = [
        {'name': 'Flooring', 'icon': 'fa-layer-group'},
        {'name': 'Tiles', 'icon': 'fa-border-all'},
        {'name': 'Doors & Windows', 'icon': 'fa-door-open'},
        {'name': 'Lumber', 'icon': 'fa-tree'},
        {'name': 'Bricks & Blocks', 'icon': 'fa-cubes'},
        {'name': 'Insulation', 'icon': 'fa-temperature-half'},
        {'name': 'Roofing', 'icon': 'fa-house'},
        {'name': 'Paint & Supplies', 'icon': 'fa-paint-roller'},
    ]
    
    for cat_data in categories:
        category, created = Category.objects.get_or_create(**cat_data)
        if created:
            print(f"  ✓ Created category: {category.name}")


def create_products():
    """Create sample products."""
    print("\nCreating products...")
    
    seller = User.objects.filter(is_seller=True).first()
    if not seller:
        print("  ✗ No seller found. Creating users first...")
        create_users()
        seller = User.objects.filter(is_seller=True).first()
    
    # Get categories
    flooring = Category.objects.get(name='Flooring')
    tiles = Category.objects.get(name='Tiles')
    lumber = Category.objects.get(name='Lumber')
    bricks = Category.objects.get(name='Bricks & Blocks')
    
    products = [
        {
            'seller': seller,
            'title': 'Premium Oak Flooring - Surplus Stock',
            'description': 'High-quality oak flooring planks. Opened boxes from completed project. Excellent condition, just cut to size. Perfect for medium-sized rooms.',
            'category': flooring,
            'condition': 'cut_undamaged',
            'quantity': Decimal('45.50'),
            'unit_of_measure': 'sqm',
            'price': Decimal('35.00'),
            'market_price': Decimal('65.00'),
            'weight_per_unit': Decimal('12.5'),
            'dimensions': '1200x180x15mm',
            'location_name': 'Amsterdam, Noord',
            'location_lat': Decimal('52.3947'),
            'location_long': Decimal('4.9125'),
            'status': 'active',
        },
        {
            'seller': seller,
            'title': 'Ceramic Bathroom Tiles - White Gloss',
            'description': 'Brand new white ceramic tiles, still in original packaging. Over-ordered for a renovation project. 300x600mm format.',
            'category': tiles,
            'condition': 'new',
            'quantity': Decimal('25.00'),
            'unit_of_measure': 'sqm',
            'price': Decimal('18.50'),
            'market_price': Decimal('32.00'),
            'weight_per_unit': Decimal('18.0'),
            'dimensions': '300x600x8mm',
            'location_name': 'Rotterdam, Centrum',
            'location_lat': Decimal('51.9225'),
            'location_long': Decimal('4.4792'),
            'status': 'active',
        },
        {
            'seller': seller,
            'title': 'Construction Lumber 4x2" - Mixed Lengths',
            'description': 'Quality construction lumber, various lengths from 2m to 4m. Slight weathering on some pieces but structurally perfect. Ideal for framing or outdoor projects.',
            'category': lumber,
            'condition': 'slightly_damaged',
            'quantity': Decimal('150.00'),
            'unit_of_measure': 'linear_meter',
            'price': Decimal('4.25'),
            'market_price': Decimal('7.50'),
            'weight_per_unit': Decimal('3.2'),
            'dimensions': '100x50mm (4x2")',
            'location_name': 'Utrecht, Overvecht',
            'location_lat': Decimal('52.1050'),
            'location_long': Decimal('5.1050'),
            'status': 'active',
        },
        {
            'seller': seller,
            'title': 'Red Clay Bricks - European Standard',
            'description': 'Traditional red clay bricks, European standard size. Surplus from housing development. Clean, stacked on pallets.',
            'category': bricks,
            'condition': 'new',
            'quantity': Decimal('2500.00'),
            'unit_of_measure': 'count',
            'price': Decimal('0.45'),
            'market_price': Decimal('0.85'),
            'weight_per_unit': Decimal('2.2'),
            'dimensions': '210x100x50mm',
            'location_name': 'The Hague, Laak',
            'location_lat': Decimal('52.0705'),
            'location_long': Decimal('4.3007'),
            'status': 'active',
        },
        {
            'seller': seller,
            'title': 'Laminate Flooring - Light Oak Effect',
            'description': 'AC4 rated laminate flooring with light oak finish. Opened packages from showroom display. Great quality for residential use.',
            'category': flooring,
            'condition': 'opened_unused',
            'quantity': Decimal('38.00'),
            'unit_of_measure': 'sqm',
            'price': Decimal('12.00'),
            'market_price': Decimal('22.00'),
            'weight_per_unit': Decimal('8.5'),
            'dimensions': '1380x193x8mm',
            'location_name': 'Eindhoven, Strijp',
            'location_lat': Decimal('51.4381'),
            'location_long': Decimal('5.4622'),
            'status': 'active',
        },
    ]
    
    for product_data in products:
        product, created = Product.objects.get_or_create(
            title=product_data['title'],
            defaults=product_data
        )
        if created:
            print(f"  ✓ Created product: {product.title}")


def main():
    print("=" * 60)
    print("CoCreate Platform - Database Initialization")
    print("=" * 60)
    
    create_users()
    create_categories()
    create_products()
    
    print("\n" + "=" * 60)
    print("✓ Database initialization complete!")
    print("=" * 60)
    print("\nYou can now log in with:")
    print("  Admin:  username=admin,   password=admin123")
    print("  Seller: username=seller1, password=seller123")
    print("  Buyer:  username=buyer1,  password=buyer123")
    print("\nAccess the admin panel at: http://127.0.0.1:8001/admin/")
    print("Access the API at: http://127.0.0.1:8001/api/")
    print("=" * 60)


if __name__ == '__main__':
    main()
