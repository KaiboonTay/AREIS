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
from django.utils import timezone
import pytz
from datetime import datetime


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


@api_view(['GET']) #will add post method for the modal
def at_risk_students(request):
    
    #if request.path.startswith('/managestudents/trigger-at-risk/'):
        courses = Courses.objects.all()
        studentgrades = Studentgrades.objects.all()
        students = Students.objects.all()

        data = {
        'courses': CourseSerializer(courses, many=True).data,
        'students': StudentSerializer(students, many=True).data,
        'studentgrades': StudentGradeSerializer(studentgrades, many=True).data
        }
        #serializer = CourseSerializer(courses, many=True)
        # Convert the serializer data to a JSON string
        json_data = json.dumps(data, indent=4)
        
        # Print the JSON data in the terminal
        print(json_data)
        return Response(data)




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
            form_link = f"http://localhost:8000/managestudents/student-form/?studentId={student_id}"

            # Prepare the email
            sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
            if not sendgrid_api_key:
                print("SendGrid API key is missing")
                return JsonResponse({'status': 'SendGrid API key is missing'}, status=500)

            # Send email
            message = Mail(
                from_email='uonareis@gmail.com',
                to_emails=email,
                subject='Complete Your At-Risk Form',
                html_content=f'Please complete the form at <a href="{form_link}">{form_link}</a>'
            )
            sg = SendGridAPIClient(sendgrid_api_key)
            response = sg.send(message)

            if response.status_code != 202:
                print(f"Failed to send email: {response.body}")
                return JsonResponse({'status': 'Failed to send email', 'error': response.body}, status=500)

            # Get Singapore time and convert to naive datetime
            singapore_timezone = pytz.timezone('Asia/Singapore')
            created_at_sg_time = timezone.now().astimezone(singapore_timezone)
            created_at_naive = created_at_sg_time.replace(tzinfo=None)  # Make the datetime naive

            # Create a new form entry in the Forms table with responded=False and created_at set
            form_response, created = Forms.objects.update_or_create(
                formid=student_id,  # Use student ID as FormID
                defaults={
                    'studentid': student,
                    'responded': False,
                    'checkbox_options': '',  # Initial blank values
                    'created_at': created_at_naive  # Set created_at timestamp as naive datetime
                }
            )

            # Update the student's flagstatus to 3 in the TriggerAtRisk page
            student.flagstatus = 3
            student.save()

            return JsonResponse({'status': 'Email sent successfully and form entry created'})

        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse({'status': 'Failed to send email', 'error': str(e)}, status=500)

    return JsonResponse({'status': 'Invalid request method'}, status=400)




# Define question weights
QUESTION_WEIGHTS = {
    "content1": 1,  # "I understand the course materials."
    "content2": 2,  # "I have sufficient knowledge from previous studies to progress in the course."
    "content3": 3,  # "I have difficulties with concentrating or staying focused while studying."
    "content4": 1,  # "I manage my time effectively to meet deadlines and complete assignments."
    "content5": 2,  # "I have difficulty understanding English."
    "content6": 3,  # "My overall stress level is high."
    "content7": 3,  # "I have health issues (physical or mental) that impact my studies."
    "content8": 2,  # "I have difficulties balancing other commitments (e.g., work, family)."
    "content9": 2,  # "I have financial issues."
}

# Define recommendation calculation function
def calculate_recommendation(responses):
    course_content_score = responses['content1'] * QUESTION_WEIGHTS['content1'] + responses['content2'] * QUESTION_WEIGHTS['content2']
    learning_issues_score = (
        responses['content3'] * QUESTION_WEIGHTS['content3'] + 
        responses['content4'] * QUESTION_WEIGHTS['content4'] + 
        responses['content5'] * QUESTION_WEIGHTS['content5']
    )
    personal_issues_score = (
        responses['content6'] * QUESTION_WEIGHTS['content6'] + 
        responses['content7'] * QUESTION_WEIGHTS['content7'] + 
        responses['content8'] * QUESTION_WEIGHTS['content8'] + 
        responses['content9'] * QUESTION_WEIGHTS['content9']
    )
    
    if course_content_score >= max(learning_issues_score, personal_issues_score):
        return "Course Content"
    elif learning_issues_score >= max(course_content_score, personal_issues_score):
        return "Learning Issues"
    else:
        return "Personal Issues"

@csrf_exempt
@api_view(['GET', 'POST'])
def submit_form(request):
    if request.method == 'GET':
        student_id = request.GET.get('studentId')
        print(f"Received GET request for student ID: {student_id}")
        
        if not student_id:
            return JsonResponse({'error': 'studentId query parameter is missing.'}, status=400)
            
        try:
            student = Students.objects.filter(studentid=student_id).first()
            print(f"Looking up student with ID: {student_id}")

            if not student:
                print(f"Student not found with ID: {student_id}")
                return JsonResponse({'error': 'Student not found.'}, status=404)

            # Check if the form has already been submitted
            form_response = Forms.objects.filter(formid=student_id).first()
            if form_response is None:
                return JsonResponse({'error': 'No form found for student.'}, status=404)
            elif form_response.responded:
                # If the form is already submitted, indicate it to the frontend
                return JsonResponse({'formSubmitted': True, 'message': 'Form has already been submitted.'})

            # If the form hasn't been submitted, return the form data
            return JsonResponse({
                'formSubmitted': False,
                'content1': form_response.content1,
                'content2': form_response.content2,
                'content3': form_response.content3,
                'content4': form_response.content4,
                'content5': form_response.content5,
                'content6': form_response.content6,
                'content7': form_response.content7,
                'content8': form_response.content8,
                'content9': form_response.content9,
                'checkbox_options': form_response.checkbox_options,
                'studentId': student_id
            })

        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            
            if not student_id:
                return JsonResponse({'error': 'student_id is required'}, status=400)

            try:
                student = Students.objects.get(studentid=student_id)
            except Students.DoesNotExist:
                return JsonResponse({'error': 'Student not found'}, status=404)

            if Forms.objects.filter(studentid=student, responded=True).exists():
                return JsonResponse({'error': 'Form has already been submitted.'}, status=400)

            # Converting checkbox options to display as a string in the database
            checkbox_options = ', '.join(json.loads(data.get('checkbox_options', '[]')))
           
            form_response = Forms.objects.filter(formid=student_id, responded=False).first()
            if not form_response:
                return JsonResponse({'error': 'No form entry found to update for this student.'}, status=404)

            # Update the form with the submitted data
            form_response.content1 = data.get('content1', '')
            form_response.content2 = data.get('content2', '')
            form_response.content3 = data.get('content3', '')
            form_response.content4 = data.get('content4', '')
            form_response.content5 = data.get('content5', '')
            form_response.content6 = data.get('content6', '')
            form_response.content7 = data.get('content7', '')
            form_response.content8 = data.get('content8', '')
            form_response.content9 = data.get('content9', '')
            form_response.checkbox_options = checkbox_options
            form_response.responded = True
            
            # Calculate recommendation based on student responses
            recommendation = calculate_recommendation({
                'content1': form_response.content1,
                'content2': form_response.content2,
                'content3': form_response.content3,
                'content4': form_response.content4,
                'content5': form_response.content5,
                'content6': form_response.content6,
                'content7': form_response.content7,
                'content8': form_response.content8,
                'content9': form_response.content9
            })
            
            form_response.recommendation = recommendation
            form_response.save()

            return JsonResponse({'status': 'success', 'message': 'Form submitted successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)






def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')