import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { db } from './services/database'
import { Toaster } from 'sonner'

// Create root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Create root
const root = ReactDOM.createRoot(rootElement)

// Render app
root.render(
  <React.StrictMode>
    <Toaster position="top-right" richColors />
    <App />
  </React.StrictMode>
)

// Initialize database in the background
setTimeout(() => {
  db.init()
    .then((success) => {
      if (success) {
        console.log('Database initialized successfully')
      }
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error)
    })
}, 1000)
