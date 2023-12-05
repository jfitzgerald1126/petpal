from rest_framework import permissions

class IsShelterOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow shelters to edit or delete their own information.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the shelter owner.
        return obj.user == request.shelter.user