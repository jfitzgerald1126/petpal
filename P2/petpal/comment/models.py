from django.db import models
from accounts.models import Shelter, Seeker
from django.core.validators import MaxValueValidator, MinValueValidator
# assuming that the shelter model is already created in the accounts app
# Create your models here.

class Comment(models.Model):
    # shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    # seeker_id = models.ForeignKey(Seeker, on_delete=models.CASCADE)

    shelter_id = models.IntegerField(default=1, blank=False, null=False)
    seeker_id = models.IntegerField(default=1, blank=False, null=False)
    rating = models.IntegerField(default=1, 
                                 validators=[MaxValueValidator(5), MinValueValidator(1)],
                                 blank=False, null=False)
    content = models.TextField(default="")
    date = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return f"{self.name}"
