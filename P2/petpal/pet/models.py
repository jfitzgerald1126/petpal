from django.db import models
# from accounts.models import Shelter

class Shelter:
    pass
class Pet(models.Model):

    GENDER_OPTIONS = [('M', 'male'), ('F', 'female'), ('O', 'other')]
    STATUS_OPTIONS = [('L', 'listed'), ('W', 'withdrawn'), ('A', 'adopted')]
    SIZE_OPTIONS = [('S', 'small'), ('M', 'medium'), ('L', 'large')]

    # shelter = models.ForeignKey(Shelter, related_name='shelter', on_delete=models.CASCADE)

    shelter = models.CharField(max_length=200, blank=False, null=False)
    animal = models.CharField(max_length=200, blank=False, null=False)
    breed = models.CharField(max_length=200, blank=False, null=False)
    name = models.CharField(max_length=200, blank=False, null=False)
    caretaker = models.CharField(max_length=200, null=False)
    description = models.CharField(max_length=600)
    birthday = models.DateField(null=True, blank=True)
    listed = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    size = models.CharField(max_length=50, null=False, blank=False, choices=SIZE_OPTIONS)
    gender = models.CharField(max_length=10, null=False, blank=False, choices=GENDER_OPTIONS)
    color = models.CharField(max_length=50, null=False, blank=False)
    status = models.CharField(max_length=10, null=False, blank=False, choices=STATUS_OPTIONS)