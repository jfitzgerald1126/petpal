from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from notification.models import Notification
from notification.serializers import NotificationSerializer, AdminNotificationSerializer
from accounts.models import Shelter, Seeker
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied

# Create your views here.


class NotificationCreate(ListCreateAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        return Notification.objects.filter(user_id=self.kwargs['user_id'])
    
    def perform_create(self, serializer):
        user = self.request.user
        # if not isinstance(user, Seeker):
        #     raise PermissionDenied("Only Seekers can create notifications.")
        serializer.save(user_id=user)


class AdminNotificationCreate(ListCreateAPIView):
    serializer_class = AdminNotificationSerializer
    permission_classes = [IsAdminUser]
    queryset = Notification.objects.all()

class AdminNotificationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = AdminNotificationSerializer
    permission_classes = [IsAdminUser]
    def get_object(self):
        return get_object_or_404(Notification, pk=self.kwargs['notification_id'])