from django.db import models
from managedata.models import Courses, Students
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Casecategory(models.Model):
    categoryid = models.TextField(db_column='CategoryId', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    categoryname = models.TextField(db_column='CategoryName', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'caseCategory'


class Forms(models.Model):
    formid = models.UUIDField(db_column='FormID', primary_key=True, blank=True, null=False)  # Field name made lowercase.
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
    #content10 = models.TextField(db_column='Content10', blank=True, null=True)  # Field name made lowercase.
    checkbox_options = models.TextField(blank=True, null=True) # Checkbox field for content 10
    responded = models.BooleanField(default=False) #Track if it's submitted 
    recommendation = models.CharField(max_length=255, blank=True, null=True)  # Recommendation field
    created_at = models.DateTimeField()  # Timestamp when email is first sent
    flagged_course = models.CharField(max_length=15, db_column = 'flagged_course', blank =True, null =True) 
    submitted_date = models.DateTimeField(blank=True, null=True) #Timestamp when student submits form 
    intervention_form_checkbox = models.TextField(blank=True, null=True)
    intervention_form_issues = models.CharField(max_length=200, blank=True, null=True)


    class Meta:
        db_table = 'forms'
        managed = True # This tells Django to create or alter this table



class Studentcases(models.Model):
    caseid = models.TextField(db_column='CaseID', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    studentid = models.ForeignKey(Students, models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    courseid = models.ForeignKey(Courses, models.DO_NOTHING, db_column='CourseId', blank=True, null=True)  # Field name made lowercase.
    categoryid = models.ForeignKey(Casecategory, models.DO_NOTHING, db_column='CategoryId', blank=True, null=True)  # Field name made lowercase.
    employeeid = models.ForeignKey(User, models.DO_NOTHING, db_column='EmployeeID', blank=True, null=True)  # Field name made lowercase.
    formid = models.ForeignKey(Forms, models.DO_NOTHING, db_column='FormID', blank=True, null=True)  # Field name made lowercase.
    

    def save(self, *args, **kwargs):
        """
        Automatically set `caseid` as a combination of `courseid` and `studentid`.
        """
        self.caseid = f"{self.courseid_id}_{self.studentid_id}"
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'studentCases'