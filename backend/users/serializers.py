from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'is_seller', 'is_verified',
            'business_name', 'tax_id', 'verification_status',
            'default_pickup_address', 'rating', 'total_sales',
            'phone', 'avatar', 'date_joined'
        ]
        read_only_fields = ['id', 'is_verified', 'verification_status', 'rating', 'total_sales', 'date_joined']
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True},
        }


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'role']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class SellerApplicationSerializer(serializers.ModelSerializer):
    """Serializer for seller application."""
    
    class Meta:
        model = User
        fields = ['business_name', 'tax_id', 'default_pickup_address']
        
    def update(self, instance, validated_data):
        instance.is_seller = True
        instance.verification_status = 'pending'
        instance.business_name = validated_data.get('business_name', instance.business_name)
        instance.tax_id = validated_data.get('tax_id', instance.tax_id)
        instance.default_pickup_address = validated_data.get('default_pickup_address', instance.default_pickup_address)
        instance.save()
        return instance
