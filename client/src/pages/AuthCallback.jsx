import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs once when the component mounts
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("Received token:", token);
      // Save the token to localStorage for future authenticated requests
      localStorage.setItem('token', token);

      // Redirect the user to the dashboard
      // Using replace: true prevents the user from going "back" to this callback page
      navigate('/dashboard', { replace: true });
    } else {
      // Handle the case where no token is found (e.g., an error)
      console.error("No token found in callback URL.");
      navigate('/signin', { replace: true }); // Redirect to login on failure
    }
  }, [location, navigate]); // Dependencies for the effect

  // Render a loading state while the logic runs
  return (
    <div>
      <h2>Logging you in...</h2>
      <p>Please wait, you are being redirected.</p>
    </div>
  );
};

export default AuthCallback;
