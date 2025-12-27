import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { toast } from 'react-toastify';
import { FaSyncAlt, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// --- Keyframes (Animations) ---
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const slideOut = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(50px); opacity: 0; }
`;

const slideIn = keyframes`
  0% { transform: translateX(-50px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;


// --- React Component ---
const SignIn = () => {
  const location = useLocation(); // Get location object
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        delay: `${Math.random() * 2}s`,
      });
    }
    setStars(newStars);

    // Check for logout message
    const logoutMessage = localStorage.getItem('logoutMessage');
    if (logoutMessage) {
      toast.info(logoutMessage);
      localStorage.removeItem('logoutMessage');
    }

    // Load remembered email if it exists
    const remembered = localStorage.getItem('rememberMe');
    if (remembered) {
      try {
        const { email } = JSON.parse(remembered);
        setEmailValue(email);
        setRememberMe(true);
      } catch (error) {
        console.error('Error parsing remembered email:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Check query parameter to set initial mode
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setIsSignUp(true);
    }
  }, [location]);

  const handleToggleForm = (e) => {
    e.preventDefault();
    // Navigate directly to signup page instead of toggling
    if (!isSignUp) {
      navigate('/signup');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(''); // Clear previous error message

    // Get values directly from state
    const email = emailValue;
    const password = passwordValue;

    // Get other form values if in signup mode
    const firstName = isSignUp ? e.target.querySelector('input[name="firstName"]').value : null;
    const lastName = isSignUp ? e.target.querySelector('input[name="lastName"]').value : null;
    const username = isSignUp ? e.target.querySelector('input[name="username"]').value : null;

    // Check if passwords match in signup mode
    if (isSignUp && passwordValue !== confirmPasswordRef.current.value) {
      setErrorMessage('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        // Call sign-up API
        console.log('Attempting sign-up for:', email); // Added log
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, firstName, lastName, username }),
        });

        console.log('Sign-up API response:', response); // Added log
        const data = await response.json();
        console.log('Sign-up API response data:', data); // Added log

        if (!response.ok) {
          console.error('Sign-up failed with response not ok:', data); // Added log
          throw new Error(data.message || 'Sign-up failed');
        }

        toast.success('Sign-up successful! Please sign in.');
        setIsSignUp(false); // Switch back to Sign In mode
        // Clear form fields
        setEmailValue('');
        setPasswordValue('');
      }
      else {
        // Call sign-in API
        console.log('Attempting sign-in for:', email); // Added log
        const response = await fetch('http://localhost:5000/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        console.log('Sign-in API response:', response); // Added log
        const data = await response.json();
        console.log('Sign-in API response data:', data); // Added log

        if (!response.ok) {
          console.error('Sign-in failed with response not ok:', data); // Added log
          throw new Error(data.message || 'Sign-in failed');
        }

        if (rememberMe) {
          localStorage.setItem('rememberMe', JSON.stringify({ email })); // Store email
        } else {
          localStorage.removeItem('rememberMe');
        }

        // --- TEST USER BYPASS ---
        if (email === "test@example.com") {
          // Save token and user info
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // ✅ Navigate to dashboard
          navigate("/dashboard");
        } else {
          // Normal users -> OTP verification page
          navigate("/verify-otp", { state: { email: data.email } });
        }
        setIsSubmitting(false); // Reset submitting state on success

      }
    } catch (error) {
      console.error("Error occurred during form submission:", error); // Modified log
      setIsSubmitting(false); // Ensure state is reset on error too
      setErrorMessage(error.message); // Display error message to user
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const { email, given_name, family_name } = userInfo.data;

        // Now, send this information to your backend to either sign up or sign in the user
        const response = await fetch('http://localhost:5000/api/auth/google-signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName: given_name,
            lastName: family_name,
            googleId: userInfo.data.sub,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Google sign-in failed');
        }

        navigate('/verify-otp', { state: { email: data.email } });

      } catch (error) {
        if (error.message.includes('network')) {
          setErrorMessage('Network error. Please check your internet connection.');
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (error) => {
      if (error.message.includes('popup_closed_by_user')) {
        setErrorMessage('Google login was cancelled.');
      } else {
        setErrorMessage('Google login failed. Please try again.');
      }
      setIsGoogleLoading(false);
    },
  });

  return (
    <Container>
      <LeftPanel>
        <CosmicBg />
        <Planet />
        <Mountains />
        <Stars>
          {stars.map((star, i) => <Star key={i} {...star} />)}
        </Stars>

        <LeftContent>
          <div>
            <LogoSection>
              <h1>Spherical Worlds</h1>
              <p>Explore infinite possibilities</p>
            </LogoSection>
            <NavButtons>
              <NavBtn onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>Sign Up</NavBtn>
              <NavBtn onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>Back Home</NavBtn>
            </NavButtons>
          </div>

          <BottomInfo>
            <h3>Andrean.ui</h3>
            <p>UI & UX Designer</p>
          </BottomInfo>
        </LeftContent>
      </LeftPanel>

      <RightPanel>
        <ToggleFormButton onClick={handleToggleForm}>
          <FaSyncAlt />
        </ToggleFormButton>

        <FormContainer $isAnimating={isAnimating} $isSignUp={isSignUp}>
          <Brand>
            <BrandLogo />
            <h2>UISOCIAL</h2>
          </Brand>

          <Welcome>
            <h1>{isSignUp ? 'Create Account' : 'Hi Designer'}</h1>
            <p>{isSignUp ? 'Join UISOCIAL today' : 'Welcome to UISOCIAL'}</p>
          </Welcome>

          <form onSubmit={handleFormSubmit}>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* Display error message */}
            {isSignUp && (
              <>
                <FormGroup>
                  <label>Username</label>
                  <input type="text" name="username" placeholder="Enter your username" required />
                </FormGroup>
                <FormGroup>
                  <label>First Name</label>
                  <input type="text" name="firstName" placeholder="Enter your first name" required />
                </FormGroup>
                <FormGroup>
                  <label>Last Name</label>
                  <input type="text" name="lastName" placeholder="Enter your last name" required />
                </FormGroup>
              </>
            )}
            <FormGroup>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                ref={emailRef}
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                style={{ color: 'black' }}
              />
            </FormGroup>

            <FormGroup>
              <label>Password</label>
              <PasswordInputWrapper>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  ref={passwordRef}
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  style={{ color: 'black' }}
                />
                <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </PasswordInputWrapper>
            </FormGroup>

            {isSignUp && (
              <FormGroup>
                <label>Confirm Password</label>
                <PasswordInputWrapper>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    ref={confirmPasswordRef}
                    style={{ color: 'black' }}
                  />
                  <PasswordToggle onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </PasswordInputWrapper>
              </FormGroup>
            )}

            {!isSignUp && (
              <RememberForgot>
                <RememberMe>
                  <input
                    type="checkbox"
                    id="rememberCheckbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberCheckbox">Remember me</label>
                </RememberMe>
                <ForgotPassword>
                  <Link to="/forgot-password">Forgot password?</Link>
                </ForgotPassword>
              </RememberForgot>
            )}

            <SignInBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In to Account')}
            </SignInBtn>

            <Divider>Or</Divider>

            <GoogleBtn type="button" onClick={() => handleGoogleSignIn()} disabled={isGoogleLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M18 9.2c0-.7-.1-1.4-.2-2H9.2v3.9h4.9c-.2 1.1-.9 2-1.8 2.6v2.1h2.9c1.7-1.6 2.6-3.9 2.6-6.6z" /><path fill="#34A853" d="M9.2 18c2.4 0 4.5-.8 6-2.2l-2.9-2.1c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.9H1.1v2.1C2.6 15.9 5.7 18 9.2 18z" /><path fill="#FBBC04" d="M4.1 10.7c-.2-.6-.2-1.2 0-1.8V6.8H1.1c-.7 1.4-.7 3.1 0 4.5l3-2.6z" /><path fill="#EA4335" d="M9.2 3.6c1.3 0 2.5.4 3.4 1.3l2.5-2.5C13.7.7 11.6 0 9.2 0 5.7 0 2.6 2.1 1.1 5.4l3 2.1c.7-2.3 2.7-3.9 5.1-3.9z" /></svg>
              <span>{isGoogleLoading ? 'Signing in...' : (isSignUp ? 'Sign up with Google' : 'Continue with Google')}</span>
            </GoogleBtn>

            <GithubBtn type="button" onClick={() => {
              const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
              const redirectUri = 'http://localhost:5000/api/auth/github/callback';
              const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
              console.log('VITE_GITHUB_CLIENT_ID:', githubClientId);
              console.log('Redirecting to GitHub Auth URL:', githubAuthUrl);
              window.location.href = githubAuthUrl;
            }}>
              <FaGithub />
              <span>Continue with Github</span>
            </GithubBtn>

            <SignupLink>
              {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </a>
            </SignupLink>
          </form>
        </FormContainer>
      </RightPanel>
    </Container>
  );
};

export default SignIn;


// --- Styled Components ---

const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: ${twinkle} 2s infinite;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  animation-delay: ${({ delay }) => delay};
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
`;

const CosmicBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 70%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 20%, rgba(78, 205, 196, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 159, 67, 0.2) 0%, transparent 50%);
`;

const Planet = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  box-shadow: 0 0 50px rgba(255, 107, 107, 0.4);
  top: 20%;
  right: 15%;
  width: 120px;
  height: 120px;
  animation: ${float} 6s ease-in-out infinite;
`;

const Mountains = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  clip-path: polygon(0 100%, 0 60%, 15% 40%, 30% 65%, 45% 35%, 60% 55%, 75% 25%, 90% 45%, 100% 30%, 100% 100%);
`;

const Stars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  color: white;
  h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
  p { font-size: 14px; opacity: 0.8; }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const NavBtn = styled.a`
  padding: 8px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const BottomInfo = styled.div`
  color: white;
  h3 { font-size: 18px; margin-bottom: 5px; }
  p { font-size: 14px; opacity: 0.8; }
`;

const RightPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%);
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(30, 64, 175, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const animationRule = css`
  animation: ${props => props.$isAnimating ? (props.$isSignUp ? css`${slideIn}` : css`${slideOut}`) : 'none'} 0.3s ease-in-out forwards;
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  ${animationRule}
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  h2 { font-size: 18px; font-weight: 600; color: #333; }
`;

const BrandLogo = styled.div`
  width: 8px;
  height: 8px;
  background: #ff6b6b;
  border-radius: 50%;
`;

const Welcome = styled.div`
  margin-bottom: 40px;
  h1 { font-size: 32px; font-weight: 700; color: #333; margin-bottom: 8px; }
  p { color: #666; font-size: 14px; }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  label { 
    display: block; 
    font-size: 14px; 
    color: #1E40AF; 
    margin-bottom: 8px; 
    font-weight: 600; 
  }
  input {
    width: 100%;
    padding: 15px;
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.8);
    color: #1E40AF !important;
    font-weight: 500;
    
    &::placeholder {
      color: #9CA3AF;
      font-weight: 400;
    }
    
    &:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }
    
    &:hover {
      border-color: rgba(59, 130, 246, 0.3);
      background: rgba(255, 255, 255, 0.9);
    }
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.div`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  &:hover {
    color: #666;
  }
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #3B82F6;
    cursor: pointer;
  }
  label { font-size: 14px; color: #6B7280; cursor: pointer; margin: 0; }
`;

const ForgotPassword = styled.div`
  margin: 0;
  a { 
    color: #6B7280; 
    font-size: 14px; 
    text-decoration: none; 
    transition: color 0.3s ease;
    
    &:hover { 
      color: #3B82F6; 
    } 
  }
`;

const Button = styled.button`
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;


const SignInBtn = styled(Button)`
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const GoogleBtn = styled(Button)`
  background: white;
  color: #5f6368;
  border: 2px solid rgba(59, 130, 246, 0.1);
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover:not(:disabled) {
    background: #F8FAFC;
    border-color: #3B82F6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    background: #F1F5F9;
    transform: translateY(0);
  }
`;

const GithubBtn = styled(Button)`
  background: linear-gradient(135deg, #374151 0%, #1F2937 100%);
  color: white;
  margin-top: 10px;
  box-shadow: 0 4px 16px rgba(31, 41, 55, 0.3);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
    box-shadow: 0 6px 20px rgba(31, 41, 55, 0.4);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #999;
  font-size: 12px;
  position: relative;
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #e1e5e9;
  }
  &::before { left: 0; }
  &::after { right: 0; }
`;

const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0 30px; /* Adjusted */
`;

const SocialBtn = styled.a`
  width: 45px;
  height: 45px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #666;
  transition: all 0.3s ease;
  background: white;
  font-size: 18px; /* Added for icon size */
  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
    transform: translateY(-2px);
  }
`;

const SignupLink = styled.div`
  text-align: center;
  color: #6B7280;
  font-size: 14px;
  a {
    color: #3B82F6;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover { 
      color: #1E40AF;
      text-decoration: underline; 
    }
  }
`;

const ToggleFormButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    color: #1E40AF;
    transform: rotate(180deg) scale(1.1);
    border-color: #3B82F6;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: ${fadeIn} 0.3s ease;
`;
