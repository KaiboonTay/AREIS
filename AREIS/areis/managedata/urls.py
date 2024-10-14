from django.urls import path, re_path
from . import views # '.' means the folder in the main directory we are importing the views.py where the methods for navigating to pages are.


app_name= 'managedata' #to designate that this url patterns are inside the posts app

urlpatterns = [
    #path('', views.dashboard, name="manage-data-dashboard"), #first part is the link, second part is the method from the views.py, third part is the name of the url
    #should be before the link after it (the post_page link) because of the slug if put underneath that link it will catch whatever we put first and assume it's a slug
    #first part is the link, second part is the method from the views.py
    path('api/upload-csv/', views.upload_csv, name="upload-csv"),
    path('api/upload-grades/', views.upload_grades, name="upload-grades"),
    re_path(r'^.*$', views.index), # This will catch any route and serve the index.html
]