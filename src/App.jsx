import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import LegalNotice from './pages/LegalNotice.jsx'
import Privacy from './pages/Privacy.jsx'
import Cookies from './pages/Cookies.jsx'
import Accessibility from './pages/Accessibility.jsx'
import NotFound from './pages/NotFound.jsx'
import ClientPortal from './pages/ClientPortal.jsx'
import ClientAccess from './pages/ClientAccess.jsx'

function ScrollAndTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const titles = {
      '/': 'Martega | Instalaciones, reformas y mantenimiento en Valencia',
      '/aviso-legal': 'Aviso legal | Martega',
      '/privacidad': 'Política de privacidad | Martega',
      '/cookies': 'Política de cookies | Martega',
      '/accesibilidad': 'Accesibilidad | Martega',
      '/acceso': 'Accede a tu obra | Martega',
    }
    document.title = pathname.startsWith('/cliente/')
      ? 'Tu obra | Martega'
      : titles[pathname] || 'Página no encontrada | Martega'
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollAndTitle />
      <Routes>
        <Route path="/cliente/:token" element={<ClientPortal />} />
        <Route path="/acceso" element={<ClientAccess />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aviso-legal" element={<LegalNotice />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/accesibilidad" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
