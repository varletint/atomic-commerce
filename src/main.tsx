import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-center" richColors theme="system" />
        </BrowserRouter>
      </HelmetProvider>
    </AppProviders>
  </StrictMode>
);
