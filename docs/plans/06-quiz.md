# Plan 06 — Quiz

> Estado: 🔄 En curso · Depende de: Planes 03, 04, 05 · Cubre: RF-12…RF-18, RN-03 (cambio visual de área), RN-06, RNF-01, RNF-02, RNF-05, RNF-06, RNF-09, E-01, E-02, E-03, E-06, E-07, `05 §5.4`–`§5.5`, `07 §7.9.8`–`§7.9.10`, `§7.10.2` · Estimación: L

## 1. Objetivo

La pantalla de quiz completa: bloques por temática con sus preguntas y alternativas A–E, cabecera sticky (área, «Bloque X de Y», cronómetro informativo, progreso segmentado), panel de texto común, navegación «Atrás»/«Continuar»/«Ver resultados» con respuestas conservadas, cambio de acento RM→RV y hoja de confirmación cuando hay preguntas en blanco. Al terminar, se puede resolver un intento completo de principio a fin.

## 2. Alcance

- **Incluye:** toda la pantalla del quiz y su navegación, el cronómetro informativo, la confirmación sin responder y el aviso al salir; el cálculo de duración (`terminadoEn`).
- **No incluye:** la pantalla de resultados (Plan 07); dominio (ya en Plan 03) y componentes (ya en Plan 04, aquí solo se ensamblan).

## 3. Referencias

- Specs: `02 §RF-12`–`§RF-18`, `§RN-03`, `§RN-06`, `§M6` (E-01, E-02, E-03, E-06, E-07); `03 §3.3` (Intento/BloqueIntento); `05 §5.4` (wireframe y reglas del bloque), `§5.5` (hoja de confirmación); `07 §7.7.3` (transiciones), `§7.9.8`/`§7.9.9`/`§7.9.10` (componentes), `§7.10.2` (pantalla), `§7.11` (microcopy), `§7.12`, `§7.14`.
- Skills: `svelte-code-writer` + `svelte-core-bestpractices` (obligatorias); `apple-design` como referencia de continuidad espacial del cambio de bloque (`07 §7.7.1`); `web-design-guidelines` (V3); `impeccable` (cierre).

## 4. Precondiciones

- Planes 03, 04 y 05 ✅ (se puede generar un intento real desde Home).
- `npm run check`, `npm run build` y `npm run test` en verde antes de empezar.

## 5. Tareas

### T-6.1 — Estructura del bloque y responder

- **Objetivo:** RF-13 y RF-14: el bloque actual con sus preguntas, alternativas y respuestas editables.
- **Archivos:** `src/components/quiz/QuizScreen.svelte`, `src/components/quiz/QuestionCard.svelte` (crear).
- **Pasos:**
  1. Renderizar `intento.bloques[indiceActual]`: título del tema y las q preguntas numeradas 1..q (RF-13.3).
  2. Cada pregunta: `<fieldset>` con el enunciado en `<legend>` (numeración «1.» + statement) y cinco `OptionRow` (T-4.5) con radios agrupados por `pregunta.id` (RN-06: orden del material).
  3. Selección única; escribir de inmediato en `bloque.respuestas[pregunta.id]`; cambiable cuantas veces se quiera; se puede dejar en blanco (RF-14); **sin** feedback de corrección.
  4. Separación: 32 px entre preguntas, 12 px entre alternativas (`07 §7.10.2`).
- **Criterios:** RF-13, RF-14, RN-06.
- **Verificación:** V0 + V2 (seleccionar, cambiar, dejar en blanco; estado inequívoco sin hover).
- **Estado:** [x]

### T-6.2 — Cabecera sticky, cronómetro y progreso

- **Objetivo:** RF-12 y RF-16 (visual en vivo) con los componentes de T-4.2.
- **Archivos:** `src/components/quiz/QuizHeader.svelte` (crear).
- **Pasos:**
  1. Chip de área con el texto completo («Razonamiento Matemático» / «Razonamiento Verbal y Comunicación»), «Bloque X de Y» tabular y chip de cronómetro (icono + `formatDuracion`, ancho estable).
  2. Reloj **derivado** de `iniciadoEn` con `setInterval` de 1 s (sin drift): activo solo en quiz; `aria-label="Tiempo transcurrido"`; **sin** `aria-live`; se detiene al entrar a resultados (T-6.6 fija `terminadoEn` y limpia el intervalo).
  3. `ProgressSegments` con N = total de bloques, actual resaltado (`07 §7.9.9`).
  4. Estado `is-scrolled` de la cabecera (borde + sombra, 160 ms) al hacer scroll.
- **Criterios:** RF-12, RF-16; `07 §7.9.8`, `§7.9.9`, `§7.3.4`.
- **Verificación:** V0 + V2 (el tiempo avanza entre bloques; formato m:ss y h:mm:ss; no interrumpe a lectores).
- **Estado:** [ ]

### T-6.3 — Panel de texto común

- **Objetivo:** RF-13.2: el texto compartido se muestra una vez, antes de las preguntas (hoy solo Comprensión de lectura).
- **Archivos:** `src/components/quiz/SharedText.svelte` (crear).
- **Pasos:** `<details>/<summary>` nativos, **abierto por defecto**, con encabezado «Texto» + toggle «Ocultar texto» / «Mostrar texto» (`aria-expanded`); contenido en `statement` 17/400, interlineado 1.6, medida ≤75ch; solo si `textoComun` no es `null` (`07 §7.9.10`); E-06: se muestra igual con q < 5.
- **Criterios:** RF-13.2, E-06; `07 §7.9.10`.
- **Verificación:** V0 + V2 (bloque de Comprensión de lectura con q = 2 y q = 5).
- **Estado:** [ ]

### T-6.4 — Navegación entre bloques

- **Objetivo:** RF-15: avanzar, retroceder y editar con respuestas conservadas.
- **Archivos:** `src/components/quiz/QuizScreen.svelte`, `src/components/quiz/QuizNav.svelte` (crear).
- **Pasos:**
  1. Barra fija inferior (T-4.2): primer bloque → solo [Continuar] ancho completo; intermedios → [Atrás] [Continuar]; último → [Atrás] [Ver resultados] (primario, `07 §7.10.2`).
  2. Al avanzar/retroceder: `indiceActual` ± 1, scroll arriba, foco al `h1` del bloque, transición direccional del contenido (±24 px + fade 260 ms; con `reduced-motion`: solo fade) — `07 §7.7.3`.
  3. E-07: al volver, las respuestas ya dadas siguen ahí y son editables y son las que se usan al final.
- **Criterios:** RF-15, E-07; `07 §7.7.3`, `§7.10.2`.
- **Verificación:** V0 + V2 (primer/intermedio/último; atrás + editar; transición en ambos sentidos).
- **Estado:** [ ]

### T-6.5 — Acento por área (RM → RV)

- **Objetivo:** RN-03 visible: el acento interactivo del quiz es el del área del bloque actual y cambia exactamente una vez por intento completo.
- **Archivos:** `src/components/quiz/QuizScreen.svelte` (modificar). 
- **Pasos:** `data-area="matematico|verbal"` en el contenedor del quiz según el bloque actual; botones primarios, opciones seleccionadas, progreso y chip usan `--accent` (T-4.x ya lo consumen); al entrar el primer bloque RV, el bloque nuevo llega ya con el acento naranja (sin cross-fade intermedio).
- **Criterios:** RN-03; `07 §7.10.2` (regla de acento contextual).
- **Verificación:** V0 + V2 (modo Completo: un solo cambio, en el límite RM→RV; modos de un área: sin cambios).
- **Estado:** [ ]

### T-6.6 — Confirmación de preguntas en blanco y cierre del intento

- **Objetivo:** RF-17 completo: la hoja de confirmación y el paso a resultados.
- **Archivos:** `src/components/quiz/ConfirmModal.svelte` (crear), `src/components/quiz/QuizScreen.svelte` (modificar).
- **Pasos:**
  1. Al pulsar «Ver resultados»: contar preguntas en blanco (global y por área).
  2. Sin blancos → directo a resultados; con blancos → `Sheet` (T-4.6) con título con singular/plural correcto («Tienes 1 pregunta sin responder» / «Tienes X preguntas sin responder»), detalle «RM: a · RV: b» (solo áreas activas; omitir el área en 0 si la otra acumula todo) y acciones «Volver a revisar» (secundaria) / «Ver resultados igualmente» (primaria con acento del área en curso) — microcopy de `07 §7.11`.
  3. Al confirmar: `terminadoEn = Date.now()`, `calcularResultado(intento)` (Plan 03) → guardar resultado en estado → `irA('resultados')`.
  4. «Volver a revisar» solo cierra la hoja (permanece en el quiz).
- **Criterios:** RF-17; CA de `02 §RF-17`; `05 §5.5`.
- **Verificación:** V0 + V2 (0 blancos / 1 blanco / varios en ambas áreas; texto singular y plural).
- **Estado:** [ ]

### T-6.7 — Aviso al salir a mitad del intento

- **Objetivo:** RF-18 y RNF-09 (prioridad S): advertencia del navegador al recargar/cerrar durante el quiz.
- **Archivos:** `src/components/quiz/QuizScreen.svelte` (modificar) o helper en `src/lib/`.
- **Pasos:** registrar `beforeunload` al entrar al quiz (con `preventDefault`); retirarlo al entrar a resultados o volver a Home; solo activo durante el quiz.
- **Criterios:** RF-18, RNF-09.
- **Verificación:** V0 + V2 (el aviso aparece al recargar con el quiz en curso y no aparece en Home/Resultados; sujeto al soporte del navegador móvil).
- **Estado:** [ ]

### T-6.8 — Verificación de pantalla (V2 + V3)

- **Objetivo:** cerrar el quiz contra `07 §7.10.2` + `§7.14` con los casos E del bloque.
- **Archivos:** — (verificación; hallazgos se corrigen en sus tareas).
- **Pasos:** checklist `07 §7.14` aplicada al quiz; casos: **E-01** (RM 17/17 → 17+ bloques, barra densa), **E-02** (q = 5), **E-03** (k = 1, q = 1: bloque único con «Ver resultados» en el primer bloque), **E-06** (texto común con q < 5), **E-07** (atrás + editar respuestas y que el cálculo final las refleje — con resultados del Plan 07 o inspección del intento). Teclado: radios con flechas, botones de barra, límites del foco. Reduced-motion en la transición de bloque. Sin scroll horizontal a 360 px. Auditoría `web-design-guidelines` + pasada `impeccable` de cierre.
- **Criterios:** `07 §7.10.2`, `§7.14`; E-01/02/03/06/07; RNF-01/02/05/06.
- **Verificación:** checklist marcada + hallazgos corregidos o registrados.
- **Estado:** [ ]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RF-12 (cabecera) | T-6.2 |
| RF-13 (contenido y texto común) | T-6.1, T-6.3 |
| RF-14 (responder) | T-6.1 |
| RF-15 (navegación) | T-6.4 |
| RF-16 (cronómetro) | T-6.2, T-6.6 |
| RF-17 (confirmación) | T-6.6 |
| RF-18 (aviso al salir) | T-6.7 |
| RN-03 (orden visual y acento) | T-6.5 |
| RN-06 (sin barajar alternativas) | T-6.1 |
| RNF-05 (sin esperas entre bloques) | T-6.4 (SPA, sin recargas) |
| RNF-09 (pérdida de progreso) | T-6.7 |
| E-01, E-02, E-03, E-06, E-07 | T-6.8 (+ lógica probada en Plan 03) |
| `05 §5.4`–`§5.5` | T-6.1…T-6.6 |
| `07 §7.9.8`–`§7.9.10`, `§7.10.2`, `§7.11` | T-6.1…T-6.8 |

## 7. Verificación final del plan

- [ ] Resolver un intento «Completo» con los defaults (≈ 26 preguntas) de punta a punta en 360 px, sin Zoom ni scroll horizontal.
- [ ] «Atrás» conserva y permite editar respuestas; el cambio se refleja en el intento (E-07).
- [ ] El cronómetro avanza entre bloques, respeta m:ss/h:mm:ss y se detiene al confirmar resultados (RF-16).
- [ ] El acento azul→naranja ocurre exactamente una vez en modo Completo (RN-03).
- [ ] La hoja de confirmación aparece solo con blancos y con el texto en singular/plural correcto.
- [ ] `beforeunload` activo únicamente durante el quiz.
- [ ] Auditoría `web-design-guidelines` y pasada `impeccable` de cierre sin hallazgos críticos pendientes.

## 8. Registro de desvíos y decisiones

_(append-only; las entradas de ejecución se añaden al final)_

### Revisión de vigencia (2026-10-17, previa a la ejecución)

- **Confrontación con las especificaciones** (`02 §RF-12`–`§RF-18`, `§RN-03`, `§RN-06`, `§M6` (E-01, E-02, E-03, E-06, E-07); `03 §3.3` (Intento/BloqueIntento); `04 §4.5`–`§4.6` (flujo del quiz y del cálculo); `05 §5.4`–`§5.5`, `§5.7`; `07 §7.7.3`, `§7.9.8`–`§7.9.10`, `§7.10.2`, `§7.11`, `§7.12`, `§7.14`): los RF/RN/E citados por la matriz siguen correspondiendo a T-6.1…T-6.8 y no hay requisitos derogados. Todo lo que necesitan las tareas ya existe en el repo (`crearIntento`/`calcularResultado`, el modelo `Intento` con `indiceActual`/`terminadoEn`, `formatDuracion`, y el catálogo `src/components/ui/*`: `Button`, `Chip`, `ProgressSegments`, `OptionRow`, `Sheet`, `BottomBar`, `Icon`). Vigencia confirmada **sin cambios de tareas ni de matriz**.
- **Precondiciones de §4 verificadas:** Planes 03, 04 y 05 ✅ en `docs/plans/README.md`; `npm run check` → 0 errores/0 avisos, `npm run build` → 157 módulos, `npm run test` → 106 pruebas en verde.
- **Decisiones pendientes de `07 §7.16`:** #1 y #2 ya resueltas (afectaron a los Planes 04 y 05); #3 («Home» → «Inicio») afecta solo a T-7.4 (Plan 07). Ninguna condiciona este plan.
- **Tensiones detectadas entre specs (se resolverán en la tarea correspondiente, con medición real y registro):** (a) `07 §7.9.8` describe la fila de cabecera en una sola línea, mientras el wireframe de `05 §5.4` muestra el cronómetro en una segunda línea; con los textos completos de área del deck (`07 §7.11`) la fila no cabe a 360 px. Se implementará la fila de `07 §7.9.8` con `flex-wrap` y se medirá a 360/390/430 px (T-6.2). (b) `07 §7.9.10` pide el panel de texto con `<details>/<summary>` **y** un toggle con `aria-expanded`: el `<summary>` nativo ya expone el estado expandido, así que el encabezado y el toggle serán el propio `<summary>` (T-6.3). (c) `05 §5.1` pide 1 título por pantalla y `07 §7.12` (11) foco al `<h1>` al navegar; el quiz monta un bloque a la vez, así que su `<h1>` es el título del tema del bloque actual y recibe el foco al entrar y al cambiar de bloque (T-6.1/T-6.4). (d) `07 §7.7.3` fija `--ease-inout` (cubic-bezier(0.65, 0, 0.35, 1)) para la transición de bloque: las transiciones de Svelte se ejecutan con la Web Animations API (fuera del alcance de las variables CSS), así que se usa `cubicInOut` de `svelte/easing` (misma familia, diferencia imperceptible) (T-6.4).
- **`App.svelte`:** el plan lista los componentes a crear; el ensamblaje obliga a modificar `App.svelte` (sustituir el placeholder de quiz por `<QuizScreen />`, retirar de la navegación temporal la pantalla de quiz y conservarla solo en el placeholder de resultados hasta el Plan 07). Cambio de pegamento, sin alcance nuevo; se registra en la entrada de T-6.1/T-6.2.
- **Verificación V2 de este plan (nota de entorno):** el ejecutor de este turno no puede recibir imágenes; toda la V2 se hará con `chrome-devtools` **por salidas de texto** (DOM, `evaluate`, `snapshot`, consola) midiendo geometría, atributos ARIA, foco y colores computados. El juicio puramente visual (p. ej. «se ve bien») queda documentado como pendiente humano en el §7 del plan si no es verificable por DOM.

### Decisiones de ejecución

- **T-6.1 · `App.svelte` como pegamento y `<main>` propio del quiz:** el quiz se renderiza fuera del `<main>` genérico de `App.svelte` porque la cabecera sticky de T-6.2 debe ser full-bleed (como la barra inferior, que ya vive fuera de `<main>`); `QuizScreen.svelte` aporta su propio `<main class="quiz app-reserve">` con la columna de 640 px y el padding lateral 20/24 de `07 §7.5.3`. Se retira la navegación temporal de la pantalla de quiz (su salida real es «Ver resultados», RF-17) y se conserva solo en el placeholder de resultados hasta el Plan 07. Sin alcance nuevo.
- **T-6.1 · el `<h1>` del quiz es el título del tema del bloque actual:** resuelve `05 §5.1` (1 título por pantalla) + `07 §7.12` (11) con `07 §7.13` (solo se monta el bloque visible). Lleva `data-screen-title` (el `irA` de T-5.1 lo enfoca al entrar) y `tabindex="-1"`; el foco al cambiar de bloque lo añade T-6.4.
- **T-6.1 · numeración «1.» + enunciado con hanging indent:** `<legend>` con `padding-left: 22px; text-indent: -22px` (layout inline puro) en vez de flex/grid: el número queda en su propia columna y las líneas envueltas del enunciado alinean a 22 px (medido: número en x=20, primera línea en x=37, líneas siguientes en x=42). Evita las rarezas de `display` sobre `<legend>` en Safari.
- **T-6.1 · V0 ejecutada:** `npm run check` → 0 errores/0 avisos; `npm run build` → 157 módulos, CSS 6.98 kB gzip + JS 47.06 kB gzip (sin dependencias nuevas); `svelte-autofixer` sobre `QuizScreen.svelte`, `QuestionCard.svelte` y `App.svelte` → sin incidencias.
- **T-6.1 · V2 ejecutada (por DOM, 360×800 con emulación móvil+táctil):** «Iniciar quiz» → `document.title` «Simulador · Quiz», `h1[data-screen-title]` = «Razones y proporciones» (20 px/700, `padding-top` 24) **enfocado**; 2 `fieldset` (q=2 por defecto) con `legend` «1.»/«2.» y 5 radios cada uno (`name` = `pregunta.id`, valores A–E, 2 grupos distintos). Filas de 56 px de alto, separación 12 entre alternativas y 32 entre preguntas; enunciado 17 px/500 con interlineado 26.35 (1.55) y tinta `#0F172A`; número 16 px/600 `#475569`. Estado inequívoco sin hover: la fila seleccionada pasa a borde `#0063BD` + fondo `#EAF3FB` + anillo interior + peso 600 y burbuja rellena con letra blanca (forma + color + peso); la no seleccionada queda `#E2E8F0`/blanco/400. Clic en «S/ 750» → única fila con `.is-selected` (el estado vuelve del modelo, no del navegador) y clic en «S/ 600» → la selección se mueve (cambiable); la segunda pregunta queda en blanco sin bloqueo (RF-14). Sin scroll horizontal (360/360) y consola sin errores (solo trazas de Vite).
