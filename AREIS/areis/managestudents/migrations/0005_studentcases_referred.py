# Generated by Django 5.1.1 on 2024-11-20 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managestudents', '0004_forms_flagged_course_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentcases',
            name='referred',
            field=models.TextField(blank=True, db_column='reffered', max_length=30, null=True),
        ),
    ]
