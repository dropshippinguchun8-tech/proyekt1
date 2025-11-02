from django.urls import path
from .views import LeadListCreateAPIView, update_lead_status, facebook_webhook

urlpatterns = [
    path('leads/', LeadListCreateAPIView.as_view(), name='leads-list-create'),
    path('leads/status/', update_lead_status, name='leads-status-update'),
    path('webhook/facebook/', facebook_webhook, name='facebook-webhook'),
]