import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MagicKitchen from './MagicKitchen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MagicKitchen />
  </StrictMode>,
)
