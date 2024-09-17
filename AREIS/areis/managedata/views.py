from django.shortcuts import render, redirect
from .models import Students
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
            studentid = row.get('Empl ID', '').strip()
            lastname = row.get('Surname', '').strip()
            firstname = row.get('First Name', '').strip()
            acadprogdesc = row.get('Academic Program Descr', '').strip()
            phoneno = row.get('Phone No.', '').strip()
            email = row.get('Email Address', '').strip()

            # Check if the student already exists before inserting
            if not Students.objects.filter(studentid=studentid).exists():
                try:
                    # Insert the student record
                    Students.objects.create(
                        studentid=studentid,
                        lastname=lastname,
                        firstname=firstname,
                        acadprogdesc=acadprogdesc,
                        phoneno=phoneno,
                        email=email
                    )
                except IntegrityError:
                    # Handle any integrity error (like UNIQUE constraint)
                    messages.error(request, f"Error inserting record for {studentid}. Duplicate entry.")
            else:
                # If the student already exists, show a message
                messages.warning(request, f"StudentID {studentid} already exists. Skipping.")
    
    
    return render(request, 'managedata/upload_csv.html')