#from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from managestudents.serializers import StudentcasesSerializer, CasecategorySerializer
from managestudents.models import Studentcases, Casecategory
from managedata.serializers import StudentGradeSerializer
from managedata.models import Studentgrades
import json  # Import the json module


# def homepage(request):
#     #return HttpResponse("Hello World! sample project")
#     return render(request, 'home.html') #second part is the view file from the templates folder

# def about(request):
#     #return HttpResponse("My About Page.")
#     return render(request, 'about.html')

def index(request):
    return render(request, 'index.html')  # This will serve the index.html from the React build

@api_view(['GET'])
def dashboard(request):
    casecategory = Casecategory.objects.all()
    studentcases = Studentcases.objects.all()
    studentgrades = Studentgrades.objects.all()
    data ={
        'casecategory': CasecategorySerializer(casecategory, many = True).data,
        'studentcases': StudentcasesSerializer(studentcases, many = True).data,
        'studentgrades': StudentGradeSerializer(studentgrades, many = True).data
    }
    
    json_data = json.dumps(data, indent=4)
    print(json_data)
    return Response(data)