import React from 'react';

import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';



const root = createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
  domain="dev-nvch8dvrrchek8it.us.auth0.com"
  clientId="u40IJJWm9sR0EtEai8U8usaYSTMNQBI6"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
    <App />
  </Auth0Provider>
);


