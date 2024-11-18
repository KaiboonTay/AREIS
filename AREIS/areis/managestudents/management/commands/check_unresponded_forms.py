from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from managestudents.models import Forms
from managestudents.views import send_email_to_student
import json
from managestudents.utils import send_email_to_student_by_email
from django.apps import apps

class Command(BaseCommand):
    help = 'Checks for students who have not responded for 2 days and resends the form email'

    def handle(self, *args, **kwargs):
        # Dynamically load Forms model and utility function
        Forms = apps.get_model('managestudents', 'Forms')
        from managestudents.utils import send_email_to_student_by_email

        # Calculate the cutoff time (2 days ago)
        cutoff_time = timezone.now() - timedelta(days = 2)
        # Query forms that have not been responded to and are older than 2 days
        unresponded_forms = Forms.objects.filter(responded= 0, created_at__lt=cutoff_time)

        for form in unresponded_forms:
            student = form.studentid
            email = student.email
            try:
                send_email_to_student_by_email(email)
                self.stdout.write(self.style.SUCCESS(f"Email resent successfully to {email}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to resend email to {email}: {str(e)}"))