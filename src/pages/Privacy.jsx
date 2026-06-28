import LegalPage from './LegalPage.jsx'
import { company } from '../config.js'

export default function Privacy() {
  return (
    <LegalPage kicker="Protección de datos" title="Política de privacidad" updated="28 de junio de 2026">
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p><strong>{company.legalName}</strong>, con domicilio en {company.address}. Contacto para privacidad: {company.email || '[CORREO PENDIENTE DE INCORPORAR ANTES DE PUBLICAR]'}.</p>
      </section>
      <section>
        <h2>2. Datos, finalidades y bases jurídicas</h2>
        <div className="legal-table-wrap"><table className="legal-table">
          <thead><tr><th>Tratamiento</th><th>Datos</th><th>Finalidad</th><th>Base jurídica</th></tr></thead>
          <tbody>
            <tr><td>Consultas y presupuestos</td><td>Identificación, contacto, ubicación aproximada y contenido de la consulta</td><td>Responder, valorar el trabajo y preparar una posible oferta</td><td>Medidas precontractuales solicitadas por la persona interesada</td></tr>
            <tr><td>Comunicaciones comerciales</td><td>Nombre y datos de contacto</td><td>Enviar novedades o información comercial</td><td>Consentimiento expreso y opcional</td></tr>
            <tr><td>Seguridad</td><td>Registros técnicos estrictamente necesarios</td><td>Prevenir abuso, fraude y proteger el servicio</td><td>Interés legítimo en garantizar la seguridad</td></tr>
          </tbody>
        </table></div>
      </section>
      <section>
        <h2>3. Conservación</h2>
        <p>Las consultas que no den lugar a contratación se conservarán durante un máximo de 12 meses desde su cierre, salvo que deban mantenerse bloqueadas para atender responsabilidades legales. Si existe contratación, los datos y documentos se conservarán durante los plazos exigidos por la normativa fiscal, mercantil y de defensa de reclamaciones. El consentimiento comercial se mantendrá hasta su retirada.</p>
      </section>
      <section>
        <h2>4. Destinatarios y encargados</h2>
        <p>Los datos no se venderán. Podrán acceder proveedores necesarios para prestar el servicio, como alojamiento web, base de datos, correo o soporte, bajo contratos de encargado del tratamiento. El formulario utiliza Supabase como proveedor de infraestructura de datos. Se configurará una región europea y se formalizará el correspondiente acuerdo de tratamiento.</p>
        <p>También podrán comunicarse datos cuando exista obligación legal o sean requeridos por una autoridad competente.</p>
      </section>
      <section>
        <h2>5. Transferencias internacionales</h2>
        <p>Cuando un proveedor trate datos fuera del Espacio Económico Europeo, se aplicará un mecanismo válido conforme al RGPD, como una decisión de adecuación o cláusulas contractuales tipo, junto con las garantías adicionales que procedan.</p>
      </section>
      <section>
        <h2>6. Derechos</h2>
        <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar un consentimiento, escribiendo al contacto indicado e identificando tu solicitud. La retirada no afecta a la licitud del tratamiento anterior.</p>
        <p>Si consideras que tus derechos no han sido atendidos, puedes reclamar ante la <a href="https://www.aepd.es" target="_blank" rel="noreferrer">Agencia Española de Protección de Datos</a>.</p>
      </section>
      <section>
        <h2>7. Carácter de los datos</h2>
        <p>Los campos señalados con asterisco son necesarios. Debes facilitar al menos un medio de contacto válido. No envíes información especialmente sensible, documentos de identidad, datos bancarios ni información de terceras personas mediante el formulario general.</p>
      </section>
      <section>
        <h2>8. Seguridad y cambios</h2>
        <p>Aplicamos medidas técnicas y organizativas proporcionadas al riesgo, incluyendo comunicaciones cifradas, control de acceso y permisos mínimos en la base de datos. Esta política podrá actualizarse cuando cambien los tratamientos, proveedores o requisitos legales.</p>
      </section>
    </LegalPage>
  )
}
