from rest_framework import serializers
from .models import (
    Category, Product, ProductImage, Order, OrderItem, Cart, CartItem, Wishlist,
    Project, ProductAlert, Kit, Flag, Dispute
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    seller_business_name = serializers.CharField(source='seller.business_name', read_only=True, allow_null=True)
    savings_percentage = serializers.IntegerField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'seller_name', 'seller_business_name',
            'title', 'description', 'category', 'category_name',
            'condition', 'quantity', 'unit_of_measure',
            'price', 'market_price', 'savings_percentage',
            'weight_per_unit', 'dimensions',
            'location_lat', 'location_long', 'location_name',
            'status', 'views', 'saves',
            'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['seller', 'views', 'saves', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_business_name = serializers.CharField(source='seller.business_name', read_only=True, allow_null=True)
    savings_percentage = serializers.IntegerField(read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url if primary.image else None
        first_image = obj.images.first()
        return first_image.image.url if first_image and first_image.image else None
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category_name', 'seller_business_name',
            'condition', 'quantity', 'unit_of_measure',
            'price', 'market_price', 'savings_percentage',
            'location_name', 'status', 'primary_image', 'created_at'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'quantity', 'price_at_purchase', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'seller', 'seller_name', 'project', 'project_name',
            'total_amount', 'tax_amount', 'delivery_method', 'delivery_status',
            'escrow_status', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['buyer', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders with items."""
    seller = serializers.IntegerField()
    project = serializers.IntegerField(required=False, allow_null=True)
    delivery_method = serializers.ChoiceField(choices=Order.DELIVERY_CHOICES)
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=10, decimal_places=2)
        )
    )
    
    def validate_items(self, value):
        """Validate that items list is not empty and has required fields."""
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each item must have product_id and quantity.")
        return value
    
    def create(self, validated_data):
        """Create order with items."""
        from decimal import Decimal
        
        items_data = validated_data.pop('items')
        buyer = self.context['request'].user
        seller_id = validated_data.pop('seller')
        
        # Calculate totals
        total_amount = Decimal('0.00')
        order_items = []
        
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            quantity = Decimal(str(item_data['quantity']))
            subtotal = product.price * quantity
            total_amount += subtotal
            order_items.append({
                'product': product,
                'quantity': quantity,
                'price_at_purchase': product.price
            })
        
        # Calculate tax (example: 21% VAT)
        tax_amount = total_amount * Decimal('0.21')
        
        # Get project if provided
        project_id = validated_data.pop('project', None)
        project = None
        if project_id:
            from .models import Project
            project = Project.objects.filter(id=project_id, buyer=buyer).first()
        
        # Create order
        order = Order.objects.create(
            buyer=buyer,
            seller_id=seller_id,
            project=project,
            total_amount=total_amount,
            tax_amount=tax_amount,
            **validated_data
        )
        
        # Create order items
        for item_data in order_items:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    def get_product_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        if primary and primary.image:
            return primary.image.url
        first_image = obj.product.images.first()
        return first_image.image.url if first_image and first_image.image else None
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'product_price', 'product_image', 'quantity', 'subtotal', 'added_at']
        read_only_fields = ['added_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_details', 'saved_at']
        read_only_fields = ['saved_at']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for buyer projects."""
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    order_count = serializers.IntegerField(read_only=True)
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'buyer', 'buyer_name', 'name', 'description', 'budget',
            'status', 'total_spent', 'order_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['buyer', 'created_at', 'updated_at']


class ProductAlertSerializer(serializers.ModelSerializer):
    """Serializer for product alerts."""
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    
    class Meta:
        model = ProductAlert
        fields = [
            'id', 'user', 'keywords', 'category', 'category_name',
            'max_price', 'condition', 'location_name', 'location_lat',
            'location_long', 'radius_km', 'notification_frequency',
            'is_active', 'last_notified_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'last_notified_at', 'created_at', 'updated_at']


class KitSerializer(serializers.ModelSerializer):
    """Serializer for limited-time kits."""
    is_available = serializers.BooleanField(read_only=True)
    savings_percentage = serializers.IntegerField(read_only=True)
    kit_type_display = serializers.CharField(source='get_kit_type_display', read_only=True)
    
    class Meta:
        model = Kit
        fields = [
            'id', 'kit_type', 'kit_type_display', 'title', 'description',
            'start_date', 'end_date', 'quantity_available', 'quantity_sold',
            'price', 'market_price', 'savings_percentage', 'location_name',
            'location_lat', 'location_long', 'status', 'specifications',
            'views', 'saves', 'is_available', 'created_at', 'updated_at'
        ]
        read_only_fields = ['views', 'saves', 'created_at', 'updated_at']


class FlagSerializer(serializers.ModelSerializer):
    """Serializer for flags/reports."""
    flagger_name = serializers.CharField(source='flagger.username', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.username', read_only=True, allow_null=True)
    product_title = serializers.CharField(source='product.title', read_only=True, allow_null=True)
    order_id = serializers.IntegerField(source='order.id', read_only=True, allow_null=True)
    flagged_user_name = serializers.CharField(source='flagged_user.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Flag
        fields = [
            'id', 'flagger', 'flagger_name', 'flag_type', 'reason', 'description',
            'product', 'product_title', 'order', 'order_id', 'flagged_user',
            'flagged_user_name', 'status', 'reviewed_by', 'reviewed_by_name',
            'admin_notes', 'resolved_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['flagger', 'reviewed_by', 'resolved_at', 'created_at', 'updated_at']


class DisputeSerializer(serializers.ModelSerializer):
    """Serializer for disputes."""
    raised_by_name = serializers.CharField(source='raised_by.username', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.username', read_only=True, allow_null=True)
    order_details = OrderSerializer(source='order', read_only=True)
    
    class Meta:
        model = Dispute
        fields = [
            'id', 'order', 'order_details', 'raised_by', 'raised_by_name',
            'reason', 'description', 'buyer_evidence', 'seller_evidence',
            'status', 'resolved_by', 'resolved_by_name', 'resolution_notes',
            'refund_amount', 'resolved_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['raised_by', 'resolved_by', 'resolved_at', 'created_at', 'updated_at']
