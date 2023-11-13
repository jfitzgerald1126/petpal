from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from pet.models import Application
from comment.models import Comment

class Notification(models.Model):


    # user_id = models.IntegerField(default=1, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # chage later when user model is created
    date = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)


class CommentNotification(Notification):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
# extends Notification, both notifications only differ by the model they are related to


class ApplicationNotification(Notification):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)