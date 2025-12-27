import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ChatPage from "./pages/Chat";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your page components
import LandingPage from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/Login';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import Profile from './pages/Profile';
import ActivityPage from './pages/Activity';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import VerifyOtp from './pages/VerifyOtp';
import Header from './components/common/Navbar';

// Your PrivateRoute component remains the same
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return children;
  }
  return <Navigate to="/signin" />;
};


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/profile/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Handle unauthorized or other errors
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* The LandingPage component is now used for the root path */}
        <Route path="/" element={<LandingPage />} />

        {/* Your other routes remain the same */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/chat" element={<PrivateRoute user={user} onLogout={handleLogout}><ChatPage /></PrivateRoute>} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/maintenance"
          element={<PrivateRoute><Maintenance user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute user={user} onLogout={handleLogout}><Profile /></PrivateRoute>}
        />
        <Route
          path="/activity"
          element={<PrivateRoute user={user} onLogout={handleLogout}><ActivityPage /></PrivateRoute>}
        />

        {/* A catch-all route to redirect unknown paths back to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
