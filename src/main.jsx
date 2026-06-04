import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './components/admin/AdminApp.jsx'

// Hash-basiertes Routing: /#admin → Adminkonsole
const isAdmin = window.location.hash === '#admin'

// Bei Hash-Wechsel Seite neu laden damit Routing greift
window.addEventListener('hashchange', () => window.location.reload())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>,
)
