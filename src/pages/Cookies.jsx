import LegalPage from './LegalPage.jsx'

export default function Cookies() {
  return (
    <LegalPage kicker="Transparencia digital" title="Política de cookies" updated="28 de junio de 2026">
      <section>
        <h2>1. Situación actual</h2>
        <p>Esta versión del sitio no instala cookies de analítica, publicidad, personalización ni seguimiento y no carga recursos de terceros destinados a observar la navegación.</p>
      </section>
      <section>
        <h2>2. Almacenamiento técnico</h2>
        <p>El navegador guarda localmente la clave <code>martega_cookie_notice_v1</code> para recordar que has cerrado el aviso informativo. No contiene identificadores personales, no se transmite a Martega y puede eliminarse desde la configuración del navegador.</p>
      </section>
      <section>
        <h2>3. Cambios futuros</h2>
        <p>Si en el futuro se incorporan herramientas no esenciales, permanecerán bloqueadas hasta obtener una elección válida. Se ofrecerán opciones equivalentes para aceptar o rechazar y la posibilidad de retirar el consentimiento en cualquier momento.</p>
      </section>
      <section>
        <h2>4. Cómo borrar datos locales</h2>
        <p>Puedes eliminar el almacenamiento del sitio desde los ajustes de privacidad de tu navegador. Al hacerlo, el aviso podrá volver a mostrarse.</p>
      </section>
    </LegalPage>
  )
}
