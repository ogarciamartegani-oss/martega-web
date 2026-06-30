import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Download,
  FileCheck2,
  HardHat,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react'
import Brand from '../components/Brand.jsx'
import { company } from '../config.js'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import './client-portal.css'

const demoPortal = {
  obra: {
    nombre: 'Reforma integral · Vivienda Ruzafa',
    referencia: 'M-2026-014',
    ubicacion: 'Ruzafa · València',
    estado: 'en_curso',
    estado_label: 'En ejecución',
    progreso: 64,
    fecha_inicio: '2026-05-18',
    fecha_fin_estimada: '2026-07-24',
    responsable: 'Carlos · Jefe de obra',
  },
  siguiente_hito: {
    titulo: 'Finalización de alicatado',
    fecha: '2026-07-02',
    descripcion: 'Revisión conjunta de baños y cocina antes de comenzar acabados.',
  },
  hitos: [
    { id: 'h1', titulo: 'Demoliciones y retirada', fecha: '2026-05-27', estado: 'completado' },
    { id: 'h2', titulo: 'Instalaciones interiores', fecha: '2026-06-14', estado: 'completado' },
    { id: 'h3', titulo: 'Alicatado y pavimentos', fecha: '2026-07-02', estado: 'en_curso' },
    { id: 'h4', titulo: 'Carpintería y acabados', fecha: '2026-07-15', estado: 'pendiente' },
    { id: 'h5', titulo: 'Revisión y entrega', fecha: '2026-07-24', estado: 'pendiente' },
  ],
  actualizaciones: [
    {
      id: 'a1',
      fecha: '2026-06-27',
      titulo: 'Instalaciones verificadas',
      resumen: 'Pruebas de presión y revisión eléctrica completadas. Esta semana avanzamos con revestimientos.',
    },
    {
      id: 'a2',
      fecha: '2026-06-20',
      titulo: 'Tabiquería terminada',
      resumen: 'Distribución ejecutada según plano aprobado. No hay cambios que afecten al calendario.',
    },
  ],
  facturas: [
    { id: 'f1', numero: 'F-2026-041', concepto: 'Segundo pago según presupuesto', total: 12450, estado: 'cobrada', fecha: '2026-06-16' },
    { id: 'f2', numero: 'F-2026-057', concepto: 'Tercer pago según avance', total: 8300, estado: 'pendiente', fecha: '2026-06-27' },
  ],
  documentos: [
    { id: 'd1', nombre: 'Presupuesto aceptado', tipo: 'Presupuesto', fecha: '2026-05-08', download_url: null },
    { id: 'd2', nombre: 'Plano de distribución aprobado', tipo: 'Plano', fecha: '2026-05-15', download_url: null },
    { id: 'd3', nombre: 'Acta de seguimiento · 20 junio', tipo: 'Seguimiento', fecha: '2026-06-20', download_url: null },
  ],
}

const formatDate = (value, options = {}) => {
  if (!value) return 'Por confirmar'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: options.year ? 'numeric' : undefined,
  }).format(new Date(`${value}T12:00:00`))
}

const formatMoney = (value) => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
}).format(value || 0)

function LoadingPortal() {
  return (
    <main className="portal-state">
      <LoaderCircle className="spin" aria-hidden="true" />
      <p>Preparando la información de tu obra…</p>
    </main>
  )
}

function PortalError({ message }) {
  return (
    <main className="portal-state portal-state--error">
      <Brand />
      <AlertCircle size={42} aria-hidden="true" />
      <h1>No podemos abrir este espacio</h1>
      <p>{message}</p>
      <Link to="/"><ArrowLeft size={17} /> Volver a Martega</Link>
    </main>
  )
}

export default function ClientPortal() {
  const { token } = useParams()
  const [portal, setPortal] = useState(token === 'demo' ? demoPortal : null)
  const [status, setStatus] = useState(token === 'demo' ? 'ready' : 'loading')

  useEffect(() => {
    if (token === 'demo') return

    const loadPortal = async () => {
      if (!isSupabaseConfigured) {
        setStatus('not-configured')
        return
      }

      const { data, error } = await supabase.rpc('get_client_portal', { access_token: token })
      if (error || !data) {
        setStatus('invalid')
        return
      }

      setPortal(data)
      setStatus('ready')
    }

    loadPortal()
  }, [token])

  const pendingTotal = useMemo(() => (
    portal?.facturas
      ?.filter((invoice) => !['cobrada', 'cobrada_total'].includes(invoice.estado))
      .reduce((total, invoice) => total + Number(invoice.total || 0), 0) || 0
  ), [portal])

  if (status === 'loading') return <LoadingPortal />
  if (status === 'not-configured') return <PortalError message="La conexión segura todavía no está configurada. Solicita a Martega un enlace nuevo." />
  if (status === 'invalid') return <PortalError message="El enlace ha caducado o ya no está activo. Solicita a Martega un enlace nuevo." />

  const { obra, siguiente_hito: next, hitos = [], actualizaciones = [], facturas = [], documentos = [] } = portal
  const phoneHref = company.phone ? `tel:${company.phone}` : null
  const whatsappHref = company.phone ? `https://wa.me/${company.phone.replace('+', '')}` : null

  return (
    <div className="client-portal">
      <header className="portal-header">
        <Brand />
        <div className="portal-header__trust"><ShieldCheck size={16} /> Espacio privado</div>
        <Link className="portal-header__back" to="/"><ArrowLeft size={16} /> martega.es</Link>
      </header>

      <main>
        <section className="portal-hero">
          <div className="portal-hero__grid" aria-hidden="true" />
          <div className="portal-hero__stamp" aria-hidden="true">
            <span className="portal-hero__stamp-ring" />
            <span className="portal-hero__stamp-letter">M</span>
            <small>MARTEGA · VAL</small>
          </div>
          <div className="portal-hero__rail" aria-hidden="true">
            <span>CONTROL DE OBRA</span>
            <span>46°20′N · 0001</span>
          </div>
          <div className="portal-hero__intro">
            <p className="portal-kicker"><span /> Tu obra · {obra.referencia}</p>
            <h1>{obra.nombre}</h1>
            <div className="portal-location"><MapPin size={16} /> {obra.ubicacion}</div>
          </div>
          <div className="portal-progress" aria-label={`Progreso estimado: ${obra.progreso}%`}>
            <div className="portal-progress__number">{obra.progreso}<small>%</small></div>
            <div>
              <span>Avance estimado</span>
              <div className="portal-progress__track"><i style={{ width: `${obra.progreso}%` }} /></div>
              <strong>{obra.estado_label}</strong>
            </div>
          </div>
          <dl className="portal-dates">
            <div><dt>Inicio</dt><dd>{formatDate(obra.fecha_inicio, { year: true })}</dd></div>
            <div><dt>Entrega estimada</dt><dd>{formatDate(obra.fecha_fin_estimada, { year: true })}</dd></div>
            <div><dt>Responsable</dt><dd>{obra.responsable}</dd></div>
          </dl>
        </section>

        <div className="portal-content">
          <section className="next-milestone">
            <div className="next-milestone__date">
              <CalendarDays aria-hidden="true" />
              <strong>{formatDate(next?.fecha)}</strong>
            </div>
            <div>
              <p>Próximo hito</p>
              <h2>{next?.titulo || 'Pendiente de programación'}</h2>
              {next?.descripcion && <span>{next.descripcion}</span>}
            </div>
            <ChevronRight aria-hidden="true" />
          </section>

          <div className="portal-layout">
            <div className="portal-main-column">
              <section className="portal-section">
                <div className="portal-section__heading">
                  <div><span>01</span><h2>Plan de trabajo</h2></div>
                  <p>Fechas orientativas actualizadas por el equipo.</p>
                </div>
                <ol className="milestone-list">
                  {hitos.map((milestone) => (
                    <li className={`milestone milestone--${milestone.estado}`} key={milestone.id}>
                      <div className="milestone__icon">
                        {milestone.estado === 'completado' ? <Check /> : milestone.estado === 'en_curso' ? <Clock3 /> : <Circle />}
                      </div>
                      <div><strong>{milestone.titulo}</strong><span>{formatDate(milestone.fecha, { year: true })}</span></div>
                      <em>{milestone.estado === 'completado' ? 'Terminado' : milestone.estado === 'en_curso' ? 'Ahora' : 'Pendiente'}</em>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="portal-section">
                <div className="portal-section__heading">
                  <div><span>02</span><h2>Últimas noticias</h2></div>
                  <p>Lo importante, explicado sin ruido.</p>
                </div>
                <div className="update-list">
                  {actualizaciones.map((update) => (
                    <article key={update.id}>
                      <time>{formatDate(update.fecha, { year: true })}</time>
                      <h3>{update.titulo}</h3>
                      <p>{update.resumen}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="portal-sidebar">
              <section className="portal-card portal-card--contact">
                <HardHat aria-hidden="true" />
                <p>¿Necesitas comentar algo?</p>
                <h2>Habla con el equipo.</h2>
                <span className="portal-card__motto">Gestión clara de principio a fin.</span>
                <div>
                  {whatsappHref && <a href={whatsappHref}><MessageCircle size={17} /> WhatsApp</a>}
                  {phoneHref && <a href={phoneHref}><Phone size={17} /> Llamar</a>}
                  {company.email && <a href={`mailto:${company.email}`}><Mail size={17} /> Correo</a>}
                </div>
              </section>

              <section className="portal-card">
                <div className="portal-card__heading"><ReceiptText /><h2>Facturación</h2></div>
                <div className="invoice-summary"><span>Pendiente</span><strong>{formatMoney(pendingTotal)}</strong></div>
                <ul className="invoice-list">
                  {facturas.map((invoice) => (
                    <li key={invoice.id}>
                      <div><strong>{invoice.numero}</strong><span>{invoice.concepto}</span></div>
                      <div><strong>{formatMoney(invoice.total)}</strong><em className={`invoice-status invoice-status--${invoice.estado}`}>{invoice.estado === 'cobrada' ? 'Pagada' : 'Pendiente'}</em></div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="portal-card">
                <div className="portal-card__heading"><FileCheck2 /><h2>Documentos</h2></div>
                <ul className="document-list">
                  {documentos.map((document) => (
                    <li key={document.id}>
                      <div><span>{document.tipo}</span><strong>{document.nombre}</strong></div>
                      {document.download_url
                        ? <a href={document.download_url} aria-label={`Descargar ${document.nombre}`}><Download /></a>
                        : <button type="button" disabled aria-label="Documento disponible próximamente"><Check /></button>}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <footer className="portal-footer">
        <Brand inverse />
        <span><ShieldCheck size={14} /> Enlace personal y privado</span>
      </footer>
    </div>
  )
}
