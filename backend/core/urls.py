from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from commerce.views import CategoryViewSet, ProductViewSet, OrderViewSet
from users.views import UserViewSet

# DRF Router
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),  # Browsable API login
]
