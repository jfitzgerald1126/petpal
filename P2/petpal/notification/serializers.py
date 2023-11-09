from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField

from notification.models import Notification


class NotificationSerializer(ModelSerializer):
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta: 
        model = Notification
        fields = '__all__'

class AdminNotificationSerializer(NotificationSerializer):
    pass