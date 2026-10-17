# 06 — Stack tecnológico

Decisión de stack para la app descrita en `01`–`05`. Requisitos que la condicionan: **app web estática, sin backend, mobile-first y muy rápida**, con **deploy gratuito**. Uso esperado: personal, pocas personas a la vez.

## 6.1 Resumen de la decisión

| Capa | Elección | Por qué |
|---|---|---|
| Lenguaje | **TypeScript** | Los contratos de datos (`03`) quedan verificados en tiempo de compilación; menos errores en puntaje y selección aleatoria. |
| Build | **Vite** (última estable) | Arranque de desarrollo instantáneo, builds mínimos y `dist/` 100 % estático. Es el flujo oficial para Svelte sin SvelteKit. |
| UI | **Svelte 5** (runes `$state`, `$derived`) | Compila a JavaScript optimizado sin DOM virtual: el bundle más pequeño posible para esta app; el estado (configuración → intento → resultados) se modela directo, sin librerías. |
| Estilos | **Tailwind CSS 4** + CSS propio puntual | Utilidades con *purge* (CSS final muy pequeño) y CSS custom para el slider (referencia CodePen de `05`). Los tokens (colores, tipografía) serán variables CSS definidas en `07-design.md`. |
| Datos | **Script Node de construcción** (`docs/preguntas` → JSON) | Extrae y **valida** el material en build (contrato de `03`, §3.6); si algo no cuadra, el build falla con mensaje claro. Cero dependencias en runtime. |
| Estado | **Runes de Svelte** | El estado es pequeño (config, intento, resultados). Redux/Zustand/Pinia serían sobreingeniería. |
| Rutas | **Sin router** | Una sola página con máquina de estados (`home | quiz | resultados`). No hay URLs que compartir ni SEO que cuidar. |
| Persistencia | **localStorage** (solo nombre en v1) | Cumple RNF-04. La configuración persistente sigue como candidata. |
| Pruebas | **Vitest** (lógica pura) | La selección aleatoria y el puntaje son las reglas críticas (RN-02, RN-04, RN-07 a RN-09) y se prueban sin navegador. |
| Deploy | **Cloudflare Pages** | Gratis, CDN con presencia en **Lima** (mínima latencia desde Perú), HTTPS y subdominio gratis, despliegue automático desde GitHub. |

## 6.2 Arquitectura

- **SPA 100 % cliente:** `npm run build` genera `dist/` (HTML + JS + CSS) que se publica en CDN. Sin backend, sin base de datos, sin API.
- **Flujo de datos:** `docs/preguntas/*.md` → *(script de build, con validaciones)* → `src/data/questions.json` → bundle → app. El JSON es un artefacto generado, no se edita a mano.
- **Pantallas como estados:** `App.svelte` conmuta entre `Home`, `Quiz` y `Resultados` (ver flujo global, `04`, §4.1).
- **Lógica separada de la vista:** selección aleatoria (`generator.ts`), puntaje y porcentajes (`scoring.ts`) y persistencia (`storage.ts`) son módulos puros y testeables.

### Presupuesto de rendimiento (compromiso de la v1)

| Métrica | Presupuesto |
|---|---|
| JS inicial (gzip) | ≤ ~80 KB (Svelte 5 aporta ~15–20 KB; el resto es app + datos) |
| CSS (gzip) | ≤ ~15 KB |
| Fuentes web | 0 KB — se usa la fuente del sistema |
| Peticiones para el primer render | 3 (HTML, JS, CSS) |
| Carga en 4G desde Lima | < 1 s |

Refuerzos: íconos **SVG en línea** (sin librería de íconos), sin kit de componentes, sin dependencias en runtime más allá de Svelte, nombres de archivo con hash (caché eterna en CDN) y compresión automática (Brotli/Gzip) de Cloudflare.

## 6.3 Estructura del proyecto propuesta

```
BecaEsan/
├── docs/                        # (ya existe) especificaciones y material de preguntas
├── scripts/
│   └── build-questions.mjs      # md → JSON + validaciones (corre antes de dev y build)
├── src/
│   ├── app.css                  # Tailwind + tokens de diseño (variables CSS)
│   ├── App.svelte               # máquina de estados: home | quiz | resultados
│   ├── main.ts
│   ├── components/
│   │   ├── ConfigPanel.svelte   # modo, sliders, puntajes, «Iniciar quiz» (RF-03..09)
│   │   ├── Slider.svelte        # slider horizontal reutilizable (RF-04/05/06)
│   │   ├── NameModal.svelte     # modal del nombre (RF-01)
│   │   ├── QuizBlock.svelte     # bloque del quiz: área, tema y preguntas (RF-12..15)
│   │   ├── ConfirmModal.svelte  # aviso de preguntas sin responder (RF-17)
│   │   └── Results.svelte       # resultados por área (RF-19..21)
│   ├── data/
│   │   └── questions.json       # GENERADO por build-questions.mjs — no editar a mano
│   └── lib/
│       ├── types.ts             # Tema, Pregunta, ConfigQuiz, Intento, Resultado (03)
│       ├── generator.ts         # selección aleatoria de temas y preguntas (RN-02/04)
│       ├── scoring.ts           # clasificación, puntaje y porcentajes (RN-07..09)
│       ├── storage.ts           # localStorage: nombre (RF-02)
│       └── *.test.ts            # pruebas Vitest de generator / scoring / parser
├── index.html
├── package.json
├── vite.config.ts               # incluye el plugin @tailwindcss/vite
├── tsconfig.json · svelte.config.js
├── README.md                    # breve: qué es, cómo ejecutar, cómo desplegar
└── .gitignore                   # node_modules, dist
```

### Inicio del proyecto y comandos

- Crear el proyecto: `npm create vite@latest` → opción **svelte** → variante **TypeScript** (flujo oficial de Svelte sin SvelteKit). Añadir Tailwind 4 (plugin de Vite) y Vitest.
- Node.js: **LTS actual (≥ 22)**.
- Scripts de `package.json`:
  - `dev`: `node scripts/build-questions.mjs && vite`
  - `build`: `node scripts/build-questions.mjs && vite build`
  - `test`: `vitest run`
  - `check`: `svelte-check` (tipos)
- Alcance de navegadores: evergreen de los últimos años (móviles actuales; Tailwind 4 apunta a Safari 16.4+ / Chrome 111+).

## 6.4 Pipeline de datos (build-time)

1. `scripts/build-questions.mjs` recorre `docs/preguntas/razonamiento-matematico/` (17 archivos) y `docs/preguntas/razonamiento-verbal/` (11).
2. Parsea cada archivo según el formato y las tolerancias de `03`, §3.1–3.2.
3. **Valida** el contrato de `03`, §3.6: 28 temas, 140 preguntas, 5 opciones por pregunta, clave válida, explicación presente. Si falla: error con **archivo y problema**, sin generar artefacto parcial.
4. Escribe `src/data/questions.json` con el modelo normalizado.

Estimación: ≈ 100 KB sin comprimir → ~25–30 KB gzip. Cabe de sobra en el presupuesto del bundle inicial.

## 6.5 Alternativas consideradas y descartadas

| Alternativa | Por qué no |
|---|---|
| **Next.js** | Aporta SSR/API/routing que no se necesitan (RNF-03) y añade peso; sería sobreingeniería. |
| **Astro** | Brillante para sitios de contenido, pero aquí toda la experiencia es interactiva (SPA). Sus *content collections* ni siquiera aplican al formato propio de las preguntas: igual haría falta el parser custom. |
| **SvelteKit** | Routing, SSR y adapters innecesarios para una sola ruta; Svelte + Vite directo es más simple y igual de rápido. |
| **React / Vue** | Válidos, pero para este caso Svelte gana en tamaño de bundle y concisión sin desventajas relevantes. |
| **Librería de estado** (Redux, Zustand, Pinia…) | El estado cabe en runes; cero dependencias extra. |
| **Kit de UI** (MUI, shadcn, etc.) | Se necesitan ~6 componentes propios según `07-design.md`; un kit añadiría peso y rigidez. |
| **PWA / service worker en v1** | Pospuesto a fase 2 por decisión del producto (`01`, §1.5); no cambia el stack. |
| **Vercel / Netlify** | Funcionarían bien, pero su plan gratis limita ~100 GB/mes y su red no tiene presencia en Lima como Cloudflare; no aportan ventaja aquí. |

## 6.6 Deploy gratuito (runbook)

**Plataforma elegida: Cloudflare Pages.** El uso esperado es mínimo (pocas personas) y *cualquier* hosting gratuito bastaría en tráfico; la decisión se toma por **velocidad desde Perú** (Cloudflare tiene centro en Lima) y porque el plan gratuito no tiene techo de ancho de banda.

Pasos de publicación:

1. `git init` en el proyecto y subirlo a un repositorio de **GitHub** (público o privado; ambos funcionan).
2. En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** → seleccionar el repositorio.
3. Configurar: *Build command* `npm run build` · *Output directory* `dist` · Node LTS.
4. Listo: cada `push` a `main` publica automáticamente, y cada rama/PR obtiene una URL de vista previa.

Notas:

- **Plan gratuito:** cientos de builds al mes y requests estáticos sin límite; más que suficiente y sin riesgo de costos.
- **URL inicial:** subdominio `*.pages.dev` con HTTPS gratis. Dominio propio: opcional y conectable gratis en cualquier momento (el dominio se compra aparte).
- **Migración trivial:** al ser 100 % estático (`dist/`), cambiar a GitHub Pages o Vercel/Netlify Hobby sería reconfigurar el pipeline, sin tocar código.

## 6.7 Fuera del stack de v1 (pospuesto)

- PWA instalable + offline (service worker) — fase 2.
- Pantalla de revisión con clave y explicación — fase 2 (la explicación ya se extrae en el JSON).
- Persistencia de la configuración entre recargas — candidato (C, RF-11).
- Dominio propio — cuando se quiera.

## 6.8 Próximos pasos

1. `07-design.md` — sistema visual (paleta, tipografía, estilo de sliders, estados).
2. Planes de implementación por fases sobre `01`–`07`.

## Referencias consultadas (octubre 2026)

- Documentación de Svelte (v5.37; uso directo con Vite vía `npm create vite@latest`; runes `$state` / `$derived`).
- Tailwind CSS v4 (configuración CSS-first; plugin oficial de Vite).
- Límites y planes de Cloudflare Pages en 2026; red global de Cloudflare con punto de presencia en Lima, Perú.
