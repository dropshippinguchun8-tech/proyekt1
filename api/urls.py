from django.urls import path, include

urlpatterns = [
    path('api/v1/', include('auth.urls')),
    path('api/v1/', include('leads.urls')),
    path('api/v1/', include('dashboard.urls')),
    path('api/v1/', include('payout.urls')),
]