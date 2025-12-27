import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #a0d2eb;
  display: flex;
  justify-content: center;  
  align-items: center;
  margin-right: 10px;
`;

const Username = styled.span`
  font-weight: bold;
  font-family: sans-serif;
  font-size: 16px;
  color: black;
`;

const ProfileComponent = ({ user }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <ProfileWrapper onClick={handleProfileClick}>
            <Avatar>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
                </svg>
            </Avatar>
            <Username>{user.username}</Username>
        </ProfileWrapper>
    );
};

export default ProfileComponent;