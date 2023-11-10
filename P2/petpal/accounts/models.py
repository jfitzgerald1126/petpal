from django.db import models
from django.contrib.auth.models import User


class Seeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    email = models.EmailField()
    phone_number = models.CharField(max_length=10, null=False, blank=False)
    description = models.CharField(max_length=600, null=False)
    address = models.CharField(max_length=200, null=False)
    age = models.IntegerField(null=True)


class Shelter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=False, null=False)
    phone_number = models.CharField(max_length=10, null=False, blank=False)
    description = models.CharField(max_length=600, null=False)
    address = models.CharField(max_length=200, null=False, blank=True)
    website = models.URLField(max_length=128, blank=True)
