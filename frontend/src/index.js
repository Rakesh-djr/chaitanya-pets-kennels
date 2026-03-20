import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress the harmless ResizeObserver loop error thrown by Chart.js
// This is a known browser quirk, not a real error
const resizeObserverErr = window.onerror;
window.onerror = function (msg, ...rest) {
  if (typeof msg === 'string' && msg.includes('ResizeObserver loop')) return true;
  return resizeObserverErr ? resizeObserverErr(msg, ...rest) : false;
};
window.addEventListener('error', e => {
  if (e.message && e.message.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
