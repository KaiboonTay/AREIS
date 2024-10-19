import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";

// Function to get the CSRF token from cookies
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 'csrftoken'.length + 1) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState(''); // Accept both username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to check if the input is an email or a username
  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Get CSRF token
    const csrfToken = getCSRFToken();

    // Send login request to Django API
    try {
      const response = await fetch('/users/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token in headers
        },
        body: JSON.stringify({
          username_or_email: usernameOrEmail, // Send the username/email value
          password: password,
        }),
        credentials: 'include',  // Include credentials to allow session cookies
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Redirect to dashboard or home page on successful login
        navigate('/');
      } else {
        setError(data.errors.non_field_errors || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ backgroundImage: `/static/bg.png` }} className="bg flex justify-center items-center flex-col relative">
      <div className="mb-48">
        <img src={`/static/logoLogin.png`} alt="Logo" />
      </div>
      <div className="absolute top-[50%] flex flex-col justify-center text-center items-center">
        <h2 className="font-bold text-[24px] shadow-slate-500">Sign In</h2>
        <p>Enter your username or UoN email to sign in</p>
        <div className="w-[400px] mt-[14px] flex flex-col justify-center items-center">
          <form onSubmit={handleLogin} className="w-full">
            <div className="w-full">
              <input
                className="w-full pl-2 rounded-lg h-[40px] mb-4"
                type="text"
                placeholder="Username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}  // Update usernameOrEmail state
                required
              />
            </div>
            <div className="w-full">
              <input
                className="w-full pl-2 rounded-lg h-[40px] mb-4"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}  // Update password state
                required
              />
            </div>
            {error && (
              <div className="w-full text-red-500 mb-4 text-center">
                {error}
              </div>
            )}
            <div className="w-full">
              <button type="submit" className="w-full bg-black text-white rounded-lg h-[40px]">
                Sign in with email/username
              </button>
            </div>
          </form>
        </div>
        <p className="w-[400px] mt-2 text-gray-500 text-[14px]">
          By clicking continue, you agree to our{' '}
          <span className="text-black">Terms of Service</span> and{' '}
          <span className="text-black">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
