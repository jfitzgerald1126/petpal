from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField

from notification.models import Notification, CommentNotification, ApplicationNotification


class NotificationSerializer(ModelSerializer):
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    class Meta: 
        model = Notification
        fields = ['read_status', 'date']


class CommentNotificationSerializer(NotificationSerializer):
    class Meta:
        model = CommentNotification
      


class ApplicationNotificationSerializer(NotificationSerializer):
    class Meta:
        model = ApplicationNotification
  

class AdminNotificationSerializer(NotificationSerializer):
    pass