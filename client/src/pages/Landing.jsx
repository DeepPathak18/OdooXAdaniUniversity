import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import { FaRocket, FaCode, FaUsers, FaTrophy, FaLightbulb, FaUserCircle, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for logout message and show toast
    const message = localStorage.getItem('logoutMessage');
    if (message) {
      toast.success(message);
      localStorage.removeItem('logoutMessage');
    }
    
    // Trigger animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNavigation = (path) => {
    // Add page transition animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
    document.body.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      navigate(path);
      document.body.style.opacity = '1';
      document.body.style.transform = 'scale(1)';
    }, 300);
  };

  return (
    <Container>
      {/* Floating Particles */}
      <ParticleContainer>
        {[...Array(20)].map((_, i) => (
          <Particle key={i} $delay={i * 0.1} />
        ))}
      </ParticleContainer>

      {/* Header */}
      <Header>
        <Logo>
          <LogoIcon>
            <FaRocket />
          </LogoIcon>
          <span>TECH-TONIC</span>
        </Logo>
        
        <AuthButtons>
          <SignInButton onClick={() => handleNavigation('/signin')}>
            Sign In
          </SignInButton>
          <SignUpButton onClick={() => handleNavigation('/signin?mode=signup')}>
            Sign Up
          </SignUpButton>
        </AuthButtons>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* Hero Section */}
        <HeroSection $isVisible={isVisible}>
          <HeroContent>
            <HeroBadge>
              <FaRocket />
              <span>Welcome to Tech-Tonic Hackathon!</span>
            </HeroBadge>
            
            <HeroTitle>
              Transform Ideas, <GradientText>Build Future</GradientText>
            </HeroTitle>
            
            <HeroSubtitle>
              Experience the most comprehensive hackathon designed for developers who want to push boundaries and create meaningful impact.
            </HeroSubtitle>

            <StatsGrid>
              <StatCard>
                <StatNumber>8</StatNumber>
                <StatLabel>Hours</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>100+</StatNumber>
                <StatLabel>Teams</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>15K</StatNumber>
                <StatLabel>In Prizes</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>5</StatNumber>
                <StatLabel>Domains</StatLabel>
              </StatCard>
            </StatsGrid>

            <ActionButtons>
              <PrimaryButton onClick={() => handleNavigation('/signin')}>
                Get Started
              </PrimaryButton>
              <SecondaryButton onClick={() => handleNavigation('/signup')}>
                Join Now
              </SecondaryButton>
            </ActionButtons>
          </HeroContent>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection $isVisible={isVisible}>
          <SectionHeader>
            <SectionTitle>Why <GradientText>Tech-Tonic?</GradientText></SectionTitle>
            <SectionSubtitle>Discover what makes our hackathon unique</SectionSubtitle>
          </SectionHeader>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FaCode />
              </FeatureIcon>
              <FeatureTitle>Industry Focus</FeatureTitle>
              <FeatureDescription>
                Tackle challenges in AI, blockchain, sustainability, and emerging technologies.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>Expert Mentors</FeatureTitle>
              <FeatureDescription>
                Get guidance from industry leaders, successful entrepreneurs, and technical experts.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaTrophy />
              </FeatureIcon>
              <FeatureTitle>Real Impact</FeatureTitle>
              <FeatureDescription>
                Build solutions for real-world problems with potential for continued development.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaRocket />
              </FeatureIcon>
              <FeatureTitle>Prizes & Swags</FeatureTitle>
              <FeatureDescription>
                Compete for 15,000 INR in prizes, including cash, tech gear, and opportunities.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>Networking</FeatureTitle>
              <FeatureDescription>
                Connect with like-minded developers, designers, and entrepreneurs.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaLightbulb />
              </FeatureIcon>
              <FeatureTitle>Team Building</FeatureTitle>
              <FeatureDescription>
                Intensive coding marathon with mentorship, workshops, and unlimited coffee.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        {/* Quick Actions */}
        <QuickActionsSection $isVisible={isVisible}>
          <SectionHeader>
            <SectionTitle>Quick <GradientText>Actions</GradientText></SectionTitle>
            <SectionSubtitle>Get started with your hackathon journey</SectionSubtitle>
          </SectionHeader>
          
          <ActionsGrid>
            <ActionCard onClick={() => handleNavigation('/signin')}>
              <ActionIcon>
                <FaUserCircle />
              </ActionIcon>
              <ActionTitle>Sign In</ActionTitle>
              <ActionDescription>Access your account and dashboard</ActionDescription>
            </ActionCard>

            <ActionCard onClick={() => handleNavigation('/signup')}>
              <ActionIcon>
                <FaRocket />
              </ActionIcon>
              <ActionTitle>Register</ActionTitle>
              <ActionDescription>Create your account and join the event</ActionDescription>
            </ActionCard>

            <ActionCard onClick={() => handleNavigation('/signin')}>
              <ActionIcon>
                <FaInfoCircle />
              </ActionIcon>
              <ActionTitle>Learn More</ActionTitle>
              <ActionDescription>Discover hackathon details and rules</ActionDescription>
            </ActionCard>

            <ActionCard onClick={() => handleNavigation('/signup')}>
              <ActionIcon>
                <FaCalendarAlt />
              </ActionIcon>
              <ActionTitle>Join Event</ActionTitle>
              <ActionDescription>Register and start your journey</ActionDescription>
            </ActionCard>
          </ActionsGrid>
        </QuickActionsSection>
      </MainContent>
    </Container>
  );
};

export default LandingPage;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #fff;
  position: relative;
  overflow-x: hidden;
`;

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  animation: ${float} 6s infinite ease-in-out;
  animation-delay: ${props => props.$delay}s;
  
  &:nth-child(odd) {
    left: ${props => Math.random() * 100}%;
    animation-duration: 8s;
  }
  
  &:nth-child(even) {
    right: ${props => Math.random() * 100}%;
    animation-duration: 10s;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SignInButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
`;

const SignUpButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(236, 72, 153, 0.4);
  }
`;

const MainContent = styled.main`
  padding: 2rem 3rem;
  position: relative;
  z-index: 2;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.8s ease;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  color: #3b82f6;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease 0.2s both;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  animation: ${fadeInUp} 0.8s ease 0.4s both;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #cbd5e1;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: ${fadeInUp} 0.8s ease 0.6s both;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 0.8s ease 0.8s both;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.8s ease 1s both;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
`;

const SecondaryButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(236, 72, 153, 0.4);
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.8s ease 0.2s;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
`;

const FeatureDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
`;

const QuickActionsSection = styled.section`
  padding: 6rem 0;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.8s ease 0.4s;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.1);
  }
`;

const ActionIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
`;

const ActionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const ActionDescription = styled.p`
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
`;