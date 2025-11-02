from rest_framework import generics, permissions
from .models import PayoutRequest
from .serializers import PayoutRequestSerializer

class PayoutRequestCreateAPIView(generics.CreateAPIView):
    serializer_class = PayoutRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PayoutHistoryListAPIView(generics.ListAPIView):
    serializer_class = PayoutRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_staff', False):
            return PayoutRequest.objects.all()
        return PayoutRequest.objects.filter(user=user)