from django.db import models
from django.conf import settings


class Category(models.Model):
    """Product categories."""
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True)  # Font Awesome class or emoji
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']


class Product(models.Model):
    """Construction materials products."""
    
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('opened_unused', 'Opened/Unused'),
        ('cut_undamaged', 'Cut/Undamaged'),
        ('slightly_damaged', 'Slightly Damaged'),
    ]
    
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('ton', 'Ton'),
        ('sqm', 'Square Meter'),
        ('count', 'Count'),
        ('linear_meter', 'Linear Meter'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('sold', 'Sold'),
        ('inactive', 'Inactive'),
    ]
    
    # Basic info
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    
    # Condition & quantity
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_of_measure = models.CharField(max_length=20, choices=UNIT_CHOICES)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price per unit
    market_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Physical properties
    weight_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Weight in kg")
    dimensions = models.CharField(max_length=100, blank=True, help_text="e.g., 1200x180x15mm")
    
    # Location
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_name = models.CharField(max_length=100)
    
    # Status & metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    views = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def savings_percentage(self):
        """Calculate savings percentage vs market price."""
        if self.market_price and self.market_price > 0:
            return round(((self.market_price - self.price) / self.market_price) * 100)
        return 0
    
    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['seller', 'status']),
            models.Index(fields=['-created_at']),
        ]


class ProductImage(models.Model):
    """Product images."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'product_images'
        ordering = ['order']
        

class Order(models.Model):
    """Purchase orders."""
    
    DELIVERY_CHOICES = [
        ('carrier', 'Carrier Delivery'),
        ('pickup', 'Self Pickup'),
    ]
    
    ESCROW_STATUS_CHOICES = [
        ('funds_held', 'Funds Held'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
    ]
    
    DELIVERY_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('ready_for_pickup', 'Ready for Pickup'),
    ]
    
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='purchases')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='sales')
    
    # Order details
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Delivery
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_CHOICES)
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='pending')
    
    # Payment
    escrow_status = models.CharField(max_length=20, choices=ESCROW_STATUS_CHOICES, default='funds_held')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.buyer.username}"
    
    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']


class OrderItem(models.Model):
    """Items within an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def subtotal(self):
        return self.quantity * self.price_at_purchase
    
    class Meta:
        db_table = 'order_items'
