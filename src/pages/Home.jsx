import { useEffect } from 'react'
import {
  ArrowRight,
  Bath,
  Building2,
  Check,
  Clock3,
  FileCheck2,
  Hotel,
  Lightbulb,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  RefreshCw,
  Ruler,
  ShieldCheck,
  Snowflake,
  Store,
  TriangleAlert,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MapPin, BadgeCheck, Landmark } from 'lucide-react'
import LeadForm from '../components/LeadForm.jsx'
import Seo from '../components/Seo.jsx'
import { company } from '../config.js'
import { works } from './worksData.js'

const audiences = [
  { icon: Store, title: 'Locales y comercios', text: 'Incidencias resueltas sin alargar paradas ni coordinar varios gremios.' },
  { icon: Building2, title: 'Comunidades', text: 'Mantenimiento de zonas comunes y un canal claro para administradores.' },
  { icon: Hotel, title: 'Alojamiento y oficinas', text: 'Espacios operativos, cuidados y preparados para clientes y equipos.' },
  { icon: Users, title: 'Gestores de inmuebles', text: 'Un colaborador técnico para varias propiedades y todas sus incidencias.' },
]

const technicalServices = [
  { icon: Zap, title: 'Electricidad', text: 'Averías, cuadros, iluminación, mecanismos e instalaciones.', to: '/servicios/electricidad' },
  { icon: Wrench, title: 'Fontanería', text: 'Fugas, grifería, sanitarios, tuberías y pequeñas reparaciones.', to: '/servicios/fontaneria' },
  { icon: Snowflake, title: 'Climatización', text: 'Revisión, mantenimiento y mejora de equipos e instalaciones.', to: '/servicios/climatizacion' },
  { icon: Lightbulb, title: 'Multiservicio', text: 'Albañilería, pintura y actuaciones coordinadas en un mismo parte.', to: '/servicios/mantenimiento' },
]

const homeFaqs = [
  {
    q: '¿En qué zonas trabajáis?',
    a: 'En València ciudad y su área metropolitana: Mislata, Xirivella, Alboraia, Burjassot, Paterna, Torrent y alrededores. Si estás en otra zona cercana, consúltanos.',
  },
  {
    q: '¿Atendéis averías urgentes?',
    a: 'Sí. Atendemos urgencias las 24 horas. Cuéntanos la incidencia por WhatsApp o teléfono y valoramos la prioridad de inmediato.',
  },
  {
    q: '¿El presupuesto tiene coste o compromiso?',
    a: 'No. Valoramos la incidencia o el proyecto y te damos un presupuesto por escrito, sin compromiso. Cada trabajo se entrega con su factura.',
  },
  {
    q: '¿Trabajáis solo para empresas o también para particulares?',
    a: 'Trabajamos para negocios, comunidades de propietarios, gestores de inmuebles y también para particulares, tanto en mantenimiento como en reformas.',
  },
  {
    q: '¿Cómo sé qué se ha hecho en mi obra o intervención?',
    a: 'Cada cliente dispone de un portal online donde puede seguir su obra: estado, documentos y fotos del trabajo realizado, accesible desde el móvil en cualquier momento.',
  },
]

function HomeFaqSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
  return null
}

const process = [
  { icon: TriangleAlert, number: '01', title: 'Recibimos la incidencia', text: 'Nos explicas qué ocurre y valoramos la prioridad.' },
  { icon: Wrench, number: '02', title: 'Asignamos al técnico', text: 'Coordinamos el oficio adecuado sin hacerte perseguir proveedores.' },
  { icon: FileCheck2, number: '03', title: 'Resolvemos y documentamos', text: 'La intervención queda clara: trabajo realizado y próximos pasos.' },
  { icon: RefreshCw, number: '04', title: 'Prevenimos la siguiente', text: 'Si tiene sentido, proponemos revisiones para evitar recurrencias.' },
]

export default function HomePage() {
  const whatsapp = company.phone
    ? `https://wa.me/${company.phone.replace('+', '')}?text=Hola%2C%20necesito%20ayuda%20con%20una%20incidencia%20de%20mantenimiento`
    : null

  return (
    <div className="market-home">
      <Seo
        title="Martega | Mantenimiento y reformas en Valencia"
        description="Mantenimiento técnico y reformas para viviendas, negocios, comunidades e inmuebles en Valencia. Urgencias 24h. Electricidad, fontanería, climatización y multiservicio."
        path="/"
      />
      <HomeFaqSchema />
      <section className="market-hero">
        <div className="market-hero__media" aria-hidden="true">
          <picture>
            <source srcSet="/hero-maintenance-v2.webp" type="image/webp" />
            <img src="/hero-maintenance-v2.jpg" alt="" width="1672" height="941" fetchPriority="high" />
          </picture>
        </div>
        <div className="market-hero__copy">
          <p className="market-eyebrow market-eyebrow--light"><span /> Mantenimiento técnico en Valencia</p>
          <h1>Tu espacio tiene que<br /><em>seguir funcionando.</em></h1>
          <p className="market-hero__lead">
            Resolvemos y prevenimos incidencias de electricidad, fontanería,
            climatización y mantenimiento general para negocios, comunidades e inmuebles.
          </p>
          <div className="market-actions">
            {whatsapp && (
              <a className="market-button market-button--primary" href={whatsapp}>
                <TriangleAlert size={18} /> Tengo una incidencia
              </a>
            )}
            <a className="market-button market-button--secondary" href="#contacto">
              Solicitar plan de mantenimiento <ArrowRight size={17} />
            </a>
          </div>
          <div className="market-hero__trust">
            <span><Check /> Urgencias 24h</span>
            <span><Check /> Un único interlocutor</span>
            <span><Check /> Presupuesto por escrito</span>
            <span><Check /> Valencia y alrededores</span>
          </div>
        </div>
        <div className="market-hero__signature">
          <span>MARTEGA / VALENCIA</span>
          <strong>Mantenimiento para espacios<br />que no pueden parar.</strong>
          <div><i /> SISTEMA ACTIVO</div>
        </div>
      </section>

      <section className="market-audiences" id="mantenimiento">
        <div className="market-section-heading">
          <p className="market-eyebrow"><span /> Para quién trabajamos</p>
          <h2>Un equipo técnico.<br /><em>Cuatro tipos de cliente.</em></h2>
        </div>
        <div className="market-audience-grid">
          {audiences.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <div><span>0{index + 1}</span><Icon size={25} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="market-demand">
        <div className="market-demand__dark">
          <p className="market-eyebrow market-eyebrow--light"><span /> Cuando algo falla</p>
          <TriangleAlert size={44} />
          <h2>Respuesta<br /><em>correctiva.</em></h2>
          <p>Diagnosticamos, coordinamos el oficio y resolvemos la incidencia con un solo contacto. Averías urgentes atendidas las 24 horas.</p>
          {whatsapp && <a href={whatsapp}>Contar una incidencia <ArrowRight size={16} /></a>}
        </div>
        <div className="market-demand__light">
          <p className="market-eyebrow"><span /> Antes de que falle</p>
          <RefreshCw size={44} />
          <h2>Mantenimiento<br /><em>preventivo.</em></h2>
          <p>Revisiones programadas, prioridades claras y seguimiento para reducir urgencias y paradas.</p>
          <a href="#contacto">Pedir una valoración <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="market-services" id="servicios">
        <div className="market-section-heading market-section-heading--split">
          <div>
            <p className="market-eyebrow"><span /> Capacidad técnica</p>
            <h2>Lo que necesitas,<br /><em>sin llamar a cuatro empresas.</em></h2>
          </div>
          <p>Centralizamos los oficios habituales del inmueble y coordinamos las actuaciones que requieren varios profesionales.</p>
        </div>
        <div className="market-service-grid">
          {technicalServices.map(({ icon: Icon, title, text, to }) => (
            <article key={title}>
              <Icon size={27} />
              <h3>{title}</h3>
              <p>{text}</p>
              <Link className="market-service-link" to={to}>Ver servicio <ArrowRight size={13} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="market-renovations" id="reformas">
        <div className="market-renovations__media">
          <picture>
            <source srcSet="/reformas-editorial-v1.webp" type="image/webp" />
            <img src="/reformas-editorial-v1.jpg" alt="Profesionales de Martega planificando una reforma integral" width="1672" height="941" loading="lazy" />
          </picture>
          <span>REFORMAS / VALENCIA</span>
        </div>
        <div className="market-renovations__content">
          <p className="market-eyebrow market-eyebrow--light"><span /> Reformas</p>
          <h2>Cuando mantener<br />ya no basta,<br /><em>transformamos.</em></h2>
          <p>
            Reformas integrales y parciales para viviendas y locales. Planificamos,
            coordinamos los gremios y cuidamos la ejecución con un único responsable.
          </p>
          <div className="market-renovations__types">
            <span><Building2 size={16} /> Viviendas y locales</span>
            <span><Bath size={16} /> Cocinas y baños</span>
            <span><Ruler size={16} /> Redistribución</span>
            <span><Zap size={16} /> Instalaciones</span>
          </div>
          <a className="market-renovations__cta" href="#contacto">
            Cuéntanos tu reforma <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <section className="market-process" id="metodo">
        <div className="market-process__intro">
          <p className="market-eyebrow market-eyebrow--light"><span /> Cómo trabajamos</p>
          <h2>De la incidencia<br /><em>al control.</em></h2>
          <p>La primera reparación puede ser el inicio de un mantenimiento mejor organizado.</p>
        </div>
        <ol>
          {process.map(({ icon: Icon, number, title, text }) => (
            <li key={number}>
              <span>{number}</span>
              <Icon size={22} />
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      {works.length > 0 && (
        <section className="market-works" id="trabajos">
          <div className="market-section-heading">
            <p className="market-eyebrow"><span /> Trabajos recientes</p>
            <h2>Hecho por nosotros,<br /><em>en Valencia.</em></h2>
          </div>
          <div className="market-works-grid">
            {works.map(({ image, alt, title, place, tag }) => (
              <figure key={image}>
                <img src={image} alt={alt} loading="lazy" />
                <figcaption>
                  <span>{tag}</span>
                  <strong>{title}</strong>
                  <small>{place}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="market-portal" id="portal">
        <div className="market-portal__copy">
          <p className="market-eyebrow market-eyebrow--light"><span /> Portal de cliente</p>
          <h2>Tu obra, en tu móvil.<br /><em>Sin llamar para preguntar.</em></h2>
          <p>
            Cada cliente dispone de un acceso privado donde ver el estado de su obra o
            intervención: qué se ha hecho, fotos del trabajo y documentos. Transparencia
            que ninguna otra empresa de mantenimiento en Valencia te ofrece.
          </p>
          <ul>
            <li><Check size={15} /> Estado de la obra actualizado</li>
            <li><Check size={15} /> Fotos y documentos en un solo sitio</li>
            <li><Check size={15} /> Accesible desde cualquier dispositivo</li>
          </ul>
          <Link className="market-button market-button--portal" to="/acceso">
            <MonitorSmartphone size={17} /> Acceder a mi obra
          </Link>
        </div>
        <div className="market-portal__visual" aria-hidden="true">
          <div className="market-portal__card">
            <span>PORTAL DE CLIENTE</span>
            <strong>Reforma en curso</strong>
            <div className="market-portal__bar"><i /></div>
            <small>Fase 3 de 5 · Instalaciones</small>
            <div className="market-portal__row"><FileCheck2 size={14} /> Presupuesto aprobado</div>
            <div className="market-portal__row"><Wrench size={14} /> Última visita: hoy</div>
          </div>
        </div>
      </section>

      <section className="market-faq" id="preguntas">
        <div className="market-section-heading">
          <p className="market-eyebrow"><span /> Preguntas frecuentes</p>
          <h2>Lo que nos preguntan<br /><em>antes de empezar.</em></h2>
        </div>
        <dl>
          {homeFaqs.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="market-proof">
        <div>
          <ShieldCheck size={28} />
          <strong>Un responsable</strong>
          <span>para coordinar el trabajo</span>
        </div>
        <div>
          <FileCheck2 size={28} />
          <strong>Información clara</strong>
          <span>sobre qué se ha hecho</span>
        </div>
        <div>
          <Clock3 size={28} />
          <strong>Prioridad real</strong>
          <span>según el impacto de la incidencia</span>
        </div>
      </section>

      <section className="market-trust" id="empresa">
        <div className="market-section-heading">
          <p className="market-eyebrow"><span /> Quiénes somos</p>
          <h2>Una empresa de Valencia,<br /><em>con nombre y apellidos.</em></h2>
        </div>
        <div className="market-trust-grid">
          <article>
            <Landmark size={26} />
            <h3>Empresa registrada</h3>
            <p>
              Martega Instalaciones y Mantenimiento, S.L., con sede en el barrio de
              Nazaret (València). Presupuesto por escrito y factura en cada trabajo.
            </p>
          </article>
          <article>
            <MapPin size={26} />
            <h3>Zona de trabajo</h3>
            <p>
              València ciudad y área metropolitana: Mislata, Xirivella, Alboraia,
              Burjassot, Paterna, Torrent y alrededores. Consulta otras zonas.
            </p>
          </article>
          <article>
            <BadgeCheck size={26} />
            <h3>Cómo respondemos</h3>
            <p>
              Cada intervención queda documentada: qué se ha hecho, qué material se ha
              usado y qué conviene vigilar. Sin letra pequeña ni trabajos a medias.
            </p>
          </article>
        </div>
      </section>

      <section className="market-contact" id="contacto">
        <div className="market-contact__intro">
          <p className="market-eyebrow"><span /> Hablemos de tu espacio</p>
          <h2>¿Qué necesitas<br /><em>mantener en marcha?</em></h2>
          <p>
            Cuéntanos el tipo de inmueble y qué te preocupa. Te diremos si conviene una
            intervención puntual o un mantenimiento recurrente.
          </p>
          <div className="market-contact__channels">
            {whatsapp && <a href={whatsapp}><MessageCircle size={19} /><span><small>WHATSAPP</small>Escribir ahora</span></a>}
            {company.phone && <a href={`tel:${company.phone}`}><Phone size={19} /><span><small>TELÉFONO</small>{company.phoneDisplay || company.phone}</span></a>}
          </div>
        </div>
        <LeadForm />
      </section>
    </div>
  )
}
