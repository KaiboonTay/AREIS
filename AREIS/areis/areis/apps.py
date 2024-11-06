from django.apps import AppConfig

class AreisConfig(AppConfig):
    name = 'areis'

    def ready(self):
        # Import the signal module to register tasks post-migration
        import areis.signals
