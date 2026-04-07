import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAnalytics } from './analytics.js'
import './index.css'
import App from './App.jsx'

initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
