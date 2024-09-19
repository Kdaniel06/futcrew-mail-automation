import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MailSender } from './MailSender'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MailSender />
  </StrictMode>,
)
