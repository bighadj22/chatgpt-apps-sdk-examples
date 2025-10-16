import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';

// Wait for DOM to be ready
const initializeApp = () => {
  const rootElement = document.getElementById('app-root');
  if (!rootElement) {
    console.error('Root element #app-root not found');
    return;
  }

  const root = createRoot(rootElement);
  root.render(<App />);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
