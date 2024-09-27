from rest_framework import serializers
from .models import Students, Courses, Studentgrades

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = '__all__'

class StudentGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studentgrades
        fields = '__all__'