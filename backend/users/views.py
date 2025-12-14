from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer, SellerApplicationSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for users."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def apply_seller(self, request):
        """Apply to become a seller."""
        if request.user.is_seller:
            return Response(
                {'detail': 'You are already a seller.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SellerApplicationSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'detail': 'Seller application submitted successfully.',
                'verification_status': 'pending'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
