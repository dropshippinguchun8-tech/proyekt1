from rest_framework import serializers
from .models import PayoutRequest

class PayoutRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutRequest
        fields = '__all__'
        read_only_fields = ('id', 'user', 'requested_at', 'processed', 'processed_at')