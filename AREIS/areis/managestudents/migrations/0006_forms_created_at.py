# Generated by Django 5.1.1 on 2024-11-03 16:17

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managestudents', '0005_remove_forms_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='forms',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
