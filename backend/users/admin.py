from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_seller', 'verification_status', 'is_staff']
    list_filter = ['role', 'is_seller', 'verification_status', 'is_staff', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'business_name']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'avatar')}),
        ('User Role', {'fields': ('role', 'is_seller', 'is_verified')}),
        ('Seller Information', {
            'fields': ('business_name', 'tax_id', 'verification_status', 'default_pickup_address'),
            'classes': ('collapse',),
        }),
        ('Ratings & Sales', {
            'fields': ('rating', 'total_sales'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    actions = ['approve_seller', 'reject_seller']
    
    def approve_seller(self, request, queryset):
        """Approve seller applications."""
        count = queryset.filter(verification_status='pending').update(
            verification_status='approved',
            is_verified=True
        )
        self.message_user(request, f'{count} seller(s) approved successfully.')
    approve_seller.short_description = 'Approve selected seller applications'
    
    def reject_seller(self, request, queryset):
        """Reject seller applications."""
        count = queryset.filter(verification_status='pending').update(
            verification_status='rejected',
            is_seller=False
        )
        self.message_user(request, f'{count} seller application(s) rejected.')
    reject_seller.short_description = 'Reject selected seller applications'
