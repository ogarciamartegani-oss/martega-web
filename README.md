# Martega Web

Sitio corporativo público de Martega Instalaciones y Mantenimiento, S.L. Incluye captación de solicitudes en Supabase, consentimiento trazable, páginas legales, diseño responsive y accesibilidad.

## Estado

Este repositorio no tiene `MEMORIA_ACTIVA.md`: el estado con fecha se deja
aquí. Lo nuevo va arriba; lo que deja de ser verdad se tacha, no se borra.

### 2026-09-06 · `ignoreCommand`: el guardián de builds, puesto

- **Resuelto el pendiente de abajo.** `vercel.json` ya lleva `ignoreCommand`
  con el patrón de `nexo-hq/proyectos/nordic-boats/web`. Cada push dejaba un
  build; ahora solo lo deja si el push tocó algo que se publica.
- **El sentido de la salida, que es lo único que hay que no equivocar.**
  `ignoreCommand` **sale 0 → se salta el build** (el despliegue queda en
  `CANCELED`, que no es un fallo); **sale 1 → construye**. Está al revés de lo
  que pide el cuerpo, así que aquí queda escrito: `git diff --quiet` sale 0
  cuando **no hay diferencias**, y eso es exactamente cuando no queremos
  construir. Los dos encajan sin invertir nada. Si alguien se equivoca de
  sentido, la web deja de desplegarse y nadie se entera: esto es producción y
  el único repositorio público de la cuenta.
- **Se compara contra `VERCEL_GIT_PREVIOUS_SHA`, no contra `HEAD^`.** El
  patrón `git diff --quiet HEAD^ HEAD -- .` está roto: solo mira la última
  commit del push. Con la regla de la casa de **un push por tarea**, y con la
  costumbre de dejar la nota de estado en el último commit, el caso normal es
  un push cuyo último commit toca solo este README — y ese patrón se saltaría
  un despliegue real. Comprobado antes de escribir esto sobre commits de
  prueba: base = commit de código + commit de README; `HEAD^ HEAD` dijo saltar
  (mal), `VERCEL_GIT_PREVIOUS_SHA` dijo construir (bien).
- **Si no hay base conocida, se construye. Nunca al revés.** Vercel clona en
  superficial y ese commit puede no estar en el clon (`fatal: bad object`), o
  la variable puede venir vacía en el primer despliegue de una rama. Por eso
  `git cat-file -e "$B^{commit}" || exit 1` va **antes** del diff: sin base
  fiable no se decide, se construye. No se pone el respaldo `:-HEAD^` de
  nordic-boats justamente porque ese respaldo es el patrón roto de arriba;
  cuesta como mucho un build de más por rama nueva, y a cambio no se pierde
  ninguno.
- **Qué rutas mira.** Aquí la raíz de despliegue es la raíz del repositorio, así
  que `-- .` a secas incluiría documentación y CI. Se excluye lo que no entra
  en `vite build`: `*.md` de la raíz, `.github/`, `herramientas/`, `supabase/`,
  `.env.example` y `eslint.config.js`. Es una lista de **exclusiones**, no de
  inclusiones, a propósito: lo que se añada mañana y no esté contemplado cuenta
  como publicable y **construye**. Con una lista de inclusiones, una carpeta
  nueva se quedaría fuera en silencio, que es el fallo caro.
- **`ignoreCommand` no puede pasar de 256 caracteres.** No está en las
  CONVENCIONES y costó un despliegue en `ERROR`: la primera versión medía 260
  y Vercel la rechazó entera con *«`vercel.json` schema validation failed:
  `ignoreCommand` should NOT be longer than 256 characters»*. Falla en la
  validación del fichero, **antes de construir**, así que el despliegue no
  llegó a promocionarse y producción siguió sirviendo el build anterior; no
  hubo caída, pero tampoco guardián. Se arregla usando la forma corta `:!` en
  lugar de `:(exclude)`, que es el mismo pathspec: 205 caracteres, las seis
  exclusiones intactas. **Si mañana hay que añadir exclusiones, hay que contar
  los caracteres**, o la protección se cae entera sin avisar.
- **Verificado en Vercel, no solo en local.** El despliegue de `55a0980`
  (`READY`, producción) registra en el log la línea `Running "B="${VERCEL_GIT_
  PREVIOUS_SHA:-}"; …"` y a continuación `Running "vercel build"`: el guardián
  se ejecuta y deja pasar el build, que es lo correcto porque ese push tocaba
  `vercel.json`. Eso prueba el sentido «construye». El sentido «salta» se
  prueba con **este mismo push**, que solo toca este README —una ruta
  excluida— y por tanto debe quedar en `CANCELED`. Era la parte que faltaba
  por comprobar de verdad: en local la base siempre está, pero Vercel clona en
  superficial, y si `VERCEL_GIT_PREVIOUS_SHA` no resolviera allí, el guardián
  construiría siempre y no ahorraría nada sin que se notara.
- **Probado antes de empujar**, ejecutando el comando extraído del JSON con
  `sh -c` y `VERCEL_GIT_PREVIOUS_SHA` puesta a mano: push solo de
  documentación → salta; push mixto con código → construye; `public/` →
  construye; solo `vercel.json` → construye; base vacía, base fuera del clon y
  base no-sha → construye; sin cambios → salta. `auditar-repo.mjs` sigue en
  verde (0 ❌, 0 ⚠️): las seis cabeceras no se han tocado.

### 2026-09-06 · Las seis cabeceras, ya en `main`

- **Fusionado el PR #1** (`claude/code-structure-security-akes7x`). Añade CSP,
  HSTS y Permissions-Policy a las tres cabeceras que ya había en
  `vercel.json`, el flujo `Seguridad` (lint + build + `auditar-repo.mjs`) en
  cada push, `ESTRUCTURA.md` y las cuatro familias de secretos en
  `.gitignore`. La rama se queda: aquí no se borra nada.
- **Cómo se comprobó, y no leyendo el código.** `npm run lint`, `npm run
  build` y `node herramientas/auditar-repo.mjs .` en verde (0 ❌, 0 ⚠️). El
  `dist/` se sirvió en local con las cabeceras reales de `vercel.json` y se
  abrió en un navegador: portada, `/servicios/electricidad` y `/acceso` (que
  es la que carga el trozo de Supabase) sin una sola violación de CSP en
  consola. Los dos `<script type="application/ld+json">` que la web inyecta
  desde JavaScript siguen en el DOM — son datos, no se ejecutan, y la CSP no
  los toca. La hoja de Google Fonts entra por `@import` desde el CSS
  compilado y sus 57 tipografías cargan desde `fonts.gstatic.com`.
- **Por qué la CSP es la que es.** No hay ni un `<script>` en línea: Vite
  emite ficheros propios bajo `/assets`. Lo externo son Google Fonts (hoja y
  fuentes), Supabase por REST — sin `realtime`, luego sin `wss:`, por eso
  `connect-src` con `https://*.supabase.co` basta — y los enlaces `wa.me`,
  que son navegación y no recurso, así que ninguna directiva los mira.

### Pendiente, sin decidir

- ~~**`vercel.json` sigue sin `ignoreCommand`**, contra las CONVENCIONES: cada
  push construye aunque no se haya tocado nada que se publique. Se deja fuera
  del PR #1 a propósito, para no mezclar cabeceras con despliegue. Queda
  abierto: es un cambio de una línea y una tarea propia.~~ → Hecho el
  2026-09-06, en su tarea propia como se dijo. Ver la sección de arriba.

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

## Fuente y espejo

Este repositorio es **la fuente**. La copia en `nexo-hq/proyectos/martega/web`
es un espejo: se trabaja aquí y se copia allí. Qué es cada carpeta y dónde
acaba la frontera entre navegador y servidor, en `ESTRUCTURA.md`; la revisión
de seguridad que corre en cada push, `node herramientas/auditar-repo.mjs .`.
