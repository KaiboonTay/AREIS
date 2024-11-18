# Generated by Django 5.1.1 on 2024-11-18 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managestudents', '0003_forms_created_at_forms_recommendation'),
    ]

    operations = [
        migrations.AddField(
            model_name='forms',
            name='flagged_course',
            field=models.CharField(blank=True, db_column='flagged_course', max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='forms',
            name='intervention_form_checkbox',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='forms',
            name='intervention_form_issues',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='forms',
            name='submitted_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='forms',
            name='formid',
            field=models.UUIDField(blank=True, db_column='FormID', primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='forms',
            name='responded',
            field=models.IntegerField(default=0),
        ),
    ]
