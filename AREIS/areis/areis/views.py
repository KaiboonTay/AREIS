#from django.http import HttpResponse
from django.shortcuts import render

# def homepage(request):
#     #return HttpResponse("Hello World! sample project")
#     return render(request, 'home.html') #second part is the view file from the templates folder

# def about(request):
#     #return HttpResponse("My About Page.")
#     return render(request, 'about.html')

def index(request):
    return render(request, 'index.html')  # This will serve the index.html from the React build
