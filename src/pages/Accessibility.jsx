import LegalPage from './LegalPage.jsx'

export default function Accessibility() {
  return (
    <LegalPage kicker="Diseño inclusivo" title="Accesibilidad" updated="28 de junio de 2026">
      <section>
        <h2>Compromiso</h2>
        <p>Martega quiere que este sitio pueda utilizarse con independencia del dispositivo o de las capacidades de cada persona. La interfaz se ha diseñado tomando como referencia WCAG 2.2, nivel AA.</p>
      </section>
      <section>
        <h2>Medidas incorporadas</h2>
        <ul>
          <li>Navegación completa mediante teclado y enlace para saltar al contenido.</li>
          <li>Estructura semántica, etiquetas asociadas a formularios y mensajes de estado.</li>
          <li>Contraste suficiente, foco visible y contenido adaptable a pantallas pequeñas.</li>
          <li>Respeto a la preferencia del sistema para reducir animaciones.</li>
        </ul>
      </section>
      <section>
        <h2>Comunicar una dificultad</h2>
        <p>Si encuentras una barrera, indícanos la página, el problema y el navegador o dispositivo utilizado mediante los datos de contacto publicados en el aviso legal. Intentaremos ofrecer una alternativa accesible y corregir la incidencia.</p>
      </section>
    </LegalPage>
  )
}
