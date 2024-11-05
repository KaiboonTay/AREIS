from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def schedule_check_unresponded_forms(sender, **kwargs):
    from background_task.models import Task
    from managestudents.tasks import check_unresponded_forms

    # Schedule the task only once if it doesn't already exist
    if not Task.objects.filter(task_name='managestudents.tasks.check_unresponded_forms').exists():
        check_unresponded_forms(repeat=60)  # Set for every 24 hours
