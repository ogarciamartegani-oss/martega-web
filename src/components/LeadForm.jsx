import { useRef, useState } from 'react'
import { CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company } from '../config.js'

// Supabase se importa dinámicamente en submit() para mantener
// @supabase/supabase-js fuera del bundle inicial de la Home.
const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

const initial = {
  nombre: '',
  telefono: '',
  email: '',
  tipo_cliente: '',
  servicio: '',
  codigo_postal: '',
  mensaje: '',
  privacidad: false,
  marketing: false,
  website: '',
}

export default function LeadForm() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const startedAt = useRef(null)

  const update = ({ target }) => {
    if (startedAt.current === null) startedAt.current = Date.now()
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm((current) => ({ ...current, [target.name]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.website || (startedAt.current !== null && Date.now() - startedAt.current < 2500)) return
    if (!form.privacidad) {
      setError('Necesitamos que aceptes la política de privacidad para responder a tu solicitud.')
      return
    }
    if (!isSupabaseConfigured) {
      setError('El formulario está pendiente de conectar con Supabase. Puedes contactar con nosotros por teléfono o correo.')
      return
    }

    setStatus('sending')
    const payload = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim() || null,
      email: form.email.trim().toLowerCase() || null,
      tipo_cliente: form.tipo_cliente || null,
      servicio: form.servicio,
      codigo_postal: form.codigo_postal.trim() || null,
      mensaje: form.mensaje.trim(),
      acepta_privacidad: true,
      acepta_marketing: form.marketing,
      version_privacidad: company.privacyVersion,
      origen: 'web',
    }

    const { supabase } = await import('../lib/supabase.js')
    const { error: insertError } = await supabase.from('solicitudes_web').insert(payload)

    if (insertError) {
      setStatus('error')
      setError('No hemos podido enviar la solicitud. Inténtalo de nuevo dentro de unos minutos.')
      return
    }

    setStatus('success')
    setForm(initial)
    startedAt.current = null
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={38} aria-hidden="true" />
        <h3>Solicitud recibida</h3>
        <p>Gracias. Revisaremos la información y nos pondremos en contacto contigo.</p>
        <button type="button" onClick={() => setStatus('idle')}>Enviar otra consulta</button>
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="honeypot" aria-hidden="true">
        <label>Tu web<input name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
      </div>
      <div className="field-grid">
        <label className="field">
          <span>Nombre y apellidos *</span>
          <input name="nombre" value={form.nombre} onChange={update} required minLength="2" maxLength="100" autoComplete="name" />
        </label>
        <label className="field">
          <span>Teléfono</span>
          <input name="telefono" value={form.telefono} onChange={update} type="tel" maxLength="30" autoComplete="tel" inputMode="tel" />
        </label>
        <label className="field">
          <span>Correo electrónico</span>
          <input name="email" value={form.email} onChange={update} type="email" maxLength="254" autoComplete="email" />
        </label>
        <label className="field">
          <span>¿Quién nos contacta?</span>
          <select name="tipo_cliente" value={form.tipo_cliente} onChange={update}>
            <option value="">Selecciona una opción</option>
            <option value="particular">Particular</option>
            <option value="empresa">Empresa o comercio</option>
            <option value="comunidad">Comunidad de propietarios</option>
            <option value="profesional">Arquitectura / administración de fincas</option>
          </select>
        </label>
        <label className="field">
          <span>Servicio *</span>
          <select name="servicio" value={form.servicio} onChange={update} required>
            <option value="">Selecciona un servicio</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="incidencia">Incidencia o reparación</option>
            <option value="instalaciones">Instalaciones</option>
            <option value="reforma">Reforma</option>
            <option value="otro">Otro</option>
          </select>
        </label>
        <label className="field">
          <span>Código postal</span>
          <input name="codigo_postal" value={form.codigo_postal} onChange={update} pattern="[0-9]{5}" maxLength="5" inputMode="numeric" autoComplete="postal-code" />
        </label>
      </div>
      <label className="field field--full">
        <span>Cuéntanos qué necesitas *</span>
        <textarea name="mensaje" value={form.mensaje} onChange={update} required minLength="10" maxLength="2000" rows="5" />
        <small>{form.mensaje.length}/2000</small>
      </label>

      <p className="contact-requirement">Indica al menos un teléfono o un correo para que podamos responderte.</p>

      <label className="check-field">
        <input name="privacidad" type="checkbox" checked={form.privacidad} onChange={update} required />
        <span>He leído y acepto la <Link to="/privacidad">política de privacidad</Link>. *</span>
      </label>
      <label className="check-field">
        <input name="marketing" type="checkbox" checked={form.marketing} onChange={update} />
        <span>Acepto recibir novedades y comunicaciones comerciales de Martega. Opcional.</span>
      </label>

      <p className="form-privacy-short">
        Responsable: Martega Instalaciones y Mantenimiento, S.L. Finalidad: responder a tu consulta y preparar una posible oferta. Base jurídica: medidas precontractuales y consentimiento cuando corresponda. Puedes ejercer tus derechos mediante el contacto indicado en la política de privacidad.
      </p>

      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="submit-button" type="submit" disabled={status === 'sending' || (!form.telefono.trim() && !form.email.trim())}>
        {status === 'sending' ? <LoaderCircle className="spin" size={19} aria-hidden="true" /> : <Send size={19} aria-hidden="true" />}
        {status === 'sending' ? 'Enviando…' : 'Solicitar primera valoración'}
      </button>
    </form>
  )
}
