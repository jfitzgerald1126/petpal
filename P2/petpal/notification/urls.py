from django.urls import path
from notification import views


urlpatterns=[ 
    path('<int:user_id>/create/', views.NotificationCreate.as_view(), name='notification_create'),
    path('super/create/', views.AdminNotificationCreate.as_view(), name='admin_notification_create'),
    path('super/<int:notification_id>/', views.AdminNotificationRetrieveUpdateDestroy.as_view(), name='admin_notification_retrieve_update_destroy'),
]