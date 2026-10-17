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
- **Estado:** [x]

### T-4.5 — Fila de alternativa (A–E)

- **Objetivo:** la «burbuja de hoja de respuestas» lista para el quiz.
- **Archivos:** `src/components/ui/OptionRow.svelte` (crear).
- **Pasos:** radio nativo oculto + burbuja 28 px (letra A–E) + texto — `07 §7.9.7`: alto mínimo 56, borde 1 px, radio 12; **seleccionada**: borde + fondo `accent-50` + texto 600 + burbuja rellena con letra blanca; pressed `surface-2`; focus visible en la fila. El `fieldset`/`legend` lo aporta la pantalla (Plan 06).
- **Criterios:** RF-14 (la fila), `07 §7.9.7`, `§7.12` (semántica nativa).
- **Verificación:** V0 + V2 + V3.
- **Estado:** [x]

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
- **Estado:** [x]

### T-4.7 — Tooltip

- **Objetivo:** mejora de escritorio del lápiz, sin función asociada en táctil.
- **Archivos:** `src/components/ui/Tooltip.svelte` (crear).
- **Pasos:** chip oscuro (`ink` + texto blanco, radio 8) sobre el trigger; aparece a los 300 ms de hover/focus, fade 120 ms; **solo** `(hover:hover) and (pointer:fine)`; `aria-hidden` (el `aria-label` del disparador ya existe) — `07 §7.9.15`.
- **Criterios:** RF-01.2 (la parte de escritorio), `07 §7.9.15`, RNF-01 (nada depende de hover).
- **Verificación:** V0 + V2 (escritorio) + V3.
- **Estado:** [x]

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
- **T-4.4 · aire etiqueta → track (desvío mínimo registrado):** el Anexo B sitúa la burbuja con `bottom: 34px`, es decir 18 px por encima del track; con el margen literal de 8 px de `§7.8.2` la burbuja tapaba la etiqueta. Se reserva su alto entre la fila superior y el track (8 + 18 = 26 px), de modo que la burbuja nunca cubre texto y el layout no se mueve al aparecer. Sin cambios funcionales.
- **T-4.4 · interacción:** el `<input type="range">` superpuesto lleva `pointer-events: none`: el gesto lo resuelve el track con Pointer Events tal como pide `§7.8.4` (tap-to-jump + arrastre 1:1 con `setPointerCapture`), y el input conserva teclado, foco y semántica de lector. La rueda se ignora sin listener (el rango nativo no responde a la rueda y el scroll de la página sigue funcionando). `setPointerCapture` va protegido: si el navegador ya soltó el puntero, el gesto continúa sin captura.
- **T-4.4 · opcionales fuera de v1:** momentum/flick (`§7.8.4.3`, nivel 2 — ya declarado fuera en el plan) y vibración háptica de 8 ms por segmento (`§7.8.4.8`, opcional en la especificación) no se implementan.
- **T-4.4 · V1 ejecutada:** `npm run test` → 106 pruebas en verde (5 nuevas de `indiceDesdeX`: franjas exactas de 17/11/5, bordes y clamping, `max = 1` y datos degenerados).
- **T-4.4 · V2 ejecutada (galería, `#dev`, 360 px, sin capturas — verificación por DOM):** reposo: 17 segmentos (alto 22, radio 7, gap 4 al ser ≥12), 11 y 5 con gap 6; vacío `#8494A9` (3.09:1) y relleno `#0063BD` (RM/preguntas) / `#EA580C` (RV); track de 44 px; segmento de ≈13 px con 17 marcas; extremos «1»/«17»; `aria-valuetext` «8 de 17 temas» y «2 de 5 preguntas»; `min/max/step` 1/17/1. Burbuja: 28 px, radio pill, fondo acento fuerte (`#004E96`/`#C2410C`), apagada en reposo y **contenida siempre dentro del track** (valores 1, 8 y 17 → 6-34 / 109-136 / 241-275 px sobre 278 px). Gesto: tap en la franja 4 → «4 de 17» con burbuja visible y transición de segmentos a 0 s; soltar → transición 0.09 s y burbuja apagada a los ~400 ms; arrastre a la franja 11 → «11 de 17» (1:1, sin transición); `Escape` → revierte a 4; `pointercancel` → revierte a 4; fuera del track → clampa a 1 y 17; botón secundario → no arrastra; rueda → no cambia el valor. Tap real (clic verificado en el navegador, franja central) → «9 de 17». Teclado: `→`/`↑` +1, `←`/`↓` −1, `Home` → 1, `End` → 17, `PageUp`/`PageDown` ±2 (salto mayor determinista); foco con anillo de 2 px `#0063BD` sobre todo el track (`:has(input:focus-visible)`) y burbuja visible al enfocar (0.99 a los 60 ms), que se apaga 400 ms después del `blur`. Deshabilitado: opacidad 0.45, `pointer-events: none`, `aria-disabled`, `tabindex="-1"` y valor inalterable. Consola sin errores; 360 px sin scroll horizontal. **Limite de la herramienta:** el navegador automatizado no registra un puntero activo para el arrastre simulado por CDP, así que la continuidad con `setPointerCapture` no se pudo ejercitar de punta a punta aquí (el resto del gesto sí); queda como comprobación manual breve con ratón/dedo real.
- **T-4.5 · burbuja de la letra (decisión):** la letra A–E va `aria-hidden` (es pintura, igual que los segmentos del slider) y el nombre accesible de la alternativa es su texto; el radio nativo recibe el foco y el anillo de foco se pinta en la fila (`:has(input:focus-visible)`), nunca en el radio oculto.
- **T-4.5 · V2 ejecutada (galería, `#dev`, 360 px):** fila de alto 56 px (mínimo), padding 12×14, radio 12, borde 1 px `line`; separación de 12 px entre alternativas; burbuja de 28×28 con borde declarado de 1.5 px (Chrome reporta 1 px: redondea los bordes en layout) y letra `caption` 600 `ink-2`; seleccionada: borde acento `#0063BD`, anillo interior `inset 0 0 0 1px`, fondo `#EAF3FB`, texto a 600 y burbuja rellena con letra blanca; `:active` → `surface-2`; foco por teclado → anillo de 2 px `#0063BD` en la fila y sin anillo en el radio oculto. Radios reales del mismo `name` con una sola `checked`; flechas del teclado mueven la selección (A→B→C→D verificado, con la clase visual siguiendo la `checked`) y el clic en la fila también; envoltura de una alternativa larga sin romper la burbuja. Consola sin errores; 360 px sin scroll horizontal.
- **T-4.6 · decisiones:** (a) `<dialog>` nativo con `showModal()` + un `$effect` mínimo para hablar con esa API imperativa (escape hatch documentado de Svelte 5); (b) **trampa de foco explícita**: `showModal()` encierra el foco en el diálogo, pero `Tab` desde el último control salta a la interfaz del navegador, así que `Sheet` cierra el recorrido sobre el propio diálogo (el plan exige «Tab atrapado»); (c) el layout de las acciones (móvil apiladas con la primaria al final; ≥768 px en fila a la derecha) vive en `Sheet` porque es parte de `07 §7.9.11`; (d) el cierre por drag continúa desde la posición del gesto con `--sheet-from`; con `reduced-motion` la hoja entra y sale con fundido (sin deslizamiento ni rebote).
- **T-4.6 · V2 ejecutada (galería, `#dev`, sin capturas — verificación por DOM):** móvil 360 px: *bottom-sheet* anclado al fondo (y = 466 de 800), ancho completo, radio 20 solo arriba, asa visible de 36×4, scrim `rgba(15,23,42,0.48)`, `z-index` 50, animación `hoja-entrar` de 0.34 s, scroll de fondo bloqueado (`html { overflow: hidden }` y restaurado al cerrar) y `overscroll-behavior: contain` con `max-height` 90dvh. Accesibilidad: rol `dialog` con `aria-modal="true"` y `aria-labelledby` al título; foco inicial dentro; `Tab`/`Shift+Tab` **ciclan dentro** (X → campo → Cancelar → Guardar → X; y al revés); `Escape` cancela con la animación de cierre de 240 ms, libera el scroll y **devuelve el foco al disparador** (clic real y cierre por scrim verificados). Scrim (clic con objetivo = diálogo) y X cierran. Drag desde el asa: 1:1 (0 → 20 → 40 px), rubber-band a 200 px → 132.4 px, umbral 96 px o velocidad > 0.5 px/ms cierra y un arrastre lento de 60 px vuelve a su sitio (0 px, hoja abierta). Escritorio 1024 px: diálogo centrado de 400 px (offset 0/0), radio 16, asa oculta, animación `dialogo-entrar` (fade + escala) y acciones en fila (botones de 104 px). `prefers-reduced-motion` y `prefers-reduced-transparency` no son emulables con las herramientas disponibles: se verifican por inspección de las reglas emitidas (fundido de 150 ms de entrada y 240 ms de salida en la hoja; barra fija con fondo sólido sin blur). Consola sin errores; 360 px sin scroll horizontal.
- **T-4.7 · decisiones:** el tooltip vive en un envoltorio `role="presentation"` (superficie decorativa; el disparador conserva su `aria-label`), el chip va `aria-hidden` y solo aparece con puntero fino: doble candado (`@media not ((hover: hover) and (pointer: fine)) { display: none }` + `matchMedia` en el handler, para que en táctil no se programe ningún temporizador). Nada depende de él (RNF-01).
- **T-4.7 · V2 ejecutada (galería, `#dev`, sin capturas — verificación por DOM):** escritorio `(hover: hover) and (pointer: fine)`: chip `#0F172A` con texto blanco `caption` (13 px), radio 8, padding 6×10, `z-index` 60 y transición de 120 ms; posición 8 px por encima del disparador y centrado (desvío horizontal 0 px); opacidad 0 a los 200 ms del `pointerenter`, 0.99 a los 400 ms (retardo de 300 ms + fundido), 0.07 a los 60 ms de salir y 0 a los ~260 ms; con foco real (`focus()` del disparador) aparece igual (0.99 a los 380 ms) y se apaga tras el blur. En táctil (360 px): `hover: none`, chip `display: none` y ningún cambio tras un `pointerenter` sintético. Consola sin errores; 360 px sin scroll horizontal.



