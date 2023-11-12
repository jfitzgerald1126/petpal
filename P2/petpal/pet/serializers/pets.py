from rest_framework.serializers import ModelSerializer
from ..models.pets import Pet

class PetSerializer(ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'