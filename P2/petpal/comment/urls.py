from django.urls import path
from comment import views

urlpatterns=[
    path('review/<int:shelter_id>/', views.ShelterCommentCreate.as_view(), name='comment_create'),
    path('application/<int:application_id>/', views.ApplicationCommentCreate.as_view(), name='application_comment_create'),
    # path('comment/<int:comment_id>/', views.SeekerCommentRetreiveUpdateDestroy.as_view(), name='comment_retrieve_update_destroy'),
    path('super/', views.AdminCommentCreate.as_view(), name='admin_comment_create'),
    path('super/<int:comment_id>/', views.AdminCommentRetrieveUpdateDestroy.as_view(), name='admin_comment_retrieve_update_destroy'),
]