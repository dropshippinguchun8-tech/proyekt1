from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Lead
from .serializers import LeadSerializer, LeadCreateSerializer, LeadStatusUpdateSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class LeadListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LeadSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_staff', False):
            return Lead.objects.all()
        return Lead.objects.filter(user=user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LeadCreateSerializer
        return LeadSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_lead_status(request):
    serializer = LeadStatusUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    lead_id = serializer.validated_data['id']
    status_value = serializer.validated_data['status']
    lead = get_object_or_404(Lead, id=lead_id)
    lead.status = status_value
    lead.save()
    return Response(LeadSerializer(lead).data, status=status.HTTP_200_OK)


# Facebook webhook to accept leads (simple implementation)
@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def facebook_webhook(request):
    # Verification challenge (GET)
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        VERIFY_TOKEN = getattr(settings, 'FB_VERIFY_TOKEN', None)
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            return Response(challenge, status=status.HTTP_200_OK)
        return Response('Forbidden', status=status.HTTP_403_FORBIDDEN)

    # POST: incoming lead
    payload = request.data
    entries = payload.get('entry', []) if isinstance(payload, dict) else []
    created_leads = []
    try:
        for entry in entries:
            changes = entry.get('changes', [])
            for change in changes:
                value = change.get('value', {})
                # value structure may vary; attempt common extraction
                form_data = value.get('form_data') or value.get('field_data') or value.get('data') or {}
                phone = None
                email = None
                offer_name = value.get('ad_id') or value.get('form_id') or value.get('page_id') or 'Facebook Lead'
                # form_data can be list or dict depending on webhook payload
                if isinstance(form_data, dict):
                    phone = form_data.get('phone_number') or form_data.get('phone')
                    email = form_data.get('email')
                elif isinstance(form_data, list):
                    for item in form_data:
                        name = item.get('name') or item.get('field')
                        values = item.get('values') or item.get('value') or item.get('values', [])
                        # normalize values
                        if isinstance(values, list) and values:
                            val = values[0]
                        else:
                            val = values
                        if name in ('phone_number', 'phone') and not phone:
                            phone = val
                        if name in ('email',) and not email:
                            email = val
                # fallback to nested payload keys
                if not phone:
                    phone = value.get('phone') or value.get('phone_number')
                if not email:
                    email = value.get('email')

                # ensure at least a phone/email or store with unknown tag
                phone_safe = phone or 'unknown'
                email_safe = email or None

                lead = Lead.objects.create(
                    offer_name=str(offer_name),
                    phone=str(phone_safe),
                    email=email_safe,
                    meta=value
                )
                created_leads.append(lead.id)
                # optional: notify via telegram if available
                try:
                    from telegram_integration.utils import send_telegram_message
                    send_telegram_message(f"New FB lead: {lead.offer_name} / {lead.phone}")
                except Exception:
                    logger.exception('Telegram notify failed')
    except Exception:
        logger.exception('Failed to process facebook webhook payload')
        return Response({'detail': 'failed to process payload'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'created': created_leads}, status=status.HTTP_201_CREATED)