from rest_framework import serializers
from .models import Students, Courses, Studentgrades
import ast

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
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert `assessments` field from string to dictionary
        if isinstance(representation.get('assessments'), str):
            try:
                representation['assessments'] = ast.literal_eval(representation['assessments'])
            except (ValueError, SyntaxError):
                representation['assessments'] = {}
        return representation