# Generated by Django 5.1.1 on 2024-11-20 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managestudents', '0005_studentcases_referred'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentcases',
            name='referred',
            field=models.TextField(blank=True, db_column='referred', max_length=30, null=True),
        ),
    ]
