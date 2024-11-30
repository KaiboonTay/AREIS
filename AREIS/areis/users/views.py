from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import logging
from rest_framework.response import Response

logger = logging.getLogger(__name__)

@api_view(['POST'])
def register_user(request):
    logger.info("Register user endpoint called")
    
    # Parse JSON data from the request
    data = request.data
    logger.info(f"Received data: {data}")

    # Extract only the necessary user data
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    email = data.get('email')

    # Validate input data
    if not all([username, password, confirm_password, email]):
        return Response({
            'status': 'error', 
            'message': 'All fields are required'
        }, status=400)

    # Validate the passwords
    if password != confirm_password:
        return Response({
            'status': 'error', 
            'message': 'Passwords do not match'
        }, status=400)

    try:
        # Create a new user and store it in auth_user
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        # Optional: Log in the user automatically after registration
        login(request, user)

        return Response({
            'status': 'success',
            'message': 'User registered and logged in',
            'user': {
                'id': user.id, 
                'username': user.username, 
                'email': user.email
            }
        }, status=201)

    except IntegrityError:
        return Response({
            'status': 'error', 
            'message': 'Username or email already exists'
        }, status=400)


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
