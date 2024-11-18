from datetime import timedelta
from django.utils import timezone
from background_task import background

@background(schedule=60 * 60 * 24 * 2)  # Schedule to run every 2 days
def check_unresponded_forms():
    # Import dynamically to avoid early loading issues
    from django.apps import apps
    from managestudents.utils import send_email_to_student_by_email
    Forms = apps.get_model('managestudents', 'Forms')

    # Get the current time in Singapore timezone
    current_time = timezone.now()

    # Calculate the cutoff time for unresponded forms
    cutoff_time = current_time - timedelta(days=2)  # For production, use days=2

    # Query unresponded forms where created_at is older than the cutoff time
    unresponded_forms = Forms.objects.filter(responded= 0, created_at__lt=cutoff_time)

    for form in unresponded_forms:
        email = form.studentid.email
        try:
            send_email_to_student_by_email(email)
        except Exception as e:
            print(f"Failed to resend email to {email}: {str(e)}")