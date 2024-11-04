from django.urls import path, re_path
from . import views # '.' means the folder in the main directory we are importing the views.py where the methods for navigating to pages are.
from django.views.generic import TemplateView
from django.urls import path, include, re_path

app_name= 'managestudents' #to designate that this url patterns are inside the posts app

urlpatterns = [
    path('api/trigger-at-risk/', views.course_list, name="course-list"), #first part is the link, second part is the method from the views.py, third part is the name of the url
    #should be before the link after it (the post_page link) because of the slug if put underneath that link it will catch whatever we put first and assume it's a slug
    #path('trigger-students-list/<str:CourseId>/', views.trigger_students_list, name="trigger-students-list"),
    path('trigger-at-risk/send-email/', views.send_email_to_student, name='send-email-to-student'),
    path('api/student-form/', views.submit_form, name='submit-form'),
    path('api/at-risk-students/', views.at_risk_students, name="at-risk-students"),
    path('api/students/', views.StudentSearchPage.as_view(), name="search-student"),
    path('api/studentprofile/<str:studentid>/', views.student_profile, name="student-profile"),
    re_path(r'^.*$', views.index), # This will catch any route and serve the index.html

]