import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'martega_cookie_notice_v1'

export default function CookieNotice() {
  const [visible, setVisible] = useState(() => localStorage.getItem(STORAGE_KEY) !== 'seen')

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'seen')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside className="cookie-notice" aria-label="Información sobre almacenamiento local">
      <div>
        <strong>Privacidad, sin letra pequeña.</strong>
        <p>Esta web no utiliza analítica, publicidad ni cookies de seguimiento. Solo guardamos tu elección para no repetir este aviso.</p>
      </div>
      <div className="cookie-notice__actions">
        <Link to="/cookies">Más información</Link>
        <button type="button" onClick={dismiss}>Entendido</button>
      </div>
    </aside>
  )
}
