from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from leads.models import Lead
from payout.models import PayoutRequest
from django.db.models import Count, Sum
from decimal import Decimal
from leads.serializers import LeadSerializer

class DashboardSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        qs = Lead.objects.all() if user.is_staff else Lead.objects.filter(user=user)
        total_leads = qs.count()
        by_status = qs.values('status').annotate(count=Count('id'))
        payouts = PayoutRequest.objects.all() if user.is_staff else PayoutRequest.objects.filter(user=user)
        payout_count = payouts.count()
        data = {
            'total_leads': total_leads,
            'leads_by_status': list(by_status),
            'payout_requests_count': payout_count,
        }
        return Response(data)

class DashboardLeadsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        qs = Lead.objects.all() if user.is_staff else Lead.objects.filter(user=user)
        serialized = LeadSerializer(qs, many=True).data
        return Response(serialized)

class DashboardBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sold_count = Lead.objects.filter(user=user, status=Lead.STATUS_SOLD).count()
        if getattr(user, 'is_targetolog', False):
            per_lead = Decimal('30000')
        elif getattr(user, 'is_operator', False):
            per_lead = Decimal('7000')
        else:
            per_lead = Decimal('0')
        earned = per_lead * sold_count
        pending = PayoutRequest.objects.filter(user=user, processed=False).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        balance = earned - pending
        data = {
            'sold_leads': sold_count,
            'per_lead_rate': str(per_lead),
            'earned_total': str(earned),
            'pending_payouts': str(pending),
            'balance': str(balance),
        }
        return Response(data)