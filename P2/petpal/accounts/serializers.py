from rest_framework.serializers import ModelSerializer
from .models import Seeker, Shelter
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class SeekerSerializer(ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = Seeker
        fields = "__all__"

    def validate(self, data):
        # Validate that passwords match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        try:
            validate_password(data["password"], self.instance)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)

        return data

    def create(self, validated_data):
        user_data = {
            "username": validated_data.pop("username"),
            "password": validated_data.pop("password"),
        }

        # Create a new user
        user = User.objects.create_user(**user_data)

        seeker = Seeker.objects.create(user=user, **validated_data)

        return seeker


class ShelterSerializer(ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = Shelter
        fields = "__all__"

    def validate(self, data):
        # Validate that passwords match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        try:
            validate_password(data["password"], self.instance)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)

        return data

    def create(self, validated_data):
        user_data = {
            "username": validated_data.pop("username"),
            "password": validated_data.pop("password"),
        }

        # Create a new user
        user = User.objects.create_user(**user_data)

        shelter = Shelter.objects.create(user=user, **validated_data)

        return shelter
