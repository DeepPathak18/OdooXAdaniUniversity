import ProfileButton from './ProfileButton';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle, FaSignOutAlt, FaBell, FaSun, FaMoon, FaRobot } from 'react-icons/fa';
import { useTheme } from '../utils/useTheme';
import Snowfall from "react-snowfall";

const TechTonicHackathon = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });
    const [showProfileModal, setShowProfileModal] = useState(false);


    const { theme, toggleTheme, isDark, isLight } = useTheme();


    // Enhanced theme toggle with notification
    const handleThemeToggle = () => {
        const newTheme = toggleTheme();

        // Show theme change notification
        toast.success(`Switched to ${newTheme} mode!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    // --- EVENT HANDLERS ---

    const handleHamburgerClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = (e) => {
        // Smooth scroll logic
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        setIsMenuOpen(false);
    };





    // CSS is embedded here to ensure styles are perfectly preserved.
    const styles = `
        :root {
            --primary-blue: #1E40AF;
            --secondary-blue: #2563EB;
            --accent-blue: #3B82F6;
            --light-blue: #60A5FA;
            --dark-blue: #1E3A8A;
            --dark-bg: #0F172A;
            --darker-bg: #020617;
            --card-bg: rgba(255, 255, 255, 0.9);
            --border-color: rgba(59, 130, 246, 0.3);
            --text-primary: #1E293B;
            --text-secondary: #334155;
            --text-muted: #64748B;
            --gradient-primary: linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6);
            --gradient-secondary: linear-gradient(135deg, #1E3A8A, #1E40AF);
            --shadow-blue: rgba(37, 99, 235, 0.2);
            --shadow-glow: rgba(37, 99, 235, 0.3);
        }

        html[data-theme='dark'] {
            --primary-blue: #3B82F6;
            --secondary-blue: #60A5FA;
            --accent-blue: #93C5FD;
            --light-blue: #BFDBFE;
            --dark-blue: #1E40AF;
            --dark-bg: #020617;
            --darker-bg: #0F172A;
            --card-bg: rgba(30, 41, 59, 0.9);
            --border-color: rgba(59, 130, 246, 0.5);
            --text-primary: #F9FAFB;
            --text-secondary: #E5E7EB;
            --text-muted: #9CA3AF;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 25%, #7DD3FC 50%, #38BDF8 75%, #0EA5E9 100%);
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(96, 165, 250, 0.04) 0%, transparent 50%);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
            position: relative;
            transition: background-color 0.5s ease;
        }

        html[data-theme='dark'] body {
            background: var(--dark-bg);
        }


        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('Background.jpeg') center/cover no-repeat;
            opacity: 0.05;
            z-index: -1;
        }

        html {
            scroll-behavior: smooth;
        }

        /* Navigation */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.1);
        }

        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            border-bottom-color: var(--primary-blue);
            box-shadow: 0 4px 30px rgba(37, 99, 235, 0.2);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 80px;
        }

        .nav-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.5rem;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: var(--gradient-primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 4px 15px var(--shadow-blue);
            position: relative;
            overflow: hidden;
        }

        .logo-icon::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .logo-icon:hover::before {
            left: 100%;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-link {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            position: relative;
            padding: 0.5rem 1rem;
            border-radius: 8px;
        }

        .nav-link:hover {
            color: var(--light-blue);
            background: rgba(37, 99, 235, 0.1);
            transform: translateY(-1px);
        }

        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--gradient-primary);
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }

        .nav-link:hover::after {
            width: 80%;
        }

        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 5px;
            width: 44px;
            height: 44px;
            justify-content: center;
            align-items: center;
            z-index: 2001;
            background: transparent;
            border: none;
            border-radius: 8px;
            transition: background 0.3s;
            position: relative;
        }
        .hamburger span {
            width: 20px;
            height: 2px;
            background: #111;
            transition: all 0.3s ease;
            display: block;
        }
        .hamburger.open span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }

        .mobile-nav-close {
            display: none;
            position: absolute;
            top: 18px;
            right: 24px;
            font-size: 2rem;
            color: var(--primary-blue);
            background: none;
            border: none;
            z-index: 2002;
            cursor: pointer;
        }

        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background: transparent;
            overflow: hidden;
            padding-top: 80px; /* Added for spacing */
        }

        .hero-grid {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: grid-move 20s linear infinite;
        }

        .hero-grid::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
        }

        @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }

        .hero-content {
            text-align: center;
            z-index: 2;
            position: relative;
            max-width: 900px;
            padding: 0 2rem;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(37, 99, 235, 0.15);
            border: 1px solid rgba(37, 99, 235, 0.3);
            padding: 12px 20px;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--light-blue);
            margin-bottom: 2rem;
            animation: fadeInUp 0.8s ease-out;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px var(--shadow-blue);
            position: relative;
            overflow: hidden;
        }

        .hero-badge::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.6s ease;
        }

        .hero-badge:hover::before {
            left: 100%;
        }

        .hero-title {
            font-size: clamp(3rem, 8vw, 6rem);
            font-weight: 900;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            letter-spacing: -0.02em;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-title .gradient-text {
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
        }

        .hero-title .gradient-text::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--gradient-primary);
            transform: scaleX(0);
            transform-origin: left;
            animation: expandLine 1s ease-out 1s forwards;
        }

        @keyframes expandLine {
            to { transform: scaleX(1); }
        }

        .hero-subtitle {
            font-size: 1.3rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            animation: fadeInUp 0.8s ease-out 0.4s both;
            line-height: 1.7;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin-bottom: 3rem;
            animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            display: block;
            font-size: 2.8rem;
            font-weight: 800;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            text-shadow: 0 4px 8px var(--shadow-blue);
        }

        .stat-label {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        }

        .countdown-container {
            margin-bottom: 3rem;
            animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        .countdown-label {
            font-size: 1rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .countdown {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
        }

        .countdown-item {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 1.5rem 1rem;
            border-radius: 16px;
            min-width: 80px;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .countdown-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--gradient-primary);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .countdown-item:hover {
            transform: translateY(-5px);
            border-color: var(--primary-blue);
            box-shadow: 0 12px 35px var(--shadow-blue);
        }

        .countdown-item:hover::before {
            transform: scaleX(1);
        }

        .countdown-number {
            display: block;
            font-size: 2.2rem;
            font-weight: 700;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
        }

        .countdown-text {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        }

        .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            animation: fadeInUp 0.8s ease-out 1s both;
        }


        

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            position: relative;
            overflow: hidden;
        }

        .btn-primary {
            background: var(--gradient-primary);
            color: white;
            box-shadow: 0 4px 20px var(--shadow-blue);
            position: relative;
            overflow: hidden;
        }

        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px var(--shadow-glow);
        }

        .btn-primary:hover::before {
            left: 100%;
        }

        .btn-secondary {
            background: rgba(37, 99, 235, 0.1);
            color: var(--text-primary);
            border: 1px solid rgba(37, 99, 235, 0.3);
            backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
            border-color: var(--primary-blue);
            color: var(--light-blue);
            background: rgba(37, 99, 235, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px var(--shadow-blue);
        }

        .btn-pdf-download {
            background: var(--gradient-secondary);
            color: white;
            border: 2px solid white;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            font-size: 1.1rem;
            padding: 1.2rem 2.5rem;
        }

        .btn-pdf-download:hover {
            background: var(--gradient-primary);
            border-color: var(--light-blue);
            color: white;
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 25px var(--shadow-glow);
        }

        .btn-gradient-download {
            background: linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%);
            color: #fff !important;
            font-weight: 700;
            border: none;
            border-radius: 32px;
            padding: 1.1rem 2.5rem;
            font-size: 1.15rem;
            box-shadow: 0 6px 24px rgba(37, 99, 235, 0.18), 0 1.5px 6px rgba(59, 130, 246, 0.10);
            position: relative;
            overflow: hidden;
            transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
            letter-spacing: 0.02em;
            outline: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.7em;
        }
        .btn-gradient-download::before {
            content: '';
            position: absolute;
            top: 0; left: -75%;
            width: 50%; height: 100%;
            background: linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%);
            transform: skewX(-20deg);
            transition: left 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-gradient-download:hover {
            transform: scale(1.06) translateY(-2px);
            box-shadow: 0 12px 32px rgba(37, 99, 235, 0.25), 0 2px 8px rgba(59, 130,246, 0.13);
        }
        .btn-gradient-download:hover::before {
            left: 120%;
        }

        /* Sections */
        .section {
            padding: 6rem 0;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }

        .section-subtitle {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }

        /* About Section */
        .about {
            background: transparent;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 2.5rem;
            border-radius: 20px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient-primary);
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }

        .feature-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at top right, rgba(37, 99, 246, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
        }

        .feature-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--primary-blue);
            box-shadow: 0 20px 40px var(--shadow-blue);
        }

        .feature-card:hover::before {
            transform: scaleX(1);
        }

        .feature-card:hover::after {
            opacity: 1;
        }

        .feature-icon {
            width: 70px;
            height: 70px;
            background: var(--gradient-primary);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 20px var(--shadow-blue);
            position: relative;
            overflow: hidden;
        }

        .feature-icon::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
        }

        .feature-card:hover .feature-icon::before {
            transform: translateX(100%);
        }

        .feature-card h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .feature-card p {
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .rule-item p {
            color: var(--text-secondary);
            line-height: 1.6;
        }

        /* Rules Section - Point Wise */
        .rules-list {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid var(--border-color);
            padding: 2.5rem;
            border-radius: 20px;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .rule-item {
            margin-bottom: 1.5rem;
            padding-left: 2.5rem;
            position: relative;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1.5rem;
        }

        .rule-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .rule-item::before {
            content: '✔';
            position: absolute;
            left: 0;
            top: 5px;
            font-size: 1.5rem;
            color: var(--primary-blue);
            font-weight: 700;
        }

        .rule-item h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .rule-item p {
            color: var(--text-secondary);
            line-height: 1.6;
        }
        /* Timeline Section */
        .timeline-container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }

        .timeline-line {
            position: absolute;
            left: 2rem;
            top: 0;
            bottom: 0;
            width: 3px;
            background: var(--gradient-primary);
            border-radius: 2px;
            box-shadow: 0 0 10px var(--shadow-blue);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            padding-left: 5rem;
        }

        .timeline-dot {
            position: absolute;
            left: 1.25rem;
            top: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
            background: var(--gradient-primary);
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 0 15px var(--shadow-blue);
            animation: pulse 2s infinite;
        }

        .timeline-content {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 2rem;
            border-radius: 16px;
            transition: all 0.3s ease;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .timeline-content:hover {
            border-color: var(--primary-blue);
            transform: translateX(5px);
            box-shadow: 0 12px 35px var(--shadow-blue);
        }

        .timeline-time {
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .timeline-content h3 {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .timeline-content p {
            color: var(--text-secondary);
        }

        /* Prizes Section */
        .prizes {
            background: transparent;
        }

        .prizes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .prize-card {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 3rem 2rem;
            border-radius: 20px;
            text-align: center;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .prize-card.first {
            border-color: #ffd700;
        }

        .prize-card.second {
            border-color: #c0c0c0;
        }

        .prize-card.third {
            border-color: #cd7f32;
        }

        .prize-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--primary-blue);
            box-shadow: 0 20px 40px var(--shadow-blue);
        }

        .prize-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient-primary);
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }

        .prize-card:hover::before {
            transform: scaleX(1);
        }

        .prize-rank {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .prize-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .prize-amount {
            font-size: 2.8rem;
            font-weight: 800;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            text-shadow: 0 4px 8px var(--shadow-blue);
        }

        .prize-description {
            color: var(--text-secondary);
            line-height: 1.6;
        }

        /* Registration Section */
        .registration-form {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(17, 17, 17, 0.8);
            border: 1px solid var(--border-color);
            padding: 3rem;
            border-radius: 16px;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-primary);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: var(--dark-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .qr-code-container {
            position: relative;
            display: inline-block;
            border-radius: 20px;
            padding: 0.5rem;
            background: white;
            box-shadow: 0 0 20px var(--shadow-blue);
            animation: glow 2s infinite alternate;
            transition: all 0.3s ease;
        }

        .qr-code-container:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px var(--shadow-glow);
        }

        @keyframes glow {
            from {
                box-shadow: 0 0 20px var(--shadow-blue);
            }
            to {
                box-shadow: 0 0 40px var(--shadow-glow), 0 0 20px rgba(37, 99, 235, 0.6);
            }
        }

        /* Footer */
        .footer {
            background: transparent;
            border-top: 1px solid var(--border-color);
            padding: 3rem 0 1rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 2rem;
        }

        .footer-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }

        .footer-section h3 {
            color: var(--primary-orange);
            margin-bottom: 1rem;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .footer-section p {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        .footer-links {
            list-style: none;
        }

        .footer-links li {
            margin-bottom: 0.5rem;
        }

        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-links a:hover {
            color: var(--primary-orange);
        }

        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
            color: var(--text-muted);
        }

        /* Floating Particles */
        .floating-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-blue);
            border-radius: 50%;
            opacity: 0.8;
            animation: float 6s infinite linear;
            box-shadow: 0 0 6px var(--primary-blue);
        }

        .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 20%; animation-delay: 1s; }
        .particle:nth-child(3) { left: 30%; animation-delay: 2s; }
        .particle:nth-child(4) { left: 40%; animation-delay: 3s; }
        .particle:nth-child(5) { left: 50%; animation-delay: 4s; }
        .particle:nth-child(6) { left: 60%; animation-delay: 5s; }
        .particle:nth-child(7) { left: 70%; animation-delay: 0s; }
        .particle:nth-child(8) { left: 80%; animation-delay: 1s; }
        .particle:nth-child(9) { left: 90%; animation-delay: 2s; }

        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 992px) {
            .footer-content {
                grid-template-columns: 1fr 1fr;
            }
        }

        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 0;
                left: -100%;
                width: 100vw;
                height: 100vh;
                background: rgba(255,255,255,0.98);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 5rem;
                transition: left 0.4s cubic-bezier(0.77,0.2,0.05,1.0);
                border-top: 1px solid var(--border-color);
                z-index: 2000;
            }

            .nav-menu.active {
                left: 0;
                box-shadow: 0 0 0 100vw rgba(0,0,0,0.2);
            }

            .hamburger {
                display: flex;
                position: relative;
            }
            .mobile-nav-close {
                display: none !important;
            }

            .hero-stats {
                flex-direction: column;
                gap: 1.5rem;
            }

            .countdown {
                flex-wrap: wrap;
                gap: 1rem;
            }

            .hero-buttons {
                flex-direction: column;
                align-items: center;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .footer-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .timeline-line {
                left: 1rem;
            }

            .timeline-item {
                padding-left: 3rem;
            }

            .timeline-dot {
                left: 0.25rem;
            }
        }
        @media (max-width: 480px) {
            .nav-container {
                padding: 0 1rem;
            }

            .container {
                padding: 0 1rem;
            }

            .hero-content {
                padding: 0 1rem;
            }

            .registration-form {
                padding: 2rem 1.5rem;
            }
        }
        .nav-logo img {
            max-width: 100%;
            height: auto;
            width: auto;
        }
        .registration-cta {
            display: flex;
            flex-wrap: wrap;
        }
        .registration-cta > div {
            min-width: 250px;
        }
        .qr-code-container img {
            width: 200px;
            height: 200px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
            border-radius: 8px;
        }
        /* --- BEAUTIFIED RULES & REGULATIONS SECTION --- */
        section#rules .section-header {
            position: relative;
        }
        section#rules .section-title {
            position: relative;
            display: inline-block;
        }
        section#rules .section-title::after {
            content: '';
            display: block;
            width: 60%;
            height: 4px;
            background: var(--gradient-primary);
            border-radius: 2px;
            margin: 0.5rem auto 0 auto;
        }
        .rules-list {
            background: rgba(255,255,255,0.98);
            border: 1.5px solid var(--primary-blue);
            box-shadow: 0 8px 32px rgba(37,99,235,0.10);
            border-radius: 24px;
            padding: 2.8rem 2.5rem;
            margin-top: 2rem;
        }
        .rule-item {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(37,99,235,0.07);
            margin-bottom: 2rem;
            padding: 1.5rem 2rem 1.5rem 3.5rem;
            border: none;
            position: relative;
            transition: box-shadow 0.3s, transform 0.3s;
        }
        .rule-item:last-child {
            margin-bottom: 0;
        }
        .rule-item:hover {
            box-shadow: 0 8px 32px rgba(37,99,235,0.13);
            transform: translateY(-2px) scale(1.02);
        }
        .rule-item::before {
            content: '✔';
            position: absolute;
            left: 1.2rem;
            top: 1.5rem;
            font-size: 2rem;
            color: var(--primary-blue);
            font-weight: 900;
        }
        .rule-item h3 {
            font-size: 1.18rem;
            font-weight: 700;
            margin-bottom: 0.4rem;
            color: var(--primary-blue);
        }
        .rule-item p {
            color: var(--text-secondary);
            line-height: 1.7;
        }
        .rule-item[style] {
            background: var(--gradient-primary) !important;
            color: #fff !important;
            box-shadow: 0 8px 32px rgba(37,99,235,0.18);
        }
        .rule-item[style] a {
            color: #fff !important;
        }

        /* --- BEAUTIFIED DOMAINS & PROBLEM STATEMENTS SECTION --- */
        section#domains .section-header {
            position: relative;
        }
        section#domains .section-title {
            position: relative;
            display: inline-block;
        }
        section#domains .section-title::after {
            content: '';
            display: block;
            width: 60%;
            height: 4px;
            background: var(--gradient-primary);
            border-radius: 2px;
            margin: 0.5rem auto 0 auto;
        }
        section#domains .features-grid {
            gap: 2.5rem;
        }
        section#domains .feature-card {
            background: #fff;
            border: 2px solid var(--primary-blue);
            border-radius: 20px;
            box-shadow: 0 4px 24px rgba(37,99,235,0.10);
            padding: 2.5rem 2rem;
            transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
            position: relative;
        }
        section#domains .feature-card:hover {
            border-color: #3B82F6;
            box-shadow: 0 12px 36px rgba(37,99,235,0.18);
            transform: translateY(-4px) scale(1.03);
        }
        section#domains .feature-icon {
            width: 70px;
            height: 70px;
            background: var(--gradient-primary);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 20px var(--shadow-blue);
            color: #fff;
        }
        section#domains .feature-card h3 {
            color: var(--primary-blue);
            font-size: 1.22rem;
            font-weight: 700;
            margin-bottom: 0.7rem;
        }
        section#domains .feature-card p {
            color: var(--text-secondary);
            line-height: 1.7;
        }
        .domain-download-card {
            background: #fff;
            border: 2px dashed var(--primary-blue);
            box-shadow: 0 8px 32px rgba(37,99,235,0.1);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2.5rem;
            transition: all 0.3s ease;
        }
        .domain-download-card:hover {
            border-style: solid;
            border-color: var(--accent-blue);
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 40px rgba(37,99,235,0.2);
        }
        .download-card-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 0.75rem;
        }
        .download-card-content p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        .domain-download-card .btn-primary {
            background: var(--gradient-primary);
            color: white;
            font-size: 1.1rem;
            padding: 0.8rem 1.8rem;
            border-radius: 50px;
        }

        .rules-cta {
            background: #fff;
            border: none;
            box-shadow: 0 4px 18px rgba(37,99,235,0.10);
            border-radius: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem 1.5rem;
            margin-top: 2.5rem;
        }
        .rules-cta::before {
            display: none !important;
        }
        .rules-cta a.btn-gradient-download {
            display: inline-flex;
            margin: 0 auto;
        }
        .rules-download-cta {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2.5rem;
        }
    `;

    return (
        <>

      <Snowfall snowflakeCount={500} />
  
            <style>{styles}</style>

            <div className="floating-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>
            <section id="home" className="hero">
                <div className="hero-grid"></div>
                <div className="hero-content">
                    <div className="hero-buttons">
                    </div>
                </div>
            </section>

            <div style={{ position: 'fixed', top: '24px', right: '32px', zIndex: 2000, display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button
                    onClick={handleThemeToggle}
                    className="theme-toggle"
                    title="Toggle Theme"
                >
                    {isLight ? <FaMoon /> : <FaSun />}
                </button>
                <button
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    onClick={() => navigate('/activity')}
                    title="Activity"
                >
                    <FaBell style={{ fontSize: '2rem', color: '#a78bfa' }} />
                </button>
                <button
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    onClick={() => navigate('/chat')}
                    title="AI Chat"
                >
                    <FaRobot style={{ fontSize: '2rem', color: '#a78bfa' }} />
                </button>
                <ProfileButton user={user} onLogout={onLogout} />
            </div>

            {/* Profile Modal */}
            {showProfileModal && user && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,19,58,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#2c2250', borderRadius: '24px', padding: '2.5rem 2rem', minWidth: '340px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', color: '#fff', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setShowProfileModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#a78bfa', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '600', marginBottom: '8px' }}>
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
                                )}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{user.firstName} {user.lastName}</div>
                            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>{user.email}</div>
                        </div>
                        <div style={{ margin: '2rem 0 1rem 0', textAlign: 'left' }}>
                            <div style={{ marginBottom: '0.7rem' }}><span style={{ fontWeight: '600' }}>Username:</span> {user.username || '-'}</div>
                            <div style={{ marginBottom: '0.7rem' }}><span style={{ fontWeight: '600' }}>Full Name:</span> {user.firstName} {user.lastName}</div>
                            <div><span style={{ fontWeight: '600' }}>Email:</span> {user.email}</div>
                        </div>
                        <button
                            style={{ background: '#a78bfa', color: '#fff', border: 'none', borderRadius: '50px', padding: '12px 32px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}
                            onClick={() => { setShowProfileModal(false); navigate('/profile'); }}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}

            {/* Rest of the sections */}
            <section id="about" className="section about">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title fade-in-up">Why <span className="gradient-text">Tech-Tonic Hackathon?</span></h2>
                        <p className="section-subtitle fade-in-up">Experience the most comprehensive hackathon designed for developers who want to push boundaries and create meaningful impact.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card fade-in-up">
                            <div className="feature-icon">💻</div>
                            <h3>Industry Focus</h3>
                            <p>Tackle challenges in AI, blockchain, sustainability, and emerging technologies.</p>
                        </div>
                        <div className="feature-card fade-in-up">
                            <div className="feature-icon">🤝</div>
                            <h3>Expert Mentors</h3>
                            <p>Get guidance from industry leaders, successful entrepreneurs, and technical experts.</p>
                        </div>
                        <div className="feature-card fade-in-up">
                            <div className="feature-icon">🏆</div>
                            <h3>Real Impact</h3>
                            <p>Build solutions for real-world problems with potential for continued development and funding.</p>
                        </div>
                        <div className="feature-card fade-in-up">
                            <div className="feature-icon">🚀</div>
                            <h3>Prizes and Swags</h3>
                            <p>Compete for 15000INR in prizes, including cash, tech gear, and career opportunities.</p>
                        </div>
                        <div className="feature-card fade-in-up">
                            <div className="feature-icon">🎯</div>
                            <h3>Networking</h3>
                            <p>Connect with like-minded developers, designers, and entrepreneurs to form winning teams.</p>
                        </div>
                        <div className="feature-card fade-in-up">
                            <div className="feature-icon">🌟</div>
                            <h3>Team Building</h3>
                            <p>Intensive coding marathon with mentorship, workshops, and unlimited coffee to fuel your creativity.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="timeline" className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title fade-in-up">Event <span className="gradient-text">Timeline</span></h2>
                        <p className="section-subtitle fade-in-up">Your complete journey from registration to victory on 30th August.</p>
                    </div>

                    <div className="timeline-container">
                        <div className="timeline-line"></div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">August 30, 8:30 AM - 9:00 AM</div>
                                <h3>Registration & Breakfast</h3>
                                <p>Participants check in, receive event materials, and enjoy a light breakfast while networking.</p>
                            </div>
                        </div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">9:00 AM - 10:00 AM</div>
                                <h3>Opening Ceremony & Introduction</h3>
                                <p>Opening remarks by the event organizers.</p>
                            </div>
                        </div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">10:00 AM - 11:00 AM</div>
                                <h3>Evaluation Round - 1</h3>
                                <p>Judges evaluate initial ideas and provide teams with valuable feedback to enhance their solutions.</p>
                            </div>
                        </div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">11:10 AM - 3:30 PM</div>
                                <h3>Implementation Round</h3>
                                <p>Teams begin working on their projects.</p>
                            </div>
                        </div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">3:30 PM - 4:30 PM</div>
                                <h3>Evaluation Round - 2 (Checkpoint with Mentors/Judges)</h3>
                                <p>Teams present their progress to mentors or judges.</p>
                            </div>
                        </div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">04:30 PM - 05:00 PM</div>
                                <h3>High Tea and Networking</h3>
                                <p>Refreshments are served.</p>
                            </div>
                        </div>

                        <div className="timeline-item fade-in-up">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">5:00 PM - 6:00 PM</div>
                                <h3>Valedictory Function</h3>
                                <p>Winners are announced, certificates are distributed, and the event concludes with a vote of thanks and group photo.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <section id="rules" className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title fade-in-up">
                            Rules & <span className="gradient-text">Regulations</span>
                        </h2>
                        <p className="section-subtitle fade-in-up">
                            Ensure a fair and enjoyable experience for all participants by adhering to these guidelines.
                        </p>
                    </div>

                    <div className="rules-list">
                        <div className="rule-item fade-in-up">
                            <h3>Eligibility</h3>
                            <p>Open to all students and professionals aged 18 and above. Participants can register individually or in teams of up to 4 members.</p>
                        </div>

                        <div className="rule-item fade-in-up">
                            <h3>Registration</h3>
                            <p>All participants must complete the registration form and agree to the event terms and conditions.</p>
                        </div>

                        <div className="rule-item fade-in-up">
                            <h3>Code of Conduct</h3>
                            <p>Respectful behavior is expected at all times. Harassment, discrimination, or any form of misconduct will not be tolerated.</p>
                        </div>

                        <div className="rule-item fade-in-up">
                            <h3>Project Requirements</h3>
                            <p>Projects must be developed during the hackathon period. Pre-existing projects or code are not allowed.</p>
                        </div>

                        <div className="rule-item fade-in-up">
                            <h3>Intellectual Property</h3>
                            <p>Participants retain ownership of their projects but grant the organizers the right to showcase them for promotional purposes.</p>
                        </div>

                        <div className="rule-item fade-in-up">
                            <h3>Judging Criteria</h3>
                            <p>Projects will be evaluated based on innovation, technical complexity, usability, and impact.</p>
                        </div>

                        <div className="rule-item fade-in-up">
                            <h3>Prizes</h3>
                            <p>Winners will be announced at the closing ceremony. Prizes are non-transferable and cannot be exchanged for cash.</p>
                        </div>

                        <div className="rule-item fade-in-up" style={{ background: 'var(--gradient-primary)' }}>
                            <h3>Contact Information</h3>
                            <p>
                                If you have any questions or need assistance, please contact us at{" "}
                                <a href="mailto:support@techttonic.com">support@techttonic.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TechTonicHackathon;