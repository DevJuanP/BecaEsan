# Plan 06 — Quiz

> Estado: ⬜ Pendiente · Depende de: Planes 03, 04, 05 · Cubre: RF-12…RF-18, RN-03 (cambio visual de área), RN-06, RNF-01, RNF-02, RNF-05, RNF-06, RNF-09, E-01, E-02, E-03, E-06, E-07, `05 §5.4`–`§5.5`, `07 §7.9.8`–`§7.9.10`, `§7.10.2` · Estimación: L

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
- **Estado:** [ ]

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

_(vacío — se completa durante la ejecución)_
