from django.db.models.signals import post_save
from django.dispatch import receiver
from managestudents.models import Forms, Studentcases, Casecategory

@receiver(post_save, sender=Forms)
def populate_student_cases(sender, instance, created, **kwargs):
    """
    Populate the `Studentcases` table when `responded` column is set to `1` (True) in the `Forms` table.
    """
    if instance.responded == 1:  # Check if `responded` is 1 (True)
        try:
            # Determine the category based on checkbox_options
            category_mapping = {
                "Course Content": 1,
                "Learning Issues": 2,
                "Personal": 3,
            }
            category_id = None

            # Get category from checkbox_options
            if instance.checkbox_options:
                for key, value in category_mapping.items():
                    if key in instance.checkbox_options:
                        category_id = value
                        break
            
            # Create or update a Studentcases entry
            Studentcases.objects.update_or_create(
                caseid=f"{instance.studentid.studentid}_{instance.flagged_course}",  # studentid + courseid
                defaults={
                    'studentid': instance.studentid,
                    'courseid': instance.flagged_course,  # Actual course ID from Forms
                    'categoryid_id': category_id,  # Foreign key to Casecategory
                    'employeeid_id': 1,  # Temporary employee ID
                    'formid': instance,
                }
            )
            print(f"Studentcases entry created or updated for StudentID: {instance.studentid.studentid} and CourseID: {instance.flagged_course}")
        except Exception as e:
            print(f"Error populating Studentcases table: {str(e)}")