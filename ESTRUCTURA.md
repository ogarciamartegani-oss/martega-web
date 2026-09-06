# Estructura · martega-web

Sigue `nexo-hq/ESTRUCTURA.md`. Este repositorio es **la fuente** de la web de
Martega; `nexo-hq/proyectos/martega/web` es su **espejo** y no despliega nada
(CONVENCIONES §1: Martega partida en dos repos se queda como está).

| Capa | Dónde | Qué |
|---|---|---|
| **Navegador** | `src/`, `public/`, `index.html` | React + Vite. Solo habla con Supabase con la `anon key`, sin sesión |
| **Servidor** | `supabase/migrations/` | El esquema y las políticas RLS de `solicitudes_web`: inserción sin lectura para `anon` |
| **Despliegue** | `vercel.json` | Cabeceras de seguridad, la SPA y las redirecciones a `martega-app` |
| **Herramientas** | `herramientas/`, `eslint.config.js`, `vite.config.js` | No se publican: Vercel sirve `dist/` |
| **Documentos** | `README.md`, `LEGAL_LAUNCH_CHECKLIST.md`, este fichero | |

Lo que el navegador **no** tiene: ninguna clave `service_role`, ninguna
variable `VITE_*` con nombre de secreto, ninguna función. El portal de
cliente llama a la RPC `get_client_portal`, que vive en la base de datos de
`martega-os`, no aquí: si cambia allí, esto se entera al abrir la página.

Comprobación: `node herramientas/auditar-repo.mjs .`
