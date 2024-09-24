from django.db import models

# Create your models here.

class Students(models.Model):
    studentid = models.TextField(db_column='StudentID', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    lastname = models.TextField(db_column='LastName', blank=True, null=True)  # Field name made lowercase.
    firstname = models.TextField(db_column='FirstName', blank=True, null=True)  # Field name made lowercase.
    acadprogdesc = models.TextField(db_column='AcadProgDesc', blank=True, null=True)  # Field name made lowercase.
    phoneno = models.TextField(db_column='PhoneNo', blank=True, null=True)  # Field name made lowercase.
    email = models.TextField(db_column='Email', blank=True, null=True)  # Field name made lowercase.

    """
    The Meta class in Django models provides metadata that controls model behavior, such as 
    specifying the database table name using db_table or preventing Django from managing migrations 
    with managed = False. It allows you to fine-tune how Django interacts with the underlying database f
    or that model.
    """
    class Meta:
        managed = False # This tells Django not to create or alter this table
        db_table = 'students'


class Courses(models.Model):
    courseid = models.TextField(db_column='CourseID', primary_key=True, blank=True, null=False)  # Field name made lowercase.
    catalogueno = models.TextField(db_column='CatalogueNo', blank=True, null=True)  # Field name made lowercase.
    subject = models.TextField(db_column='Subject', blank=True, null=True)  # Field name made lowercase.
    classdescription = models.TextField(db_column='ClassDescription', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'courses'



class Studentgrades(models.Model):
    studentid = models.ForeignKey('Students', models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    courseid = models.ForeignKey(Courses, models.DO_NOTHING, db_column='CourseID', blank=True, null=True)  # Field name made lowercase.
    gradeinput = models.IntegerField(db_column='GradeInput', blank=True, null=True)  # Field name made lowercase.
    officialgrade = models.TextField(db_column='OfficialGrade', blank=True, null=True)  # Field name made lowercase.
    trimester = models.TextField(db_column='Trimester', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'studentGrades'