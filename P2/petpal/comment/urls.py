from django.urls import path
from comment import views

urlpatterns=[
    path('review/<int:shelter_id>/', views.ShelterCommentCreate.as_view(), name='comment_create'),
    path('application/<int:application_id>/', views.ApplicationCommentCreate.as_view(), name='application_comment_create'),

    path('specific_review/<int:comment_id>/', views.ReviewRetreive.as_view(), name='specific-comment'),
    path('specific_application/<int:comment_id>/', views.ApplicationCommentRetreive.as_view(), name='specific-application-comment'),

    path('super/', views.AdminCommentCreate.as_view(), name='admin_comment_create'),
    path('super/<int:comment_id>/', views.AdminCommentRetrieveUpdateDestroy.as_view(), name='admin_comment_retrieve_update_destroy'),
]