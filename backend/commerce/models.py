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
    """Buyer projects to organize orders and materials."""
    
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
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.buyer.username}"
    
    @property
    def total_spent(self):
        """Calculate total spent on this project."""
        return sum(order.total_amount for order in self.orders.all())
    
    @property
    def order_count(self):
        """Get number of orders in this project."""
        return self.orders.count()
    
    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']


class ProductAlert(models.Model):
    """Buyer alerts for specific products within a region."""
    
    NOTIFICATION_FREQUENCY_CHOICES = [
        ('instant', 'Instant'),
        ('daily', 'Daily Digest'),
        ('weekly', 'Weekly Digest'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_alerts')
    
    # Alert criteria
    keywords = models.CharField(max_length=255, blank=True, help_text="Search keywords")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts')
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    condition = models.CharField(max_length=20, choices=Product.CONDITION_CHOICES, blank=True)
    
    # Location filter
    location_name = models.CharField(max_length=100, blank=True)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    radius_km = models.IntegerField(default=50, help_text="Search radius in kilometers")
    
    # Notification settings
    notification_frequency = models.CharField(max_length=20, choices=NOTIFICATION_FREQUENCY_CHOICES, default='instant')
    is_active = models.BooleanField(default=True)
    last_notified_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Alert: {self.keywords or self.category} - {self.user.username}"
    
    class Meta:
        db_table = 'product_alerts'
        ordering = ['-created_at']


class Kit(models.Model):
    """Limited-time niche kits from construction site excess materials."""
    
    KIT_TYPE_CHOICES = [
        ('thermal_shell', 'Thermal Shell Pack'),
        ('stone_bbq', 'Stone BBQ Station'),
        ('herringbone_deck', 'Herringbone Deck Pack'),
        ('industrial_shelving', 'Industrial Shelving Unit'),
        ('privacy_screen', 'Privacy Screen Kit'),
        ('green_wall', 'Green Wall Trellis Kit'),
        ('instant_path', 'Instant Path Aggregate Pack'),
        ('acoustic_pack', 'Silent Office Acoustic Pack'),
        ('garage_rail', 'Heavy Duty Garage Rail'),
    ]
    
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('active', 'Active'),
        ('sold_out', 'Sold Out'),
        ('ended', 'Ended'),
    ]
    
    kit_type = models.CharField(max_length=50, choices=KIT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Limited-time availability
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Inventory
    quantity_available = models.IntegerField(default=0)
    quantity_sold = models.IntegerField(default=0)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Location
    location_name = models.CharField(max_length=100)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    
    # Kit specifications (stored as JSON-like text or separate fields)
    specifications = models.TextField(blank=True, help_text="Kit contents and specifications")
    
    # Metadata
    views = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def is_available(self):
        """Check if kit is currently available."""
        from django.utils import timezone
        now = timezone.now()
        return (
            self.status == 'active' and
            self.start_date <= now <= self.end_date and
            self.quantity_available > 0
        )
    
    @property
    def savings_percentage(self):
        """Calculate savings percentage vs market price."""
        if self.market_price and self.market_price > 0:
            return round(((self.market_price - self.price) / self.market_price) * 100)
        return 0
    
    class Meta:
        db_table = 'kits'
        ordering = ['-created_at']


class Flag(models.Model):
    """Flags for reporting products, orders, or users."""
    
    FLAG_TYPE_CHOICES = [
        ('product', 'Product Listing'),
        ('order', 'Order/Sale'),
        ('user', 'User Account'),
    ]
    
    REASON_CHOICES = [
        ('inappropriate', 'Inappropriate Content'),
        ('fraud', 'Fraudulent Activity'),
        ('quality_issue', 'Quality Issue'),
        ('spam', 'Spam'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewing', 'Under Review'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]
    
    # Flag details
    flag_type = models.CharField(max_length=20, choices=FLAG_TYPE_CHOICES)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    description = models.TextField()
    
    # Reporter
    flagged_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='flags_created')
    
    # Target (one of these will be set based on flag_type)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, related_name='flags')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True, related_name='flags')
    flagged_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='flags_received')
    
    # Status and resolution
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='flags_resolved')
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        target = self.product or self.order or self.flagged_user
        return f"Flag #{self.id} - {self.get_flag_type_display()}: {target}"
    
    def save(self, *args, **kwargs):
        # Set resolved_at when status changes to resolved or dismissed
        if self.status in ['resolved', 'dismissed'] and not self.resolved_at:
            self.resolved_at = timezone.now()
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = 'flags'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['flag_type', 'status']),
            models.Index(fields=['status', '-created_at']),
        ]


class Dispute(models.Model):
    """Disputes for order resolution with escrow management."""
    
    REASON_CHOICES = [
        ('not_as_described', 'Not as Described'),
        ('damaged', 'Damaged'),
        ('not_received', 'Not Received'),
        ('quality_issue', 'Quality Issue'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('buyer_favored', 'Buyer Favored'),
        ('seller_favored', 'Seller Favored'),
        ('partial_refund', 'Partial Refund'),
        ('closed', 'Closed'),
    ]
    
    # Dispute details
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='disputes')
    raised_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='disputes_raised')
    reason = models.CharField(max_length=30, choices=REASON_CHOICES)
    description = models.TextField()
    
    # Evidence from both parties
    buyer_evidence = models.TextField(blank=True)
    seller_evidence = models.TextField(blank=True)
    
    # Status and resolution
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution_type = models.CharField(max_length=20, choices=STATUS_CHOICES[2:5], null=True, blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    
    # Admin resolution
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='disputes_resolved')
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dispute #{self.id} - Order #{self.order.id}"
    
    def save(self, *args, **kwargs):
        # Set resolved_at when dispute is resolved
        if self.status in ['buyer_favored', 'seller_favored', 'partial_refund', 'closed'] and not self.resolved_at:
            self.resolved_at = timezone.now()
        
        # Update order escrow status based on dispute resolution
        if self.status == 'buyer_favored':
            self.order.escrow_status = 'refunded'
            self.order.save(update_fields=['escrow_status'])
        elif self.status == 'seller_favored':
            self.order.escrow_status = 'released'
            self.order.save(update_fields=['escrow_status'])
        elif self.status == 'partial_refund':
            # Partial refund keeps escrow as disputed until manually handled
            self.order.escrow_status = 'disputed'
            self.order.save(update_fields=['escrow_status'])
        
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = 'disputes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order', 'status']),
            models.Index(fields=['status', '-created_at']),
        ]
