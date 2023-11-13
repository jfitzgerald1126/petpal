from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from notification.models import Notification, CommentNotification, ApplicationNotification
from notification.serializers import NotificationSerializer, AdminNotificationSerializer, CommentNotificationSerializer, ApplicationNotificationSerializer
from comment.models import Comment
from comment.serializers import CommentSerializer
from pet.models import Application 
from pet.serializers import ApplicationSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied

# Create your views here.


# class NotificationCreate(ListCreateAPIView):

#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]
#     def get_queryset(self):
#         return Notification.objects.filter(user_id=self.kwargs['user_id']).order_by('date')
    
#     def perform_create(self, serializer):
#         user = self.request.user
#         # if not isinstance(user, Seeker):
#         #     raise PermissionDenied("Only Seekers can create notifications.")
#         serializer.save(user_id=user)

# class NotificationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]
#     def get_object(self):
#         notification = get_object_or_404(Notification, pk=self.kwargs['notification_id']).filter(user_id=self.kwargs['user_id'])
#         notification.read_status = True
#         # make notification read upon retrieval 
#         return notification

def get_status(is_read):
    if is_read == 'read' or  is_read == 'unread':
        return is_read 
    else:
        raise PermissionDenied("Invalid status.")
# LIST AND CREATE
class BaseNotificationListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        status = get_status(self.kwargs['is_read'])
        return self.model.objects.filter(user=self.kwargs['user_id'], read_status = status).order_by('date')

class CommentNotificationCreate(BaseNotificationListCreateView):
    serializer_class = CommentNotificationSerializer
    def perform_create(self, serializer):
        user = self.request.user
        comment = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
        serializer.save(user_id=user, comment=comment)

class ApplicationNotificationCreate(BaseNotificationListCreateView):
    serializer_class = ApplicationNotificationSerializer
    def perform_create(self, serializer):
        user = self.request.user
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        serializer.save(user_id=user, application=application)


# UPDATE AND DELETE 
class CommentNotificationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentNotificationSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        notification = get_object_or_404(CommentNotification, pk=self.kwargs['comment_id'])
        if notification.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this notification.")
        notification.read_status = True
        # make notification read upon retrieval 
        return notification

class ApplicationNotificationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationNotificationSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        notification = get_object_or_404(ApplicationNotification, pk=self.kwargs['notification_id'])
        if notification.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this notification.")
        notification.read_status = True
        # make notification read upon retrieval 
        return notification
    
# GET
class CommentNotificationRetreive(RetrieveAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        comment = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
        return comment
    
class ApplicationNotificationRetreive(RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        return application
    


class AdminNotificationCreate(ListCreateAPIView):
    serializer_class = AdminNotificationSerializer
    permission_classes = [IsAdminUser]
    queryset = Notification.objects.all()

class AdminNotificationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = AdminNotificationSerializer
    permission_classes = [IsAdminUser]
    def get_object(self):
        return get_object_or_404(Notification, pk=self.kwargs['notification_id'])