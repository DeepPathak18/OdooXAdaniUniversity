import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../utils/useTheme';

// This is the initial message content taken from your screenshot.

/**
 * A helper function to parse markdown-style bold text (**text**) and convert it to HTML.
 * @param {string} text - The text to format.
 * @returns {object} - An object for dangerouslySetInnerHTML.
 */
const formatMessage = (text) => {
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return { __html: formattedText };
};


const ChatPage = () => {
  // State to hold the list of messages
  const initialMessage = "Hello! How can I help you today?";
  const [messages, setMessages] = useState([
    { id: 1, text: initialMessage, sender: 'ai' }
  ]);
  
  // State for the controlled input component
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to the end of the messages list for auto-scrolling
  const messagesEndRef = useRef(null);

  const { theme } = useTheme();

  const themeColors = {
    light: {
      textColor: '#333',
      bgColor: '#ffffff',
      containerBorder: '#ddd',
      headerBg: '#f8f8f8',
      messagesBg: '#f0fff0',
      userMessageBg: '#e0f7fa',
      aiMessageBg: '#f0f0f0',
      inputBorder: '#ccc',
      buttonBg: '#f0f0f0',
      buttonHoverBg: '#e0e0e0',
    },
    dark: {
      textColor: '#e0e0e0',
      bgColor: '#1a202c',
      containerBorder: '#4a5568',
      headerBg: '#2d3748',
      messagesBg: '#2d3748',
      userMessageBg: '#4a5568',
      aiMessageBg: '#2c3e50',
      inputBorder: '#4a5568',
      buttonBg: '#4a5568',
      buttonHoverBg: '#6a7588',
    },
  };

    const currentTheme = themeColors[theme];

  // CSS styles to mimic the screenshot
  const styles = {
    chatContainer: {
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '40px auto',
      border: `1px solid ${currentTheme.containerBorder}`,
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      height: '80vh',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: currentTheme.bgColor,
      color: currentTheme.textColor,
    },
    header: {
      padding: '10px 20px',
      borderBottom: `1px solid ${currentTheme.containerBorder}`,
      backgroundColor: currentTheme.headerBg,
      color: currentTheme.textColor,
    },
    title: {
      margin: '0 0 5px 0',
      color: currentTheme.textColor,
    },
    subtitle: {
      margin: 0,
      fontSize: '0.9em',
      color: currentTheme.textColor, // Adjusted to use theme color
    },
    messagesContainer: {
      flex: 1,
      padding: '20px',
      backgroundColor: currentTheme.messagesBg,
      overflowY: 'auto',
      lineHeight: '1.6',
      display: 'flex',
      flexDirection: 'column',
      color: currentTheme.textColor, // Ensure message text color is themed
    },
    message: {
      marginBottom: '10px',
      whiteSpace: 'pre-wrap', // Preserves line breaks and spacing
    },
    userMessage: {
      backgroundColor: currentTheme.userMessageBg,
      padding: '8px 12px',
      borderRadius: '10px',
      alignSelf: 'flex-end', // Align to the right
      maxWidth: '70%',
      marginBottom: '10px',
      whiteSpace: 'pre-wrap',
      color: currentTheme.textColor, // Ensure user message text color is themed
    },
    aiMessage: {
      backgroundColor: currentTheme.aiMessageBg,
      padding: '8px 12px',
      borderRadius: '10px',
      alignSelf: 'flex-start', // Align to the left
      maxWidth: '70%',
      marginBottom: '10px',
      whiteSpace: 'pre-wrap',
      color: currentTheme.textColor, // Ensure AI message text color is themed
    },
    inputForm: {
      display: 'flex',
      padding: '10px',
      borderTop: `1px solid ${currentTheme.containerBorder}`,
      backgroundColor: currentTheme.headerBg, // Use header background for input form area
    },
    input: {
      flex: 1,
      padding: '10px',
      fontSize: '1em',
      border: `1px solid ${currentTheme.inputBorder}`,
      borderRadius: '4px',
      marginRight: '10px',
      backgroundColor: currentTheme.bgColor, // Input background
      color: currentTheme.textColor, // Input text color
    },
    sendButton: {
      padding: '10px 20px',
      fontSize: '1em',
      border: `1px solid ${currentTheme.inputBorder}`,
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: currentTheme.buttonBg,
      color: currentTheme.textColor, // Button text color
    },
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Effect to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => { // Make it async
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]); // Use functional update
    setInputValue('');
    setIsLoading(true); // Set loading state

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        message: newMessage.text,
        history: messages.map(msg => ({ role: msg.sender === 'ai' ? 'model' : 'user', content: msg.text }))
      });

      const aiReply = {
        id: messages.length + 2,
        text: response.data.reply,
        sender: 'ai'
      };

      setMessages((prevMessages) => [...prevMessages, aiReply]); // Add AI reply
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "Error: Could not get a response from AI.", sender: "ai" }
      ]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div style={styles.chatContainer}>
      <header style={styles.header}>
        <h2 style={styles.title}>AI CHAT</h2>
        <h5 style={styles.title}>Hello, There! What can I help you with?</h5>
      </header>
      
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={message.sender === 'user' ? styles.userMessage : styles.aiMessage}
          >
            {/* Using dangerouslySetInnerHTML is okay here because we are controlling the content.
              Be very cautious with this if rendering user-generated content from a database
              to prevent XSS (Cross-Site Scripting) attacks.
            */}
            <p dangerouslySetInnerHTML={formatMessage(message.text)}></p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={styles.inputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
          disabled={isLoading} // Disable when loading
        />
        <button type="submit" style={styles.sendButton} disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};




export default ChatPage;