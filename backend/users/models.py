from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model for CoCreate platform."""
    
    # User roles
    ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    is_seller = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Seller-specific fields
    business_name = models.CharField(max_length=255, blank=True, null=True)
    tax_id = models.CharField(max_length=100, blank=True, null=True)
    verification_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ],
        blank=True,
        null=True
    )
    default_pickup_address = models.TextField(blank=True, null=True)
    
    # Ratings & sales
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    total_sales = models.IntegerField(default=0)
    
    # Additional profile fields
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Watchlist (many-to-many to products, defined later)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
