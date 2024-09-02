from django.shortcuts import render, redirect #similar to asp.net for navigation of pages
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm #this is for using the built-in forms in django
from django.contrib.auth import login, logout


# Create your views here.

def register_user(request):
    if request.method == "POST": #for the HTTP POST method in the form
        form = UserCreationForm(request.POST)
        if form.is_valid():
            login(request, form.save()) #save the new user. form.save() also returns a user value same as form.get_user()
            return redirect("home") #similar to asp.net it will go to the posts_list view
    else:
        form = UserCreationForm()
    return render(request, "users/register.html", { "form" : form })

def login_user(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST) #data talks about the login information of the users if it is valid it is a kwargs. kwargs stands for keyword arguments
        if form.is_valid():
            #LOGIN here
            login(request, form.get_user())
            if 'next' in request.POST: #'next' refers to the value from the input field named 'next' inside the login.html
                return redirect(request.POST.get('next')) #request.POST.get('next') this line is trying to get the value from the input field named 'next' inside the login.html
            else:
                return redirect("home")

    else:
        form = AuthenticationForm()      
    return render(request, "users/login.html", { "form" : form })

def logout_user(request):
    if request.method == "POST":
        logout(request)
        return redirect("home")