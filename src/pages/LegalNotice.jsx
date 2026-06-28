import LegalPage from './LegalPage.jsx'
import { company } from '../config.js'

export default function LegalNotice() {
  return (
    <LegalPage kicker="Información jurídica" title="Aviso legal" updated="28 de junio de 2026">
      <section>
        <h2>1. Titular del sitio web</h2>
        <p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico, se informa de los siguientes datos:</p>
        <dl className="legal-data">
          <div><dt>Denominación social</dt><dd>{company.legalName}</dd></div>
          <div><dt>NIF</dt><dd>{company.taxId || '[PENDIENTE DE INCORPORAR ANTES DE PUBLICAR]'}</dd></div>
          <div><dt>Domicilio</dt><dd>{company.address}</dd></div>
          <div><dt>Registro</dt><dd>{company.registry}</dd></div>
          <div><dt>Correo electrónico</dt><dd>{company.email || '[PENDIENTE DE INCORPORAR ANTES DE PUBLICAR]'}</dd></div>
          <div><dt>Teléfono</dt><dd>{company.phoneDisplay || '[PENDIENTE DE INCORPORAR ANTES DE PUBLICAR]'}</dd></div>
        </dl>
      </section>
      <section>
        <h2>2. Objeto y condiciones de uso</h2>
        <p>Este sitio ofrece información sobre los servicios de instalaciones, construcción, reformas, conservación y mantenimiento prestados por Martega. El acceso implica la aceptación de este aviso. La información publicada tiene carácter general y no constituye por sí sola una oferta contractual ni un presupuesto.</p>
      </section>
      <section>
        <h2>3. Presupuestos y contratación</h2>
        <p>Las solicitudes enviadas mediante la web no generan una relación contractual automática. Todo trabajo estará sujeto a valoración técnica, disponibilidad, definición de alcance y aceptación expresa de un presupuesto o contrato.</p>
      </section>
      <section>
        <h2>4. Propiedad intelectual</h2>
        <p>Los textos, identidad gráfica, fotografías y demás contenidos propios pertenecen a Martega o se utilizan con autorización. No se permite su reproducción, transformación o explotación comercial sin permiso previo, salvo los usos permitidos por la ley.</p>
      </section>
      <section>
        <h2>5. Responsabilidad y enlaces</h2>
        <p>Martega procura mantener la información actualizada y el sitio disponible, pero no garantiza la ausencia absoluta de errores o interrupciones. Los enlaces externos, cuando existan, se facilitan como referencia y no implican control sobre sus contenidos.</p>
      </section>
      <section>
        <h2>6. Legislación aplicable</h2>
        <p>El sitio se rige por la legislación española. Las controversias se someterán a los juzgados y tribunales que resulten competentes conforme a la normativa de consumidores y usuarios y demás legislación aplicable.</p>
      </section>
    </LegalPage>
  )
}
