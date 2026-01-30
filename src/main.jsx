import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { QueryProvider } from './providers/QueryProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  </StrictMode>,
)
