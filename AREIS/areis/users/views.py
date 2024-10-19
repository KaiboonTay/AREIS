from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

@api_view(['POST'])
def register_user(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()  # Save the user
            login(request, user)  # Automatically log the user in after registration
            return JsonResponse({'status': 'success', 'message': 'User registered and logged in', 'user': {'username': user.username}}, status=200)
        else:
            # Return validation errors as JSON
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)

@api_view(['POST'])
def login_user(request):
    username_or_email = request.data.get('username_or_email')
    password = request.data.get('password')

    if not username_or_email or not password:
        return JsonResponse({'status': 'error', 'message': 'Username or email and password are required.'}, status=400)

    # Try to authenticate the user
    form = AuthenticationForm(request, data={'username': username_or_email, 'password': password})
    if form.is_valid():
        user = form.get_user()
        login(request, user)
        return JsonResponse({'status': 'success', 'message': 'User logged in', 'user': {'username': user.username}}, status=200)
    else:
        # Return validation errors as JSON
        return JsonResponse({'status': 'error', 'errors': form.errors}, status=401)


@api_view(['POST'])
def logout_user(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'User logged out'}, status=200)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)
