import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ElectionApp from './ElectionApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ElectionApp />
  </StrictMode>,
)
