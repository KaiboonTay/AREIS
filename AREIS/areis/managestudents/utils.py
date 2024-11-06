from django.core.mail import EmailMessage
from managestudents.models import Students

def send_email_to_student_by_email(email):
    # Define the link and email message
    student = Students.objects.filter(email=email).first()
    if not student:
        print(f"Student with email {email} not found.")
        return
    
    student_id = student.studentid
    form_link = f"http://localhost:8000/managestudents/student-form/?studentId={student_id}"
    message = f"Please complete the form at {form_link}"

    email_msg = EmailMessage(
        subject="Reminder to Complete Your At-Risk Form",
        body=message,
        from_email='uonareis@gmail.com',
        to=[email],
    )
    email_msg.send(fail_silently=False)