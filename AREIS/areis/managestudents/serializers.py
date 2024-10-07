from rest_framework import serializers
from .models import Forms, Studentcases, Casecategory

class CasecategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Casecategory
        fields = '__all__'


class FormsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forms
        fields = '__all__'


class StudentcasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studentcases
        fields = '__all__'