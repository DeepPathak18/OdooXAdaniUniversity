import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import AppWrapper from './AppWrapper.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="127468730932-b5hlr1lkr6cfb5st2hdlerciks50hbc6.apps.googleusercontent.com">
      <AppWrapper />
    </GoogleOAuthProvider>
  </React.StrictMode>
);


