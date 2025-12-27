// tailwind.config.js

// NEW: Import the default theme to extend it
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // NEW: Set 'Inter' as the default sans-serif font
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      
      // NEW: Add keyframe animations for messages
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-particle': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.2' },
          '25%': { transform: 'translate(10px, -20px)', opacity: '0.4' },
          '50%': { transform: 'translate(-10px, -40px)', opacity: '0.6' },
          '75%': { transform: 'translate(15px, -30px)', opacity: '0.4' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      // NEW: Create a utility class for the animation
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'float-particle': 'float-particle 15s infinite ease-in-out',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};