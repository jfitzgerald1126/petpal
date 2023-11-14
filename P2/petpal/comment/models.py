from django.db import models
from accounts.models import Shelter, Seeker
from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User


# assuming that the shelter model is already created in the accounts app
# Create your models here.


class Comment(models.Model):
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    # content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # object_id = models.PositiveIntegerField()
    # commenter_id= GenericForeignKey('content_type', 'object_id')
    commenter_id = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(
        default=1,
        validators=[MaxValueValidator(5), MinValueValidator(1)],
        blank=False,
        null=False,
    )
    content = models.TextField(default="")
    date = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return f"{self.name}"
