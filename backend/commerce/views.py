from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Order
from .serializers import (
    CategorySerializer, ProductSerializer, ProductListSerializer, OrderSerializer
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
    
    def get_queryset(self):
        user = self.request.user
        # Users can see orders where they are buyer or seller
        return Order.objects.filter(
            models.Q(buyer=user) | models.Q(seller=user)
        ).select_related('buyer', 'seller').prefetch_related('items__product')
    
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)
