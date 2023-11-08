from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField

from comment.models import Comment

class CommentSerializer(ModelSerializer):
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    # format checking for date
    class Meta:
        model = Comment
        fields = '__all__'
        # serialize the comment model as json

class AdminCommentSerializer(CommentSerializer):
    pass