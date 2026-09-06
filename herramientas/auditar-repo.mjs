#!/usr/bin/env node
/*
  auditar-repo.mjs — comprueba que un repositorio cumple ESTRUCTURA.md y
  SEGURIDAD-BASE.md de NEXO HQ. Sin dependencias: solo Node ≥ 18 y git.

    node herramientas/auditar-repo.mjs [ruta-del-repo] [--estricto] [--json]

  Sale con 1 si hay algún ❌. Con --estricto, también si hay algún ⚠️.

  La fuente de este fichero es nexo-hq/herramientas/auditar-repo.mjs. Las
  copias que hay en cada repositorio se mantienen iguales a mano; el
  comprobador de nexo-hq avisa cuando una copia se queda atrás.

  Qué mira, y por qué cada cosa (la regla que cazó cada fallo está en
  SEGURIDAD-BASE.md):

    1  README.md y .gitignore con las cuatro familias que no se commitean
    2  ficheros rastreados que no deberían estarlo (.env, .db, claves, >10 MB,
       y los que .gitignore dice ignorar pero ya estaban dentro)
    3  secretos en el código: claves con formato conocido, JWT con rol que no
       sea anon, asignaciones largas con pinta de credencial
    4  cabeceras de seguridad en cada raíz de despliegue (vercel.json,
       next.config, middleware, _headers de Cloudflare)
    5  código de servidor dentro de una carpeta pública, y secretos en
       variables que viajan al navegador (NEXT_PUBLIC_*, VITE_*)
    6  hashes de la CSP: cada <script> en línea tiene que estar en la política
    7  higiene del HTML: target=_blank sin rel, javascript:, http:// en src
    8  comparaciones de secretos con === en vez de en tiempo constante
    9  integración continua que ejecute este mismo fichero

  Excepciones: un fichero AUDITAR.json en la raíz del repo con
    { "excepciones": [ { "regla": "cabeceras", "ruta": "sistema", "motivo": "…" } ] }
  Cada excepción exige motivo. Sin motivo, no vale.
*/

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const RAIZ = path.resolve(args.find(a => !a.startsWith('--')) || '.');
const ESTRICTO = args.includes('--estricto');
const JSON_SALIDA = args.includes('--json');
const VERSION = '2026-09-06.1';

// ── utilidades ────────────────────────────────────────────────────────────

const hallazgos = [];
const mal = (regla, ruta, texto) => hallazgos.push({ nivel: 'mal', regla, ruta, texto });
const ojo = (regla, ruta, texto) => hallazgos.push({ nivel: 'ojo', regla, ruta, texto });
const bien = (regla, ruta, texto) => hallazgos.push({ nivel: 'bien', regla, ruta, texto });

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

const leer = rel => {
  try { return readFileSync(path.join(RAIZ, rel), 'utf8'); } catch { return ''; }
};
const existe = rel => existsSync(path.join(RAIZ, rel));
const tamano = rel => { try { return statSync(path.join(RAIZ, rel)).size; } catch { return 0; } };

// Excepciones declaradas, con motivo obligatorio.
let excepciones = [];
if (existe('AUDITAR.json')) {
  try {
    const cfg = JSON.parse(leer('AUDITAR.json'));
    excepciones = (cfg.excepciones || []).filter(e => {
      if (!e.motivo || e.motivo.length < 15) {
        mal('excepciones', 'AUDITAR.json', `la excepción ${e.regla}:${e.ruta} no lleva motivo. Sin motivo no vale.`);
        return false;
      }
      return true;
    });
  } catch (e) {
    mal('excepciones', 'AUDITAR.json', `no se puede leer: ${e.message}`);
  }
}
const exento = (regla, ruta) => excepciones.some(e =>
  e.regla === regla && (ruta === e.ruta || ruta.startsWith(e.ruta.replace(/\/$/, '') + '/')));

// Solo ficheros rastreados: lo que no está en git no se publica.
const rastreados = git('ls-files -z').split('\0').filter(Boolean);
if (!rastreados.length) {
  console.error(`No parece un repositorio git con ficheros: ${RAIZ}`);
  process.exit(2);
}
const esTexto = rel => /\.(m?js|cjs|ts|tsx|jsx|json|jsonc|html?|css|md|txt|ya?ml|toml|sh|py|sql|env|example|mjs)$/i.test(rel)
  || /^\.env/.test(path.basename(rel)) || path.basename(rel) === '_headers';
// El propio comprobador lleva dentro los patrones que busca: no se audita a sí mismo.
const textoRastreado = rastreados.filter(f => esTexto(f) && tamano(f) < 2_000_000 && !/package-lock\.json$|auditar-repo\.mjs$/.test(f));

// ── 1 · README y .gitignore ───────────────────────────────────────────────

if (existe('README.md')) bien('readme', 'README.md', 'existe');
else mal('readme', 'README.md', 'no existe. Un repo sin README es un repo que nadie sabe qué es');

const gi = leer('.gitignore');
const familias = [
  ['.env', /^\s*\.env(\.\*|\*|$)/m, 'ficheros de entorno (.env, .env.*)'],
  ['db', /^\s*\*\.(db|sqlite3?)\s*$/m, 'bases de datos (*.db, *.sqlite)'],
  ['claves', /^\s*\*\.(pem|key)\s*$/m, 'claves privadas (*.pem, *.key)'],
  ['node_modules', /^\s*\/?node_modules\/?\s*$/m, 'node_modules'],
];
if (!gi) mal('gitignore', '.gitignore', 'no existe');
else for (const [id, re, nombre] of familias) {
  if (re.test(gi)) bien('gitignore', '.gitignore', `bloquea ${nombre}`);
  else mal('gitignore', '.gitignore', `no bloquea ${nombre}`);
}

// ── 2 · rastreados que no deberían ────────────────────────────────────────

const motivoDe = (regla, ruta) => (excepciones.find(e => e.regla === regla && (ruta === e.ruta || ruta.startsWith(e.ruta.replace(/\/$/, '') + '/'))) || {}).motivo;
for (const f of rastreados) {
  const base = path.basename(f);
  if (exento('rastreados', f)) { ojo('rastreados', f, `exento por AUDITAR.json: ${motivoDe('rastreados', f)}`); continue; }
  if (/^\.env(\..+)?$/.test(base) && !/example$/.test(base)) mal('rastreados', f, 'fichero de entorno rastreado. Solo se commitea el .example');
  if (/\.(db|sqlite3?|sqlite)$/i.test(base) && tamano(f) > 0) mal('rastreados', f, `base de datos rastreada (${(tamano(f) / 1024).toFixed(0)} KB). Nunca en git, aunque el repo sea privado`);
  if (/\.(pem|p12|pfx|jks|keystore)$/i.test(base) || /^id_(rsa|ed25519|ecdsa)$/.test(base)) mal('rastreados', f, 'clave privada o almacén de claves rastreado');
  if (base === 'credentials.json' || /^service-account.*\.json$/.test(base)) mal('rastreados', f, 'credencial de servicio rastreada');
  const t = tamano(f);
  if (t > 10 * 1024 * 1024) ojo('rastreados', f, `${(t / 1024 / 1024).toFixed(1)} MB. Un binario así no es código; mejor fuera del repo`);
}
// Lo que .gitignore dice ignorar pero ya estaba dentro: la regla no protege.
const ignoradosPeroDentro = git('ls-files -ci --exclude-standard').split('\n').filter(Boolean);
for (const f of ignoradosPeroDentro) {
  if (exento('rastreados', f)) continue;
  ojo('rastreados', f, 'está en .gitignore y aun así rastreado: la regla llegó tarde. Sigue en el historial');
}

// ── 3 · secretos ──────────────────────────────────────────────────────────

const formatos = [
  [/sk-(live|test|proj)-[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9]{32,}/, 'clave de OpenAI o Stripe'],
  [/ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/, 'token de GitHub'],
  [/AKIA[0-9A-Z]{16}/, 'clave de AWS'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'token de Slack'],
  [/AIza[0-9A-Za-z_-]{35}/, 'clave de Google'],
  [/-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, 'clave privada'],
  [/re_[A-Za-z0-9]{20,}/, 'clave de Resend'],
  [/postgres(ql)?:\/\/[^:\s'"]+:(?![A-Z_]+@|password@|PASSWORD@|contrase[nñ]a@|\$\{|\.\.\.)[^@\s'"]{8,}@/, 'URL de base de datos con contraseña'],
  [/https:\/\/[a-z0-9-]+:[A-Za-z0-9_-]{16,}@[a-z0-9.-]*upstash\.io/, 'URL de Upstash con token'],
];
const asignacion = /\b(?:api[_-]?key|secret|token|password|passwd|pin|clave|contrase[nñ]a)\w*\s*[:=]\s*["'`]([^"'`\s]{20,})["'`]/gi;
const entropiaAlta = v => /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v) && !/^[A-Z_]+$/.test(v) && !/\$\{|\{\{|process\.env|\.\.\./.test(v);

function decodificaJwt(tok) {
  try {
    const cuerpo = tok.split('.')[1];
    return JSON.parse(Buffer.from(cuerpo.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  } catch { return null; }
}

for (const f of textoRastreado) {
  if (f === path.relative(RAIZ, new URL(import.meta.url).pathname) || /auditar-repo\.mjs$/.test(f)) continue;
  if (/seguridad\.mjs$/.test(f)) continue; // el detector de la Escuela lleva los patrones dentro
  const txt = leer(f);
  if (!txt) continue;
  const lineas = txt.split('\n');
  lineas.forEach((l, i) => {
    for (const [re, nombre] of formatos) {
      if (re.test(l)) mal('secretos', `${f}:${i + 1}`, `${nombre}: «${l.trim().slice(0, 60)}…»`);
    }
    for (const m of l.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g)) {
      const cuerpo = decodificaJwt(m[0]);
      if (!cuerpo) continue;
      const rol = cuerpo.role || cuerpo.rol;
      if (rol && rol !== 'anon') mal('secretos', `${f}:${i + 1}`, `JWT con rol «${rol}» en el código. Solo la anon key puede viajar al navegador`);
      else if (!rol) ojo('secretos', `${f}:${i + 1}`, 'JWT sin rol reconocible. Comprobar qué es');
    }
    if (/\.md$/i.test(f)) return; // la prosa habla de tokens sin tenerlos
    for (const m of l.matchAll(asignacion)) {
      const v = m[1];
      if (entropiaAlta(v)) ojo('secretos', `${f}:${i + 1}`, `asignación con pinta de credencial: «${l.trim().slice(0, 70)}»`);
    }
  });
}
if (!hallazgos.some(h => h.regla === 'secretos' && h.nivel === 'mal')) bien('secretos', '.', `ningún secreto con formato conocido en ${textoRastreado.length} ficheros de texto`);

// ── 4 · cabeceras por raíz de despliegue ──────────────────────────────────

const REQUERIDAS = {
  'Content-Security-Policy': /frame-ancestors|default-src/,
  'Strict-Transport-Security': /max-age=\d{6,}/,
  'X-Content-Type-Options': /nosniff/,
  'X-Frame-Options': /DENY|SAMEORIGIN/,
  'Referrer-Policy': /strict-origin|no-referrer|same-origin/,
  'Permissions-Policy': /camera=\(\)/,
};

// Una raíz de despliegue es una carpeta con vercel.json, next.config.*,
// wrangler.jsonc o _headers. Cada una publica por su cuenta y cada una
// tiene que llevar sus cabeceras.
const raices = new Map();
for (const f of rastreados) {
  const base = path.basename(f);
  const dir = path.dirname(f);
  if (base === 'vercel.json' || /^next\.config\.(m?js|ts)$/.test(base) || base === 'wrangler.jsonc' || base === 'wrangler.toml' || base === '_headers') {
    if (!raices.has(dir)) raices.set(dir, { dir, ficheros: [] });
    raices.get(dir).ficheros.push(f);
  }
}
// Cloudflare sirve la carpeta assets.directory de wrangler: sus _headers
// cuentan para esa raíz, y un middleware de Next cuenta para su next.config.
function textoCabeceras(raiz) {
  let txt = '';
  for (const f of raiz.ficheros) txt += '\n' + leer(f);
  const candidatos = ['src/middleware.ts', 'src/middleware.js', 'middleware.ts', 'middleware.js'];
  for (const c of candidatos) {
    const rel = path.join(raiz.dir, c).replace(/^\.\//, '');
    if (rastreados.includes(rel)) txt += '\n' + leer(rel);
  }
  return txt;
}
function valorCabecera(txt, nombre) {
  const n = nombre.replace(/-/g, '[-]');
  const intentos = [
    // vercel.json / next.config: { key: "X", value: "…" }
    new RegExp(`["']key["']?\\s*:\\s*["']${n}["']\\s*,\\s*["']?value["']?\\s*:\\s*"([^"]+)"`, 'i'),
    new RegExp(`["']key["']?\\s*:\\s*["']${n}["']\\s*,\\s*["']?value["']?\\s*:\\s*'([^']+)'`, 'i'),
    new RegExp(`key\\s*:\\s*["']${n}["']\\s*,\\s*value\\s*:\\s*\`([^\`]+)\``, 'i'),
    // middleware: .set('X', '…') / .set("X", "…") / .set('X', IDENT)
    new RegExp(`\\.set\\(\\s*["']${n}["']\\s*,\\s*"([^"]+)"`, 'i'),
    new RegExp(`\\.set\\(\\s*["']${n}["']\\s*,\\s*'([^']+)'`, 'i'),
    new RegExp(`\\.set\\(\\s*["']${n}["']\\s*,\\s*([A-Za-z_$][\\w$]*)\\s*\\)`, 'i'),
    // _headers de Cloudflare: "  X: …"
    new RegExp(`^\\s*${n}\\s*:\\s*(.+)$`, 'im'),
  ];
  for (const re of intentos) {
    const m = txt.match(re);
    if (!m) continue;
    let v = m[1].trim();
    // Un identificador: buscar su definición como lista de cadenas unida.
    if (/^[A-Za-z_$][\w$]*$/.test(v)) {
      const def = txt.match(new RegExp(`const\\s+${v}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*\\.join\\(`));
      if (def) v = [...def[1].matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)].map(x => x[1] ?? x[2] ?? x[3]).join('; ');
      else {
        const def2 = txt.match(new RegExp(`const\\s+${v}\\s*=\\s*["'\`]([^"'\`]+)["'\`]`));
        v = def2 ? def2[1] : v;
      }
    }
    return v;
  }
  return '';
}

for (const raiz of raices.values()) {
  const etiqueta = raiz.dir === '.' ? '(raíz)' : raiz.dir;
  if (exento('cabeceras', raiz.dir)) { ojo('cabeceras', etiqueta, `exenta por AUDITAR.json: ${motivoDe('cabeceras', raiz.dir)}`); continue; }
  const esWrangler = raiz.ficheros.some(f => /wrangler/.test(f));
  const esSoloCron = raiz.ficheros.length === 1 && /vercel\.json$/.test(raiz.ficheros[0])
    && !/headers/.test(leer(raiz.ficheros[0])) && /"crons"/.test(leer(raiz.ficheros[0])) && !/next\.config/.test(raiz.ficheros.join());
  if (esWrangler && !raiz.ficheros.some(f => /_headers$/.test(f))) {
    // wrangler publica assets.directory; buscar allí el _headers
    const cfg = leer(raiz.ficheros.find(f => /wrangler/.test(f)));
    const m = cfg.match(/"directory"\s*:\s*"([^"]+)"/);
    if (m) {
      const h = path.join(raiz.dir, m[1], '_headers').replace(/^\.\//, '');
      if (rastreados.includes(h)) raiz.ficheros.push(h);
    }
  }
  const txt = textoCabeceras(raiz);
  const faltan = [];
  const cspTxt = valorCabecera(txt, 'Content-Security-Policy');
  for (const [nombre, re] of Object.entries(REQUERIDAS)) {
    let v = valorCabecera(txt, nombre);
    // Una CSP con frame-ancestors sustituye a X-Frame-Options.
    if (!v && nombre === 'X-Frame-Options' && /frame-ancestors\s+'none'/.test(cspTxt)) continue;
    if (!v) faltan.push(nombre);
    else if (!re.test(v)) faltan.push(`${nombre} (dice «${v.slice(0, 40)}»)`);
  }
  if (esSoloCron && faltan.length === Object.keys(REQUERIDAS).length) {
    ojo('cabeceras', etiqueta, 'vercel.json solo declara crons y no hay middleware: las cabeceras van en next.config o middleware, y aquí no aparecen');
    continue;
  }
  if (faltan.length) mal('cabeceras', etiqueta, `faltan: ${faltan.join(', ')}`);
  else bien('cabeceras', etiqueta, 'las seis cabeceras están');
  if (cspTxt && /script-src[^;]*'unsafe-inline'/.test(cspTxt)) ojo('cabeceras', etiqueta, "la CSP admite 'unsafe-inline' en script-src: protege del iframe y del object, no del XSS");
  if (cspTxt && /script-src[^;]*'unsafe-eval'/.test(cspTxt)) ojo('cabeceras', etiqueta, "la CSP admite 'unsafe-eval' en script-src");
  if (cspTxt && !/object-src\s+'none'/.test(cspTxt)) ojo('cabeceras', etiqueta, "la CSP no lleva object-src 'none'");
  if (cspTxt && !/base-uri/.test(cspTxt)) ojo('cabeceras', etiqueta, 'la CSP no lleva base-uri');
}
if (!raices.size) ojo('cabeceras', '.', 'no hay ninguna raíz de despliegue (vercel.json, next.config, wrangler, _headers): nada que publicar, nada que proteger');

// ── 5 · frontera entre navegador y servidor ───────────────────────────────

// 5a · en una raíz estática, el código de servidor vive en api/ y en nada más.
for (const raiz of raices.values()) {
  const cfg = raiz.ficheros.map(leer).join('\n');
  const esNext = raiz.ficheros.some(f => /next\.config/.test(f)) || /"framework"\s*:\s*"nextjs"/.test(cfg);
  if (esNext) continue;
  const prefijo = raiz.dir === '.' ? '' : raiz.dir + '/';
  // Un proyecto con build publica su salida, no sus fuentes.
  const pkg = leer(prefijo + 'package.json');
  if (pkg && /"build"\s*:/.test(pkg) && !/"outputDirectory"/.test(cfg)) continue;
  let salida = null;
  const m = cfg.match(/"outputDirectory"\s*:\s*"([^"]+)"/);
  if (m) salida = prefijo + m[1].replace(/\/$/, '') + '/';
  const publicados = rastreados.filter(f => f.startsWith(prefijo) && (!salida || f.startsWith(salida)) && /\.(m?js|cjs)$/.test(f)
    && !f.slice(prefijo.length).startsWith('api/') && !f.slice(prefijo.length).startsWith('node_modules/')
    && !/\.config\.(m?js|cjs|ts)$/.test(f));
  // Lo que .vercelignore excluye no se publica.
  const vi = leer(path.join(raiz.dir, '.vercelignore')).split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  const ignoradoVercel = f => {
    const rel = f.slice(prefijo.length);
    let ign = false;
    for (const regla of vi) {
      const neg = regla.startsWith('!');
      const pat = (neg ? regla.slice(1) : regla).replace(/\/$/, '');
      const glob = pat.replace(/\*\*/g, '§').replace(/\*/g, '[^/]*').replace(/§/g, '.*');
      const re = new RegExp(`^${glob}(/|$)`);
      if (re.test(rel)) ign = !neg;
    }
    return ign;
  };
  for (const f of publicados) {
    if (ignoradoVercel(f)) continue;
    if (exento('frontera', f)) { ojo('frontera', f, `exento por AUDITAR.json: ${motivoDe('frontera', f)}`); continue; }
    const txt = leer(f);
    if (/process\.env\.|from\s+['"]node:|require\(['"]node:|\bcreateServer\b/.test(txt)) {
      ojo('frontera', f, 'código de servidor (process.env / node:) dentro de una carpeta que se publica tal cual. Si es una herramienta, .vercelignore; si es una función, api/');
    }
  }
}

// 5b · variables públicas con nombre de secreto. Solo cuenta el código que
// se ejecuta: ni los .example, ni las pruebas, ni los comentarios.
for (const f of textoRastreado) {
  if (/\.md$|\.example$|\.test\.[cm]?[jt]sx?$/i.test(f)) continue;
  const txt = leer(f).split('\n').filter(l => !/^\s*(\/\/|#|\*|\/\*)/.test(l)).join('\n');
  for (const m of txt.matchAll(/\b(NEXT_PUBLIC|VITE|PUBLIC|REACT_APP)_([A-Z0-9_]+)/g)) {
    const nombre = m[2];
    if (/(SECRET|PASSWORD|PIN|SERVICE_ROLE|PRIVATE)/.test(nombre)) mal('frontera', f, `${m[0]}: una variable pública con nombre de secreto acaba en el bundle del navegador`);
    else if (/TOKEN/.test(nombre) && !/ANON|PUBLISH/.test(nombre)) ojo('frontera', f, `${m[0]}: ¿seguro que ese token puede ser público?`);
  }
  if (/service_role/i.test(txt) && !/\.sql$/i.test(f) && !/(README|\.md|\.env\.example|\.env\.local\.example)$/.test(f)
      && /("use client"|'use client'|<script|VITE_|window\.)/.test(txt)) {
    mal('frontera', f, 'service_role mencionado en código que llega al navegador');
  }
}
// 5c · Next: un fichero "use client" no importa acceso a datos.
for (const f of textoRastreado) {
  if (!/\.(tsx?|jsx?)$/.test(f)) continue;
  const txt = leer(f);
  if (!/^\s*["']use client["']/.test(txt)) continue;
  const malos = [];
  for (const m of txt.matchAll(/^import\s+(type\s+)?(\{[^}]*\}|[\w*$]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+['"]([^'"]+)['"]/gm)) {
    const soloTipos = m[1] || (m[2].startsWith('{') && m[2].slice(1, -1).split(',').map(x => x.trim()).filter(Boolean).every(x => /^type\s/.test(x)));
    if (soloTipos) continue;
    if (/(^pg$|@prisma\/client|@\/lib\/prisma|@\/lib\/db$|\/lib\/queries|@supabase\/supabase-js.*service|^node:)/.test(m[3])) malos.push(m[3]);
  }
  for (const s of malos) mal('frontera', f, `componente de navegador importando «${s}» sin "import type"`);
}

// ── 6 · hashes de la CSP ──────────────────────────────────────────────────

for (const raiz of raices.values()) {
  const txt = textoCabeceras(raiz);
  const csp = valorCabecera(txt, 'Content-Security-Policy');
  if (!csp) continue;
  const script = (csp.match(/script-src([^;]*)/) || [])[1] || '';
  if (/'unsafe-inline'/.test(script)) continue;
  const declarados = new Set([...script.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map(m => m[1]));
  const prefijo = raiz.dir === '.' ? '' : raiz.dir + '/';
  const cfg = raiz.ficheros.map(leer).join('\n');
  const m = cfg.match(/"outputDirectory"\s*:\s*"([^"]+)"/);
  const salida = m ? prefijo + m[1].replace(/\/$/, '') + '/' : prefijo;
  const htmls = rastreados.filter(f => f.startsWith(salida) && /\.html?$/.test(f));
  let inline = 0, sinHash = 0;
  for (const h of htmls) {
    const doc = leer(h);
    for (const s of doc.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (/type\s*=\s*["'](application\/(ld\+)?json|text\/template)["']/i.test(s[0])) continue;
      inline++;
      const hash = createHash('sha256').update(s[1]).digest('base64');
      if (!declarados.has(hash)) { sinHash++; if (sinHash <= 5) mal('csp-hashes', h, `un <script> en línea cuyo hash no está en la CSP: en producción no se ejecuta`); }
    }
  }
  if (inline && !sinHash) bien('csp-hashes', raiz.dir === '.' ? '(raíz)' : raiz.dir, `${inline} scripts en línea, todos en la CSP`);
  if (sinHash > 5) mal('csp-hashes', raiz.dir, `…y ${sinHash - 5} más`);
}

// ── 7 · higiene del HTML ──────────────────────────────────────────────────

let htmlMirados = 0;
for (const f of rastreados) {
  if (!/\.html?$/.test(f) || /node_modules|zonas-privadas|_files\//.test(f)) continue;
  if (exento('html', f)) continue;
  const doc = leer(f);
  if (!doc) continue;
  htmlMirados++;
  const lineas = doc.split('\n');
  lineas.forEach((l, i) => {
    for (const a of l.matchAll(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi)) {
      if (!/rel\s*=\s*["'][^"']*noopener/.test(a[0])) ojo('html', `${f}:${i + 1}`, 'target="_blank" sin rel="noopener"');
    }
    if (/href\s*=\s*["']\s*javascript:/i.test(l)) mal('html', `${f}:${i + 1}`, 'enlace javascript:');
    if (/<(script|link|img|iframe)\b[^>]*(src|href)\s*=\s*["']http:\/\//i.test(l)) mal('html', `${f}:${i + 1}`, 'recurso cargado por http:// sin cifrar');
  });
}
if (htmlMirados && !hallazgos.some(h => h.regla === 'html' && h.nivel === 'mal')) bien('html', '.', `${htmlMirados} páginas sin javascript: ni http://`);

// ── 8 · secretos comparados con === ───────────────────────────────────────

for (const f of textoRastreado) {
  if (!/\.(m?js|cjs|ts)$/.test(f) || /\.test\.|\/pruebas\/|node_modules/.test(f)) continue;
  const txt = leer(f);
  txt.split('\n').forEach((l, i) => {
    if (/(TOKEN|SECRET|PIN|PASSWORD|CLAVE|PASE|API_KEY)\w*\b[^\n]*(===|!==|==|!=)|(===|!==|==|!=)\s*[^\n]*process\.env\.\w*(TOKEN|SECRET|PIN|PASSWORD|CLAVE|PASE|KEY)/.test(l)
        && /process\.env|secret\b|token\b|\bpin\b|pase\b/i.test(l) && !/timingSafeEqual|safeEqual|igualdadConstante|length/.test(l)
        && !/^\s*(\/\/|\*|#)/.test(l) && !/typeof|===\s*(undefined|null|''|"")|!==\s*(undefined|null|''|"")|\.length/.test(l)) {
      ojo('tiempo-constante', `${f}:${i + 1}`, `un secreto comparado con ===: se adivina carácter a carácter cronometrando. Usar timingSafeEqual: «${l.trim().slice(0, 70)}»`);
    }
  });
}

// ── 9 · integración continua ──────────────────────────────────────────────

const flujos = rastreados.filter(f => /^\.github\/workflows\/.*\.ya?ml$/.test(f));
if (!flujos.length) ojo('ci', '.github/workflows', 'no hay integración continua: este fichero solo corre cuando alguien se acuerda');
else if (flujos.some(f => /auditar-repo/.test(leer(f)))) bien('ci', flujos.find(f => /auditar-repo/.test(leer(f))), 'ejecuta auditar-repo.mjs en cada push');
else ojo('ci', flujos[0], 'hay CI pero no ejecuta auditar-repo.mjs');

// Copias del comprobador: tienen que ser iguales a la fuente.
const yo = readFileSync(new URL(import.meta.url), 'utf8');
for (const f of rastreados) {
  if (/auditar-repo\.mjs$/.test(f) && path.resolve(RAIZ, f) !== path.resolve(new URL(import.meta.url).pathname) && leer(f) !== yo) {
    ojo('ci', f, `copia del comprobador distinta de la que se está ejecutando (versión fuente ${VERSION})`);
  }
}

// ── salida ────────────────────────────────────────────────────────────────

const nMal = hallazgos.filter(h => h.nivel === 'mal').length;
const nOjo = hallazgos.filter(h => h.nivel === 'ojo').length;
const nBien = hallazgos.filter(h => h.nivel === 'bien').length;

if (JSON_SALIDA) {
  console.log(JSON.stringify({ repo: RAIZ, version: VERSION, mal: nMal, ojo: nOjo, bien: nBien, hallazgos }, null, 2));
} else {
  const icono = { mal: '❌', ojo: '⚠️ ', bien: '✅' };
  console.log(`\nauditar-repo ${VERSION} · ${path.basename(RAIZ)} · ${rastreados.length} ficheros rastreados\n`);
  const porRegla = new Map();
  for (const h of hallazgos) { if (!porRegla.has(h.regla)) porRegla.set(h.regla, []); porRegla.get(h.regla).push(h); }
  for (const [regla, lista] of porRegla) {
    console.log(`── ${regla}`);
    for (const h of lista) console.log(`  ${icono[h.nivel]} ${h.ruta} — ${h.texto}`);
  }
  console.log(`\n${nMal} ❌ · ${nOjo} ⚠️ · ${nBien} ✅${ESTRICTO ? ' · modo estricto' : ''}\n`);
}
process.exit(nMal || (ESTRICTO && nOjo) ? 1 : 0);
