from django.contrib import admin
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
    list_display = ['id', 'flag_type', 'reason', 'status', 'flagged_by', 'get_target', 'created_at']
    list_filter = ['flag_type', 'status', 'reason', 'created_at']
    search_fields = ['description', 'flagged_by__username', 'admin_notes']
    readonly_fields = ['flagged_by', 'resolved_at', 'created_at', 'updated_at']
    
    def get_target(self, obj):
        """Display the target of the flag."""
        if obj.product:
            return f"Product: {obj.product.title}"
        elif obj.order:
            return f"Order #{obj.order.id}"
        elif obj.flagged_user:
            return f"User: {obj.flagged_user.username}"
        return "N/A"
    get_target.short_description = 'Target'
    
    fieldsets = (
        ('Flag Information', {
            'fields': ('flag_type', 'reason', 'description', 'status')
        }),
        ('Reporter', {
            'fields': ('flagged_by',)
        }),
        ('Target', {
            'fields': ('product', 'order', 'flagged_user')
        }),
        ('Resolution', {
            'fields': ('admin_notes', 'resolved_by', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['mark_as_reviewing', 'mark_as_resolved', 'mark_as_dismissed']
    
    def mark_as_reviewing(self, request, queryset):
        queryset.update(status='reviewing')
    mark_as_reviewing.short_description = 'Mark selected flags as under review'
    
    def mark_as_resolved(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='resolved', resolved_by=request.user, resolved_at=timezone.now())
    mark_as_resolved.short_description = 'Mark selected flags as resolved'
    
    def mark_as_dismissed(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='dismissed', resolved_by=request.user, resolved_at=timezone.now())
    mark_as_dismissed.short_description = 'Dismiss selected flags'


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'raised_by', 'reason', 'status', 'refund_amount', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['description', 'raised_by__username', 'resolution_notes']
    readonly_fields = ['raised_by', 'resolved_at', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Dispute Information', {
            'fields': ('order', 'raised_by', 'reason', 'description')
        }),
        ('Evidence', {
            'fields': ('buyer_evidence', 'seller_evidence')
        }),
        ('Status & Resolution', {
            'fields': ('status', 'resolution_type', 'refund_amount', 'resolution_notes')
        }),
        ('Admin', {
            'fields': ('resolved_by', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['mark_as_under_review', 'mark_as_closed']
    
    def mark_as_under_review(self, request, queryset):
        queryset.update(status='under_review')
    mark_as_under_review.short_description = 'Mark selected disputes as under review'
    
    def mark_as_closed(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='closed', resolved_by=request.user, resolved_at=timezone.now())
    mark_as_closed.short_description = 'Close selected disputes'
