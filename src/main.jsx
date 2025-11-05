import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

// Override console methods if not in development
if (import.meta.env.VITE_ENVIRONMENT !== 'development') {
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.info = noop;
  console.debug = noop;
  console.table = noop;
  console.group = noop;
  console.groupEnd = noop;
  console.time = noop;
  console.timeEnd = noop;
  console.trace = noop;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
