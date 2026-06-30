import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock3,
  Gauge,
  Home,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
  Zap,
} from 'lucide-react'
import LeadForm from '../components/LeadForm.jsx'
import { company } from '../config.js'

const clients = [
  {
    icon: Home,
    number: '01',
    title: 'Viviendas',
    text: 'Pequeñas incidencias, revisiones periódicas y una casa que envejece mejor.',
  },
  {
    icon: Store,
    number: '02',
    title: 'Negocios',
    text: 'Mantenimiento sin interrumpir la actividad y con un responsable que ya conoce el local.',
  },
  {
    icon: Building2,
    number: '03',
    title: 'Comunidades',
    text: 'Preventivo, zonas comunes e incidencias coordinadas con administradores y propietarios.',
  },
]

const plans = [
  {
    name: 'Esencial',
    label: 'Para anticiparse',
    description: 'Una base preventiva para detectar desgaste antes de que se convierta en una avería.',
    items: ['Revisión periódica', 'Informe de estado', 'Calendario preventivo', 'Canal directo'],
  },
  {
    name: 'Continuo',
    label: 'El más equilibrado',
    description: 'Seguimiento activo para espacios que necesitan respuesta, orden y continuidad.',
    items: ['Todo lo incluido en Esencial', 'Prioridad en incidencias', 'Bolsa de horas', 'Historial del inmueble'],
    featured: true,
  },
  {
    name: 'Integral',
    label: 'Delegación completa',
    description: 'Nos convertimos en el equipo técnico de confianza de tu inmueble o negocio.',
    items: ['Plan hecho a medida', 'Coordinación de gremios', 'Seguimiento recurrente', 'Un único responsable'],
  },
]

const protocol = [
  ['01', 'Escuchamos', 'Entendemos el uso del espacio, sus puntos débiles y lo que te preocupa.'],
  ['02', 'Revisamos', 'Hacemos una primera lectura técnica y ordenamos las prioridades.'],
  ['03', 'Planificamos', 'Creamos un calendario realista: qué hacer ahora, después y nunca de urgencia.'],
  ['04', 'Cuidamos', 'Ejecutamos, documentamos y damos continuidad con el mismo equipo.'],
]

const zones = ['València', 'Paterna', 'Burjassot', 'Mislata', 'Torrent', "L'Horta Nord", "L'Horta Sud"]

export default function HomePage() {
  const whatsapp = company.phone
    ? `https://wa.me/${company.phone.replace('+', '')}?text=Hola%2C%20quiero%20una%20valoraci%C3%B3n%20de%20mantenimiento`
    : null

  return (
    <div className="maintenance-home">
      <section className="maintenance-hero">
        <div className="maintenance-hero__copy">
          <p className="maintenance-kicker"><span>MARTEGA / 01</span> Mantenimiento integral en Valencia</p>
          <h1>Lo que no se rompe<br /><em>también se mantiene.</em></h1>
          <p className="maintenance-hero__lead">
            Cuidamos viviendas, negocios y comunidades antes de que una pequeña incidencia
            se convierta en una reparación urgente. Un equipo. Un plan. Cero improvisación.
          </p>
          <div className="maintenance-hero__actions">
            <a className="maintenance-button maintenance-button--primary" href="#contacto">
              Quiero un plan de mantenimiento <ArrowRight size={17} />
            </a>
            {whatsapp && (
              <a className="maintenance-text-link" href={whatsapp}>
                <MessageCircle size={17} /> Hablar por WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="maintenance-console" aria-label="Resumen de un plan de mantenimiento activo">
          <div className="maintenance-console__head">
            <span><i /> SISTEMA ACTIVO</span>
            <span>VAL / 2026</span>
          </div>
          <div className="maintenance-console__orbit">
            <div className="maintenance-console__ring">
              <ShieldCheck size={38} strokeWidth={1.4} />
            </div>
            <span className="orbit-label orbit-label--one">PREVENIR</span>
            <span className="orbit-label orbit-label--two">REVISAR</span>
            <span className="orbit-label orbit-label--three">RESOLVER</span>
          </div>
          <div className="maintenance-console__stats">
            <div><small>Próxima revisión</small><strong>Planificada</strong></div>
            <div><small>Interlocutores</small><strong>Uno</strong></div>
            <div><small>Historial técnico</small><strong>Disponible</strong></div>
          </div>
        </div>
      </section>

      <div className="maintenance-marquee" aria-hidden="true">
        <div>
          {[...Array(2)].flatMap((_, index) => [
            <span key={`a${index}`}><CalendarCheck /> Mantenimiento preventivo</span>,
            <span key={`b${index}`}><Zap /> Electricidad</span>,
            <span key={`c${index}`}><Wrench /> Fontanería</span>,
            <span key={`d${index}`}><RefreshCw /> Seguimiento continuo</span>,
            <span key={`e${index}`}><ShieldCheck /> Respuesta coordinada</span>,
          ])}
        </div>
      </div>

      <section className="maintenance-statement" id="mantenimiento">
        <div className="maintenance-section-tag">01 — CAMBIAR LA LÓGICA</div>
        <div className="maintenance-statement__content">
          <h2>Una avería cuesta.<br /><em>La prevención, renta.</em></h2>
          <div>
            <p>
              El mantenimiento no es llamar a alguien cuando algo falla. Es conocer el inmueble,
              anticipar el desgaste y decidir con tiempo. Así se reducen urgencias, paradas y
              reparaciones grandes.
            </p>
            <p className="maintenance-note"><Sparkles size={16} /> Menos sobresaltos. Más vida útil. Más control.</p>
          </div>
        </div>
      </section>

      <section className="maintenance-clients">
        {clients.map(({ icon: Icon, number, title, text }) => (
          <article className="maintenance-client-card" key={title}>
            <div className="maintenance-client-card__top"><span>{number}</span><Icon size={24} strokeWidth={1.5} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href="#contacto">Ver cómo lo cuidamos <ArrowRight size={14} /></a>
          </article>
        ))}
      </section>

      <section className="maintenance-plans" id="planes">
        <div className="maintenance-plans__intro">
          <div className="maintenance-section-tag maintenance-section-tag--light">02 — ELIGE TU NIVEL DE TRANQUILIDAD</div>
          <h2>No vendemos urgencias.<br /><em>Diseñamos continuidad.</em></h2>
          <p>
            La frecuencia y el alcance se ajustan después de conocer el espacio. Sin paquetes
            inflados ni trabajos que no necesitas.
          </p>
        </div>
        <div className="maintenance-plan-grid">
          {plans.map((plan) => (
            <article className={`maintenance-plan ${plan.featured ? 'maintenance-plan--featured' : ''}`} key={plan.name}>
              <div className="maintenance-plan__head">
                <span>{plan.label}</span>
                {plan.featured && <i>RECOMENDADO</i>}
              </div>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <ul>
                {plan.items.map((item) => <li key={item}><Check size={14} /> {item}</li>)}
              </ul>
              <a href="#contacto">Solicitar valoración <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="maintenance-protocol" id="metodo">
        <div className="maintenance-protocol__intro">
          <div className="maintenance-section-tag">03 — MÉTODO MARTEGA</div>
          <h2>El buen mantenimiento<br /><em>casi no se nota.</em></h2>
          <p>Porque está ordenado, documentado y ocurre antes de que tengas que perseguir a nadie.</p>
        </div>
        <ol className="maintenance-protocol__steps">
          {protocol.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <CheckCircle2 size={20} strokeWidth={1.4} />
            </li>
          ))}
        </ol>
      </section>

      <section className="maintenance-support" id="servicios">
        <div className="maintenance-support__graphic" aria-hidden="true">
          <span>MARTEGA</span>
          <Wrench />
          <small>CAPACIDAD TÉCNICA / RESPALDO REAL</small>
        </div>
        <div className="maintenance-support__copy">
          <div className="maintenance-section-tag">04 — CUANDO HAY QUE ACTUAR</div>
          <h2>Mantenemos porque<br /><em>sabemos ejecutar.</em></h2>
          <p>
            Electricidad, fontanería, climatización, albañilería y reformas. Si una revisión
            detecta una intervención, coordinamos los oficios y la resolvemos sin empezar de cero.
          </p>
          <div className="maintenance-support__list">
            <span><Zap size={17} /> Instalaciones</span>
            <span><Wrench size={17} /> Reparaciones</span>
            <span><Building2 size={17} /> Reformas</span>
            <span><Gauge size={17} /> Eficiencia</span>
          </div>
        </div>
      </section>

      <section className="maintenance-zone">
        <div>
          <div className="maintenance-section-tag maintenance-section-tag--light">05 — CERCA CUENTA</div>
          <h2>Valencia y su área metropolitana.</h2>
        </div>
        <ul>{zones.map((zone) => <li key={zone}><Check size={13} /> {zone}</li>)}</ul>
      </section>

      <section className="maintenance-contact" id="contacto">
        <div className="maintenance-contact__intro">
          <div className="maintenance-section-tag">06 — PRIMERA VALORACIÓN</div>
          <h2>Empecemos por mirar<br /><em>lo que nadie mira.</em></h2>
          <p>
            Cuéntanos qué espacio quieres cuidar. Revisaremos tu caso y te propondremos un plan
            proporcionado, claro y sin compromiso.
          </p>
          <div className="maintenance-contact__channels">
            {whatsapp && <a href={whatsapp}><MessageCircle size={19} /><span><small>WHATSAPP</small>Escribir ahora</span></a>}
            {company.phone && <a href={`tel:${company.phone}`}><Phone size={19} /><span><small>TELÉFONO</small>{company.phoneDisplay || company.phone}</span></a>}
          </div>
          <p className="maintenance-contact__promise"><Clock3 size={15} /> Te responderá una persona del equipo, no un robot.</p>
        </div>
        <LeadForm />
      </section>
    </div>
  )
}
