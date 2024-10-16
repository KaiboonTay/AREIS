# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    first_name = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Casecategory(models.Model):
    categoryid = models.TextField(db_column='CategoryId', primary_key=True, blank=True, null=True)  # Field name made lowercase.
    categoryname = models.TextField(db_column='CategoryName', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'caseCategory'


class Courses(models.Model):
    courseid = models.TextField(db_column='CourseID', primary_key=True, blank=True, null=True)  # Field name made lowercase.
    catalogueno = models.TextField(db_column='CatalogueNo', blank=True, null=True)  # Field name made lowercase.
    subject = models.TextField(db_column='Subject', blank=True, null=True)  # Field name made lowercase.
    classdescription = models.TextField(db_column='ClassDescription', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'courses'


class DjangoAdminLog(models.Model):
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    action_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Forms(models.Model):
    formid = models.TextField(db_column='FormID', primary_key=True, blank=True, null=True)  # Field name made lowercase.
    studentid = models.ForeignKey('Students', models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    content1 = models.IntegerField(db_column='Content1', blank=True, null=True)  # Field name made lowercase.
    content2 = models.IntegerField(db_column='Content2', blank=True, null=True)  # Field name made lowercase.
    content3 = models.IntegerField(db_column='Content3', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'forms'


class Lecturercourse(models.Model):
    userid = models.ForeignKey(AuthUser, models.DO_NOTHING, db_column='UserId', blank=True, null=True)  # Field name made lowercase.
    courseid = models.ForeignKey(Courses, models.DO_NOTHING, db_column='CourseId', blank=True, null=True)  # Field name made lowercase.
    trimester = models.TextField(db_column='Trimester', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'lecturerCourse'


class Studentcases(models.Model):
    caseid = models.TextField(db_column='CaseID', primary_key=True, blank=True, null=True)  # Field name made lowercase.
    studentid = models.ForeignKey('Students', models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    courseid = models.ForeignKey(Courses, models.DO_NOTHING, db_column='CourseId', blank=True, null=True)  # Field name made lowercase.
    categoryid = models.ForeignKey(Casecategory, models.DO_NOTHING, db_column='CategoryId', blank=True, null=True)  # Field name made lowercase.
    employeeid = models.ForeignKey(AuthUser, models.DO_NOTHING, db_column='EmployeeID', blank=True, null=True)  # Field name made lowercase.
    formid = models.ForeignKey(Forms, models.DO_NOTHING, db_column='FormID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'studentCases'


class Studentgrades(models.Model):
    studentid = models.ForeignKey('Students', models.DO_NOTHING, db_column='StudentID', blank=True, null=True)  # Field name made lowercase.
    courseid = models.ForeignKey(Courses, models.DO_NOTHING, db_column='CourseID', blank=True, null=True)  # Field name made lowercase.
    trimester = models.TextField(db_column='Trimester', blank=True, null=True)  # Field name made lowercase.
    flagstatus = models.IntegerField(db_column='FlagStatus', blank=True, null=True)  # Field name made lowercase.
    journal1 = models.IntegerField(db_column='Journal1', blank=True, null=True)  # Field name made lowercase.
    journal2 = models.IntegerField(db_column='Journal2', blank=True, null=True)  # Field name made lowercase.
    assessment1 = models.IntegerField(db_column='Assessment1', blank=True, null=True)  # Field name made lowercase.
    assessment2 = models.IntegerField(db_column='Assessment2', blank=True, null=True)  # Field name made lowercase.
    assessment3 = models.IntegerField(db_column='Assessment3', blank=True, null=True)  # Field name made lowercase.
    currentscore = models.IntegerField(db_column='CurrentScore', blank=True, null=True)  # Field name made lowercase.
    finalgrade = models.IntegerField(db_column='FinalGrade', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'studentGrades'


class Students(models.Model):
    studentid = models.TextField(db_column='StudentID', primary_key=True, blank=True, null=True)  # Field name made lowercase.
    lastname = models.TextField(db_column='LastName', blank=True, null=True)  # Field name made lowercase.
    firstname = models.TextField(db_column='FirstName', blank=True, null=True)  # Field name made lowercase.
    acadprogdesc = models.TextField(db_column='AcadProgDesc', blank=True, null=True)  # Field name made lowercase.
    phoneno = models.TextField(db_column='PhoneNo', blank=True, null=True)  # Field name made lowercase.
    email = models.TextField(db_column='Email', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'students'
