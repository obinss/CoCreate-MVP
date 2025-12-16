from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from commerce.views import (
    CategoryViewSet, ProductViewSet, OrderViewSet, CartViewSet, WishlistViewSet,
    ProjectViewSet, ProductAlertViewSet, KitViewSet, FlagViewSet, DisputeViewSet
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
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),  # Browsable API login
    path('api/auth/token/', obtain_auth_token, name='api_token_auth'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
