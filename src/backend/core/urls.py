from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from commerce.views import (
    CategoryViewSet, ProductViewSet, OrderViewSet, CartViewSet,
    WishlistViewSet, ProjectViewSet, ProductAlertViewSet, KitViewSet,
    FlagViewSet, DisputeViewSet
)
from users.views import UserViewSet

# DRF Router
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'alerts', ProductAlertViewSet, basename='alert')
router.register(r'kits', KitViewSet, basename='kit')
router.register(r'flags', FlagViewSet, basename='flag')
router.register(r'disputes', DisputeViewSet, basename='dispute')
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include(router.urls)),
    
    # Authentication endpoints
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Browsable API (development only)
    path('api-auth/', include('rest_framework.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

