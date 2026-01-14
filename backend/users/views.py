from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authtoken.models import Token
from .serializers import (
    UserSerializer, UserCreateSerializer, SellerApplicationSerializer,
    LoginSerializer, SellerVerificationSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for users."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'login']:
            return [AllowAny()]
        elif self.action == 'verify_seller':
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action == 'login':
            return LoginSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        """Register a new user."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create auth token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login user."""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Log in user (creates session)
        login(request, user)
        
        # Get or create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout user."""
        # Delete token
        try:
            request.user.auth_token.delete()
        except:
            pass
        
        # Logout from session
        logout(request)
        
        return Response({'detail': 'Successfully logged out.'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Update current user profile."""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
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
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def verify_seller(self, request):
        """Admin action to approve or reject seller applications."""
        serializer = SellerVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_id = serializer.validated_data['user_id']
        approved = serializer.validated_data['approved']
        
        user = User.objects.get(id=user_id)
        
        if approved:
            user.verification_status = 'approved'
            user.is_verified = True
            message = f'Seller {user.username} approved successfully.'
        else:
            user.verification_status = 'rejected'
            user.is_seller = False
            message = f'Seller {user.username} rejected.'
        
        user.save()
        
        return Response({
            'detail': message,
            'user': UserSerializer(user).data
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending_sellers(self, request):
        """Get list of pending seller applications (admin only)."""
        pending = User.objects.filter(is_seller=True, verification_status='pending')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)
