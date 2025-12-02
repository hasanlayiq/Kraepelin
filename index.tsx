import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("CRITICAL ERROR: Could not find root element with id 'root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App mounted successfully");
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to mount React app", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load application. Please check console for details.</p>
      <pre>${error}</pre>
    </div>`;
  }
}