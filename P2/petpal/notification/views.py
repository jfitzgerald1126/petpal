from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, CreateAPIView
from notification.models import Notification, ApplicationNotification, CommentNotification, ApplicationCommentNotification
from notification.serializers import ApplicationNotificationSerializer, CommentNotificationSerializer, NotificationSerializer, ApplicationCommentNotificationSerializer
from pet.models import Application 
from comment.models import Comment, ApplicationComment
from django.core.exceptions import PermissionDenied, BadRequest
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters, pagination
from accounts.models import Shelter, Seeker
from django.urls import reverse

# Create your views here.

class CreateApplicationSubmittedNotificationView(APIView):
    """This endpoint creates a notifcation for a submitted application when a POST request is sent"""
    notif_types = ['submission', 'withdrawl', 'acceptance', 'rejection']
    def post(self, request, *args, **kwargs):
        if not 'notification_type' in request.data or request.data['notification_type'] not in self.notif_types:
            raise BadRequest('`notification_type` field is either missing or invalid. Supported values: {}'.format(str(self.notif_types)))
        
        notif_type = request.data['notification_type']
        application = get_object_or_404(Application, id=kwargs['application_id'])
        if notif_type == 'submission':
            if application.seeker.user != request.user:
                raise PermissionDenied("Notifications can only be sent for valid submitted applications.")
            user = application.pet.shelter.user
            content = "{} submitted an application for your pet {}.".format(application.seeker.first_name + ' ' + application.seeker.last_name, application.pet.name)
        elif notif_type == "withdrawl":
            if application.seeker.user != request.user:
                raise PermissionDenied("Notifications can only be sent for valid submitted applications.")
            user = application.pet.shelter.user
            content = "{} withdrew their application for your pet {}.".format(application.seeker.first_name + ' ' + application.seeker.last_name, application.pet.name)
        elif notif_type == "acceptance":
            if application.pet.shelter.user != request.user:
                raise PermissionDenied("Notifications can only be sent for valid submitted applications.")
            user = application.seeker.user
            content = "{} accepted your application for their pet {}.".format(application.pet.shelter.shelter_name, application.pet.name)
        elif notif_type == "rejection":
            if application.pet.shelter.user != request.user:
                raise PermissionDenied("Notifications can only be sent for valid submitted applications.")
            user = application.seeker.user
            content = "{} rejected your application for their pet {}.".format(application.pet.shelter.shelter_name, application.pet.name)

        notification_data = {
            'application': application.id, 
            'user': user.id, 
            'content': content,
            'type': 'application',
        }

        serializer = ApplicationNotificationSerializer(data=notification_data)
        
        if serializer.is_valid():
            serializer.save(application=application, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise BadRequest(serializer.errors)

class CreateCommentNotificationView(APIView):
    """This endpoint creates a notifcation when a POST Request is sent, given a comment_id"""
    def post(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, id=kwargs['comment_id'])
        if comment.commenter_id != request.user:
            raise PermissionDenied("Notifications can only be sent for your own comments.")
        user = comment.shelter_id.user
        if hasattr(comment.commenter_id, 'shelter'):
            user_object = Shelter.objects.get(user=comment.commenter_id)
            username = user_object.shelter_name
        else:
            user_object = Seeker.objects.get(user=comment.commenter_id)
            username = user_object.first_name + ' ' + user_object.last_name 
        content = "{} left a comment on your shelter.".format(username)

        notification_data = {
            'comment': comment.id, 
            'user': user.id, 
            'content': content,
            'type': 'comment',
        }

        serializer = CommentNotificationSerializer(data=notification_data)
        
        if serializer.is_valid():
            serializer.save(comment=comment, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise BadRequest(serializer.errors)

class CreateApplicationCommentNotificationView(APIView):
    """This Endpoint creates a notification when a POST Request is sent given comment_id signifying that a new application comment was created"""
    def post(self, request, *args, **kwargs):
        comment = get_object_or_404(ApplicationComment, id=kwargs['comment_id'])
        if comment.sender != request.user:
            raise PermissionDenied("Notifications can only be sent for your own comments.")
        if comment.sender == comment.application.seeker.user:
            user = comment.application.pet.shelter.user
        else:
            user = comment.application.seeker.user
        content = "{} left a comment on an application for {}.".format(request.user, comment.application.pet.name)

        notification_data = {
            'application_comment': comment.id, 
            'user': user.id, 
            'content': content,
            'type': 'application_comment',
        }

        serializer = ApplicationCommentNotificationSerializer(data=notification_data)

        if serializer.is_valid():
            serializer.save(application_comment=comment, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise BadRequest(serializer.errors)

class UpdateDeleteRetrieveNotificationView(APIView):
    """This endpoint shows a notification on GET Request and when you make a request with GET, it marks the notifcation as read. It also deletes a notification on Delete Request"""
    def get(self, request, *args, **kwargs):
        notification = get_object_or_404(Notification, id=kwargs['pk'])
        if notification.user != request.user:
            raise PermissionDenied("You do not have access to this notification.")
        if notification.type == 'application':
            notification = get_object_or_404(ApplicationNotification, id=kwargs['pk'])
            url = request.build_absolute_uri(reverse('application-details', kwargs={'pk': notification.application.pk}))
        elif notification.type == 'comment':
            notification = get_object_or_404(CommentNotification, id=kwargs['pk'])
            url = request.build_absolute_uri(reverse('specific-comment', kwargs={'comment_id': notification.comment.pk}))
        else:
            notification = get_object_or_404(ApplicationCommentNotification, id=kwargs['pk'])
            url = request.build_absolute_uri(reverse('specific-application-comment', kwargs={'comment_id': notification.application_comment.pk}))

        notification.read_status = True
        notification.save()
        return Response({"url": url}, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        notification = get_object_or_404(Notification, id=kwargs['pk'])
        if notification.user != request.user:
            raise PermissionDenied("You do not have access to update this notification.")
        notification.delete()
        return Response({"detail", "notification deleted successfully"}, status=status.HTTP_200_OK)


class NotificationPagination(pagination.PageNumberPagination):
    page_size = 5

class NotificationFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'read_status' in request.query_params:
            queryset = queryset.filter(read_status=request.query_params['read_status'])
        return queryset
class ListNotificationView(ListAPIView):
    """This endpoint lists all notifcations on GET Request"""
    serializer_class = NotificationSerializer
    ordering_fields = ['timestamp']
    filterset_fields = ['read_status']
    ordering = ['-timestamp']
    filter_backends = [NotificationFilter, filters.OrderingFilter]
    pagination_class = NotificationPagination

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        return queryset 