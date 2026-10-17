# Plan 01 — Fundación

> Estado: ⬜ Pendiente · Depende de: — · Cubre: RNF-01, RNF-02 (base), RNF-03, RNF-06 (base), RNF-07, `06 §6.1`–`§6.3`, `07 §7.19` (Anexo C), `07 §7.5.3`, `07 §7.12`, `07 §7.13` · Estimación: M

## 1. Objetivo

Dejar el repositorio y el proyecto listos para construir: control de versiones, andamiaje **Vite + Svelte 5 + TypeScript + Tailwind 4**, tokens de diseño de `07 §7.19` operativos, shell de la app con máquina de estados `home | quiz | resultados`, Vitest configurado y los comandos de `06 §6.3` en verde.

## 2. Alcance

- **Incluye:** git, scaffold oficial, Tailwind 4, tokens, `index.html`, shell de `App.svelte`, estructura de carpetas de `06 §6.3`, Vitest + utilidades de formato, scripts npm.
- **No incluye:** parser de datos (Plan 02), lógica del intento (Plan 03), componentes de UI (Plan 04) ni pantallas (Planes 05–07).

## 3. Referencias

- Specs: `06 §6.1`–`§6.3` (stack, arquitectura, estructura y comandos), `06 §6.2` (presupuesto), `07 §7.19` (tokens), `07 §7.4.1` (fuente del sistema), `07 §7.5.3` (layout), `07 §7.12` (foco visible), `07 §7.13` (rendimiento visual), `01 §RNF-01/02/03/06/07`.
- Skills: `svelte-code-writer` + `svelte-core-bestpractices` (al escribir `App.svelte`); `impeccable` (cierre del plan).

## 4. Precondiciones

- Node.js LTS ≥ 22 y npm disponibles.
- Git instalado.
- No depende de ningún plan.

## 5. Tareas

### T-1.1 — Repositorio e higiene base

- **Objetivo:** repositorio git inicializado con `.gitignore` correcto y README raíz mínimo.
- **Archivos:** `.gitignore` (crear), `README.md` raíz (crear).
- **Pasos:**
  1. `git init` en la raíz del proyecto (conservando `docs/` y `PRODUCT.md`).
  2. `.gitignore`: `node_modules/`, `dist/`, `.DS_Store`, `*.local`, `.vite/`, `src/data/questions.json` (generado, ver Plan 02).
  3. `README.md` breve según `06 §6.3`: qué es (2 líneas), comandos (`dev`, `build`, `test`, `check`), sección de deploy que se completa en el Plan 08, enlaces a `docs/`.
  4. Primer commit (p. ej. `chore: inicializa repositorio`).
- **Criterios:** `06 §6.3` (estructura raíz).
- **Verificación:** `git status` limpio tras el commit; `git log --oneline` con ≥ 1 commit.
- **Estado:** [x]

### T-1.2 — Andamiaje Vite + Svelte 5 + TypeScript

- **Objetivo:** proyecto oficial Svelte + Vite + TS, sin demo, con la estructura de carpetas de `06 §6.3`.
- **Archivos:** `package.json`, `vite.config.ts`, `tsconfig.json`, `svelte.config.js`, `src/main.ts`, `src/App.svelte` (temporal), carpetas `src/components/`, `src/data/`, `src/lib/` (crear).
- **Pasos:**
  1. Generar con `npm create vite@latest` → plantilla **svelte** + variante **TypeScript** (`06 §6.3`), preservando `docs/`, `PRODUCT.md` y `README.md` existentes.
  2. Eliminar el demo (contador, assets de ejemplo) y activar `resolveJsonModule` en `tsconfig.json`.
  3. Scripts base: `dev`, `build`, `preview`, `check` (`svelte-check`); `test` se añade en T-1.6.
- **Criterios:** `06 §6.1` (Svelte 5 + Vite + TS), `06 §6.3` (estructura y comandos).
- **Verificación:** V0: `npm run check` y `npm run build` en verde; `npm run dev` levanta.
- **Estado:** [x]

### T-1.3 — Tailwind CSS 4

- **Objetivo:** Tailwind 4 integrado por el plugin oficial de Vite.
- **Archivos:** `package.json` (devDependencies), `vite.config.ts`, `src/app.css`, `src/main.ts`.
- **Pasos:**
  1. Instalar `tailwindcss` y `@tailwindcss/vite`; registrar el plugin en `vite.config.ts`.
  2. `src/app.css` con `@import "tailwindcss";` e importarlo desde `main.ts`.
  3. Eliminar CSS del demo.
- **Criterios:** `06 §6.1` (Tailwind 4 + CSS propio puntual).
- **Verificación:** V0 + comprobación de una utilidad cualquiera en `npm run dev` (el CSS se genera).
- **Estado:** [x]

### T-1.4 — Tokens de diseño

- **Objetivo:** sistema de tokens operativo: color, tipografía, forma, sombras, espaciado, movimiento, z y acento por área.
- **Archivos:** `src/app.css` (modificar).
- **Pasos:**
  1. Copiar **tal cual** el bloque de `07 §7.19` (Anexo C): `@theme`, `:root` (espaciado, movimiento, z, scrim), `[data-area="…"]` (acento contextual) y `.tnum`.
  2. Base: `body` con `background: var(--color-bg)`, `color: var(--color-ink)`, `font-family: var(--font-sans)`; `color-scheme: light`; `touch-action: manipulation`.
  3. Foco visible global (`07 §7.12`): `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }`.
- **Criterios:** `07 §7.3.2`, `§7.4`, `§7.5.2`, `§7.7.2`, `§7.12`; `06 §6.2` (0 fuentes web).
- **Verificación:** V0; las utilidades `bg-surface`, `text-ink-2` y `rounded-card` generan CSS; el CSS final contiene `#0063BD`.
- **Estado:** [ ]

### T-1.5 — Shell de la app

- **Objetivo:** `index.html` + `App.svelte` con la máquina de estados y el layout móvil-first.
- **Archivos:** `index.html`, `src/App.svelte`, `public/favicon.svg`, `src/app.css` (reserva de scroll).
- **Pasos:**
  1. `index.html`: `lang="es"`, título base «Simulador · Beca BCP/ESAN», meta `viewport` con `viewport-fit=cover`, `theme-color #F8FAFC`, favicon SVG mínimo (`07 §7.13`).
  2. `App.svelte`: `$state` `screen: 'home' | 'quiz' | 'resultados'` con tres placeholders; contenedor `max-w-[640px] mx-auto px-5 md:px-6` (`07 §7.5.3`); reserva inferior para barras fijas (64 px + safe-area, `07 §7.5.1`).
  3. Sin scroll horizontal a 360 px.
- **Criterios:** RNF-01, `06 §6.2` (pantallas como estados), `07 §7.5.3`, `§7.13`.
- **Verificación:** V0 + V2 mínimo: a 360 px sin scroll horizontal; columna centrada a ≥768 px; `theme-color` aplicado.
- **Estado:** [ ]

### T-1.6 — Vitest y utilidades de formato

- **Objetivo:** infraestructura de pruebas lista, validada con utilidades reales que los Planes 06–07 usarán.
- **Archivos:** `package.json`, `vite.config.ts` (o `vitest.config.ts`), `src/lib/format.ts`, `src/lib/format.test.ts`.
- **Pasos:**
  1. Instalar `vitest`; script `test`: `vitest run`.
  2. `format.ts`:
     - `formatDuracion(ms): string` → `m:ss`, `h:mm:ss` si ≥ 1 hora (RF-16);
     - `formatoEntero(n): string` → entero con signo menos tipográfico U+2212 en negativos (E-09).
  3. Pruebas: `0 → "0:00"`, `61_000 → "1:01"`, `3_661_000 → "1:01:01"`, `5 → "5"`, `−2 → "−2"` (U+2212).
- **Criterios:** RF-16 (formato), E-09, `06 §6.1` (Vitest solo lógica pura).
- **Verificación:** V0 + V1: `npm run test` en verde.
- **Estado:** [ ]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RNF-01 (mobile-first) | T-1.5 |
| RNF-02 (base táctil: 44 px, `touch-action`) | T-1.4, T-1.5 |
| RNF-03 (sitio estático) | T-1.2 |
| RNF-06 (base: foco visible) | T-1.4 |
| RNF-07 (lang es, sin webfonts) | T-1.4, T-1.5 |
| RF-16 (formato del tiempo) | T-1.6 |
| E-09 (signo −) | T-1.6 |
| `06 §6.1`–`§6.3` (stack, estructura, comandos) | T-1.2, T-1.3, T-1.5, T-1.6 |
| `07 §7.19` (tokens) | T-1.4 |
| `07 §7.5.3` (layout), `§7.12` (foco), `§7.13` (rendimiento visual) | T-1.4, T-1.5 |

## 7. Verificación final del plan

- [ ] `git log --oneline` con un commit por tarea; `git status` limpio.
- [ ] Los cuatro comandos en verde: `npm run check`, `npm run build`, `npm run test`, y `npm run preview` sirviendo `dist/`.
- [ ] `dist/` sin fuentes web ni imágenes raster; primer render con 3 requests (HTML, JS, CSS) en Network.
- [ ] En 360 px: sin scroll horizontal; en ≥768 px: columna centrada.

## 8. Registro de desvíos y decisiones

_(vacío — se completa durante la ejecución)_
