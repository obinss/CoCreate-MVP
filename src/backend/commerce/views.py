from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Category, Product, Order, Cart, CartItem, Wishlist, Project, ProductAlert, Kit, Flag, Dispute
from .serializers import (
    CategorySerializer, ProductSerializer, ProductListSerializer, 
    OrderSerializer, OrderCreateSerializer, CartSerializer, 
    CartItemSerializer, WishlistSerializer, ProjectSerializer,
    ProductAlertSerializer, KitSerializer,
    FlagSerializer, FlagCreateSerializer, FlagUpdateSerializer,
    DisputeSerializer, DisputeCreateSerializer, DisputeEvidenceSerializer, DisputeResolveSerializer
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
        serializer.save(seller=self.request.user)
    
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
    
    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        """Get all orders for a project."""
        project = self.get_object()
        orders = project.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class ProductAlertViewSet(viewsets.ModelViewSet):
    """API endpoint for product alerts."""
    serializer_class = ProductAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProductAlert.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def check_matches(self, request):
        """Check for products matching active alerts."""
        from math import radians, cos, sin, asin, sqrt
        
        alerts = ProductAlert.objects.filter(user=request.user, is_active=True)
        matches = []
        
        for alert in alerts:
            # Build query
            query = Q(status='active')
            
            if alert.keywords:
                query &= (Q(title__icontains=alert.keywords) | Q(description__icontains=alert.keywords))
            
            if alert.category:
                query &= Q(category=alert.category)
            
            if alert.max_price:
                query &= Q(price__lte=alert.max_price)
            
            if alert.condition:
                query &= Q(condition=alert.condition)
            
            # Location filter (if provided)
            products = Product.objects.filter(query)
            
            if alert.location_lat and alert.location_long:
                # Filter by radius
                def haversine(lon1, lat1, lon2, lat2):
                    """Calculate distance between two points."""
                    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
                    dlon = lon2 - lon1
                    dlat = lat2 - lat1
                    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
                    c = 2 * asin(sqrt(a))
                    km = 6371 * c
                    return km
                
                filtered_products = []
                for product in products:
                    if product.location_lat and product.location_long:
                        distance = haversine(
                            float(alert.location_long),
                            float(alert.location_lat),
                            float(product.location_long),
                            float(product.location_lat)
                        )
                        if distance <= alert.radius_km:
                            filtered_products.append(product)
                products = filtered_products
            else:
                products = list(products)
            
            if products:
                matches.append({
                    'alert_id': alert.id,
                    'alert_name': str(alert),
                    'products': ProductListSerializer(products, many=True).data
                })
        
        return Response({'matches': matches})


class KitViewSet(viewsets.ModelViewSet):
    """API endpoint for limited-time kits."""
    queryset = Kit.objects.all()
    serializer_class = KitSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['kit_type', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'end_date', 'price', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all currently active kits."""
        now = timezone.now()
        active_kits = Kit.objects.filter(
            status='active',
            start_date__lte=now,
            end_date__gte=now,
            quantity_available__gt=0
        )
        serializer = self.get_serializer(active_kits, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get all upcoming kits."""
        now = timezone.now()
        upcoming_kits = Kit.objects.filter(
            status='upcoming',
            start_date__gt=now
        )
        serializer = self.get_serializer(upcoming_kits, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment kit view count."""
        kit = self.get_object()
        kit.views += 1
        kit.save(update_fields=['views'])
        return Response({'views': kit.views})


class FlagViewSet(viewsets.ModelViewSet):
    """API endpoint for flags."""
    serializer_class = FlagSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['flag_type', 'status', 'reason']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Admins can see all flags, users see their own
        if user.is_staff:
            return Flag.objects.all().select_related('flagged_by', 'resolved_by', 'product', 'order', 'flagged_user')
        return Flag.objects.filter(flagged_by=user).select_related('flagged_by', 'resolved_by', 'product', 'order', 'flagged_user')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FlagCreateSerializer
        elif self.action == 'update_status':
            return FlagUpdateSerializer
        return FlagSerializer
    
    def perform_create(self, serializer):
        """Create flag with current user as flagged_by."""
        serializer.save(flagged_by=self.request.user)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Update flag status (admin only)."""
        flag = self.get_object()
        serializer = FlagUpdateSerializer(flag, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Set resolved_by if resolving
        if request.data.get('status') in ['resolved', 'dismissed']:
            serializer.save(resolved_by=request.user)
        else:
            serializer.save()
        
        return Response(FlagSerializer(flag).data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """Get all pending flags (admin only)."""
        pending_flags = Flag.objects.filter(status='pending')
        serializer = self.get_serializer(pending_flags, many=True)
        return Response(serializer.data)


class DisputeViewSet(viewsets.ModelViewSet):
    """API endpoint for disputes."""
    serializer_class = DisputeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'reason']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Admins see all disputes, users see disputes they're involved in
        if user.is_staff:
            return Dispute.objects.all().select_related('order', 'raised_by', 'resolved_by')
        return Dispute.objects.filter(
            Q(raised_by=user) | Q(order__buyer=user) | Q(order__seller=user)
        ).select_related('order', 'raised_by', 'resolved_by')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DisputeCreateSerializer
        elif self.action == 'add_evidence':
            return DisputeEvidenceSerializer
        elif self.action == 'resolve':
            return DisputeResolveSerializer
        return DisputeSerializer
    
    def perform_create(self, serializer):
        """Create dispute with current user as raised_by."""
        dispute = serializer.save(raised_by=self.request.user)
        # Update order escrow status to disputed
        dispute.order.escrow_status = 'disputed'
        dispute.order.save(update_fields=['escrow_status'])
    
    @action(detail=True, methods=['post'])
    def add_evidence(self, request, pk=None):
        """Add evidence to dispute (buyer or seller)."""
        dispute = self.get_object()
        serializer = DisputeEvidenceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        evidence = serializer.validated_data['evidence']
        user = request.user
        
        # Determine if user is buyer or seller
        if user == dispute.order.buyer:
            dispute.buyer_evidence = evidence
            dispute.save(update_fields=['buyer_evidence'])
        elif user == dispute.order.seller:
            dispute.seller_evidence = evidence
            dispute.save(update_fields=['seller_evidence'])
        else:
            return Response(
                {'error': 'You are not a party to this dispute'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return Response(DisputeSerializer(dispute).data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def resolve(self, request, pk=None):
        """Resolve dispute (admin only)."""
        dispute = self.get_object()
        serializer = DisputeResolveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        resolution_type = serializer.validated_data['resolution_type']
        refund_amount = serializer.validated_data.get('refund_amount')
        resolution_notes = serializer.validated_data.get('resolution_notes', '')
        
        # Update dispute
        dispute.status = resolution_type
        dispute.resolution_type = resolution_type
        dispute.refund_amount = refund_amount
        dispute.resolution_notes = resolution_notes
        dispute.resolved_by = request.user
        dispute.save()  # This will trigger the save method which updates order escrow status
        
        return Response(DisputeSerializer(dispute).data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def open(self, request):
        """Get all open disputes (admin only)."""
        open_disputes = Dispute.objects.filter(status__in=['open', 'under_review'])
        serializer = self.get_serializer(open_disputes, many=True)
        return Response(serializer.data)

