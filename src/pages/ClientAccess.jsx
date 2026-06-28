import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, HardHat, KeyRound, MessageCircle, ShieldCheck } from 'lucide-react'
import { company } from '../config.js'

export default function ClientAccess() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const wa = company.phone
    ? `https://wa.me/${company.phone.replace('+', '')}?text=Hola%2C%20necesito%20acceder%20a%20mi%20expediente%20de%20obra`
    : null

  const submit = (e) => {
    e.preventDefault()
    const clean = token.trim()
    if (!clean) {
      setError('Introduce tu código de acceso.')
      return
    }
    navigate(`/cliente/${clean}`)
  }

  return (
    <div className="client-access-page">
      <div className="client-access-card">

        {/* Icon */}
        <div className="client-access-icon">
          <HardHat size={28} aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1>Accede a tu obra</h1>
        <p className="client-access-lead">
          Introduce el código de acceso que recibiste en el correo de bienvenida
          cuando comenzamos tu proyecto.
        </p>

        {/* Form */}
        <form onSubmit={submit} className="client-access-form">
          <label className="client-access-label" htmlFor="token-input">
            <KeyRound size={16} aria-hidden="true" />
            Código de expediente
          </label>
          <div className="client-access-input-row">
            <input
              id="token-input"
              type="text"
              value={token}
              onChange={(e) => { setToken(e.target.value); setError('') }}
              placeholder="ej. M-2026-014 o el enlace completo"
              autoComplete="off"
              spellCheck="false"
              className="client-access-input"
            />
            <button type="submit" className="client-access-button">
              Entrar <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          {error && <p className="client-access-error" role="alert">{error}</p>}
        </form>

        {/* Trust */}
        <p className="client-access-trust">
          <ShieldCheck size={14} aria-hidden="true" />
          Tu espacio es privado. Solo tú y el equipo de Martega tenéis acceso.
        </p>

        {/* Fallback */}
        <div className="client-access-help">
          <p>¿No tienes o no recuerdas tu código?</p>
          <div className="client-access-help-actions">
            {wa && (
              <a href={wa} className="client-access-help-link">
                <MessageCircle size={15} /> Escríbenos por WhatsApp
              </a>
            )}
            {company.email && (
              <a href={`mailto:${company.email}`} className="client-access-help-link">
                Envíanos un correo
              </a>
            )}
          </div>
        </div>

        {/* Demo link */}
        <p className="client-access-demo">
          ¿Quieres ver cómo funciona?{' '}
          <a href="/cliente/demo">Ver demo del portal →</a>
        </p>

      </div>
    </div>
  )
}
