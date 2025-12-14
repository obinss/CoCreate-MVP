from rest_framework import serializers
from .models import Category, Product, ProductImage, Order, OrderItem


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
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'seller', 'seller_name',
            'total_amount', 'tax_amount', 'delivery_method', 'delivery_status',
            'escrow_status', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['buyer', 'created_at', 'updated_at']
