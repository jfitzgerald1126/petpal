from django.db import models

# Create your models here.


class Notification(models.Model):


    user_id = models.IntegerField(default=1, blank=False, null=False)
    # chage later when user model is created
    date = models.DateTimeField(auto_now_add=True)
    content=models.TextField(blank=False, null=False)
    read_status = models.BooleanField(default=False)
    redirect_url = models.CharField(max_length=100, blank=False, null=False)