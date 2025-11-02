from django.db import models
from django.conf import settings

class Lead(models.Model):
    STATUS_NEW = 'new'
    STATUS_ACCEPTED = 'accepted'
    STATUS_SOLD = 'sold'
    STATUS_RETURNED = 'returned'

    STATUS_CHOICES = [
        (STATUS_NEW, 'Yangi'),
        (STATUS_ACCEPTED, 'Qabul'),
        (STATUS_SOLD, 'Sotildi'),
        (STATUS_RETURNED, 'Qaytdi'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    offer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    meta = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.offer_name} - {self.phone} ({self.status})"