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
    project = models.ForeignKey('Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    
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


class Cart(models.Model):
    """Shopping cart for users."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart - {self.user.username}"
    
    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())
    
    class Meta:
        db_table = 'carts'


class CartItem(models.Model):
    """Items in a user's shopping cart."""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def subtotal(self):
        return self.quantity * self.product.price
    
    def __str__(self):
        return f"{self.quantity}x {self.product.title}"
    
    class Meta:
        db_table = 'cart_items'
        unique_together = ['cart', 'product']


class Wishlist(models.Model):
    """User wishlist/saved products."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.product.title}"
    
    class Meta:
        db_table = 'wishlist'
        unique_together = ['user', 'product']


class Project(models.Model):
    """Buyer projects to organize orders."""
    
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.buyer.username}"
    
    @property
    def total_spent(self):
        """Calculate total spent on this project."""
        return sum(order.total_amount for order in self.orders.all())
    
    @property
    def remaining_budget(self):
        """Calculate remaining budget."""
        if self.budget:
            return self.budget - self.total_spent
        return None
    
    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']


class ProductAlert(models.Model):
    """Alerts for buyers to get notified when matching products are posted."""
    
    FREQUENCY_CHOICES = [
        ('immediate', 'Immediate'),
        ('daily', 'Daily Digest'),
        ('weekly', 'Weekly Digest'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_alerts')
    name = models.CharField(max_length=255, help_text="Name for this alert (e.g., 'Looking for insulation')")
    
    # Search criteria
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    keywords = models.CharField(max_length=500, blank=True, help_text="Comma-separated keywords")
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    condition = models.CharField(max_length=20, choices=Product.CONDITION_CHOICES, null=True, blank=True)
    
    # Location filter (radius in km)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_name = models.CharField(max_length=100, blank=True)
    radius_km = models.IntegerField(default=50, help_text="Radius in kilometers")
    
    # Notification settings
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='immediate')
    is_active = models.BooleanField(default=True)
    last_notified_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"
    
    class Meta:
        db_table = 'product_alerts'
        ordering = ['-created_at']


class AlertNotification(models.Model):
    """Records of notifications sent for product alerts."""
    alert = models.ForeignKey(ProductAlert, on_delete=models.CASCADE, related_name='notifications')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='alert_notifications')
    sent_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'alert_notifications'
        ordering = ['-sent_at']
        unique_together = ['alert', 'product']


class Kit(models.Model):
    """Limited-time niche kits from construction site excess materials."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('sold_out', 'Sold Out'),
        ('expired', 'Expired'),
    ]
    
    # Basic info
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, help_text="Brief description for listings")
    
    # Kit details from Improvements.txt
    kit_type = models.CharField(
        max_length=50,
        choices=[
            ('thermal_shell', 'Thermal Shell Pack'),
            ('stone_bbq', 'Stone BBQ Station'),
            ('herringbone_deck', 'Herringbone Deck Pack'),
            ('industrial_shelving', 'Industrial Shelving'),
            ('privacy_screen', 'Privacy Screen'),
            ('green_wall', 'Green Wall Trellis'),
            ('instant_path', 'Instant Path Pack'),
            ('acoustic_pack', 'Acoustic Pack'),
            ('garage_rail', 'Garage Rail'),
        ]
    )
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Inventory
    quantity_available = models.IntegerField(default=0)
    max_quantity_per_order = models.IntegerField(default=1)
    
    # Limited time offer
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Source information (for marketing)
    source_description = models.CharField(
        max_length=255,
        blank=True,
        help_text="e.g., 'Sourced from Hilton Hotel project'"
    )
    
    # Specifications (stored as JSON or text)
    specifications = models.JSONField(default=dict, blank=True, help_text="Kit specifications")
    
    # Images
    primary_image = models.ImageField(upload_to='kits/', blank=True, null=True)
    
    # Metadata
    views = models.IntegerField(default=0)
    orders_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def is_active(self):
        """Check if kit is currently active."""
        from django.utils import timezone
        return (
            self.status == 'active' and
            self.quantity_available > 0 and
            timezone.now() >= self.start_date and
            timezone.now() <= self.end_date
        )
    
    @property
    def savings_percentage(self):
        """Calculate savings percentage vs market price."""
        if self.market_price and self.market_price > 0:
            return round(((self.market_price - self.price) / self.market_price) * 100)
        return 0
    
    @property
    def days_remaining(self):
        """Calculate days remaining until expiration."""
        from django.utils import timezone
        if timezone.now() > self.end_date:
            return 0
        delta = self.end_date - timezone.now()
        return delta.days
    
    class Meta:
        db_table = 'kits'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'start_date', 'end_date']),
            models.Index(fields=['kit_type']),
        ]


class KitItem(models.Model):
    """Items/components included in a kit."""
    kit = models.ForeignKey(Kit, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    quantity = models.CharField(max_length=100, help_text="e.g., '15 sheets', '40 linear meters'")
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'kit_items'
        ordering = ['order']
