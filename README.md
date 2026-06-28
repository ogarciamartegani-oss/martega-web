# Martega Web

Sitio corporativo público de Martega Instalaciones y Mantenimiento, S.L. Incluye captación de solicitudes en Supabase, consentimiento trazable, páginas legales, diseño responsive y accesibilidad.

## Arranque local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sin variables de Supabase la web funciona en modo demostración, pero el formulario informa de que la conexión está pendiente y no simula envíos.

## Conectar Supabase

1. Crear o elegir un proyecto Supabase alojado en una región de la UE. En este workspace, el desarrollo local reutiliza automáticamente las variables de `../martega-os/.env`.
2. Ejecutar `supabase/migrations/202606280001_solicitudes_web.sql` en SQL Editor.
3. Copiar `.env.example` como `.env.local`.
4. Completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con la URL y clave pública del proyecto.
5. Reiniciar el servidor local y enviar una solicitud de prueba.
6. Confirmar en Table Editor que se creó la fila.
7. Verificar con la clave pública que `select`, `update` y `delete` son rechazados.

La clave `service_role` nunca debe utilizarse en variables `VITE_*` ni incluirse en el frontend.

## Datos públicos obligatorios antes de publicar

Completar en `.env.local`:

- `VITE_COMPANY_TAX_ID`
- `VITE_CONTACT_EMAIL`
- `VITE_CONTACT_PHONE`
- `VITE_CONTACT_PHONE_DISPLAY`
- `VITE_PUBLIC_SITE_URL`

Después hay que sustituir el dominio provisional en `public/robots.txt` y `public/sitemap.xml` si el definitivo no es `martega.es`.

## Controles incorporados

- Supabase RLS activado y forzado.
- El rol público solo puede insertar columnas autorizadas.
- No existe acceso público de lectura, edición o borrado.
- Restricciones de longitud, formato y valores en la base de datos.
- Consentimiento comercial opcional e independiente.
- Registro de versión y fecha del aviso de privacidad.
- Campo trampa y tiempo mínimo básico contra robots.
- Sin analítica, fuentes externas ni cookies no esenciales.

Antes de campañas o tráfico relevante conviene interponer una Edge Function con Cloudflare Turnstile y limitación de frecuencia. El formulario actual prioriza una puesta en marcha sencilla, pero las políticas de base de datos no sustituyen la protección antiabuso.

## Revisión de cumplimiento previa al lanzamiento

Este proyecto facilita el cumplimiento, pero no reemplaza revisión jurídica profesional. Antes de publicar:

1. Validar NIF, correo, teléfono, domicilio y datos registrales.
2. Firmar/aceptar el DPA de Supabase y documentar subencargados y transferencias.
3. Mantener un registro interno de actividades de tratamiento.
4. Definir quién atiende derechos RGPD y el procedimiento de respuesta.
5. Definir y ejecutar el plazo de conservación; la función SQL de purga no queda programada automáticamente.
6. Mantener un procedimiento de incidentes y brechas de seguridad.
7. Recabar autorización antes de publicar fotografías, testimonios, nombres o ubicaciones de obras.
8. Si se añade analítica, mapas, vídeos o publicidad, implantar consentimiento previo y actualizar la política de cookies.
9. Configurar HTTPS, copias de seguridad y acceso administrativo con MFA.

## Comandos de calidad

```bash
npm run lint
npm run build
npm run preview
```
