import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { siteConfig } from './config/siteConfig.js'
import { applyTheme } from './config/applyTheme.js'

applyTheme(siteConfig.theme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
