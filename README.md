# Simulador Beca BCP / ESAN

App web estática mobile-first que genera ensayos de opción múltiple (A–E) desde [`docs/preguntas/`](docs/preguntas/README.md) (28 temáticas · 140 preguntas), con selección aleatoria por bloques, puntaje configurable y resultados por área.

- **Home:** saludo editable (nombre persistente), modo del quiz (solo RM / solo RV / completo), sliders de temas (RM 1–17, RV 1–11) y de preguntas por tema (1–5), puntajes configurables (+5 / 0 / −2 por defecto) y «Iniciar quiz».
- **Quiz:** un bloque por temática con sus preguntas del intento, alternativas A–E, cronómetro informativo, progreso y navegación «Atrás» / «Continuar» / «Ver resultados».
- **Resultados:** puntaje total con la escala usada y el tiempo, tarjeta por área con % de aciertos, erróneas y no respondidas (suman 100 %), revisión opcional de cada pregunta con la clave y su explicación, y botón «Home» para repetir con preguntas nuevas.

Sin backend, sin cuentas y sin historial: todo el estado vive en el navegador (v1, ver [`docs/especificaciones/01`](docs/especificaciones/01-vision-y-alcance.md) §1.5).

## Requisitos

- **Node.js LTS ≥ 22** (probado con Node 24).
- npm (viene con Node).

## Comandos

```bash
npm ci          # instala dependencias desde package-lock.json
npm run dev     # desarrollo: genera los datos y sirve con Vite (http://localhost:5173)
npm run build   # build de producción a dist/ (valida y genera src/data/questions.json)
npm run preview # sirve dist/ localmente (para comprobar el build)
npm run test    # pruebas Vitest de la lógica pura (generación, puntaje, formato, parser)
npm run check   # verificación de tipos (svelte-check + tsc)
```

Notas:

- `npm run dev` y `npm run build` ejecutan antes `scripts/build-questions.mjs`, que **extrae y valida** el material de `docs/preguntas/` y genera `src/data/questions.json` (artefacto generado: no se edita a mano ni se versiona). Si un archivo del material incumple el contrato de datos, el comando falla indicando archivo y problema.
- El quiz de desarrollo tiene una galería de componentes en `http://localhost:5173/#dev` (solo en desarrollo; no entra al bundle de producción).

## Estructura

```
scripts/build-questions.mjs   # docs/preguntas/*.md → src/data/questions.json (con validaciones)
src/
├── App.svelte                # máquina de estados: home | quiz | resultados
├── app.css                   # Tailwind 4 + tokens del sistema visual
├── components/               # home/, quiz/, results/, ui/ (catálogo) y dev/ (galería)
├── data/questions.json       # GENERADO por el script de build — no editar
└── lib/                      # tipos, generador aleatorio, puntaje, formato, persistencia, estado
docs/
├── preguntas/                # material fuente (solo lectura, 28 temáticas · 140 preguntas)
├── especificaciones/         # qué se construye y por qué (01–07)
└── plans/                    # planes de ejecución, estados y desvíos
```

## Deploy

El deploy es **manual** y se hace en **Cloudflare Pages** (plan gratuito, CDN con presencia en Lima). El detalle de la decisión de stack está en [`docs/especificaciones/06`](docs/especificaciones/06-stack.md) §6.6.

### Runbook (Cloudflare Pages)

> Verificado en local desde un **clon limpio** (`git clone` → `npm ci` → `npm run build`): el banco de preguntas y `dist/` se regeneran solos, sin pasos manuales, y el build es reproducible (mismos hashes de assets).

1. **Repositorio:** ya está publicado en GitHub — `origin` → `https://github.com/DevJuanP/BecaEsan.git`, rama `main`.
2. **Panel de Cloudflare:** entra a *Workers & Pages → Create → Pages → Connect to Git* y autoriza/selecciona el repositorio `DevJuanP/BecaEsan`.
3. **Configuración del proyecto:**
   - *Production branch*: `main`
   - *Build command*: `npm run build`
   - *Build output directory*: `dist`
   - *Root directory*: `/` (por defecto)
   - *Node.js version*: LTS ≥ 22 — añade la variable de entorno `NODE_VERSION` = `22` si el panel no la detecta.
4. **Guardar y desplegar:** el primer build publica la URL `https://<proyecto>.pages.dev` con HTTPS. A partir de ahí, cada `push` a `main` publica automáticamente y cada rama/PR obtiene una URL de vista previa.
5. **Smoke test en la URL publicada** (lo ejecuta quien despliega):
   - La app carga por HTTPS en menos de 1 s y sin errores en la consola del navegador.
   - `Home`: saludo «Hola», panel de configuración y «Iniciar quiz» operativos.
   - `Quiz`: un bloque con sus preguntas y alternativas, cronómetro, «Atrás»/«Continuar» y el aviso al recargar a mitad del intento.
   - `Resultados`: puntaje total, tarjetas por área con porcentajes que suman 100 % y botón «Home».
   - En la pestaña *Network*: los assets llevan hash (`index-*.js`, `index-*.css`) y **no** hay peticiones de fuentes ni de imágenes raster.
6. **Pendiente manual del usuario:** ejecutar este runbook y validar la URL publicada; queda registrado en el informe de cierre (`docs/plans/08-calidad-y-despliegue.md` §8).

> La app es 100 % estática: si más adelante se cambia de plataforma (GitHub Pages, Vercel, Netlify), basta reconfigurar el pipeline — `npm run build` → `dist/` — sin tocar código.

## Documentación

- Especificaciones (qué y por qué): [`docs/especificaciones/`](docs/especificaciones/README.md)
- Planes de ejecución y estado: [`docs/plans/`](docs/plans/README.md)
- Material de preguntas (fuente única, solo lectura): [`docs/preguntas/`](docs/preguntas/README.md)
- Sistema visual del build real: [`DESIGN.md`](DESIGN.md)
