import React from 'react';
import styled from 'styled-components';
import ProfileButton from './ProfileButton';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1E40AF;
`;

const Header = ({ user, onLogout }) => {
  return (
    <HeaderContainer>
      <Logo>My App</Logo>
      <ProfileButton user={user} onLogout={onLogout} />
    </HeaderContainer>
  );
};

export default Header;
