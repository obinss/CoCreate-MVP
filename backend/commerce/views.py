from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import (
    Category, Product, Order, Cart, CartItem, Wishlist,
    Project, ProductAlert, AlertNotification, Kit, KitItem
)
from .serializers import (
    CategorySerializer, ProductSerializer, ProductListSerializer, 
    OrderSerializer, OrderCreateSerializer, CartSerializer, 
    CartItemSerializer, WishlistSerializer,
    ProjectSerializer, ProductAlertSerializer, AlertNotificationSerializer,
    KitSerializer, KitListSerializer, KitItemSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    """API endpoint for products with filtering and search."""
    queryset = Product.objects.filter(status='active').select_related('category', 'seller').prefetch_related('images')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'condition', 'status', 'seller']
    search_fields = ['title', 'description', 'category__name']
    ordering_fields = ['created_at', 'price', 'views']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def perform_create(self, serializer):
        product = serializer.save(seller=self.request.user)
        # Check if this product matches any alerts
        check_product_alerts(product)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment product view count."""
        product = self.get_object()
        product.views += 1
        product.save(update_fields=['views'])
        return Response({'views': product.views})
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get products grouped by category."""
        category_id = request.query_params.get('category_id')
        if category_id:
            products = self.get_queryset().filter(category_id=category_id)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'category_id required'}, status=400)


class OrderViewSet(viewsets.ModelViewSet):
    """API endpoint for orders."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Users can see orders where they are buyer or seller
        return Order.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).select_related('buyer', 'seller').prefetch_related('items__product')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """Create order with items."""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Clear cart after successful order
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class CartViewSet(viewsets.ViewSet):
    """API endpoint for shopping cart."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get current user's cart."""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart."""
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(Product, id=product_id)
        
        # Check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Update quantity if item already exists
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Update item quantity in cart."""
        cart = get_object_or_404(Cart, user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')
        
        if not product_id or quantity is None:
            return Response(
                {'error': 'product_id and quantity are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        
        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from cart."""
        cart = get_object_or_404(Cart, user=request.user)
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        cart_item.delete()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear all items from cart."""
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class WishlistViewSet(viewsets.ModelViewSet):
    """API endpoint for wishlist/saved products."""
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle product in/out of wishlist."""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(Product, id=product_id)
        wishlist_item = Wishlist.objects.filter(user=request.user, product=product).first()
        
        if wishlist_item:
            wishlist_item.delete()
            return Response({'saved': False, 'message': 'Product removed from wishlist'})
        else:
            Wishlist.objects.create(user=request.user, product=product)
            return Response({'saved': True, 'message': 'Product added to wishlist'})


class ProjectViewSet(viewsets.ModelViewSet):
    """API endpoint for buyer projects."""
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(buyer=self.request.user).prefetch_related('orders')
    
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class ProductAlertViewSet(viewsets.ModelViewSet):
    """API endpoint for product alerts."""
    serializer_class = ProductAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProductAlert.objects.filter(user=self.request.user).select_related('category')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle alert active status."""
        alert = self.get_object()
        alert.is_active = not alert.is_active
        alert.save()
        return Response({'is_active': alert.is_active})
    
    @action(detail=False, methods=['get'])
    def notifications(self, request):
        """Get all notifications for user's alerts."""
        alerts = ProductAlert.objects.filter(user=request.user, is_active=True)
        notifications = AlertNotification.objects.filter(
            alert__in=alerts
        ).select_related('alert', 'product').order_by('-sent_at')
        
        serializer = AlertNotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        """Mark notifications as read."""
        notification_ids = request.data.get('notification_ids', [])
        AlertNotification.objects.filter(
            id__in=notification_ids,
            alert__user=request.user
        ).update(read_at=timezone.now())
        return Response({'message': 'Notifications marked as read'})


class KitViewSet(viewsets.ModelViewSet):
    """API endpoint for limited-time kits."""
    queryset = Kit.objects.all().prefetch_related('items')
    serializer_class = KitSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['kit_type', 'status']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['created_at', 'price', 'start_date', 'end_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return KitListSerializer
        return KitSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter active kits for listing
        if self.action == 'list':
            now = timezone.now()
            queryset = queryset.filter(
                status='active',
                start_date__lte=now,
                end_date__gte=now,
                quantity_available__gt=0
            )
        return queryset
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment kit view count."""
        kit = self.get_object()
        kit.views += 1
        kit.save(update_fields=['views'])
        return Response({'views': kit.views})


def check_product_alerts(product):
    """Check if a newly created product matches any active alerts and create notifications."""
    import math
    
    # Get all active alerts
    alerts = ProductAlert.objects.filter(is_active=True)
    
    for alert in alerts:
        matches = True
        
        # Check category
        if alert.category and product.category != alert.category:
            matches = False
            continue
        
        # Check keywords
        if alert.keywords:
            keywords = [k.strip().lower() for k in alert.keywords.split(',')]
            product_text = f"{product.title} {product.description}".lower()
            if not any(keyword in product_text for keyword in keywords):
                matches = False
                continue
        
        # Check max price
        if alert.max_price and product.price > alert.max_price:
            matches = False
            continue
        
        # Check condition
        if alert.condition and product.condition != alert.condition:
            matches = False
            continue
        
        # Check location (within radius) using Haversine formula
        if alert.location_lat and alert.location_long and product.location_lat and product.location_long:
            # Convert to radians
            lat1 = math.radians(float(alert.location_lat))
            lat2 = math.radians(float(product.location_lat))
            lon1 = math.radians(float(alert.location_long))
            lon2 = math.radians(float(product.location_long))
            
            # Haversine formula
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
            c = 2 * math.asin(math.sqrt(a))
            distance_km = 6371 * c  # Earth radius in km
            
            if distance_km > alert.radius_km:
                matches = False
                continue
        
        # If matches, create notification
        if matches:
            AlertNotification.objects.get_or_create(
                alert=alert,
                product=product
            )
            
            # Update last_notified_at if immediate frequency
            if alert.frequency == 'immediate':
                alert.last_notified_at = timezone.now()
                alert.save(update_fields=['last_notified_at'])
