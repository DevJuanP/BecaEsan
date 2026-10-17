# Simulador Beca BCP / ESAN

App web estática mobile-first que genera ensayos de opción múltiple (A–E) desde [`docs/preguntas/`](docs/preguntas/README.md) (28 temáticas · 140 preguntas), con selección aleatoria por bloques, puntaje configurable y resultados por área.

- **Home:** saludo editable (nombre persistente), modo del quiz (solo RM / solo RV / completo), sliders de temas (RM 1–17, RV 1–11) y de preguntas por tema (1–5), puntajes configurables (+5 / 0 / −2 por defecto) y «Iniciar quiz».
- **Quiz:** un bloque por temática con sus preguntas del intento, alternativas A–E, cronómetro informativo, progreso y navegación «Atrás» / «Continuar» / «Ver resultados».
- **Resultados:** puntaje total con la escala usada y el tiempo, tarjeta por área con % de aciertos, erróneas y no respondidas (suman 100 %) y botón «Home» para repetir con preguntas nuevas.

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

El deploy es **manual** y se hace en **Cloudflare Pages** (plan gratuito, CDN con presencia en Lima). El runbook paso a paso vive en la sección siguiente y el detalle de la decisión de stack en [`docs/especificaciones/06`](docs/especificaciones/06-stack.md) §6.6.

### Runbook (Cloudflare Pages)

1. Sube el repositorio a GitHub (ya está: `origin` → `https://github.com/DevJuanP/BecaEsan.git`) y entra al panel de Cloudflare.
2. **Workers & Pages → Create → Pages → Connect to Git** y selecciona el repositorio.
3. Configura el proyecto:
   - *Build command*: `npm run build`
   - *Output directory*: `dist`
   - *Node.js version*: LTS (≥ 22) — variable de entorno `NODE_VERSION` = `22` si el panel no la detecta.
4. Guarda y espera el primer build: cada `push` a `main` publica automáticamente y cada rama/PR obtiene una URL de vista previa.
5. **Smoke test** en la URL `*.pages.dev`: HTTPS, carga en menos de 1 s, las tres pantallas funcionando, assets con hash y sin fuentes web (ver la lista exacta en [`docs/plans/08-calidad-y-despliegue.md`](docs/plans/08-calidad-y-despliegue.md) §8, T-8.7).

> Este runbook se verifica en local (build limpio + `npm run preview`) antes de entregarse; el deploy real lo ejecuta el usuario.

## Documentación

- Especificaciones (qué y por qué): [`docs/especificaciones/`](docs/especificaciones/README.md)
- Planes de ejecución y estado: [`docs/plans/`](docs/plans/README.md)
- Material de preguntas (fuente única, solo lectura): [`docs/preguntas/`](docs/preguntas/README.md)
- Sistema visual del build real: [`DESIGN.md`](DESIGN.md)
