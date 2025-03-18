import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { JobseekerAuthProvider } from './hooks/useJobseekerAuth';
import { EmployerAuthProvider } from './hooks/useEmployerAuth';
import { UIProvider } from './context/UIContext';
import { JarvisAuthProvider } from './hooks/useJarvisAuth'; // Corrected import
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <JobseekerAuthProvider>
          <EmployerAuthProvider>
            <JarvisAuthProvider>
              <UIProvider>
                <App />
              </UIProvider>
            </JarvisAuthProvider>
          </EmployerAuthProvider>
        </JobseekerAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();