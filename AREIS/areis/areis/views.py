#from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from managestudents.serializers import StudentcasesSerializer, CasecategorySerializer
from managestudents.models import Studentcases, Casecategory
from managedata.serializers import StudentGradeSerializer, StudentSerializer
from managedata.models import Studentgrades, Students
import json  # Import the json module
from rest_framework.decorators import api_view
from rest_framework.response import Response
from managestudents.models import Forms
from managestudents.serializers import FormsSerializer
from managestudents import views 
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)



# def homepage(request):
#     #return HttpResponse("Hello World! sample project")
#     return render(request, 'home.html') #second part is the view file from the templates folder

# def about(request):
#     #return HttpResponse("My About Page.")
#     return render(request, 'about.html')

def index(request):
    return render(request, 'index.html')  # This will serve the index.html from the React build

@api_view(['GET'])
def dashboard(request):
    casecategory = Casecategory.objects.all()
    studentcases = Studentcases.objects.select_related('formid').all()  # Use select_related to include related form data
    studentgrades = Studentgrades.objects.all()
    students = Students.objects.all()
    data ={
        'casecategory': CasecategorySerializer(casecategory, many = True).data,
        'studentcases': StudentcasesSerializer(studentcases, many = True).data,
        'studentgrades': StudentGradeSerializer(studentgrades, many = True).data,
        'students': StudentSerializer(students, many = True).data
    }
    
    json_data = json.dumps(data, indent=4)
    print(json_data)
    return Response(data)



@api_view(['GET'])
def student_form_view(request):
    student_id = request.GET.get('studentId')
    form_id = request.GET.get('formId')

    if not student_id or not form_id:
        return JsonResponse({'error': 'Student ID or Form ID is missing'}, status=400)

    try:
        # Attempt to retrieve the form
        form = Forms.objects.get(studentid=student_id, formid=form_id)
        
        # Ensure the student exists
        if not form.studentid:
            return JsonResponse({'error': 'Student details not found'}, status=404)
        
        # Access related student data
        student = form.studentid

        data = {
            'form_id': str(form.formid),
            'student_name': f"{student.firstname} {student.lastname}",
            'flagged_course': form.flagged_course,
            'responses': {
                'I understand the course materials.': form.content1,
                'I have sufficient knowledge from previous studies to progress in the course.': form.content2,
                'I have difficulties with concentrating or staying focused while studying.': form.content3,
                'I manage my time effectively to meet deadlines and complete assignments.': form.content4,
                'I have difficulty understanding English.': form.content5,
                'My overall stress level is high.': form.content6,
                'I have health issues (physical or mental) that impact my studies.': form.content7,
                'I have difficulties balancing other commitments (e.g., work, family).': form.content8,
                'I have financial issues.': form.content9,
            },
            'checkbox_options': form.checkbox_options.split(', ') if form.checkbox_options else [],
            'recommendation' : form.recommendation,
        }

        return JsonResponse(data)
    except Forms.DoesNotExist:
        return JsonResponse({'error': 'Form not found'}, status=404)
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
    


@api_view(['POST'])
def update_studentcase_referred(request):
    case_id = request.data.get('case_id')
    referred_action = request.data.get('referred')

    if not case_id or not referred_action:
        return Response({'error': 'Missing case ID or referred action'}, status=400)

    try:
        student_case = Studentcases.objects.get(caseid=case_id)
        
        if referred_action.split("-", 1)[1].lower() == "uoncounsellor":
            formatted_action = "Uon Counsellor"
        else:
            formatted_action = referred_action.split("-", 1)[1].replace("-", " ").capitalize()
        
        student_case.referred = formatted_action if formatted_action else None
        student_case.save()
        
        return Response({'message': 'Referred action updated successfully', 'referred': student_case.referred or "N/A"})
    except Studentcases.DoesNotExist:
        return Response({'error': 'Student case not found'}, status=404)
    

@api_view(['GET'])
def get_student_history(request, student_id, course_id):
    try:
        logger.info(f"Fetching history for student_id: {student_id} and course_id: {course_id}")
        
        # Filter by both studentid and flagged_course
        forms = Forms.objects.filter(
            studentid=student_id,
            flagged_course=course_id
        ).order_by('-created_at')
        
        logger.info(f"Number of forms found: {forms.count()}")
        
        student_history = []
        for form in forms:
            try:
                if form.checkbox_options:
                    if isinstance(form.checkbox_options, str):
                        checkbox_options = [opt.strip() for opt in form.checkbox_options.split(',')]
                    else:
                        checkbox_options = form.checkbox_options
                else:
                    checkbox_options = []
            except Exception as e:
                logger.error(f"Error parsing checkbox_options: {e}")
                checkbox_options = []
                
            student_history.append({
                'created_at': form.created_at.strftime('%Y-%m-%d %I:%M %p') if form.created_at else None,
                'submitted_date': form.submitted_date.strftime('%Y-%m-%d %I:%M %p') if form.submitted_date else None,
                'checkbox_options': checkbox_options,
                'recommendation': form.recommendation,
                'intervention_form_checkbox': form.intervention_form_checkbox,
                'intervention_form_issues': form.intervention_form_issues,
            })

        logger.info(f"Serialized history data: {student_history}")
        return Response({'student_history': student_history}, status=200)

    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        return Response({'error': str(e)}, status=500)


