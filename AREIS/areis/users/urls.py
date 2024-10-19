from django.urls import path
from . import views # '.' means the folder in the main directory we are importing the views.py where the methods for navigating to pages are.


app_name= 'users' #to designate that this url patterns are inside the posts app

urlpatterns = [
    path('api/register/', views.register_user, name="register"), #first part is the link(can add here something for the last part of the url), second part is the method from the views.py, third part is the name of the url
    path('api/login/', views.login_user, name="login"),
    path('api/logout/', views.logout_user, name="logout"),
]