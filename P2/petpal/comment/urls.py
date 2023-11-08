from django.urls import path
from comment import views

urlpatterns=[
    path('comments/<int:shelter_id>', views.SeekerCommentCreate.as_view(), name='comment_create'),
    path('super/comments/', views.AdminCommentCreate.as_view(), name='comment_create'),

]