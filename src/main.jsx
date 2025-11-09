import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { clearCache } from './utils/apiCache.js'

const noop = () => {}

if (import.meta.env.VITE_ENVIRONMENT === 'production') {
  console.log = noop
  console.info = noop
  console.debug = noop
  console.warn = noop
  console.error = noop
}

// Clear IndexedDB cache on page reload
window.addEventListener('beforeunload', () => {
  clearCache();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
