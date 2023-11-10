from rest_framework.serializers import ModelSerializer
from .models import Seeker, Shelter


class SeekerSerializer(ModelSerializer):
    class Meta:
        model = Seeker
        fields = "__all__"
        # serialize the Seeker model as json


class ShelterSerializer(ModelSerializer):
    class Meta:
        model = Shelter
        fields = "__all__"
        # serialize the Seeker model as json
