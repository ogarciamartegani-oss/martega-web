import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { LocalBusinessSchema } from './components/Seo.jsx'
import Home from './pages/Home.jsx'
import LegalNotice from './pages/LegalNotice.jsx'
import Privacy from './pages/Privacy.jsx'
import Cookies from './pages/Cookies.jsx'
import Accessibility from './pages/Accessibility.jsx'
import NotFound from './pages/NotFound.jsx'
import ServicePage from './pages/services/ServicePage.jsx'

// Portal de cliente en chunk aparte: arrastra @supabase/supabase-js
// y no debe penalizar la carga inicial de la web pública.
const ClientPortal = lazy(() => import('./pages/ClientPortal.jsx'))
const ClientAccess = lazy(() => import('./pages/ClientAccess.jsx'))

function ScrollAndTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    // Las páginas de servicio y la home gestionan su propio título vía <Seo />
    if (pathname.startsWith('/servicios/') || pathname === '/') return
    const titles = {
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
      <LocalBusinessSchema />
      <Routes>
        <Route
          path="/cliente/:token"
          element={<Suspense fallback={null}><ClientPortal /></Suspense>}
        />
        <Route
          path="/acceso"
          element={<Suspense fallback={null}><ClientAccess /></Suspense>}
        />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios/:slug" element={<ServicePage />} />
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
