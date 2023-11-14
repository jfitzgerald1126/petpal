from django.urls import path
from notification import views


urlpatterns=[ 
    path('<int:user_id>/comment/<int:comment_id>/<str:is_read>/', views.CommentNotificationCreate.as_view(), name='notification_create'),
    path('<int:user_id>/application/<int:application_id>/<str:is_read>/', views.ApplicationNotificationCreate.as_view(), name='notification_create'),
    path('comment/<int:comment_id>/', views.CommentNotificationRetrieveUpdateDestroy.as_view(), name='notification_modify'),
    path('application/<int:application_id>/', views.ApplicationNotificationRetrieveUpdateDestroy.as_view(), name='notification_modify'),

    path('comment/source/<int:comment_id>/', views.CommentNotificationRetreive.as_view(), name='notification_retrieve'),
    path('application/source/<int:application_id>/', views.ApplicationNotificationRetreive.as_view(), name='notification_retrieve'),

    path('super/create/', views.AdminNotificationCreate.as_view(), name='admin_notification_create'),
    path('super/<int:notification_id>/', views.AdminNotificationRetrieveUpdateDestroy.as_view(), name='admin_notification_retrieve_update_destroy'),
]