import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const Toast = ({ message, type = 'success', onClose, duration = 6000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer type={type}>
      <ToastIcon>
        {type === 'success' && <FaCheckCircle />}
      </ToastIcon>
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
    </ToastContainer>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
  color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out;
  max-width: 400px;
  
  &.closing {
    animation: ${slideOut} 0.3s ease-in forwards;
  }
`;

const ToastIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Toast;
