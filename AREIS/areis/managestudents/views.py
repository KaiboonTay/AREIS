from django.shortcuts import render, redirect


from managedata.models import Students, Courses, Studentgrades
from rest_framework.decorators import api_view
from rest_framework.response import Response
from managedata.serializers import CourseSerializer, StudentSerializer, StudentGradeSerializer
import json  # Import the json module

# Create your views here.

# def course_list(request):
#     courses = Courses.objects.all()
#     #first - request (the link I think ie about, home, posts), second - html file location, third - setting the value of 'courses' as the courses object this will be used in the html file
#     return render(request, 'managestudents/trigger_course_list.html', { 'courses' : courses }) #'courses' : courses this is a dictionary datatype

@api_view(['GET'])
def course_list(request):
    if request.path.startswith('/managestudents/courses/'):
        courses = Courses.objects.all()
        
        serializer = CourseSerializer(courses, many=True)
        # Convert the serializer data to a JSON string
        json_data = json.dumps(serializer.data, indent=4)
        
        # Print the JSON data in the terminal
        print(json_data)
        return Response(serializer.data)
    
    return render(request, 'index.html')


# def trigger_students_list(request, CourseId):
#     #students = Students.objects.all()
#     studentsgrades = Studentgrades.objects.filter(courseid = CourseId)
#     # Extract student IDs from the studentsfilter queryset
#     student_ids = studentsgrades.values_list('studentid', flat = True)
#     # Filter Students based on the extracted student IDs
#     students = Students.objects.filter(studentid__in = student_ids)
#     #first - request (the link I think ie about, home, posts), second - html file location, third - setting the value of 'courses' as the courses object this will be used in the html file
#     course = Courses.objects.get(courseid = CourseId)
    
#     #print(studentsgrades)

#     context = {
#         'students': students,
#         'studentsgrades': studentsgrades,
#         'course': course
#     }
#     return render(request, 'managestudents/trigger_students_list.html', context)

@api_view(['GET'])
def trigger_students_list(request, CourseId):
    studentsgrades = Studentgrades.objects.filter(courseid=CourseId)
    student_ids = studentsgrades.values_list('studentid', flat=True)
    students = Students.objects.filter(studentid__in=student_ids)
    course = Courses.objects.get(courseid=CourseId)

    data = {
        'course': CourseSerializer(course).data,
        'students': StudentSerializer(students, many=True).data,
        'studentsgrades': StudentGradeSerializer(studentsgrades, many=True).data
    }
    return Response(data)


def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')