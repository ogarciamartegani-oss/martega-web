import {
  ArrowRight,
  Bath,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  ClipboardList,
  FileText,
  Flame,
  HardHat,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import LeadForm from '../components/LeadForm.jsx'
import { company } from '../config.js'

/* ─── DATA ─── */

const tickerItems = [
  { icon: FileText, text: 'Presupuesto cerrado y por escrito' },
  { icon: ShieldCheck, text: 'Garantía en todos los trabajos' },
  { icon: Users, text: 'Atención con un único interlocutor' },
  { icon: Camera, text: 'Fotos de avance de la obra' },
  { icon: MessageCircle, text: 'Respuesta ágil por WhatsApp' },
  { icon: HardHat, text: 'Coordinación de todos los gremios' },
  { icon: Zap, text: 'Electricidad e instalaciones certificadas' },
  { icon: Wrench, text: 'Fontanería y climatización' },
]

const mainServices = [
  {
    icon: Home,
    title: 'Reformas integrales',
    text: 'Coordinamos la reforma completa de tu vivienda o local, desde el primer boceto hasta la entrega de llaves.',
    href: '#contacto',
  },
  {
    icon: Bath,
    title: 'Baños y cocinas',
    text: 'Renovación completa con selección de materiales, instalaciones y acabados de calidad.',
    href: '#contacto',
  },
  {
    icon: Zap,
    title: 'Electricidad',
    text: 'Instalaciones eléctricas, cuadros, puntos de luz y automatizaciones según normativa vigente.',
    href: '#contacto',
  },
]

const secondaryServices = [
  { icon: Wrench, title: 'Fontanería', text: 'Reparación, instalación y mejora de redes de agua.' },
  { icon: Flame, title: 'Climatización', text: 'Aire acondicionado, calefacción y ventilación.' },
  { icon: Building2, title: 'Pladur y tabiquería', text: 'Distribución de espacios y trasdosados.' },
  { icon: CalendarCheck, title: 'Mantenimiento', text: 'Contratos preventivos para viviendas y locales.' },
  { icon: ShieldCheck, title: 'Comunidades', text: 'Zonas comunes, fachadas y cubiertas.' },
]

const features = [
  { icon: HardHat, title: 'Coordinamos todo', text: 'Gestionamos todos los oficios para que no tengas que hacerlo tú.' },
  { icon: Users, title: 'Un único interlocutor', text: 'Una sola persona conoce tu proyecto de principio a fin.' },
  { icon: FileText, title: 'Presupuesto cerrado', text: 'Lo que firmas es lo que pagas, sin sorpresas a mitad de la obra.' },
  { icon: ShieldCheck, title: 'Garantía por escrito', text: 'Garantizamos nuestros trabajos. Si algo falla, lo solucionamos.' },
  { icon: Camera, title: 'Fotos de avance', text: 'Recibes actualizaciones visuales del progreso de tu obra.' },
  { icon: MessageCircle, title: 'Respuesta rápida', text: 'En horario laboral respondemos en menos de 30 minutos.' },
]

const steps = [
  ['01', 'Nos cuentas qué necesitas', 'Una llamada, un WhatsApp o el formulario es suficiente.'],
  ['02', 'Visitamos el espacio', 'Un técnico visita el inmueble para entender el alcance real.'],
  ['03', 'Presupuesto detallado', 'Recibes una propuesta clara, sin partidas ocultas.'],
  ['04', 'Planificamos los trabajos', 'Fechas, materiales y gremios organizados desde el inicio.'],
  ['05', 'Ejecutamos y comunicamos', 'Trabajamos con orden y recibes fotos de avance.'],
  ['06', 'Revisión y entrega', 'Revisión conjunta antes del cierre para que todo quede perfecto.'],
]

const gallery = [
  { label: 'Reforma integral', location: 'Ruzafa · València', phase: 'Antes / Después' },
  { label: 'Baño completo', location: 'Patraix · València', phase: 'Resultado final' },
  { label: 'Instalación eléctrica', location: 'Burjassot', phase: 'En ejecución' },
  { label: 'Cocina renovada', location: 'Benimaclet · València', phase: 'Antes / Después' },
  { label: 'Climatización', location: 'Campanar · València', phase: 'Instalación' },
  { label: 'Comunidad de vecinos', location: "L'Eixample · València", phase: 'Fachada' },
]

const zones = [
  'Valencia', 'Paterna', 'Burjassot', 'Mislata', 'Torrent',
  'Aldaia', 'Alaquàs', 'Manises', 'Xirivella', 'Quart de Poblet',
  'Picanya', 'Paiporta', 'Catarroja', "L'Horta Nord", "L'Horta Sud",
]

/* ─── COMPONENT ─── */

export default function HomePage() {
  const wa = company.phone
    ? `https://wa.me/${company.phone.replace('+', '')}?text=Hola%2C%20me%20gustar%C3%ADa%20pedir%20presupuesto`
    : null

  return (
    <>
      {/* 1. HERO */}
      <section className="hero">
        <div className="hero__content">
          <p className="hero__kicker"><span>—</span> Martega · Valencia</p>
          <h1>
            Todo lo que tu vivienda necesita,<br />
            <em>en un único equipo.</em>
          </h1>
          <p className="hero__lead">
            Reformas, instalaciones y mantenimiento coordinados por un solo responsable.
            Presupuesto claro, seguimiento real y trabajo bien ejecutado de principio a fin.
          </p>
          <div className="hero__actions">
            {wa && (
              <a className="button button--whatsapp" href={wa}>
                <MessageCircle size={19} aria-hidden="true" /> Solicitar presupuesto
              </a>
            )}
            <a className="button button--outline-dark" href="#servicios">
              Ver servicios <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero__deco" aria-hidden="true">
          <div className="hero__deco-card">
            <span className="hero__deco-num">1</span>
            <span>Único interlocutor para toda la obra</span>
          </div>
          <div className="hero__deco-card">
            <span className="hero__deco-num">+8</span>
            <span>Oficios coordinados por nosotros</span>
          </div>
          <div className="hero__deco-card hero__deco-card--accent">
            <span className="hero__deco-num">0</span>
            <span>Llamadas que tendrás que perseguir</span>
          </div>
          <p className="hero__deco-note">
            <ShieldCheck size={14} /> Presupuesto por escrito, siempre
          </p>
        </div>
      </section>

      {/* 2. TICKER ANIMADO */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...tickerItems, ...tickerItems].map(({ icon: Icon, text }, i) => (
            <span className="ticker__item" key={i}>
              <Icon size={15} /> {text}
            </span>
          ))}
        </div>
      </div>

      {/* 3. SERVICIOS PRINCIPALES */}
      <section className="section services" id="servicios">
        <div className="section-intro">
          <p className="eyebrow eyebrow--dark"><span />A qué nos dedicamos</p>
          <h2>Soluciones integrales<br /><em>para tu hogar y negocio</em></h2>
          <p>
            Somos expertos en reformas, instalaciones y mantenimiento en Valencia,
            ejecutados por un equipo propio. Un solo interlocutor para tu proyecto,
            de la visita al acabado.
          </p>
        </div>
        <div className="services-main-grid">
          {mainServices.map(({ icon: Icon, title, text, href }) => (
            <article className="service-main-card" key={title}>
              <div className="service-main-card__icon"><Icon size={28} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href={href} className="service-main-card__link">
                Solicitar presupuesto <ArrowRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* 4. SERVICIOS SECUNDARIOS */}
      <section className="section services-secondary">
        <p className="eyebrow eyebrow--dark"><span />También trabajamos en</p>
        <h2>Un mismo equipo para<br /><em>todas tus necesidades</em></h2>
        <div className="services-secondary-grid">
          {secondaryServices.map(({ icon: Icon, title, text }) => (
            <article className="service-sec-card" key={title}>
              <Icon size={22} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="services-secondary__cta">
          {wa && (
            <a className="button button--whatsapp" href={wa}>
              <MessageCircle size={17} /> Pide tu presupuesto gratis
            </a>
          )}
        </div>
      </section>

      {/* 5. FEATURES / POR QUÉ ELEGIRNOS */}
      <section className="section features" id="nosotros">
        <div className="section-intro">
          <p className="eyebrow eyebrow--dark"><span />Por qué elegirnos</p>
          <h2>Tu proyecto en buenas manos,<br /><em>de principio a fin.</em></h2>
        </div>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="feature-item" key={title}>
              <div className="feature-item__icon"><Icon size={22} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="features__cta">
          {wa && (
            <a className="button button--blue" href={wa}>
              <MessageCircle size={17} /> Pide tu presupuesto
            </a>
          )}
        </div>
      </section>

      {/* 6. MÉTODO */}
      <section className="section method" id="metodo">
        <div className="section-intro">
          <p className="eyebrow eyebrow--dark"><span />Método Martega</p>
          <h2>Del primer mensaje<br /><em>a la última revisión.</em></h2>
        </div>
        <ol className="method-steps">
          {steps.map(([number, title, text]) => (
            <li key={number}>
              <span className="method-steps__num">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 7. REVIEWS */}
      <section className="reviews">
        <div className="reviews__badge">
          <div className="reviews__stars">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <strong>4,9 sobre 5 en Google</strong>
          <span>Basado en más de 30 reseñas reales de clientes</span>
        </div>
        <blockquote className="reviews__quote">
          "Contratamos a Martega para reformar el baño y la cocina. El resultado fue exactamente
          lo que acordamos, en el plazo prometido y sin sorpresas en el presupuesto. El seguimiento
          fue impecable."
          <cite>— Ana G., Valencia</cite>
        </blockquote>
      </section>

      {/* 8. GALERÍA */}
      <section className="section gallery" id="proyectos">
        <div className="section-intro">
          <p className="eyebrow eyebrow--dark"><span />Galería de proyectos</p>
          <h2>Conoce algunos de<br /><em>nuestros últimos trabajos.</em></h2>
          <p>
            Estamos preparando el archivo visual de obras de Martega.
            Pronto podrás ver antes, durante y después de cada proyecto.
          </p>
        </div>
        <div className="gallery-grid">
          {gallery.map(({ label, location, phase }) => (
            <div className="gallery-card" key={label + location}>
              <div className="gallery-card__photo">
                <span className="gallery-card__phase">{phase}</span>
              </div>
              <div className="gallery-card__info">
                <strong>{label}</strong>
                <span>{location}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="gallery__cta">
          {wa && (
            <a className="button button--whatsapp" href={wa}>
              <MessageCircle size={17} /> ¿Tienes un proyecto? Cuéntanoslo
            </a>
          )}
        </div>
      </section>

      {/* 9. ZONAS */}
      <section className="section zones" id="zonas">
        <div className="zones__content">
          <p className="eyebrow eyebrow--dark"><span />Zona de servicio</p>
          <h2>De Valencia,<br /><em>para Valencia.</em></h2>
          <p>
            Cubrimos Valencia ciudad y todos los municipios del área metropolitana.
            Si tu zona no está en la lista, llámanos: probablemente también vayamos.
          </p>
          {wa && (
            <a className="button button--blue" href={wa}>
              ¿Trabajáis en mi zona? Consúltanos <ArrowRight size={15} />
            </a>
          )}
        </div>
        <ul className="zones__list">
          {zones.map((zone) => (
            <li key={zone}><Check size={13} aria-hidden="true" /> {zone}</li>
          ))}
        </ul>
      </section>

      {/* 10. CONTACTO */}
      <section className="contact-section" id="contacto">
        <div className="contact-intro">
          <p className="eyebrow eyebrow--dark"><span />¿Listo para empezar?</p>
          <h2>Solicita presupuesto<br /><em>sin compromiso.</em></h2>
          <p>
            Escríbenos ahora y nuestro equipo se encargará de estudiar tu caso y
            prepararte una propuesta clara y detallada.
          </p>
          <div className="contact-channels">
            {wa && (
              <a className="contact-channel contact-channel--whatsapp" href={wa}>
                <MessageCircle size={22} aria-hidden="true" />
                <div>
                  <strong>WhatsApp</strong>
                  <span>Respondemos en menos de 30 min</span>
                </div>
              </a>
            )}
            {company.phone && (
              <a className="contact-channel" href={`tel:${company.phone}`}>
                <Phone size={22} aria-hidden="true" />
                <div>
                  <strong>Llamar</strong>
                  <span>{company.phoneDisplay || company.phone}</span>
                </div>
              </a>
            )}
          </div>
          <div className="contact-details">
            <div><span>Zona de trabajo</span><strong>Valencia y alrededores</strong></div>
            {company.email && <div><span>Correo</span><strong>{company.email}</strong></div>}
          </div>
        </div>
        <LeadForm />
      </section>
    </>
  )
}
