import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ripples, setRipples] = useState([]);

  const { username, firstName, lastName, email, password, confirmPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
    const response = await axios.post('/api/auth/signup', { username, firstName, lastName, email, password });
    console.log('Signup API full response:', response);
    console.log('Signup API data:', response.data);
    console.log('Signup successful');
    navigate('/dashboard'); // Redirect to dashboard page
    } catch (err) {
      console.error('Signup error:', err.response?.data);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Ripple effect on button click
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple = { x, y, size, key: Date.now() };
    setRipples((oldRipples) => [...oldRipples, newRipple]);
    setTimeout(() => {
      setRipples((oldRipples) => oldRipples.filter((r) => r.key !== newRipple.key));
    }, 600);
  };

  // Use shake animation if error exists
  const CardComponent = error ? ErrorShakeSignUpCard : SignUpCard;

  return (
    <PageContainer>
      <CardComponent>
        <Title>Create an Account</Title>
        <Subtitle>Get started with us</Subtitle>

        {error && <SmoothErrorMessage>{error}</SmoothErrorMessage>}

        <StyledForm onSubmit={onSubmit}>
          <InputGroup>
            <EnhancedInput
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Username"
              required
            />
          </InputGroup>
          <NameRow>
            <InputGroup>
              <EnhancedInput
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                placeholder="First Name"
                required
              />
            </InputGroup>
            <InputGroup>
              <EnhancedInput
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                placeholder="Last Name"
                required
              />
            </InputGroup>
          </NameRow>
          <InputGroup>
            <EnhancedInput
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              required
            />
          </InputGroup>
          <InputGroup>
            <EnhancedInput
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
            />
          </InputGroup>
          <InputGroup>
            <EnhancedInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm Password"
              required
            />
          </InputGroup>
          <SubmitButton
            type="submit"
            disabled={isLoading}
            onClick={createRipple}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {ripples.map(({ x, y, size, key }) => (
              <RippleContainer
                key={key}
                style={{
                  width: size,
                  height: size,
                  top: y,
                  left: x,
                  position: 'absolute',
                }}
              />
            ))}
          </SubmitButton>
        </StyledForm>

        <Divider />

        <SignInText>
          Already have an account? <StyledLink to="/signin">Sign In</StyledLink>
        </SignInText>

        <BackToHome>
          <StyledLink to="/">← Back to Home</StyledLink>
        </BackToHome>
      </CardComponent>
    </PageContainer>
  );
};

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.75;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
`;

const bounceIn = keyframes`
  0% { transform: translateY(-100%) scale(0); opacity: 0; }
  60% { transform: translateY(15%) scale(1.1); opacity: 1; }
  80% { transform: translateY(-7%) scale(0.95); }
  100% { transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 25%, #7DD3FC 50%, #38BDF8 75%, #0EA5E9 100%);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
`;

const SignUpCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40px 32px;
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(37, 99, 235, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${fadeIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: ${shimmer} 3s infinite;
  }
`;

const ErrorShakeSignUpCard = styled(SignUpCard)`
  animation: ${shake} 0.5s;
`;

const Title = styled.h1`
  color: #1E40AF;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #6B7280;
  font-size: 16px;
  margin-bottom: 30px;
  font-weight: 500;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
  flex: 1;
`;

const NameRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 0px;
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 20px;
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  color: #1E40AF;
  font-weight: 500;
  
  &::placeholder {
    color: #9CA3AF;
    font-weight: 400;
  }
`;

const EnhancedInput = styled(Input)`
  border: 2px solid rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 0.8);
  color: #1E40AF;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
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
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RippleContainer = styled.span`
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ${ripple} 600ms linear;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 30px 0;
`;



const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const SmoothErrorMessage = styled(ErrorMessage)`
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards;
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const SignInText = styled.p`
  margin-top: 30px;
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
`;

const BackToHome = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #3B82F6;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: #1E40AF;
    text-decoration: underline;
  }
`;

export default SignUp;