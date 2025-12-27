import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailFromQuery = params.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }

        if (!location.state?.email && !emailFromQuery) {
            navigate('/signin');
            toast.error('Something went wrong. Please try signing in again.');
        }
    }, [location, navigate]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'OTP verification failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('justLoggedIn', 'true');
            navigate('/dashboard');

        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <FormContainer>
                <Welcome>
                    <h1>Verify Your Account</h1>
                    <p>An OTP has been sent to {email}. Please enter it below.</p>
                </Welcome>
                <form onSubmit={handleFormSubmit}>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <FormGroup>
                        <label>OTP</label>
                        <input
                            type="text"
                            placeholder="Enter your 6-digit OTP"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ color: 'black' }}
                        />
                    </FormGroup>
                    <SignInBtn type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Verify'}
                    </SignInBtn>
                </form>
            </FormContainer>
        </Container>
    );
};

export default VerifyOtp;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%);
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const Welcome = styled.div`
  margin-bottom: 40px;
  text-align: center;
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

const ErrorMessage = styled.div`
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;
