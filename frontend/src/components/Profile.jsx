import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUserCircle, FaEnvelope, FaUserTag, FaIdBadge, FaEdit, FaSave, FaTimes, FaPhone, FaVenusMars, FaCamera, FaSpinner, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaGlobe, FaLinkedin, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

// Real API functions
const getProfile = async (email) => {
    try {
        console.log('🔍 Fetching profile for email:', email);
    // Use relative API path so Vite dev server proxy handles CORS
    const response = await fetch(`/api/profile/me?email=${encodeURIComponent(email)}`);
        console.log('📡 Profile API response status:', response.status);
        console.log('📡 Profile API response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📊 Profile data received:', data);
        return data;
    } catch (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
    }
};

const updateProfile = async (email, formData) => {
    try {
        console.log('🔄 Updating profile for email:', email);
        console.log('📝 Update data:', formData);
    // Use relative API path so Vite dev server proxy handles CORS
    const response = await fetch('/api/profile/me/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                ...formData
            })
        });
        
        console.log('📡 Update API response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Profile update successful:', result);
        return result;
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
    }
};


const getUserEmail = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('👤 User from localStorage:', user);
    const email = user?.email;
    console.log('📧 Extracted email:', email);
    return email;
  } catch (err) {
    console.error('❌ Error parsing user from localStorage:', err);
    return null;
  }
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    username: '', 
    phoneNumber: '', 
    gender: '',
    location: '',
    occupation: '',
    education: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    github: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/signin');
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
        setForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          username: userData.username || '',
          phoneNumber: userData.phoneNumber || '',
          gender: userData.gender || '',
        });
        setAvatarPreview(userData.avatar || '');
        setLoading(false);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    // Reset form and avatar preview to current user state when opening modal
    setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        location: user.location || '',
        occupation: user.occupation || '',
        education: user.education || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        instagram: user.instagram || '',
        github: user.github || ''
    });
    setAvatarPreview(user.avatar || '');
    setAvatarFile(null);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Clean up preview URL
    if (avatarFile) {
        URL.revokeObjectURL(avatarPreview);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      // First, update the profile data
      const profileUpdateResponse = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!profileUpdateResponse.ok) {
        throw new Error('Failed to update profile data.');
      }

      let updatedUser = await profileUpdateResponse.json();

      // If there's a new avatar file, upload it
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarUpdateResponse = await fetch('/api/profile/avatar', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!avatarUpdateResponse.ok) {
          throw new Error('Failed to upload avatar.');
        }
        const avatarData = await avatarUpdateResponse.json();
        // Combine the results
        updatedUser.avatar = avatarData.avatar;
      }
      
      setUser(updatedUser);
      setEditMode(false);
      setShowSuccessToast(true); // Show success notification

    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ProfileContainer><Loader /></ProfileContainer>;
  }

  if (error && !editMode) {
    return <ProfileContainer><ErrorCard>{error}</ErrorCard></ProfileContainer>;
  }

  if (!user) {
    return <ProfileContainer><ErrorCard>Could not load user profile.</ErrorCard></ProfileContainer>;
  }

  return (
    <ProfileContainer>
      {showSuccessToast && (
        <Toast
          message="Profile updated successfully!"
          type="success"
          onClose={() => setShowSuccessToast(false)}
          duration={5000}
        />
      )}
      
      <ProfileCard>
        <AvatarContainer>
            <Avatar src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : 'https://placehold.co/150x150/E0F7FA/01579B?text=User'} alt="Avatar" />
            <AvatarOverlay onClick={() => setEditMode(true)}>
                <FaCamera />
            </AvatarOverlay>
            <AvatarGlow />
        </AvatarContainer>
        <UserName>{`${user.firstName} ${user.lastName}`}</UserName>
        <UserHandle>@{user.username || 'username'}</UserHandle>
        
        <ProfileInfo>
          <InfoRow>
            <IconWrapper><FaUserTag /></IconWrapper>
            <div>
              <InfoLabel>Username</InfoLabel>
              <InfoValue>{user.username || '-'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaIdBadge /></IconWrapper>
            <div>
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaEnvelope /></IconWrapper>
            <div>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user.email || '-'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaPhone /></IconWrapper>
            <div>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{user.phoneNumber || '-'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaVenusMars /></IconWrapper>
            <div>
              <InfoLabel>Gender</InfoLabel>
              <InfoValue>{user.gender || '-'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaCalendar /></IconWrapper>
            <div>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaMapMarkerAlt /></IconWrapper>
            <div>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{user.location || 'Not specified'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaBriefcase /></IconWrapper>
            <div>
              <InfoLabel>Occupation</InfoLabel>
              <InfoValue>{user.occupation || 'Not specified'}</InfoValue>
            </div>
          </InfoRow>
          <InfoRow>
            <IconWrapper><FaGraduationCap /></IconWrapper>
            <div>
              <InfoLabel>Education</InfoLabel>
              <InfoValue>{user.education || 'Not specified'}</InfoValue>
            </div>
          </InfoRow>
        </ProfileInfo>
        
        {user.bio && (
          <BioSection>
            <BioTitle>About</BioTitle>
            <BioText>{user.bio}</BioText>
          </BioSection>
        )}
        
        {(user.website || user.linkedin || user.twitter || user.instagram || user.github) && (
          <SocialLinksSection>
            <SocialTitle>Social Links</SocialTitle>
            <SocialLinks>
              {user.website && (
                <SocialLink href={user.website} target="_blank" rel="noopener noreferrer">
                  <FaGlobe />
                  <span>Website</span>
                </SocialLink>
              )}
              {user.linkedin && (
                <SocialLink href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </SocialLink>
              )}
              {user.twitter && (
                <SocialLink href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                  <span>Twitter</span>
                </SocialLink>
              )}
              {user.instagram && (
                <SocialLink href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                  <span>Instagram</span>
                </SocialLink>
              )}
              {user.github && (
                <SocialLink href={user.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                  <span>GitHub</span>
                </SocialLink>
              )}
            </SocialLinks>
          </SocialLinksSection>
        )}
        
        <ButtonGroup>
          <EditButton onClick={handleEdit}>
            <FaEdit /> Edit Profile
          </EditButton>
          <LogoutButton onClick={() => { 
            const user = JSON.parse(localStorage.getItem('user'));
            const username = user?.username || user?.firstName || 'User';
            localStorage.removeItem('token'); 
            localStorage.removeItem('user');
            localStorage.setItem('logoutMessage', `Goodbye, ${username}! You have been logged out successfully.`);
            navigate('/'); 
          }}>
             Logout
          </LogoutButton>
        </ButtonGroup>
      </ProfileCard>

      {editMode && (
        <ModalOverlay>
            <EditModal>
                <ModalHeader>
                    <ModalTitle>Edit Profile</ModalTitle>
                    <ModalSubtitle>Update your personal information and social links</ModalSubtitle>
                </ModalHeader>
                
                {error && <ErrorText>{error}</ErrorText>}
                
                <ModalForm>
                    <FormSection>
                        <SectionTitle>Profile Photo</SectionTitle>
                        <AvatarUploadContainer>
                            <img src={avatarPreview || 'https://placehold.co/150x150/E0F7FA/01579B?text=User'} alt="Avatar Preview" className="preview-avatar" />
                            <UploadButton onClick={() => fileInputRef.current.click()}>
                                <FaCamera /> Change Photo
                            </UploadButton>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </AvatarUploadContainer>
                    </FormSection>

                    <FormSection>
                        <SectionTitle>Basic Information</SectionTitle>
                        <InputRow>
                            <ModalInput name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
                            <ModalInput name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
                        </InputRow>
                        <InputRow>
                            <ModalInput name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                            <ModalInput name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                        </InputRow>
                        <InputRow>
                            <ModalInput name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
                            <ModalSelect name="gender" value={form.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </ModalSelect>
                        </InputRow>
                    </FormSection>

                    <FormSection>
                        <SectionTitle>Professional Information</SectionTitle>
                        <InputRow>
                            <ModalInput name="location" value={form.location} onChange={handleChange} placeholder="Location" />
                            <ModalInput name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupation" />
                        </InputRow>
                        <ModalInput name="education" value={form.education} onChange={handleChange} placeholder="Education" />
                        <ModalTextarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows="3" />
                    </FormSection>

                    <FormSection>
                        <SectionTitle>Social Links</SectionTitle>
                        <InputRow>
                            <ModalInput name="website" value={form.website} onChange={handleChange} placeholder="Website URL" />
                            <ModalInput name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" />
                        </InputRow>
                        <InputRow>
                            <ModalInput name="twitter" value={form.twitter} onChange={handleChange} placeholder="Twitter Handle" />
                            <ModalInput name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram Handle" />
                        </InputRow>
                        <ModalInput name="github" value={form.github} onChange={handleChange} placeholder="GitHub Profile" />
                    </FormSection>
                </ModalForm>
                
                <ModalActions>
                    <SaveButton onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <SmallLoader/> : <><FaSave /> Save Changes</>}
                    </SaveButton>
                    <CancelButton onClick={handleCancel}><FaTimes /> Cancel</CancelButton>
                </ModalActions>
            </EditModal>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

// --- Enhanced Animations and Keyframes ---

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.95) translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
`;

const slideInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1); 
    opacity: 1; 
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.8; 
  }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(37, 99, 235, 0.3); 
  }
  50% { 
    box-shadow: 0 0 30px rgba(37, 99, 235, 0.6); 
  }
`;

const spin = keyframes`
  to { 
    transform: rotate(360deg); 
  }
`;

const shimmer = keyframes`
  0% { 
    background-position: -200px 0; 
  }
  100% { 
    background-position: calc(200px + 100%) 0; 
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { 
    transform: translate3d(0,0,0); 
  }
  40%, 43% { 
    transform: translate3d(0, -8px, 0); 
  }
  70% { 
    transform: translate3d(0, -4px, 0); 
  }
  90% { 
    transform: translate3d(0, -2px, 0); 
  }
`;

// --- Enhanced Styled Components ---

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 25%, #7DD3FC 50%, #38BDF8 75%, #0EA5E9 100%);
  padding: 20px;
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

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(37, 99, 235, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  width: 100%;
  max-width: 450px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1E40AF;
  animation: ${fadeIn} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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

const AvatarContainer = styled.div`
    position: relative;
    margin-bottom: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const Avatar = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 4px solid #3B82F6;
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  object-fit: cover;
  animation: ${pulse} 3s ease-in-out infinite;

  &:hover {
    border-color: #1E40AF;
    box-shadow: 
      0 12px 40px rgba(59, 130, 246, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const AvatarOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(30, 64, 175, 0.8);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    opacity: 0;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    
    ${AvatarContainer}:hover & {
        opacity: 1;
        transform: scale(1.1);
    }
`;

const AvatarGlow = styled.div`
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
    animation: ${glow} 2s ease-in-out infinite;
    pointer-events: none;
`;

const UserName = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  color: #1E40AF;
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${slideInUp} 0.6s ease-out 0.2s both;
`;

const UserHandle = styled.p`
  font-size: 1.1rem;
  color: #6B7280;
  margin-top: 8px;
  margin-bottom: 32px;
  font-weight: 500;
  animation: ${slideInUp} 0.6s ease-out 0.3s both;
`;

const ProfileInfo = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 36px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  padding-top: 24px;
  animation: ${slideInUp} 0.6s ease-out 0.4s both;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 1rem;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(59, 130, 246, 0.02);

  &:hover {
    background: rgba(59, 130, 246, 0.05);
    transform: translateX(4px);
  }

  &:last-child { 
    margin-bottom: 0; 
  }
`;

const IconWrapper = styled.div`
  color: #3B82F6;
  font-size: 1.3rem;
  margin-right: 16px;
  width: 28px;
  text-align: center;
  transition: all 0.3s ease;

  ${InfoRow}:hover & {
    color: #1E40AF;
    transform: scale(1.1);
  }
`;

const InfoLabel = styled.span`
  display: block;
  color: #6B7280;
  font-size: 0.85rem;
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  display: block;
  color: #1E40AF;
  font-weight: 600;
  font-size: 1rem;
`;

const BioSection = styled.div`
  width: 100%;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(59, 130, 246, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  animation: ${slideInUp} 0.6s ease-out 0.5s both;
`;

const BioTitle = styled.h3`
  color: #1E40AF;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

const BioText = styled.p`
  color: #6B7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
`;

const SocialLinksSection = styled.div`
  width: 100%;
  margin-bottom: 24px;
  animation: ${slideInUp} 0.6s ease-out 0.6s both;
`;

const SocialTitle = styled.h3`
  color: #1E40AF;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(59, 130, 246, 0.05);
  color: #3B82F6;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(59, 130, 246, 0.1);
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #1E40AF;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 16px;
    width: 100%;
    animation: ${slideInUp} 0.6s ease-out 0.7s both;
`;

const baseButton = `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  position: relative;
  overflow: hidden;

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
`;

const EditButton = styled.button`
  ${baseButton}
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LogoutButton = styled.button`
  ${baseButton}
  background: transparent;
  color: #EF4444;
  border: 2px solid #EF4444;
  font-weight: 500;

  &:hover {
    background: #EF4444;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// --- Enhanced Modal Styles ---

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease;
`;

const EditModal = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 0;
  border-radius: 24px;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.15),
    0 12px 40px rgba(37, 99, 235, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(59, 130, 246, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  color: white;
  padding: 32px 36px 24px;
  border-radius: 24px 24px 0 0;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const ModalSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.95rem;
  font-weight: 400;
`;

const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 36px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #1E40AF;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  }
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 64, 175, 0.05) 100%);
    border-radius: 16px;
    border: 1px solid rgba(59, 130, 246, 0.1);

    .preview-avatar {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #3B82F6;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;

        &:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }
    }
`;

const UploadButton = styled.button`
    ${baseButton}
    width: auto;
    padding: 10px 20px;
    font-size: 0.95rem;
    background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%);
    color: white;
    border-radius: 8px;

    &:hover {
        background: linear-gradient(135deg, #4B5563 0%, #374151 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(75, 85, 99, 0.3);
    }
`;

const baseInput = `
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 0.8);
  color: #1E40AF;
  font-size: 1rem;
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

const ModalInput = styled.input` 
  ${baseInput} 
`;

const ModalSelect = styled.select` 
  ${baseInput} 
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
`;

const ModalTextarea = styled.textarea`
  ${baseInput}
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 36px;
  background: rgba(248, 250, 252, 0.8);
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 0 0 24px 24px;
`;

const SaveButton = styled.button`
  ${baseButton}
  width: auto;
  min-width: 120px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);

  &:hover:not(:disabled) { 
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  }

  &:disabled { 
    background: #9CA3AF; 
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  ${baseButton}
  width: auto;
  min-width: 120px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);

  &:hover { 
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
  }
`;

// --- Enhanced Loader and Error Styles ---

const Loader = styled.div`
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top: 4px solid #3B82F6;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
`;

const SmallLoader = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ErrorCard = styled(ProfileCard)`
  border-color: #EF4444;
  color: #EF4444;
  animation: ${bounce} 0.6s ease;
`;

const ErrorText = styled.p`
    color: #EF4444;
    text-align: center;
    margin: -8px 0 20px 0;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 12px 16px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(239, 68, 68, 0.2);
`;

export default Profile;