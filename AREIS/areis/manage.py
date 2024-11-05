#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import multiprocessing

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'areis.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Run `process_tasks` if `runserver` is in the command line arguments
    if 'runserver' in sys.argv:
        process_tasks = multiprocessing.Process(target=run_process_tasks)
        process_tasks.start()
    
    execute_from_command_line(sys.argv)

def run_process_tasks():
    os.system("python manage.py process_tasks")

if __name__ == '__main__':
    main()