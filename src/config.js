const cleanPhone = (value = '') => value.replace(/[^\d+]/g, '')

export const company = {
  legalName: 'MARTEGA INSTALACIONES Y MANTENIMIENTO, S.L.',
  brand: 'MARTEGA',
  taxId: import.meta.env.VITE_COMPANY_TAX_ID || '',
  address: 'C/ Mayor de Nazaret, 4, 46024 València',
  registry: 'Registro Mercantil de Valencia, tomo/hoja H V 224776, inscripción 1',
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  phone: cleanPhone(import.meta.env.VITE_CONTACT_PHONE),
  phoneDisplay: import.meta.env.VITE_CONTACT_PHONE_DISPLAY || '',
  siteUrl: import.meta.env.VITE_PUBLIC_SITE_URL || 'https://martega-web.vercel.app',
  privacyVersion: '2026-06-28',
}

export const isPublicConfigComplete = Boolean(company.taxId && company.email && company.phone)
