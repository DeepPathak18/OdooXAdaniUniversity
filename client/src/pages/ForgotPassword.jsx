import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import { FaEnvelope, FaKey, FaLock, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {
        if (step === 2) {
            inputRefs.current[0]?.focus();
        }
    }, [step]);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/otp/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message || 'Failed to send OTP.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const finalOtp = otp.join('');
        try {
            const res = await fetch('http://localhost:5000/api/otp/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: finalOtp }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setStep(3);
            } else {
                toast.error(data.message || 'OTP verification failed.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/otp/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                navigate('/signin');
            } else {
                toast.error(data.message || 'Password change failed.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/signin');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <FormWrapper key="step1" onSubmit={handleRequestOtp}>
                        <IconWrapper><FaEnvelope /></IconWrapper>
                        <h2>Forgot Password?</h2>
                        <p>Enter your email to receive a reset code.</p>
                        <InputGroup>
                            <FaEnvelope />
                            <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </InputGroup>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Request OTP'}</Button>
                    </FormWrapper>
                );
            case 2:
                return (
                    <FormWrapper key="step2" onSubmit={handleVerifyOtp}>
                        <IconWrapper><FaKey /></IconWrapper>
                        <h2>Enter OTP</h2>
                        <p>A 6-digit code was sent to <strong>{email}</strong>.</p>
                        <CodeInputContainer>
                            {otp.map((data, index) => (
                                <CodeInput key={index} type="text" maxLength="1" value={data} onChange={(e) => handleCodeChange(e.target, index)} onKeyDown={(e) => handleKeyDown(e, index)} ref={el => inputRefs.current[index] = el} />
                            ))}
                        </CodeInputContainer>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify OTP'}</Button>
                    </FormWrapper>
                );
            case 3:
                return (
                    <FormWrapper key="step3" onSubmit={handleChangePassword}>
                        <IconWrapper><FaLock /></IconWrapper>
                        <h2>Set New Password</h2>
                        <p>Create a new secure password for your account.</p>
                        <InputGroup>
                            <FaLock />
                            <Input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </InputGroup>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Change Password'}</Button>
                    </FormWrapper>
                );
            default:
                return null;
        }
    };

    return (
        <Container>
            <Card>
                <BackButton onClick={goBack}><FaArrowLeft /></BackButton>
                {renderStep()}
                <StyledLink to="/signin">Back to Sign In</StyledLink>
            </Card>
        </Container>
    );
};

export default ForgotPassword;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: 'Poppins', sans-serif;
`;

const Card = styled.div`
    background: white;
    padding: 40px 50px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 450px;
    width: 100%;
    position: relative;
    overflow: hidden;
`;

const FormWrapper = styled.form`
    animation: ${fadeIn} 0.5s ease-in-out;
    h2 {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
    }
    p {
        color: #666;
        margin-bottom: 30px;
    }
`;

const IconWrapper = styled.div`
    font-size: 40px;
    color: #ff6b6b;
    margin-bottom: 20px;
`;

const InputGroup = styled.div`
    position: relative;
    margin-bottom: 20px;
    svg {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #aaa;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 15px 15px 15px 45px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s ease;
    &:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    }
`;

const CodeInputContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

const CodeInput = styled.input`
    width: 45px;
    height: 50px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    border: 1px solid #ddd;
    border-radius: 10px;
    transition: all 0.3s ease;
    &:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    margin-top: 1rem;
    transition: all 0.3s ease;
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
    }
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const StyledLink = styled(Link)`
    display: inline-block;
    margin-top: 20px;
    color: #ff6b6b;
    text-decoration: none;
    font-weight: 500;
    &:hover {
        text-decoration: underline;
    }
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    font-size: 20px;
    color: #aaa;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
        color: #333;
    }
`;
