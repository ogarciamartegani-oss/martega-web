import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  FileCheck2,
  Hotel,
  Lightbulb,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Store,
  TriangleAlert,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import LeadForm from '../components/LeadForm.jsx'
import { company } from '../config.js'

const audiences = [
  { icon: Store, title: 'Locales y comercios', text: 'Incidencias resueltas sin alargar paradas ni coordinar varios gremios.' },
  { icon: Building2, title: 'Comunidades', text: 'Mantenimiento de zonas comunes y un canal claro para administradores.' },
  { icon: Hotel, title: 'Alojamiento y oficinas', text: 'Espacios operativos, cuidados y preparados para clientes y equipos.' },
  { icon: Users, title: 'Gestores de inmuebles', text: 'Un colaborador técnico para varias propiedades y todas sus incidencias.' },
]

const technicalServices = [
  { icon: Zap, title: 'Electricidad', text: 'Averías, cuadros, iluminación, mecanismos e instalaciones.' },
  { icon: Wrench, title: 'Fontanería', text: 'Fugas, grifería, sanitarios, tuberías y pequeñas reparaciones.' },
  { icon: Snowflake, title: 'Climatización', text: 'Revisión, mantenimiento y mejora de equipos e instalaciones.' },
  { icon: Lightbulb, title: 'Multiservicio', text: 'Albañilería, pintura y actuaciones coordinadas en un mismo parte.' },
]

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
      <section className="market-hero">
        <div className="market-hero__media" aria-hidden="true">
          <img src="/hero-maintenance-v2.jpg" alt="" fetchPriority="high" />
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
          <p>Diagnosticamos, coordinamos el oficio y resolvemos la incidencia con un solo contacto.</p>
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
          {technicalServices.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={27} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
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
