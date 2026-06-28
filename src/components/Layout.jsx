import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { HardHat, Menu, Phone, X } from 'lucide-react'
import Brand from './Brand.jsx'
import CookieNotice from './CookieNotice.jsx'
import { company } from '../config.js'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="site-shell">
      <header className="site-header">
        <Brand />
        <nav id="main-nav" className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Navegación principal">
          <a href="/#servicios" onClick={close}>Servicios</a>
          <a href="/#metodo" onClick={close}>Cómo trabajamos</a>
          <a href="/#proyectos" onClick={close}>Proyectos</a>
          <a href="/#contacto" onClick={close}>Contacto</a>
          <Link to="/acceso" onClick={close} className="nav-client-link">
            <HardHat size={14} aria-hidden="true" /> Mi obra
          </Link>
        </nav>
        {company.phone ? (
          <a className="header-phone" href={`tel:${company.phone}`}>
            <Phone size={17} aria-hidden="true" /> <span>{company.phoneDisplay || 'Llamar'}</span>
          </a>
        ) : (
          <a className="header-phone" href="/#contacto">Pedir valoración</a>
        )}
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav">
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          {open ? <X /> : <Menu />}
        </button>
      </header>

      <main id="contenido"><Outlet /></main>

      <footer className="site-footer">
        <div className="footer-main">
          <Brand inverse />
          <p>Instalaciones, reformas y mantenimiento integral para viviendas, negocios y comunidades en Valencia.</p>
          <a className="footer-cta" href="/#contacto">Cuéntanos qué necesitas <span aria-hidden="true">↗</span></a>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Martega</span>
          <nav aria-label="Información legal">
            <Link to="/aviso-legal">Aviso legal</Link>
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/accesibilidad">Accesibilidad</Link>
            <Link to="/acceso">Acceder a mi obra</Link>
          </nav>
        </div>
      </footer>
      <CookieNotice />
    </div>
  )
}
