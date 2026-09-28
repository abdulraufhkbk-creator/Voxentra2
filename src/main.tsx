import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PlatformDataProvider } from './context/PlatformDataProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlatformDataProvider>
      <App />
    </PlatformDataProvider>
  </StrictMode>
);
