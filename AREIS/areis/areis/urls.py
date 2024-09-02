"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path #re_path means regular expressions
from . import views # '.' means the folder we are in the importing the views.py where the methods for navigating to pages are.
#two imports below are use for the upload image feature
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.homepage, name='home'), #first part is the link, second part is the method from the views.py
    path('about/', views.about),
    #register the urls inside the posts app
    #telling django to look inside posts app and look at the URLs file inside of that 
    #posts application created inside of project
    #users application created inside of project
    path('users/', include('users.urls')) 
]

#used for upload image feature
#this line tells the app where it can find the images
#this is when you use the import os in settings.py
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
