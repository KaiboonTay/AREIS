from django.shortcuts import render, redirect
from managedata.models import Students, Courses, Studentgrades
from django.db.models import Q, Value, IntegerField
from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from managedata.serializers import CourseSerializer, StudentSerializer, StudentGradeSerializer
import json  # Import the json module
from django.views.decorators.csrf import csrf_exempt
import os
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from sendgrid import SendGridAPIClient  
from sendgrid.helpers.mail import Mail
from managestudents.models import Forms, Studentcases, Casecategory
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
import pytz
from django.utils import timezone
from django.db.models import Case, When
import uuid
from managedata.models import Studentgrades
from django.contrib.auth.models import User


# Create your views here.

# def course_list(request):
#     courses = Courses.objects.all()
#     #first - request (the link I think ie about, home, posts), second - html file location, third - setting the value of 'courses' as the courses object this will be used in the html file
#     return render(request, 'managestudents/trigger_course_list.html', { 'courses' : courses }) #'courses' : courses this is a dictionary datatype

class StudentSearchPage(generics.ListAPIView):
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['^firstname', '^lastname', '=studentid']

    def get_queryset(self):
        queryset = Students.objects.all()
        search_query = self.request.query_params.get('search', None)

        if search_query:
            keywords = search_query.split()

            if len(keywords) >= 2:
                # Flexible matching for multiple keywords
                name_filters = Q()

                # Build conditions for each keyword to match any part of first or last name
                for keyword in keywords:
                    name_filters |= Q(firstname__icontains=keyword) | Q(lastname__icontains=keyword)

                # Annotate fields based on the match priority
                queryset = queryset.filter(name_filters).annotate(
                    # Prioritize cases where both names match any keywords
                    both_names_match=Case(
                        When(Q(firstname__icontains=keywords[0]) & Q(lastname__icontains=keywords[1]), then=Value(2)),
                        default=Value(0),
                        output_field=IntegerField()
                    ),
                    # Assign score based on first and last name matching start of keywords
                    first_name_match=Case(
                        When(firstname__istartswith=keywords[0], then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField()
                    ),
                    last_name_match=Case(
                        When(lastname__istartswith=keywords[-1], then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField()
                    )
                ).order_by('-both_names_match', '-first_name_match', '-last_name_match')
            else:
                # Single keyword, prioritize both names starting with the query, but allow partial matches
                single_keyword = keywords[0]
                queryset = queryset.filter(
                    Q(firstname__icontains=single_keyword) |
                    Q(lastname__icontains=single_keyword)
                ).annotate(
                    both_names_match=Case(
                        When(Q(firstname__istartswith=single_keyword) & Q(lastname__istartswith=single_keyword), then=Value(2)),
                        default=Value(0),
                        output_field=IntegerField()
                    ),
                    first_name_match=Case(
                        When(firstname__istartswith=single_keyword, then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField()
                    ),
                    last_name_match=Case(
                        When(lastname__istartswith=single_keyword, then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField()
                    )
                ).order_by('-both_names_match', '-first_name_match', '-last_name_match')

        # Debugging output for search and results
        print("Search Query:", search_query)
        print("Query Results:", list(queryset.values()))
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



@api_view(['GET'])
def student_profile(request, studentid):
    student = get_object_or_404(Students, studentid=studentid)
    studentgrades = Studentgrades.objects.filter(studentid=studentid)
    courses = Courses.objects.all()
    
    data = {
        'student': StudentSerializer(student).data,
        'studentgrades': StudentGradeSerializer(studentgrades, many=True).data,
        'courses': CourseSerializer(courses, many=True).data
        
    }

    json_data = json.dumps(data, indent=4)
    print(json_data)
    
    return Response(data)




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
            # Parse JSON request data
            data = json.loads(request.body)
            email = data.get('email')
            flagged_course = data.get('course')  # Course ID passed from the frontend
            student_id = data.get('student_id')  # Add student_id to uniquely identify the student
            selected_options = data.get('selected_options', [])  # Array of selected options from frontend
            issues = data.get('issues', '')  # Text entered in the issues field from frontend

            print(f"Received data: Email: {email}, Flagged Course: {flagged_course}, Student ID: {student_id}, Selected Options: {selected_options}, Issues: {issues}")

            # Validate input data
            if not email:
                print("Error: No email provided")
                return JsonResponse({'status': 'No email provided'}, status=400)
            if not flagged_course:
                print("Error: Flagged course is required")
                return JsonResponse({'status': 'Flagged course is required'}, status=400)
            if not student_id:
                print("Error: Student ID is required")
                return JsonResponse({'status': 'Student ID is required'}, status=400)

            # Query the student using the `studentid`, `email`, and `courseid`
            student = Students.objects.filter(
                studentid=student_id,
                email=email,
                studentgrades__courseid=flagged_course
            ).distinct().first()

            if not student:
                print("Error: No matching student found with the given email, course, and ID")
                return JsonResponse({'status': 'No matching student found with the given email, course, and ID'}, status=404)

            print(f"Student found: {student}")

            # Generate form link
            form_link = f"http://localhost:8000/managestudents/student-form/?studentId={student.studentid}&flaggedCourse={flagged_course}"
            print(f"Generated form link: {form_link}")

            # Validate SendGrid API key
            sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
            print(f"SendGrid API Key: {os.getenv('SENDGRID_API_KEY')}")
            if not sendgrid_api_key:
                print("Error: SendGrid API key is missing")
                return JsonResponse({'status': 'SendGrid API key is missing'}, status=500)

            print("SendGrid API key found. Preparing to send email...")

            # Send email using SendGrid
            message = Mail(
                from_email='officialuonareis@gmail.com',
                to_emails=email,
                subject=f'Complete Your At-Risk Form For {flagged_course}',
                html_content=f'Dear {student.firstname}, You have been flagged by your lecturer for being at risk due to underperforming grades. Please complete the student At-Risk form at <a href="{form_link}">{form_link}</a>'
            )
            sg = SendGridAPIClient(sendgrid_api_key)
            response = sg.send(message)

            print(f"SendGrid response status code: {response.status_code}")
            print(f"SendGrid response body: {response.body}")

            if response.status_code != 202:
                print("Error: Failed to send email")
                return JsonResponse({'status': 'Failed to send email', 'error': response.body}, status=500)

            # Get Singapore time
            singapore_timezone = pytz.timezone('Asia/Singapore')
            created_at_sg_time = timezone.now().astimezone(singapore_timezone)
            created_at_naive = created_at_sg_time.replace(tzinfo=None)

            # Generate a UUID for the form entry
            form_uuid = uuid.uuid4()

            # Create or update the form entry
            print("Creating or updating form entry in the Forms table...")
            form_response, created = Forms.objects.update_or_create(
                studentid=student,
                flagged_course=flagged_course,
                defaults={
                    'formid': form_uuid,
                    'responded': 0,  # Set to 0 (False) initiallyform_response.responded = 1  # Set to 1 (True) after submission
                    'created_at': created_at_naive,
                    'intervention_form_checkbox': ', '.join(selected_options),  # Save selected checkboxes
                    'intervention_form_issues': issues,  # Save issues
                }
            )
            print(f"Form entry {'created' if created else 'updated'} successfully")

            # Update the flagstatus in the studentgrades table
            print("Updating flagstatus in StudentGrades table...")
            student_grade = Studentgrades.objects.filter(studentid=student, courseid=flagged_course).first()
            if student_grade:
                student_grade.flagstatus = 1
                student_grade.save()
                print(f"Flag status updated to 1 for StudentGrades: {student_grade}")
            else:
                print("Error: No matching StudentGrades entry found")

            return JsonResponse({'status': 'Email sent successfully and form entry created'})

        except Exception as e:
            print(f"Unhandled exception occurred: {e}")
            import traceback
            print(traceback.format_exc())
            return JsonResponse({'status': 'Failed to send email', 'error': str(e)}, status=500)

    print("Error: Invalid request method")
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
        flagged_course = request.GET.get('flaggedCourse')
        print(f"Received GET request for student ID: {student_id} and course: {flagged_course}")

        if not student_id:
            return JsonResponse({'error': 'studentId query parameter is missing.'}, status=400)
        if not flagged_course:
            return JsonResponse({'error': 'flaggedCourse query parameter is missing.'}, status=400)

        try:
            student = Students.objects.filter(studentid=student_id).first()

            if not student:
                return JsonResponse({'error': 'Student not found.'}, status=404)

            # Retrieve the form entry using `studentid` and `flagged_course`
            form_response = Forms.objects.filter(studentid=student, flagged_course=flagged_course).first()
            if form_response is None:
                return JsonResponse({'error': 'No form found for student.'}, status=404)
            elif form_response.responded:
                return JsonResponse({'formSubmitted': True, 'message': 'Form has already been submitted.'})

            # Return the form data
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
                'flagged_course': form_response.flagged_course,
                'studentId': student_id
            })

        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            flagged_course = data.get('flagged_course')

            if not student_id:
                return JsonResponse({'error': 'student_id is required'}, status=400)
            if not flagged_course:
                return JsonResponse({'error': 'flagged_course is required'}, status=400)

            student = Students.objects.filter(studentid=student_id).first()
            if not student:
                return JsonResponse({'error': 'Student not found'}, status=404)

            # Retrieve the form entry using studentId and flagged_course
            form_response = Forms.objects.filter(studentid=student, flagged_course=flagged_course, responded= 0).first()
            if not form_response:
                return JsonResponse({'error': 'No form entry found for the given student and course.'}, status=404)

            # Parse and clean checkbox_options
            raw_options = data.get('checkbox_options', [])
            if isinstance(raw_options, str):
                raw_options = json.loads(raw_options)

            checkbox_options = ', '.join(option.strip() for option in raw_options)

            # Update the form with the submitted data
            form_response.content1 = data.get('content1', 0)
            form_response.content2 = data.get('content2', 0)
            form_response.content3 = data.get('content3', 0)
            form_response.content4 = data.get('content4', 0)
            form_response.content5 = data.get('content5', 0)
            form_response.content6 = data.get('content6', 0)
            form_response.content7 = data.get('content7', 0)
            form_response.content8 = data.get('content8', 0)
            form_response.content9 = data.get('content9', 0)
            form_response.checkbox_options = checkbox_options
            form_response.responded = 1  # Set to 1 (True) after submission

            # Set the submission date and time in Singapore timezone
            singapore_timezone = pytz.timezone('Asia/Singapore')
            submitted_sg_time = timezone.now().astimezone(singapore_timezone)
            form_response.submitted_date = submitted_sg_time.replace(tzinfo=None)

            # Calculate the recommendation
            recommendation = calculate_recommendation({
                'content1': form_response.content1,
                'content2': form_response.content2,
                'content3': form_response.content3,
                'content4': form_response.content4,
                'content5': form_response.content5,
                'content6': form_response.content6,
                'content7': form_response.content7,
                'content8': form_response.content8,
                'content9': form_response.content9,
            })
            form_response.recommendation = recommendation

            # Save the form data
            form_response.save()

            # Determine category based on checkbox_options
            categories = {
                "Course Content": 1,
                "Learning Issues": 2,
                "Personal": 3,
            }

            category_id = None
            for option in raw_options:
                clean_option = option.strip()
                if clean_option in categories:
                    category_id = categories[clean_option]
                    break

            if not category_id:
                return JsonResponse({'error': 'Invalid category for student case.'}, status=400)

            # Create update the role created by send_email_to_student view
            Studentcases.objects.create(
                caseid=f"{student_id}_{flagged_course}",
                studentid=student,
                courseid=Courses.objects.get(courseid=flagged_course),
                categoryid=Casecategory.objects.get(categoryid=category_id),
                employeeid=User.objects.get(id=1),  # Temporary employee ID
                formid=form_response
            )

            # Update the flagstatus in the Studentgrades table
            student_grade = Studentgrades.objects.filter(studentid=student, courseid=flagged_course).first()
            if student_grade:
                student_grade.flagstatus = 3
                student_grade.save()
                print(f"Flag status updated to 3 for StudentGrades: {student_grade}")

            return JsonResponse({'status': 'success', 'message': 'Form submitted successfully and case created'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)






def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')