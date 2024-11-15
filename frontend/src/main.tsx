// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client'; 
import client from './ApolloClient';  // Importez votre client Apollo
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>  {/* Enveloppez l'application avec ApolloProvider */}
      <App />
    </ApolloProvider>
  </StrictMode>,
);
