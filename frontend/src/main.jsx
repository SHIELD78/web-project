import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error('Missing Clerk publishable key. Check your .env file.');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey='pk_test_YWRlcXVhdGUtbGxhbWEtMTEuY2xlcmsuYWNjb3VudHMuZGV2JA' afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);
