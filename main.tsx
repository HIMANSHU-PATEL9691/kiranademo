import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { router } from './app';
import './index.css';

// Remove loading skeleton once React takes over
function removeLoadingState() {
  const loader = document.getElementById('app-loading');
  if (loader) loader.remove();
}

// Safe DOM mount
const rootElement = document.getElementById('root');
if (rootElement) {
  removeLoadingState();
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
