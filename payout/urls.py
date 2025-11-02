from django.urls import path
from .views import PayoutRequestCreateAPIView, PayoutHistoryListAPIView

urlpatterns = [
    path('payout/request/', PayoutRequestCreateAPIView.as_view(), name='payout-request'),
    path('payout/history/', PayoutHistoryListAPIView.as_view(), name='payout-history'),
]