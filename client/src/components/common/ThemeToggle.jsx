import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../utils/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme, isLoaded } = useTheme();

  if (!isLoaded) {
    return <ToggleContainer><ToggleSwitch /></ToggleContainer>;
  }

  return (
    <ToggleContainer>
      <ToggleSwitch onClick={toggleTheme} $isDark={theme === 'dark'}>
        <ToggleIcon $isDark={theme === 'dark'}>
          <FaSun />
        </ToggleIcon>
        <ToggleIcon $isDark={theme === 'dark'}>
          <FaMoon />
        </ToggleIcon>
        <ToggleSlider $isDark={theme === 'dark'} />
      </ToggleSwitch>
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${props => props.$isDark ? '#374151' : '#e5e7eb'};
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ToggleIcon = styled.div`
  color: ${props => props.$isDark ? '#fbbf24' : '#f59e0b'};
  font-size: 12px;
  z-index: 2;
  transition: all 0.3s ease;
  opacity: ${props => props.$isDark ? '0.7' : '1'};
  
  &:last-child {
    opacity: ${props => props.$isDark ? '1' : '0.7'};
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.$isDark ? '32px' : '2px'};
  width: 26px;
  height: 26px;
  background: ${props => props.$isDark ? '#1f2937' : '#ffffff'};
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

export default ThemeToggle;
