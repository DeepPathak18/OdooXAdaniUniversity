import React from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaUser, FaCalendar, FaIdCard } from 'react-icons/fa';

const UserDataDisplay = ({ user }) => {
  if (!user) return null;

  return (
    <UserCard>
      <UserHeader>
        <Avatar>
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} />
          ) : (
            <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          )}
        </Avatar>
        <UserInfo>
          <Name>{user.name || 'User'}</Name>
          <Email>{user.email}</Email>
        </UserInfo>
      </UserHeader>

      <UserDetails>
        <DetailItem>
          <Icon><FaEnvelope /></Icon>
          <DetailContent>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>{user.email}</DetailValue>
          </DetailContent>
        </DetailItem>

        <DetailItem>
          <Icon><FaUser /></Icon>
          <DetailContent>
            <DetailLabel>Full Name</DetailLabel>
            <DetailValue>{user.name}</DetailValue>
          </DetailContent>
        </DetailItem>

        {user.firstName && (
          <DetailItem>
            <Icon><FaUser /></Icon>
            <DetailContent>
              <DetailLabel>First Name</DetailLabel>
              <DetailValue>{user.firstName}</DetailValue>
            </DetailContent>
          </DetailItem>
        )}

        {user.lastName && (
          <DetailItem>
            <Icon><FaUser /></Icon>
            <DetailContent>
              <DetailLabel>Last Name</DetailLabel>
              <DetailValue>{user.lastName}</DetailValue>
            </DetailContent>
          </DetailItem>
        )}

        <DetailItem>
          <Icon><FaIdCard /></Icon>
          <DetailContent>
            <DetailLabel>User ID</DetailLabel>
            <DetailValue>{user.appwriteId || user.$id}</DetailValue>
          </DetailContent>
        </DetailItem>

        {user.createdAt && (
          <DetailItem>
            <Icon><FaCalendar /></Icon>
            <DetailContent>
              <DetailLabel>Member Since</DetailLabel>
              <DetailValue>{new Date(user.createdAt).toLocaleDateString()}</DetailValue>
            </DetailContent>
          </DetailItem>
        )}

        {user.provider && (
          <DetailItem>
            <Icon>🔐</Icon>
            <DetailContent>
              <DetailLabel>Sign-in Method</DetailLabel>
              <DetailValue>Google OAuth</DetailValue>
            </DetailContent>
          </DetailItem>
        )}
      </UserDetails>
    </UserCard>
  );
};

// Styled Components
const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 400px;
  width: 100%;
  margin: 20px auto;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const Email = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.2rem;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
`;

const DetailValue = styled.div`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

export default UserDataDisplay;
