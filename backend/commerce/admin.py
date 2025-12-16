from django.contrib import admin
from django.utils import timezone
from .models import (
    Category, Product, ProductImage, Order, OrderItem, Cart, CartItem, Wishlist,
    Project, ProductAlert, Kit, Flag, Dispute
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


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'buyer', 'status', 'budget', 'total_spent', 'order_count', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'description', 'buyer__username']
    readonly_fields = ['total_spent', 'order_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Project Information', {
            'fields': ('buyer', 'name', 'description', 'status', 'budget')
        }),
        ('Statistics', {
            'fields': ('total_spent', 'order_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ProductAlert)
class ProductAlertAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'keywords', 'category', 'max_price', 'location_name', 'radius_km', 'is_active', 'created_at']
    list_filter = ['is_active', 'notification_frequency', 'created_at']
    search_fields = ['user__username', 'keywords', 'location_name']
    readonly_fields = ['last_notified_at', 'created_at', 'updated_at']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Alert Criteria', {
            'fields': ('keywords', 'category', 'max_price', 'condition')
        }),
        ('Location Filter', {
            'fields': ('location_name', 'location_lat', 'location_long', 'radius_km')
        }),
        ('Notification Settings', {
            'fields': ('notification_frequency', 'is_active', 'last_notified_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Kit)
class KitAdmin(admin.ModelAdmin):
    list_display = ['title', 'kit_type', 'status', 'price', 'quantity_available', 'quantity_sold', 'start_date', 'end_date', 'is_available']
    list_filter = ['kit_type', 'status', 'start_date', 'end_date']
    search_fields = ['title', 'description']
    readonly_fields = ['views', 'saves', 'savings_percentage', 'is_available', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Kit Information', {
            'fields': ('kit_type', 'title', 'description', 'status')
        }),
        ('Availability', {
            'fields': ('start_date', 'end_date', 'quantity_available', 'quantity_sold', 'is_available')
        }),
        ('Pricing', {
            'fields': ('price', 'market_price', 'savings_percentage')
        }),
        ('Location', {
            'fields': ('location_name', 'location_lat', 'location_long')
        }),
        ('Specifications', {
            'fields': ('specifications',)
        }),
        ('Metadata', {
            'fields': ('views', 'saves', 'created_at', 'updated_at')
        }),
    )


@admin.register(Flag)
class FlagAdmin(admin.ModelAdmin):
    list_display = ['id', 'flag_type', 'reason', 'flagger', 'status', 'created_at']
    list_filter = ['flag_type', 'status', 'reason', 'created_at']
    search_fields = ['description', 'flagger__username', 'product__title']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    
    fieldsets = (
        ('Flag Information', {
            'fields': ('flagger', 'flag_type', 'reason', 'description')
        }),
        ('Related Objects', {
            'fields': ('product', 'order', 'flagged_user')
        }),
        ('Review', {
            'fields': ('status', 'reviewed_by', 'admin_notes', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['mark_as_resolved', 'mark_as_dismissed']
    
    def mark_as_resolved(self, request, queryset):
        queryset.update(status='resolved', reviewed_by=request.user, resolved_at=timezone.now())
    mark_as_resolved.short_description = 'Mark selected flags as resolved'
    
    def mark_as_dismissed(self, request, queryset):
        queryset.update(status='dismissed', reviewed_by=request.user, resolved_at=timezone.now())
    mark_as_dismissed.short_description = 'Mark selected flags as dismissed'


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'raised_by', 'reason', 'status', 'refund_amount', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['description', 'order__id', 'raised_by__username']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    
    fieldsets = (
        ('Dispute Information', {
            'fields': ('order', 'raised_by', 'reason', 'description')
        }),
        ('Evidence', {
            'fields': ('buyer_evidence', 'seller_evidence')
        }),
        ('Resolution', {
            'fields': ('status', 'resolved_by', 'resolution_notes', 'refund_amount', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['favor_buyer', 'favor_seller', 'partial_refund']
    
    def favor_buyer(self, request, queryset):
        queryset.update(
            status='buyer_favored',
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
    favor_buyer.short_description = 'Resolve in favor of buyer'
    
    def favor_seller(self, request, queryset):
        queryset.update(
            status='seller_favored',
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
    favor_seller.short_description = 'Resolve in favor of seller'
    
    def partial_refund(self, request, queryset):
        queryset.update(
            status='partial_refund',
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
    partial_refund.short_description = 'Mark for partial refund'
