// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { JobseekerAuthProvider } from './hooks/useJobseekerAuth'; // Corrected import and alias
import { EmployerAuthProvider } from './hooks/useEmployerAuth';
import { UIProvider } from './context/UIContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <JobseekerAuthProvider>
      <EmployerAuthProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </EmployerAuthProvider>
    </JobseekerAuthProvider>
  </React.StrictMode>
);

reportWebVitals();