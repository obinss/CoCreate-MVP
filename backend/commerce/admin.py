from django.contrib import admin
from .models import (
    Category, Product, ProductImage, Order, OrderItem, Cart, CartItem, Wishlist,
    Project, ProductAlert, AlertNotification, Kit, KitItem
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'is_primary', 'order']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price_at_purchase', 'subtotal']
    fields = ['product', 'quantity', 'price_at_purchase', 'subtotal']
    
    def subtotal(self, obj):
        return obj.subtotal
    subtotal.short_description = 'Subtotal'


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['added_at', 'subtotal']
    fields = ['product', 'quantity', 'subtotal', 'added_at']
    
    def subtotal(self, obj):
        return obj.subtotal
    subtotal.short_description = 'Subtotal'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'seller', 'category', 'condition', 'price', 'quantity', 'status', 'created_at']
    list_filter = ['status', 'condition', 'category', 'created_at']
    search_fields = ['title', 'description', 'seller__username']
    readonly_fields = ['views', 'saves', 'created_at', 'updated_at', 'savings_percentage']
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('seller', 'title', 'description', 'category')
        }),
        ('Condition & Quantity', {
            'fields': ('condition', 'quantity', 'unit_of_measure')
        }),
        ('Pricing', {
            'fields': ('price', 'market_price', 'savings_percentage')
        }),
        ('Physical Properties', {
            'fields': ('weight_per_unit', 'dimensions')
        }),
        ('Location', {
            'fields': ('location_name', 'location_lat', 'location_long')
        }),
        ('Status & Metadata', {
            'fields': ('status', 'views', 'saves', 'created_at', 'updated_at')
        }),
    )
    
    actions = ['mark_as_sold', 'mark_as_active', 'mark_as_inactive']
    
    def mark_as_sold(self, request, queryset):
        queryset.update(status='sold')
    mark_as_sold.short_description = 'Mark selected products as sold'
    
    def mark_as_active(self, request, queryset):
        queryset.update(status='active')
    mark_as_active.short_description = 'Mark selected products as active'
    
    def mark_as_inactive(self, request, queryset):
        queryset.update(status='inactive')
    mark_as_inactive.short_description = 'Mark selected products as inactive'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer', 'seller', 'project', 'total_amount', 'delivery_method', 'delivery_status', 'escrow_status', 'created_at']
    list_filter = ['delivery_status', 'escrow_status', 'delivery_method', 'created_at']
    search_fields = ['buyer__username', 'seller__username', 'project__name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Parties', {
            'fields': ('buyer', 'seller', 'project')
        }),
        ('Order Details', {
            'fields': ('total_amount', 'tax_amount')
        }),
        ('Delivery', {
            'fields': ('delivery_method', 'delivery_status')
        }),
        ('Payment', {
            'fields': ('escrow_status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'subtotal', 'updated_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at', 'total_items', 'subtotal']
    inlines = [CartItemInline]
    
    fieldsets = (
        ('Cart Information', {
            'fields': ('user', 'total_items', 'subtotal')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'saved_at']
    list_filter = ['saved_at']
    search_fields = ['user__username', 'product__title']
    readonly_fields = ['saved_at']


class KitItemInline(admin.TabularInline):
    model = KitItem
    extra = 1
    fields = ['name', 'description', 'quantity', 'order']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'buyer', 'status', 'budget', 'total_spent', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'buyer__username', 'description']
    readonly_fields = ['total_spent', 'remaining_budget', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Project Information', {
            'fields': ('buyer', 'name', 'description', 'status')
        }),
        ('Budget', {
            'fields': ('budget', 'total_spent', 'remaining_budget')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ProductAlert)
class ProductAlertAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'category', 'is_active', 'frequency', 'created_at']
    list_filter = ['is_active', 'frequency', 'created_at']
    search_fields = ['name', 'user__username', 'keywords']
    readonly_fields = ['last_notified_at', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Alert Information', {
            'fields': ('user', 'name', 'is_active', 'frequency')
        }),
        ('Search Criteria', {
            'fields': ('category', 'keywords', 'max_price', 'condition')
        }),
        ('Location Filter', {
            'fields': ('location_name', 'location_lat', 'location_long', 'radius_km')
        }),
        ('Notifications', {
            'fields': ('last_notified_at',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(AlertNotification)
class AlertNotificationAdmin(admin.ModelAdmin):
    list_display = ['alert', 'product', 'sent_at', 'read_at']
    list_filter = ['sent_at', 'read_at']
    search_fields = ['alert__name', 'product__title', 'alert__user__username']
    readonly_fields = ['sent_at']


@admin.register(Kit)
class KitAdmin(admin.ModelAdmin):
    list_display = ['name', 'kit_type', 'status', 'price', 'quantity_available', 'is_active', 'start_date', 'end_date']
    list_filter = ['status', 'kit_type', 'start_date', 'end_date']
    search_fields = ['name', 'description', 'short_description']
    readonly_fields = ['views', 'orders_count', 'is_active', 'days_remaining', 'savings_percentage', 'created_at', 'updated_at']
    inlines = [KitItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'kit_type', 'description', 'short_description')
        }),
        ('Pricing', {
            'fields': ('price', 'market_price', 'savings_percentage')
        }),
        ('Inventory', {
            'fields': ('quantity_available', 'max_quantity_per_order')
        }),
        ('Limited Time Offer', {
            'fields': ('start_date', 'end_date', 'status', 'is_active', 'days_remaining')
        }),
        ('Source Information', {
            'fields': ('source_description', 'specifications')
        }),
        ('Media', {
            'fields': ('primary_image',)
        }),
        ('Statistics', {
            'fields': ('views', 'orders_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
