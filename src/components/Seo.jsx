import { useEffect } from 'react'
import { company } from '../config.js'

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Actualiza título, descripción, canonical y Open Graph por ruta.
 */
export default function Seo({ title, description, path = '/' }) {
  useEffect(() => {
    const url = `${company.siteUrl}${path}`
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, path])

  return null
}

/**
 * JSON-LD LocalBusiness — se inyecta una vez a nivel de aplicación.
 */
export function LocalBusinessSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: 'Martega',
      legalName: company.legalName,
      url: company.siteUrl,
      image: `${company.siteUrl}/hero-maintenance-v2.jpg`,
      description:
        'Mantenimiento técnico y reformas para viviendas, negocios, comunidades e inmuebles en Valencia. Electricidad, fontanería, climatización y multiservicio.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'C/ Mayor de Nazaret, 4',
        postalCode: '46024',
        addressLocality: 'València',
        addressRegion: 'Comunidad Valenciana',
        addressCountry: 'ES',
      },
      areaServed: { '@type': 'City', name: 'Valencia' },
      knowsAbout: ['Electricidad', 'Fontanería', 'Climatización', 'Reformas', 'Mantenimiento de edificios'],
      ...(company.phone ? { telephone: company.phone } : {}),
      ...(company.email ? { email: company.email } : {}),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'ld-local-business'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])

  return null
}
