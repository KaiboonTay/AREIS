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

    student_duplicates = set()
    course_duplicates = set()
    grade_duplicates = set()

    new_students = set()
    new_courses = set()
    new_grades = set()

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

        # Check if student already exists
        if Students.objects.filter(studentid=StudentId).exists():
            if StudentId:  # Only add non-empty values
                student_duplicates.add(StudentId)
        else:
            Students.objects.create(
                studentid=StudentId,
                lastname=Lastname,
                firstname=FirstName,
                acadprogdesc=AcadProgDesc,
                phoneno=PhoneNo,
                email=Email
            )
            new_students.add(StudentId)

        # Check if course exists
        if Courses.objects.filter(courseid=CourseId).exists():
            if CourseId:  # Only add non-empty values
                course_duplicates.add(CourseId)
        else:
            Courses.objects.create(
                courseid=CourseId,
                catalogueno=CatalogueNo,
                subject=Subject,
                classdescription=ClassDescription,
            )
            new_courses.add(CourseId)

        # Check if the studentgrades already exists before inserting
        if Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId, trimester=Trimester).exists():
            if StudentId and CourseId:  # Only add non-empty values
                grade_duplicates.add(f"{StudentId}-{CourseId}")
        else:
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
            new_grades.add(f"{StudentId}-{CourseId}")

    # Convert sets to lists and filter out any empty strings
    return Response({
        "message": "CSV file successfully uploaded and processed.",
        "student_duplicates": [s for s in student_duplicates if s],
        "course_duplicates": [c for c in course_duplicates if c],
        "grade_duplicates": [g for g in grade_duplicates if g],
        "new_students": list(new_students),
        "new_courses": list(new_courses),
        "new_grades": list(new_grades),
    }, status=status.HTTP_201_CREATED)



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

        student = Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId).first()
        # check if student already exists
        if Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId).exists():
            try:
                # add the grades
                if CurrentScore and int(CurrentScore) <= 50 and student.flagstatus == 0:
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
                    
                elif CurrentScore and int(CurrentScore) and student.flagstatus == 0:
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
                    
                else:
                    Studentgrades.objects.filter(courseid=CourseId, studentid=StudentId).update(
                        journal1=float(Journal1) if Journal1 else None,
                        journal2=float(Journal2) if Journal2 else None,
                        assessment1=float(Assessment1) if Assessment1 else None,
                        assessment2=float(Assessment2) if Assessment2 else None,
                        assessment3=float(Assessment3) if Assessment3 else None,
                        currentscore=float(CurrentScore) if CurrentScore else None,
                        finalgrade=float(FinalGrade) if FinalGrade else None
                    )

                    
            except IntegrityError:
                return Response({"error": f"Error inserting student {StudentId}. Does not exist."}, 
                                status=status.HTTP_409_CONFLICT)

    return Response({"message": "CSV file successfully uploaded and processed."}, status=status.HTTP_201_CREATED)


def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')


