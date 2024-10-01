from django.shortcuts import render, redirect
from .models import Students, Courses, Studentgrades
from django.contrib import messages
from tablib import Dataset
import csv, io
from django.db import IntegrityError


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

def index(request):
    # Serve the React index.html for frontend routes
    return render(request, 'index.html')