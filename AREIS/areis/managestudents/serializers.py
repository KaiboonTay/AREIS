from rest_framework import serializers
from .models import Forms, Studentcases, Casecategory

class CasecategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Casecategory
        fields = '__all__'


class FormsSerializer(serializers.ModelSerializer):
    # Custom fields to handle special serialization
    formid = serializers.UUIDField(format='hex', required=True)  # Ensure UUID is serialized as a string
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S', required=False)  # ISO 8601 format
    submitted_date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S', required=False)  # ISO 8601 format
    checkbox_options = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True, default=[]
    )  # Convert checkbox options from TextField to a list

    class Meta:
        model = Forms
        fields = '__all__'  # Include all model fields

    def to_representation(self, instance):
        """
        Custom representation for fields that require special handling
        """
        representation = super().to_representation(instance)
        
        # Ensure checkbox_options is serialized as a list (split by ', ')
        if instance.checkbox_options:
            representation['checkbox_options'] = instance.checkbox_options.split(', ')
        else:
            representation['checkbox_options'] = []

        # UUIDField serialized as a string
        representation['formid'] = str(instance.formid)

        return representation

    def to_internal_value(self, data):
        """
        Custom deserialization logic for input validation
        """
        if 'checkbox_options' in data and isinstance(data['checkbox_options'], list):
            data['checkbox_options'] = ', '.join(data['checkbox_options'])  # Join list to string for saving

        return super().to_internal_value(data)


class StudentcasesSerializer(serializers.ModelSerializer):
    formid = serializers.CharField(source='formid_str', read_only=True)  # Use the string version of UUID
    responded = serializers.IntegerField(source='formid.responded', read_only=True)  # Fetch responded from related form
    
    class Meta:
        model = Studentcases
        fields = '__all__'

