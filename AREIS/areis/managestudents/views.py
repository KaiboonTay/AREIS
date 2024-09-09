from django.shortcuts import render, redirect

# Create your views here.

from managedata.models import Students, Courses, Studentgrades


# Create your views here.

def course_list(request):
    courses = Courses.objects.all()
    #first - request (the link I think ie about, home, posts), second - html file location, third - setting the value of 'courses' as the courses object this will be used in the html file
    return render(request, 'managestudents/trigger_course_list.html', { 'courses' : courses }) #'courses' : courses this is a dictionary datatype


def trigger_students_list(request):
    students = Students.objects.all()
    #first - request (the link I think ie about, home, posts), second - html file location, third - setting the value of 'courses' as the courses object this will be used in the html file
    return render(request, 'managestudents/trigger_students_list.html', { 'students' : students })