from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Students, Courses, Studentgrades
from django.contrib import messages
from tablib import Dataset
import csv, io
from django.db import IntegrityError


# Create your views here.

@api_view(['POST'])
def upload_csv(request):
    if 'csv_file' not in request.FILES:
        return Response({"error": "CSV file not provided."}, status=status.HTTP_400_BAD_REQUEST)

    csv_file = request.FILES['csv_file']

    if not csv_file.name.endswith('.csv'):
        return Response({"error": "Please upload a CSV file only."}, status=status.HTTP_400_BAD_REQUEST)

    data_set = csv_file.read().decode('UTF-8')
    io_string = io.StringIO(data_set)
    next(io_string)  # skip one row to get the headers

    csv_reader = csv.DictReader(io_string)

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
        Trimester = row.get('Term', '').strip()
        CourseId = Subject + CatalogueNo

        # check if student already exists
        if not Students.objects.filter(studentid=StudentId).exists():
            try:
                Students.objects.create(
                    studentid=StudentId,
                    lastname=Lastname,
                    firstname=FirstName,
                    acadprogdesc=AcadProgDesc,
                    phoneno=PhoneNo,
                    email=Email
                )
            except IntegrityError:
                return Response({"error": f"Error inserting student {StudentId}. Duplicate entry."}, 
                                status=status.HTTP_409_CONFLICT)

        # check if course exists
        if not Courses.objects.filter(courseid=CourseId).exists():
            try:
                Courses.objects.create(
                    courseid=CourseId,
                    catalogueno=CatalogueNo,
                    subject=Subject,
                    classdescription=ClassDescription,
                )
            except IntegrityError:
                return Response({"error": f"Error inserting course {CourseId}. Duplicate entry."}, 
                                status=status.HTTP_409_CONFLICT)
            
        # check if the studentgrades already exists before inserting
        if not Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId, trimester=Trimester).exists():
            try:
                # add the grades
                Studentgrades.objects.create(
                    studentid=Students.objects.get(studentid=StudentId),
                    courseid=Courses.objects.get(courseid=CourseId),
                    journal1=None,
                    journal2=None,
                    assessment1=None,
                    assessment2=None,
                    assessment3=None,
                    currentscore=None,
                    finalgrade=None,
                    trimester=Trimester,
                    flagstatus=0
                )
            except IntegrityError:
                # Handle any integrity error (like UNIQUE constraint)
                messages.error(request, f"Error inserting record for {StudentId}. Duplicate entry.")
        else:
            # If the course already exists, show a message
            messages.warning(request, f"Grade for {StudentId} already exists. Skipping.")

    return Response({"message": "CSV file successfully uploaded and processed."}, status=status.HTTP_201_CREATED)



@api_view(['POST'])
def upload_grades(request):
    if 'csv_file' not in request.FILES:
        return Response({"error": "CSV file not provided."}, status=status.HTTP_400_BAD_REQUEST)

    csv_file = request.FILES['csv_file']

    if not csv_file.name.endswith('.csv'):
        return Response({"error": "Please upload a CSV file only."}, status=status.HTTP_400_BAD_REQUEST)

    data_set = csv_file.read().decode('UTF-8')
    io_string = io.StringIO(data_set)

    csv_reader = csv.DictReader(io_string)
    next(csv_reader)
    next(csv_reader)
    for row in csv_reader:
        
        StudentId = row.get('SIS User ID', '').strip().lower()
        Journal1 = row.get('Journal 1 (251237)', '').strip()
        Journal2 = row.get('Journal 2 (251238)', '').strip()
        Assessment1 = row.get('Assessment 1 Final Score', '').strip()
        Assessment2 = row.get('Assessment 2 Final Score', '').strip()
        Assessment3 = row.get('Assessment 3 Final Score', '').strip()
        CurrentScore = row.get('Current Score', '').strip()
        FinalGrade = row.get('Final Score', '').strip()
        Section = row.get('Section', '').strip()
        #Trimester = Section.split(' ')[0] Issue does not match with the other csv file
        CourseId = Section.split(' ')[0]

        # check if student already exists
        if Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId).exists():
            try:
                # add the grades
                if int(CurrentScore) <= 50:
                    Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId).update(
                        journal1=float(Journal1) if Journal1 else None,
                        journal2=float(Journal2) if Journal2 else None,
                        assessment1=float(Assessment1) if Assessment1 else None,
                        assessment2=float(Assessment2) if Assessment2 else None,
                        assessment3=float(Assessment3) if Assessment3 else None,
                        currentscore=float(CurrentScore) if CurrentScore else None,
                        finalgrade=float(FinalGrade) if FinalGrade else None,
                        #trimester=Trimester,
                        flagstatus=2
                )
                    
                else:
                    Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId).update(
                        journal1=float(Journal1) if Journal1 else None,
                        journal2=float(Journal2) if Journal2 else None,
                        assessment1=float(Assessment1) if Assessment1 else None,
                        assessment2=float(Assessment2) if Assessment2 else None,
                        assessment3=float(Assessment3) if Assessment3 else None,
                        currentscore=float(CurrentScore) if CurrentScore else None,
                        finalgrade=float(FinalGrade) if FinalGrade else None,
                        #trimester=Trimester,
                        flagstatus=0
                )
                    
            except IntegrityError:
                return Response({"error": f"Error inserting student {StudentId}. Does not exist."}, 
                                status=status.HTTP_409_CONFLICT)

    return Response({"message": "CSV file successfully uploaded and processed."}, status=status.HTTP_201_CREATED)


def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')







# def upload_csv(request):
#     if request.method == 'POST':
#         dataset = Dataset()
#         new_csv = request.FILES['csv_file']

#         if not new_csv.name.endswith('csv'):
#             messages.info(request, 'Please Upload the CSV File only')
#             return render(request,'managedata/upload_csv.html')
#         else:
#             messages.info(request,'File successfully uploaded')
        
#         data_set=new_csv.read().decode('UTF-8')
#         io_string = io.StringIO(data_set)
#         next(io_string) # cause the csv file format has a title in the first row
       
#         # After reading the CSV
#         csv_reader = csv.DictReader(io_string)

#         # Print the header names
#         print(csv_reader.fieldnames)  # This will show all the header names


#         for row in csv_reader:
#             StudentId = row.get('Empl ID', '').strip()
#             Lastname = row.get('Surname', '').strip()
#             FirstName = row.get('First Name', '').strip()
#             AcadProgDesc = row.get('Academic Program Descr', '').strip()
#             PhoneNo = row.get('Phone No.', '').strip()
#             Email = row.get('Email Address', '').strip()
#             CatalogueNo = row.get('Catalogue Number', '').strip()
#             Subject = row.get('Subject', '').strip()
#             ClassDescription = row.get('Class Descr', '').strip()
#             # GradeInput = row.get('Grade Input', '').strip()
#             # OfficialGrade = row.get('Official Grade', '').strip()
#             # Trimester = row.get('Term', '').strip()
#             CourseId = Subject+CatalogueNo
            

#             # Check if the student already exists before inserting
#             if not Students.objects.filter(studentid=StudentId).exists():
#                 try:
#                     # Insert the student record
#                     Students.objects.create(
#                         studentid=StudentId,
#                         lastname=Lastname,
#                         firstname=FirstName,
#                         acadprogdesc=AcadProgDesc,
#                         phoneno=PhoneNo,
#                         email=Email
#                     )
#                 except IntegrityError:
#                     # Handle any integrity error (like UNIQUE constraint)
#                     messages.error(request, f"Error inserting record for {StudentId}. Duplicate entry.")
#             else:
#                 # If the student already exists, show a message
#                 messages.warning(request, f"StudentID {StudentId} already exists. Skipping.")


#             # check if the course already exists before inserting
#             if not Courses.objects.filter(courseid=CourseId).exists():
#                 try:
#                     # add the course
#                     Courses.objects.create(
#                         courseid=CourseId,
#                         catalogueno=CatalogueNo,
#                         subject=Subject,
#                         classdescription=ClassDescription,
#                     )
#                 except IntegrityError:
#                     # Handle any integrity error (like UNIQUE constraint)
#                     messages.error(request, f"Error inserting record for {CourseId}. Duplicate entry.")
#             else:
#                 # If the course already exists, show a message
#                 messages.warning(request, f"{ClassDescription} already exists. Skipping.")


#             # check if the studentgrades already exists before inserting
#             # if not Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId, trimester=Trimester).exists():
#             #     try:
#             #         # add the grades
#             #         Studentgrades.objects.create(
#             #             studentid=Students.objects.get(studentid=StudentId),
#             #             courseid=Courses.objects.get(courseid=CourseId),
#             #             gradeinput=GradeInput,
#             #             officialgrade=OfficialGrade,
#             #             trimester=Trimester,
#             #             flagstatus=0
#             #         )
#             #     except IntegrityError:
#             #         # Handle any integrity error (like UNIQUE constraint)
#             #         messages.error(request, f"Error inserting record for {StudentId}. Duplicate entry.")
#             # else:
#             #     # If the course already exists, show a message
#             #     messages.warning(request, f"Grade for {StudentId} already exists. Skipping.")
    
#     return render(request, 'managedata/upload_csv.html')