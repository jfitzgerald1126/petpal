from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from comment.models import Comment
from comment.serializers import CommentSerializer, AdminCommentSerializer
from accounts.models import Shelter, Seeker
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied

# Create your views here.


class SeekerCommentCreate(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(shelter_id=self.kwargs['shelter_id'])
    # only get the comments for the specific shelter

    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['shelter_id'])
        commenter = self.request.user
        # retreive the shelter object from the database
        # if not isinstance(seeker, Seeker):
        #    raise PermissionDenied("Only Seekers can create comments.")
        serializer.save(shelter_id=shelter, commenter_id=commenter)
        # set the shelter_id of the comment to the shelter object



class AdminCommentCreate(ListCreateAPIView):
    serializer_class = AdminCommentSerializer
    permission_classes = [IsAdminUser]
    queryset = Comment.objects.all()
    # see all the comments for all the shelters


class AdminCommentRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = AdminCommentSerializer
    permission_classes = [IsAdminUser]
    def get_object(self):
        return get_object_or_404(Comment, pk=self.kwargs['comment_id'])