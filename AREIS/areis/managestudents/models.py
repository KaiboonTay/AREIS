from django.db import models
from managedata.models import Courses, Students
from django.contrib.auth.models import User

# Create your models here.
class Casecategory(models.Model):
    categoryid = models.TextField(db_column='CategoryId', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    categoryname = models.TextField(db_column='CategoryName', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'caseCategory'


class Forms(models.Model):
    formid = models.TextField(db_column='FormID', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    studentid = models.ForeignKey(Students, models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    content1 = models.IntegerField(db_column='Content1', blank=True, null=True)  # Field name made lowercase.
    content2 = models.IntegerField(db_column='Content2', blank=True, null=True)  # Field name made lowercase.
    content3 = models.IntegerField(db_column='Content3', blank=True, null=True)  # Field name made lowercase.
    content4 = models.IntegerField(db_column='Content4', blank=True, null=True)  # Field name made lowercase.
    content5 = models.IntegerField(db_column='Content5', blank=True, null=True)  # Field name made lowercase.
    content6 = models.IntegerField(db_column='Content6', blank=True, null=True)  # Field name made lowercase.
    content7 = models.IntegerField(db_column='Content7', blank=True, null=True)  # Field name made lowercase.
    content8 = models.IntegerField(db_column='Content8', blank=True, null=True)  # Field name made lowercase.
    content9 = models.IntegerField(db_column='Content9', blank=True, null=True)  # Field name made lowercase.
    content10 = models.IntegerField(db_column='Content10', blank=True, null=True)  # Field name made lowercase.
    responded = models.BooleanField(default=False)

    class Meta:
        db_table = 'forms'


class Studentcases(models.Model):
    caseid = models.TextField(db_column='CaseID', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    studentid = models.ForeignKey(Students, models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    courseid = models.ForeignKey(Courses, models.DO_NOTHING, db_column='CourseId', blank=True, null=True)  # Field name made lowercase.
    categoryid = models.ForeignKey(Casecategory, models.DO_NOTHING, db_column='CategoryId', blank=True, null=True)  # Field name made lowercase.
    employeeid = models.ForeignKey(User, models.DO_NOTHING, db_column='EmployeeID', blank=True, null=True)  # Field name made lowercase.
    formid = models.ForeignKey(Forms, models.DO_NOTHING, db_column='FormID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'studentCases'