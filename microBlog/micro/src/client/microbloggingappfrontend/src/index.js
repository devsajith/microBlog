import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/feeds/ErrorBoundrry';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
    <ErrorBoundary>
      <App />
      </ErrorBoundary>

    </React.StrictMode>
  </BrowserRouter>
  
);
reportWebVitals();
