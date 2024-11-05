from django.apps import AppConfig

class ManagestudentsConfig(AppConfig):
    name = 'managestudents'

    def ready(self):
        # Connect signals for scheduling tasks after migrations
        from areis.signals import schedule_check_unresponded_forms



