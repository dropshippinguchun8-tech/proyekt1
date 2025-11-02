from django.urls import path
from .views import DashboardSummaryAPIView, DashboardLeadsAPIView, DashboardBalanceAPIView

urlpatterns = [
    path('dashboard/summary/', DashboardSummaryAPIView.as_view(), name='dashboard-summary'),
    path('dashboard/leads/', DashboardLeadsAPIView.as_view(), name='dashboard-leads'),
    path('dashboard/balance/', DashboardBalanceAPIView.as_view(), name='dashboard-balance'),
]