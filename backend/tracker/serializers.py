from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Transaction

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color']


class TransactionSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        required=False,
        allow_null=True
    )
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id',
            'type',
            'amount',
            'note',
            'category_id',
            'category_name',
            'category_icon',
            'category_color',
            'created_at',
            'formatted_date'
        ]
        read_only_fields = ['id', 'created_at']

    def get_formatted_date(self, obj):
        # Format: "Nov 15, 2026 • 8:45 PM"
        if not obj.created_at:
            return ""
        # Local or formatted date
        dt = obj.created_at
        return dt.strftime('%b %d, %Y • %I:%M %p')

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
