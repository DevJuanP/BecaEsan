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
- **Estado:** [x]

### T-4.2 — Chips, progreso y barra inferior

- **Objetivo:** los tres elementos de contexto del quiz y de las pantallas.
- **Archivos:** `src/components/ui/Chip.svelte`, `src/components/ui/ProgressSegments.svelte`, `src/components/ui/BottomBar.svelte` (crear).
- **Pasos:**
  1. `Chip`: pill con variantes **área** (punto 6 px + tint + borde del acento) y **cronómetro** (icono `clock` 16 + texto tabular, ancho estable en `ch`) — `07 §7.9.8`.
  2. `ProgressSegments`: N segmentos, pendiente `line`, completado `accent`, actual con alto 6 px; `aria-hidden` (el texto «Bloque X de Y» lo comunica) — `07 §7.9.9`.
  3. `BottomBar`: barra fija traducida de `07 §7.9.6`: translúcida + blur 12 con fallback sólido (`@supports`), borde + sombra solo en estado `is-scrolled` (transición 160 ms), padding con `env(safe-area-inset-bottom)`; variantes 1 botón / 2 botones (1:2).
- **Criterios:** `07 §7.9.6`, `§7.9.8`, `§7.9.9`, `§7.3.4`.
- **Verificación:** V0 + V2 (galería: estados de scroll de la barra) + V3.
- **Estado:** [x]

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
- **Estado:** [x]

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

- **Orden de la galería (T-4.8):** para que cada tarea pueda correr su V2 declarada («V2 (galería)») antes de marcarse ✅, la galería se crea **incrementalmente**: T-4.1 aporta el armazón (`src/components/dev/Gallery.svelte` + hook con import dinámico en `App.svelte`) con la sección de botones, y T-4.8 la completa (cobertura de todos los estados, hoja abierta en demo, slider 5/11/17, error del stepper, exclusión de producción). No cambia el alcance ni la verificación de T-4.8.
- **`src/app.css` (tokens):** se añaden `--radius-pill: 999px` (token de `07 §7.5.2` que faltaba en el Anexo C) y `--accent-deep` en los bloques `[data-area]` (alias del «pressed profundo» azul/naranja 800 de `07 §7.3.2`), para que los componentes consuman el acento contextual sin duplicar hex.
- **T-4.1 · V2 ejecutada (galería, `#dev`):** 360 y 430 px sin scroll horizontal (`scrollWidth == innerWidth`); todos los botones ≥44×44 (mínimo medido 44×44 en la variante icono) con ≥8 px de separación; consola sin errores. Hover verificado con `(hover: hover) and (pointer: fine)`: primario azul `#004E96` y naranja del área `#C2410C`; en emulación táctil la media query no aplica. Focus por teclado (`Tab`): anillo 2 px `--color-focus` + offset 2 px. Pressed `scale(0.97)` presente en la hoja de estilos (100 ms `--ease-out`); disabled con fondo `line` + `ink-disabled` y sin cambio en hover. Auditoría `web-design-guidelines` de los archivos UI: se ejecuta en el cierre del plan (V3 declarada «al cierre del plan»).
- **T-4.2 · V2 ejecutada (galería, `#dev`):** chip de área RM `#EAF3FB`/`#063E77` y RV `#FFF3EA`/`#9A3412` (tinte, borde y punto del acento); chip de cronómetro `surface-2`, 28 px de alto, texto tabular con `min-width: 5ch` (36 px) para no reflowear. Progreso con N = 1, 13 y 17 (`E-01`, `E-03`): pendiente `line`, completado y actual con el acento, actual a 6 px y el resto a 4 px. Barra: `rgba(255,255,255,0.85)` + `blur(12px)`, sin borde ni sombra en reposo y con `.is-scrolled` (sombra `0 -6px 16px rgba(15,23,42,0.06)` + borde `line`) al hacer scroll; un botón 236 px de ancho (completo) y dos botones 89/135 px (1:2). Consola sin errores; 360 px sin scroll horizontal.
- **T-4.3 · `{campo}` de los `aria-label` de los botones ± (`07 §7.11`):** se sustituye por la **etiqueta visible de la fila** («Quitar un punto a Correcta»), que es la lectura literal de la plantilla y evita la frase encadenada que saldría con el `aria-label` completo del campo («… a Puntos por respuesta correcta»). El campo conserva su nombre completo («Puntos por respuesta correcta») y el mensaje de error el del deck.
- **T-4.3 · `parsearEntero`:** se recortan espacios externos (pegado desde el portapapeles sigue funcionando, `07 §7.12.8`); el resto es estricto: un solo signo inicial ASCII `-` o tipográfico `−`, solo dígitos y dentro de −999…999. Un texto inválido deja el valor de la fila en `NaN` y mantiene el texto escrito a la vista para poder corregirlo (validación en vivo de `07 §7.9.14`).
- **T-4.3 · V1 ejecutada:** `npm run test` → 101 pruebas en verde (9 nuevas de `parsearEntero`: signos `-`/`−`, bordes ±999, ceros a la izquierda, vacío/espacios, decimales, comas, notación científica, signos repetidos, en dash y desborde).
- **T-4.3 · V2 ejecutada (galería, `#dev`):** campos con `inputmode="numeric"` y `autocomplete="off"`; botones ± de 44×44 con `aria-label` «Quitar/Añadir un punto a {fila}»; foco por clic/Tab con selección completa del texto y borde `--color-focus`; − y + mueven el valor de 1 en 1; al escribir `-7` y salir del campo se muestra `−7` con U+2212 (código 8722); un texto no numérico («abc») se mantiene a la vista; fila en error con borde `--color-bad` (13 px) y `aria-invalid` + `aria-describedby` apuntando al mensaje del deck. Consola sin errores; 360 px sin scroll horizontal.


