# Plan 04 — Componentes base

> Estado: 🔄 En curso · Depende de: Plan 01 (solo requiere el Plan 01; se ejecuta en su turno) · Cubre: `07 §7.6`–`§7.9` (componentes), `§7.18` (Anexo B), RF-04/05/06 (el control), RF-14 (fila de alternativa), RF-17 (la hoja, sin lógica), `07 §7.5.4`, `§7.7.3`, `§7.12` · Estimación: L

## 1. Objetivo

Construir el catálogo de componentes reutilizables fiel al sistema visual de `07`: botones, chips, progreso, barra inferior, stepper, **slider segmentado** (la firma del producto), fila de alternativa, hoja modal y tooltip — cada uno con sus estados completos, accesibles y verificados de forma aislada en una galería solo para desarrollo.

## 2. Alcance

- **Incluye:** componentes de `src/components/ui/*`, la galería de desarrollo (`T-4.8`) y las funciones puras que estos extraigan (con sus pruebas).
- **No incluye:** ensamblado de pantallas (Planes 05–07); lógica del intento (ya en Plan 03); acentos contextuales a nivel de pantalla (lo habilitan, se aplica en 05–07).

## 3. Referencias

- Specs: `07 §7.6` (iconos), `§7.7` (movimiento), `§7.8` (slider) + `§7.18` (Anexo B), `§7.9.3`–`§7.9.11` y `§7.9.15` (componentes), `§7.5.4` (hover solo pointer fino), `§7.12` (accesibilidad), `§7.13` (rendimiento visual), `§7.14` (checklist); `06 §6.1` (sin kit de UI), `§6.2` (sin dependencias de runtime).
- Skills: `svelte-code-writer` + `svelte-core-bestpractices` (**obligatorias** al escribir cada `.svelte`); `apple-design` como referencia del slider/hoja (ya traducido en `07 §7.8.4`/`§7.9.11`); `web-design-guidelines` (auditoría al cierre).

## 4. Precondiciones

- Plan 01 ✅ (tokens y shell operativos).
- `npm run check`, `npm run build` y `npm run test` en verde antes de empezar.
- Decisión pendiente `07 §7.16 (#1)` (captura del CodePen): **no bloquea** — la especificación vinculante es `07 §7.8` + Anexo B; si al ejecutar ya existe la captura/CSS, ajustar únicamente la capa visual del slider.

## 5. Tareas

### T-4.1 — Botones

- **Objetivo:** `Button.svelte` con variantes y estados completos.
- **Archivos:** `src/components/ui/Button.svelte` (crear).
- **Pasos:** variantes **primario / secundario / fantasma** (`07 §7.9.4`): alturas 48 (barras) y 44 (contextos), radio 12, texto 16/600; acento azul por defecto y naranja cuando el contenedor tenga `data-area="verbal"`; icono opcional 20 (gap 8); estados: hover **solo** `@media (hover:hover) and (pointer:fine)`, pressed `scale(0.97)` + tono profundo, `:focus-visible`, deshabilitado (`line` + `ink-disabled`, sin pointer). `<button>` real siempre.
- **Criterios:** `07 §7.9.4`, `§7.5.4`, `§7.12` (foco); RNF-02.
- **Verificación:** V0 + V2 (galería) + V3 (web-design-guidelines al cierre del plan).
- **Estado:** [ ]

### T-4.2 — Chips, progreso y barra inferior

- **Objetivo:** los tres elementos de contexto del quiz y de las pantallas.
- **Archivos:** `src/components/ui/Chip.svelte`, `src/components/ui/ProgressSegments.svelte`, `src/components/ui/BottomBar.svelte` (crear).
- **Pasos:**
  1. `Chip`: pill con variantes **área** (punto 6 px + tint + borde del acento) y **cronómetro** (icono `clock` 16 + texto tabular, ancho estable en `ch`) — `07 §7.9.8`.
  2. `ProgressSegments`: N segmentos, pendiente `line`, completado `accent`, actual con alto 6 px; `aria-hidden` (el texto «Bloque X de Y» lo comunica) — `07 §7.9.9`.
  3. `BottomBar`: barra fija traducida de `07 §7.9.6`: translúcida + blur 12 con fallback sólido (`@supports`), borde + sombra solo en estado `is-scrolled` (transición 160 ms), padding con `env(safe-area-inset-bottom)`; variantes 1 botón / 2 botones (1:2).
- **Criterios:** `07 §7.9.6`, `§7.9.8`, `§7.9.9`, `§7.3.4`.
- **Verificación:** V0 + V2 (galería: estados de scroll de la barra) + V3.
- **Estado:** [ ]

### T-4.3 — Stepper numérico

- **Objetivo:** control de puntajes con validación visual y accesible.
- **Archivos:** `src/components/ui/Stepper.svelte`, `src/lib/format.ts` (ampliar), `src/lib/format.test.ts` (ampliar).
- **Pasos:**
  1. Estructura `07 §7.9.3`: etiqueta + [−] [valor] [+]; botones 44×44 con `aria-label` («Quitar un punto a {campo}» / «Añadir un punto a {campo}»); input de texto `inputmode="numeric"` ancho 64.
  2. `parsearEntero(texto)`: acepta `-` y `−` (U+2212), rechaza vacío/no numérico/fuera de −999…999; `formatoEntero` ya existe (T-1.6) y se usa como display cuando el campo **no** está enfocado.
  3. Estados: reposo, focus (borde `--color-focus` + anillo), **error** (borde `--color-bad`, mensaje 13 px debajo, `aria-invalid` + `aria-describedby`) — `07 §7.9.14`.
  4. Al enfocar, seleccionar el texto (reemplazo rápido).
- **Criterios:** RF-07 (el control), `07 §7.9.3`, `§7.9.14`, E-09.
- **Verificación:** V1 (`parsearEntero`: signos, bordes, inválidos) + V0 + V2 + V3.
- **Estado:** [ ]

### T-4.4 — Slider segmentado ★

- **Objetivo:** el componente firma: barra segmentada con arrastre 1:1, snap entero, tap-to-jump, teclado, burbuja de valor y accesibilidad nativa — sin GSAP ni dependencias (`07 §7.8.7`).
- **Archivos:** `src/components/ui/Slider.svelte`, `src/lib/slider.ts`, `src/lib/slider.test.ts` (crear).
- **Pasos:**
  1. Marcado y CSS según `07 §7.8` + Anexo B (`§7.18`): fila etiqueta/valor (`{v} de {max}`, tabular), track de 44 px con segmentos flex (alto 22, radio 7, gap 4 con ≥12 segmentos / 6 con ≤11), extremos «1» y `{max}` en `micro` `ink-3`, burbuja 28 px alineada al segmento activo (clamp 20 px de los bordes).
  2. Control real: `<input type="range" min=1 max={max} step=1>` invisible superpuesto (opacity 0, 44 px) con `aria-label` y `aria-valuetext` «{v} de {max} temas» / «… preguntas»; segmentos y burbuja `aria-hidden`.
  3. Interacción (`07 §7.8.4`): `pointerdown` → `setPointerCapture` + tap-to-jump; `pointermove` → índice por franja X, sin transición (1:1); `pointerup` → soltar; `pointercancel`/`Escape` → revertir al valor previo; `touch-action: pan-y`; rueda ignorada; foco visible con `:has(input:focus-visible)` (anillo 2 px, offset 4).
  4. Burbuja (`07 §7.8.5`): aparece en pointerdown/focus, sigue sin transición durante el gesto, se desvanece 400 ms tras soltar (fade `--dur-2`); colores por acento (`--accent-strong`).
  5. Extraer `indiceDesdeX(x, rect, max)` a `src/lib/slider.ts` (pura, testeable).
  6. Momentum/flick: **fuera de v1** (mejora opcional ya documentada en `07 §7.8.4.3`).
- **Criterios:** RF-04/05/06 (control), `07 §7.8`, `§7.18`, `§7.12` (tap único = alternativa al arrastre, WCAG 2.2).
- **Verificación:** V1 (`indiceDesdeX`: bordes, clamping, franjas) + V0 + V2 (galería: reposo, arrastre con dedo simulado, teclado, focus, hover) + V3.
- **Estado:** [ ]

### T-4.5 — Fila de alternativa (A–E)

- **Objetivo:** la «burbuja de hoja de respuestas» lista para el quiz.
- **Archivos:** `src/components/ui/OptionRow.svelte` (crear).
- **Pasos:** radio nativo oculto + burbuja 28 px (letra A–E) + texto — `07 §7.9.7`: alto mínimo 56, borde 1 px, radio 12; **seleccionada**: borde + fondo `accent-50` + texto 600 + burbuja rellena con letra blanca; pressed `surface-2`; focus visible en la fila. El `fieldset`/`legend` lo aporta la pantalla (Plan 06).
- **Criterios:** RF-14 (la fila), `07 §7.9.7`, `§7.12` (semántica nativa).
- **Verificación:** V0 + V2 + V3.
- **Estado:** [ ]

### T-4.6 — Hoja modal / diálogo

- **Objetivo:** la superficie de nombre y confirmaciones (`07 §7.9.11`).
- **Archivos:** `src/components/ui/Sheet.svelte` (crear).
- **Pasos:**
  1. **Móvil:** bottom-sheet (radio 20 arriba, asa 36×4, sombra de hoja + scrim); **≥768 px:** diálogo centrado (ancho 400, radio 16).
  2. Comportamiento: `role="dialog"` + `aria-modal`; foco atrapado; `Escape` y clic en scrim = cancelar; al cerrar, el foco vuelve al disparador (quien la usa provee el ref); scroll del fondo bloqueado con `overscroll-behavior: contain`.
  3. Drag-to-dismiss **básico** desde el asa (umbral 96 px o velocidad > 0.5 px/ms) en móvil; con `reduced-motion`: solo fade (sin deslizamiento).
  4. Animaciones según `07 §7.7.3` (entrada 340 ms `--ease-sheet`; cierre 240 ms).
- **Criterios:** `07 §7.9.11`, `§7.7.3`, `§7.7.4`, `§7.12` (foco).
- **Verificación:** V0 + V2 (galería: abrir/cerrar con teclado, scrim, Escape, drag en móvil, reduced-motion) + V3.
- **Estado:** [ ]

### T-4.7 — Tooltip

- **Objetivo:** mejora de escritorio del lápiz, sin función asociada en táctil.
- **Archivos:** `src/components/ui/Tooltip.svelte` (crear).
- **Pasos:** chip oscuro (`ink` + texto blanco, radio 8) sobre el trigger; aparece a los 300 ms de hover/focus, fade 120 ms; **solo** `(hover:hover) and (pointer:fine)`; `aria-hidden` (el `aria-label` del disparador ya existe) — `07 §7.9.15`.
- **Criterios:** RF-01.2 (la parte de escritorio), `07 §7.9.15`, RNF-01 (nada depende de hover).
- **Verificación:** V0 + V2 (escritorio) + V3.
- **Estado:** [ ]

### T-4.8 — Galería de componentes (solo desarrollo)

- **Objetivo:** superficie de verificación V2 de este plan (los componentes aún no viven en pantallas).
- **Archivos:** `src/components/dev/Gallery.svelte` (crear), `src/App.svelte` (modificar).
- **Pasos:**
  1. En `App.svelte`: si `import.meta.env.DEV` y `location.hash === '#dev'`, montar la galería con **import dinámico** (no entra al bundle de producción).
  2. Contenido: sección por componente con **todas** las variantes y estados de T-4.1…T-4.7 (incluidos hover anotado, error del stepper, slider con 5/11/17 segmentos, hoja abierta en demo).
- **Criterios:** `07 §7.9` (cobertura de estados), `§7.13` (exclusión de producción).
- **Verificación:** V0 + `grep -ri "gallery" dist/` sin resultados tras `npm run build` + V2 sobre la galería.
- **Estado:** [ ]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RF-04, RF-05, RF-06 (control deslizante) | T-4.4 |
| RF-07 (control de puntajes) | T-4.3 |
| RF-14 (fila de alternativa) | T-4.5 |
| RF-17 (superficie de confirmación) | T-4.6 |
| RF-01.2 (tooltip de escritorio) | T-4.7 |
| RNF-02 (44 px), RNF-06 (foco/semántica) | T-4.1…T-4.8 |
| `07 §7.6` (iconos en línea) | T-4.1, T-4.2, T-4.7 |
| `07 §7.7` (movimiento), `§7.5.4` (hover) | T-4.1, T-4.6 |
| `07 §7.8` + Anexo B (`§7.18`) | T-4.4 |
| `07 §7.9.3`–`§7.9.11`, `§7.9.15` | T-4.1…T-4.7 |
| `07 §7.12` (a11y), `§7.13` (rendimiento visual) | Todas |

## 7. Verificación final del plan

- [ ] La galería cubre todos los estados descritos en `07 §7.9` para cada componente.
- [ ] Todos los controles alcanzan ≥44×44 px (medidos en la galería) y ≥8 px de separación.
- [ ] Teclado: slider con flechas/Home/End; radios con flechas; hoja con Tab atrapado y `Escape`.
- [ ] `reduced-motion` y `reduced-transparency` probados en la galería.
- [ ] `grep -ri "gallery" dist/` sin resultados (la galería no entra a producción).
- [ ] Auditoría `web-design-guidelines` sobre `src/components/ui/*` sin hallazgos críticos.
- [ ] `package.json` sin dependencias nuevas (solo las del stack).

## 8. Registro de desvíos y decisiones

_(append-only; las entradas de ejecución se añaden al final)_

### Revisión de vigencia (2026-10-16, previa a la ejecución)

- **Decisión pendiente `07 §7.16 (#1)` — captura/CSS del CodePen del slider: resuelta por el orquestador.** No existe captura ni CSS en el repo; la capa visual del slider (T-4.4) se rige por `07 §7.8` + `§7.18` (Anexo B) como especificación vinculante. No hay cambios de tareas ni de matriz; la fila 1 de la tabla de decisiones de `docs/plans/README.md` ya refleja la resolución (commit `f06863f`).
- **`07 §7.9.4` enumera cuatro variantes de botón (primario, secundario, fantasma e **icono**); el encabezado de T-4.1 lista tres.** La variante icono (44×44, icono 20, hover `surface-2`) la consumen T-4.2/T-4.6/T-4.7 (X de cierre, lápiz) y está en la especificación: se implementa la tabla completa de `07 §7.9.4`. No es requisito nuevo ni cambio de alcance.
- **`07 §7.6` exige diez iconos en el catálogo** (pencil, clock, house, chevron-left, arrow-right, check, x, minus, plus, text-align-left) **copiados en línea como SVG**. Se crea `src/components/ui/Icon.svelte` como pieza compartida de `src/components/ui/*` (alcance del plan) para no duplicar los SVG entre componentes; siempre `aria-hidden` y `currentColor`, con `name` tipado.
- **Criterios sin cambios**: `07 §7.5`–`§7.9`, `§7.12`–`§7.14`, `§7.18`, `04` y `06 §6.1`–`§6.2` se confrontaron contra las tareas y la matriz; RF-04/05/06, RF-07, RF-14, RF-17, RF-01.2, RNF-02 y RNF-06 siguen correspondiendo a T-4.1…T-4.8 como declara la matriz.

### Decisiones de ejecución

_(se añaden al completar cada tarea)_

