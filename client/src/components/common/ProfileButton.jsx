import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #60A5FA;
`;

const DefaultAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #60A5FA;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const UsernameText = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: black;
  white-space: nowrap;
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const EmailText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ProfileButton = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <ProfileButtonContainer onClick={handleClick}>
      {user?.avatarUrl ? <Avatar src={user.avatarUrl} alt="Avatar" /> : <DefaultAvatar><FaUserCircle /></DefaultAvatar>}
      <DropdownHeader>
        <UsernameText>{user?.firstName || 'Guest'}</UsernameText>
        <EmailText>{user?.email}</EmailText>
      </DropdownHeader>
    </ProfileButtonContainer>
  );
};

export default ProfileButton;
