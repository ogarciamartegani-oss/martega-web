import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, MessageCircle, Phone } from 'lucide-react'
import LeadForm from '../../components/LeadForm.jsx'
import Seo from '../../components/Seo.jsx'
import { company } from '../../config.js'
import { getService, services } from './servicesData.js'

function FaqSchema({ service }) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faqs.map(({ q, a }) => ({
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
  }, [service])
  return null
}

export default function ServicePage() {
  const { slug } = useParams()
  const service = getService(slug)

  if (!service) return <Navigate to="/" replace />

  const { icon: Icon } = service
  const whatsapp = company.phone
    ? `https://wa.me/${company.phone.replace('+', '')}?text=${encodeURIComponent(`Hola, necesito ayuda con ${service.nav.toLowerCase()}`)}`
    : null
  const others = services.filter((s) => s.slug !== slug)

  return (
    <div className="market-home service-page">
      <Seo title={service.title} description={service.metaDescription} path={`/servicios/${service.slug}`} />
      <FaqSchema service={service} />

      <section className="service-hero">
        <p className="market-eyebrow market-eyebrow--light"><span /> Servicio en Valencia</p>
        <Icon size={40} aria-hidden="true" />
        <h1>{service.h1[0]}<br /><em>{service.h1[1]}</em></h1>
        <p className="service-hero__lead">{service.lead}</p>
        <div className="market-actions">
          {whatsapp && (
            <a className="market-button market-button--primary" href={whatsapp}>
              <MessageCircle size={17} /> Escribir por WhatsApp
            </a>
          )}
          <a className="market-button market-button--secondary" href="#contacto">
            Pedir presupuesto <ArrowRight size={16} />
          </a>
          {company.phone && (
            <a className="market-button market-button--secondary" href={`tel:${company.phone}`}>
              <Phone size={16} /> {company.phoneDisplay || 'Llamar'}
            </a>
          )}
        </div>
      </section>

      <section className="service-body">
        <div className="service-tasks">
          <p className="market-eyebrow"><span /> Qué hacemos</p>
          <h2>Trabajos<br /><em>habituales.</em></h2>
          <ul>
            {service.tasks.map((task) => (
              <li key={task}><Check size={16} aria-hidden="true" /> {task}</li>
            ))}
          </ul>
        </div>
        <div className="service-for">
          <p className="market-eyebrow"><span /> Para quién</p>
          <p>{service.forWho}</p>
          <div className="service-others">
            <small>OTROS SERVICIOS</small>
            {others.map((s) => (
              <Link key={s.slug} to={`/servicios/${s.slug}`}>{s.nav} <ArrowRight size={13} /></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="service-faqs">
        <p className="market-eyebrow"><span /> Preguntas frecuentes</p>
        <h2>Antes de<br /><em>llamarnos.</em></h2>
        <dl>
          {service.faqs.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="market-contact" id="contacto">
        <div className="market-contact__intro">
          <p className="market-eyebrow"><span /> Hablemos</p>
          <h2>Cuéntanos<br /><em>qué necesitas.</em></h2>
          <p>
            Explícanos la incidencia o el proyecto y te responderemos con los siguientes
            pasos y un presupuesto por escrito.
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
