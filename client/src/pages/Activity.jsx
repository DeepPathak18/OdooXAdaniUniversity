import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBell, FaUser, FaSignInAlt, FaEdit, FaTrash, FaClock } from 'react-icons/fa';

const getActivityIcon = (type) => {
    switch(type?.toLowerCase()) {
        case 'login': return <FaSignInAlt />;
        case 'profile_update': return <FaEdit />;
        case 'registration': return <FaUser />;
        case 'deletion': return <FaTrash />;
        default: return <FaClock />;
    }
};

const ActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:5000/api/profile/activity', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch activities');
                }
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error(error);
                setError('Failed to load activities. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <Container>
                <LoaderWrapper>
                    <Loader />
                    <LoadingText>Loading your activity...</LoadingText>
                </LoaderWrapper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage>{error}</ErrorMessage>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <HeaderIcon><FaBell /></HeaderIcon>
                <h1>Your Activity</h1>
            </Header>
            
            <ActivityList>
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <ActivityItem key={activity._id} index={index}>
                            <IconContainer>
                                {getActivityIcon(activity.activityType)}
                            </IconContainer>
                            <ContentContainer>
                                <ActivityInfo>
                                    <ActivityType>{activity.activityType?.replace('_', ' ')}</ActivityType>
                                    <ActivityDescription>{activity.description}</ActivityDescription>
                                </ActivityInfo>
                                <ActivityTimestamp>
                                    {formatDate(activity.createdAt)}
                                </ActivityTimestamp>
                            </ContentContainer>
                        </ActivityItem>
                    ))
                ) : (
                    <EmptyState>
                        <EmptyIcon><FaBell /></EmptyIcon>
                        <EmptyText>No recent activity to display.</EmptyText>
                        <EmptyDescription>Your recent actions will appear here.</EmptyDescription>
                    </EmptyState>
                )}
            </ActivityList>
        </Container>
    );
};

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const flipIn = keyframes`
    0% { transform: perspective(400px) rotateX(-90deg); opacity: 0; }
    40% { transform: perspective(400px) rotateX(10deg); }
    70% { transform: perspective(400px) rotateX(-10deg); }
    100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }
`;

const Container = styled.div`
    padding: 2rem;
    max-width: 800px;
    margin: 2rem auto;
    background-color: var(--card-bg);
    color: var(--text-primary);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    transition: background-color 0.5s ease, color 0.5s ease, transform 0.5s ease;
    animation: ${flipIn} 0.8s ease-out;
    transform-origin: center top;
    
    &:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
    position: relative;
    
    &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100px;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-blue), var(--primary-color));
        border-radius: 3px;
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(90deg, var(--accent-blue), var(--primary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

const HeaderIcon = styled.div`
    color: var(--accent-blue);
    font-size: 1.8rem;
    display: flex;
    align-items: center;
`;

const ActivityList = styled.ul`
    list-style: none;
    padding: 0;
`;

const ActivityItem = styled.li`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    border: 1px solid transparent;
    animation: ${fadeIn} 0.5s ease-out;
    animation-fill-mode: both;
    animation-delay: ${props => (props.index || 0) * 0.1}s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        border-color: var(--primary-blue);
        background-color: rgba(255, 255, 255, 0.08);
    }
`;

const IconContainer = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-blue), var(--primary-color));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 1rem;
    flex-shrink: 0;
    font-size: 1.2rem;
`;

const ContentContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
`;

const ActivityInfo = styled.div`
    flex: 1;
`;

const ActivityType = styled.h3`
    text-transform: capitalize;
    margin: 0 0 0.5rem 0;
    color: var(--accent-blue);
    font-weight: 600;
`;

const ActivityDescription = styled.p`
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.95rem;
`;

const ActivityTimestamp = styled.span`
    color: var(--text-muted);
    font-size: 0.85rem;
    white-space: nowrap;
    margin-left: 1rem;
    background: rgba(0, 0, 0, 0.1);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
`;

const Loader = styled.div`
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid var(--accent-blue);
    width: 40px;
    height: 40px;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1rem;
`;

const LoadingText = styled.p`
    color: var(--text-secondary);
    font-size: 1rem;
`;

const ErrorMessage = styled.div`
    color: #e74c3c;
    text-align: center;
    background: rgba(231, 76, 60, 0.1);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #e74c3c;
    margin: 2rem 0;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    border: 1px dashed var(--border-color);
    animation: ${fadeIn} 0.5s ease-out;
    transition: transform 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.05);
    }
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    opacity: 0.5;
`;

const EmptyText = styled.h3`
    font-size: 1.2rem;
    color: var(--text-primary);
    margin: 0.5rem 0;
`;

const EmptyDescription = styled.p`
    color: var(--text-secondary);
    font-size: 0.9rem;
    max-width: 300px;
    margin: 0.5rem auto;
`;

export default ActivityPage;
