from django.shortcuts import render, redirect
from .models import Students, Courses, Studentgrades
from django.contrib import messages
from tablib import Dataset
import csv, io
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import FormResponse

# Create your views here.

def upload_csv(request):
    if request.method == 'POST':
        dataset = Dataset()
        new_csv = request.FILES['csv_file']

        if not new_csv.name.endswith('csv'):
            messages.info(request, 'Please Upload the CSV File only')
            return render(request,'managedata/upload_csv.html')
        else:
            messages.info(request,'File successfully uploaded')
        
        data_set=new_csv.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        next(io_string) # cause the csv file format has a title in the first row
       
        # After reading the CSV
        csv_reader = csv.DictReader(io_string)

        # Print the header names
        print(csv_reader.fieldnames)  # This will show all the header names


        for row in csv_reader:
            StudentId = row.get('Empl ID', '').strip()
            Lastname = row.get('Surname', '').strip()
            FirstName = row.get('First Name', '').strip()
            AcadProgDesc = row.get('Academic Program Descr', '').strip()
            PhoneNo = row.get('Phone No.', '').strip()
            Email = row.get('Email Address', '').strip()
            CatalogueNo = row.get('Catalogue Number', '').strip()
            Subject = row.get('Subject', '').strip()
            ClassDescription = row.get('Class Descr', '').strip()
            GradeInput = row.get('Grade Input', '').strip()
            OfficialGrade = row.get('Official Grade', '').strip()
            Trimester = row.get('Term', '').strip()
            CourseId = Subject+CatalogueNo
            

            # Check if the student already exists before inserting
            if not Students.objects.filter(studentid=StudentId).exists():
                try:
                    # Insert the student record
                    Students.objects.create(
                        studentid=StudentId,
                        lastname=Lastname,
                        firstname=FirstName,
                        
                        acadprogdesc=AcadProgDesc,
                        phoneno=PhoneNo,
                        email=Email
                    )
                except IntegrityError:
                    # Handle any integrity error (like UNIQUE constraint)
                    messages.error(request, f"Error inserting record for {StudentId}. Duplicate entry.")
            else:
                # If the student already exists, show a message
                messages.warning(request, f"StudentID {StudentId} already exists. Skipping.")


            # check if the course already exists before inserting
            if not Courses.objects.filter(courseid=CourseId).exists():
                try:
                    # add the course
                    Courses.objects.create(
                        courseid=CourseId,
                        catalogueno=CatalogueNo,
                        subject=Subject,
                        classdescription=ClassDescription,
                    )
                except IntegrityError:
                    # Handle any integrity error (like UNIQUE constraint)
                    messages.error(request, f"Error inserting record for {CourseId}. Duplicate entry.")
            else:
                # If the course already exists, show a message
                messages.warning(request, f"{ClassDescription} already exists. Skipping.")


            # check if the studentgrades already exists before inserting
            if not Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId, trimester=Trimester).exists():
                try:
                    # add the course
                    Studentgrades.objects.create(
                        studentid=Students.objects.get(studentid=StudentId),
                        courseid=Courses.objects.get(courseid=CourseId),
                        gradeinput=GradeInput,
                        officialgrade=OfficialGrade,
                        trimester=Trimester
                    )
                except IntegrityError:
                    # Handle any integrity error (like UNIQUE constraint)
                    messages.error(request, f"Error inserting record for {StudentId}. Duplicate entry.")
            else:
                # If the course already exists, show a message
                messages.warning(request, f"Grade for {StudentId} already exists. Skipping.")
    
    return render(request, 'managedata/upload_csv.html')



#Student Forms Response
@csrf_exempt
def submit_form(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data['student_id']
            form_id = f"{student_id}-{data['content1']}-{data['content2']}"  # Create a unique form ID
            print(form_id)
            student = Students.objects.get(studentid=data['student_id'])
            print(student)

            # Check if the form has already been submitted (form exists)
            form_response, created = FormResponse.objects.get_or_create(
                form_id=form_id,
                defaults={
                    'studentid': student,
                    'content1': data['content1'],
                    'content2': data['content2'],
                    'content3': data['content3'],
                    'content4': data['content4'],
                    'content5': data['content5'],
                    'content6': data['content6'],
                    'content7': data['content7'],
                    'content8': data['content8'],
                    'content9': data['content9'],
                    'content10': data['content10'],
                    'responded': True,
                }
            )

            if not created:
                return JsonResponse({'error': 'Form has already been submitted.'}, status=400)

            return JsonResponse({'status': 'Form submitted successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        # Extract studentId from the query string
        student_id = request.GET.get('studentId')
        
        if student_id:
            try:
                # Check if there is a form already created for this student
                form_response = FormResponse.objects.get(studentid=student_id)
                # Return the existing form data
                data = {
                    'student_id': form_response.studentid,
                    'content1': form_response.content1,
                    'content2': form_response.content2,
                    'content3': form_response.content3,
                    'content4': form_response.content4,
                    'content5': form_response.content5,
                    'content6': form_response.content6,
                    'content7': form_response.content7,
                    'content8': form_response.content8,
                    'content9': form_response.content9,
                    'content10': form_response.content10,
                }
                print("Received data:", data)

                return JsonResponse(data)
            

            except FormResponse.DoesNotExist:
                # Return empty form fields if no form data exists
                data = {
                    'student_id': student_id,
                    'content1': 0,
                    'content2': 0,
                    'content3': 0,
                    'content4': 0,
                    'content5': 0,
                    'content6': 0,
                    'content7': 0,
                    'content8': 0,
                    'content9': 0,
                    'content10': 0,
                }
                return JsonResponse(data)

        else:
            return JsonResponse({'error': 'studentId query parameter is missing.'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)