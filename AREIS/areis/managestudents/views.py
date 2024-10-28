from django.shortcuts import render, redirect
from managedata.models import Students, Courses, Studentgrades
from rest_framework.decorators import api_view
from rest_framework.response import Response
from managedata.serializers import CourseSerializer, StudentSerializer, StudentGradeSerializer
import json  # Import the json module
from managedata.models import Students
from django.views.decorators.csrf import csrf_exempt
import os
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from sendgrid import SendGridAPIClient  
from sendgrid.helpers.mail import Mail
from managestudents.models import Forms
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

# def course_list(request):
#     courses = Courses.objects.all()
#     #first - request (the link I think ie about, home, posts), second - html file location, third - setting the value of 'courses' as the courses object this will be used in the html file
#     return render(request, 'managestudents/trigger_course_list.html', { 'courses' : courses }) #'courses' : courses this is a dictionary datatype

@api_view(['GET'])
def course_list(request):
    
    #if request.path.startswith('/managestudents/trigger-at-risk/'):
        courses = Courses.objects.all()
        studentsgrades = Studentgrades.objects.all()
        students = Students.objects.all()

        data = {
        'courses': CourseSerializer(courses, many=True).data,
        'students': StudentSerializer(students, many=True).data,
        'studentsgrades': StudentGradeSerializer(studentsgrades, many=True).data
        }
        #serializer = CourseSerializer(courses, many=True)
        # Convert the serializer data to a JSON string
        json_data = json.dumps(data, indent=4)
        
        # Print the JSON data in the terminal
        print(json_data)
        return Response(data)
    
    #return render(request, 'index.html')

# if request.path.startswith('/managestudents/trigger-at-risk/'):
    #     courses = Courses.objects.all()
        
    #     serializer = CourseSerializer(courses, many=True)
    #     # Convert the serializer data to a JSON string
    #     json_data = json.dumps(serializer.data, indent=4)
        
    #     # Print the JSON data in the terminal
    #     print(json_data)
    #     return Response(serializer.data)
    
    # return render(request, 'index.html')


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

# @api_view(['GET'])
# def trigger_students_list(request, CourseId):
#     studentsgrades = Studentgrades.objects.filter(courseid=CourseId)
#     student_ids = studentsgrades.values_list('studentid', flat=True)
#     students = Students.objects.filter(studentid__in=student_ids)
#     course = Courses.objects.get(courseid=CourseId)

#     data = {
#         'course': CourseSerializer(course).data,
#         'students': StudentSerializer(students, many=True).data,
#         'studentsgrades': StudentGradeSerializer(studentsgrades, many=True).data
#     }
#     return Response(data)

@csrf_exempt
def send_email_to_student(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            print(f"Email to send: {email}")

            if not email:
                print("No email provided")
                return JsonResponse({'status': 'No email provided'}, status=400)

            student = get_object_or_404(Students, email=email)
            student_id = student.studentid
            form_link = f"http://localhost:8000/student-form?studentId={student_id}"

            sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
            if not sendgrid_api_key:
                print("SendGrid API key is missing")
                return JsonResponse({'status': 'SendGrid API key is missing'}, status=500)

            # Create and send the email
            message = Mail(
                from_email='uonareis@gmail.com',
                to_emails=email,
                subject='Complete Your At-Risk Form',
                html_content=f'Please complete the form at <a href="{form_link}">{form_link}</a>'
            )
            
            sg = SendGridAPIClient(sendgrid_api_key)
            response = sg.send(message)
            print(f"SendGrid Response Status: {response.status_code}")
            print(f"SendGrid Response Body: {response.body}")
            
            if response.status_code != 202:
                print(f"Failed to send email: {response.body}")
                return JsonResponse({'status': 'Failed to send email', 'error': response.body}, status=500)

            return JsonResponse({'status': 'Email sent successfully'})
        
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse({'status': 'Failed to send email', 'error': str(e)}, status=500)
    
    return JsonResponse({'status': 'Invalid request method'}, status=400)




@csrf_exempt
@api_view(['GET', 'POST'])
def submit_form(request):
    # Add CORS headers if needed
    if request.method == 'GET':
        student_id = request.GET.get('studentId')
        print(f"Received GET request for student ID: {student_id}")  # Debug log
        
        if not student_id:
            return JsonResponse({'error': 'studentId query parameter is missing.'}, status=400)
            
        try:
            # First check if the student exists
            student = Students.objects.filter(studentid=student_id).first()
            print(f"Looking up student with ID: {student_id}")  # Debug log

            if not student:
                print(f"Student not found with ID: {student_id}")  # Debug log
                return JsonResponse({'error': 'Student not found.'}, status=404)

            # Check if there is a form already submitted for this student
            form_response = Forms.objects.filter(studentid=student).first()
            if form_response and form_response.responded:
                print(f"Form already submitted for student: {student_id}")  # Debug log
                return JsonResponse({'formSubmitted': True})
            
            # If no submitted form exists, return initial form data
            print(f"Returning initial form data for student: {student_id}")  # Debug log
            return JsonResponse({
                'formSubmitted': False,
                'content1': '',
                'content2': '',
                'content3': '',
                'content4': '',
                'content5': '',
                'content6': '',
                'content7': '',
                'content8': '',
                'content9': '',
                'studentId': student_id
            })

        except Exception as e:
            print(f"Error processing request: {str(e)}")  # Debug log
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            
            if not student_id:
                return JsonResponse({'error': 'student_id is required'}, status=400)

            # Get or validate student
            try:
                student = Students.objects.get(studentid=student_id)
            except Students.DoesNotExist:
                return JsonResponse({'error': 'Student not found'}, status=404)

            # Check for existing form submission
            if Forms.objects.filter(studentid=student, responded=True).exists():
                return JsonResponse({'error': 'Form has already been submitted.'}, status=400)

            # Create form response
            form_response = Forms.objects.create(
                studentid=student,
                content1=data.get('content1', ''),
                content2=data.get('content2', ''),
                content3=data.get('content3', ''),
                content4=data.get('content4', ''),
                content5=data.get('content5', ''),
                content6=data.get('content6', ''),
                content7=data.get('content7', ''),
                content8=data.get('content8', ''),
                content9=data.get('content9', ''),
                responded=True
            )

            return JsonResponse({'status': 'success', 'message': 'Form submitted successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)




def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')