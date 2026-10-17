# Plan 09 — Revisión de respuestas

> Estado: ✅ Hecho · Depende de: Planes 03, 04, 06, 07 · Cubre: RF-22, RF-14 (lectura), RF-19, RF-20, RF-21, RN-05, RN-06, RN-07, RN-11, E-04, E-06, E-10, RNF-01, RNF-02, RNF-06, RNF-08, `05 §5.6`–`§5.7`, `07 §7.9.16`, `§7.10.3`, `§7.11`, `§7.12`, `§7.19` · Estimación: M

## 1. Objetivo

Cerrar el ciclo de aprendizaje del producto: al terminar el quiz, el usuario puede desplegar **todas** las preguntas del intento con su estado (correcta / incorrecta / no respondida), la alternativa que marcó, la clave y la explicación de la clave. La revisión es de solo lectura, vive dentro de Resultados y se descarta con el intento.

## 2. Alcance

- **Incluye:** el botón «Mostrar respuestas correctas», el bloque de revisión por área y tema, el acordeón por pregunta con alternativas marcadas y explicación, el texto común de Comprensión de lectura, la accesibilidad (teclado, foco, contraste) y la actualización de especificaciones y microcopy.
- **No incluye:** el cálculo de resultados (Plan 03), el quiz y su ausencia de feedback (Plan 06), la pantalla de resultados existente (Plan 07), persistir la revisión ni añadir historial (`01 §1.5`), ni reabrir tareas de planes cerrados.

## 3. Referencias

- Specs: `01 §1.4` #6; `02 §RF-22`, `§RF-14`, `§RF-19`–`§RF-21`, `§RN-05`–`§RN-07`, `§RN-11`, `§E-04`, `§E-06`, `§E-10`, `§RNF-01`, `§RNF-02`, `§RNF-06`, `§RNF-08`; `03 §3.2`–`§3.3`; `05 §5.6`–`§5.7`; `06 §6.7`; `07 §7.9.16`, `§7.10.3`, `§7.11`, `§7.12`, `§7.16` #7, `§7.19`.
- Skills: `svelte-code-writer` + `svelte-core-bestpractices` (obligatorias); `web-design-guidelines` (V3); `impeccable` (cierre de la pantalla).

## 4. Precondiciones

- Planes 03, 04, 06 y 07 ✅ (existe `Intento` con `bloques[].respuestas` y `Pregunta.correcta`/`explicacion`); `check`, `build` y `test` en verde antes de empezar.
- `docs/preguntas/` es fuente única y no se edita; `questions.json` ya incluye `correcta` y `explicacion` (validado por `scripts/build-questions.mjs`).
- Decisión de diseño aprobada por el usuario (2026-10-17): revisión **en la misma pantalla**, **acordeón por pregunta** y actualización de especificaciones + plan.

## 5. Tareas

### T-9.1 — Clasificación y opciones de la revisión

- **Objetivo:** reutilizar RN-07 y derivar las alternativas marcadas sin lógica dentro de los componentes.
- **Archivos:** `src/lib/scoring.ts` (modificar), `src/lib/review.ts` (crear), `src/lib/scoring.test.ts` (modificar), `src/lib/review.test.ts` (crear).
- **Pasos:**
  1. Extraer `clasificarRespuesta(pregunta, respuesta)` a `scoring.ts` y usarla en `calcularResultado`.
  2. Añadir `opcionesRevisadas(pregunta, respuesta)` a `review.ts`: marca `esCorrecta` y `esSeleccionada` conservando orden y texto (RN-06).
  3. Pruebas: correcta / incorrecta / no respondida y opciones con clave, elegida, misma letra y blanco.
- **Criterios:** RF-22, RN-06, RN-07.
- **Verificación:** V1 (`npm run test`) + V0.
- **Estado:** [x]

### T-9.2 — Piezas de UI de la revisión

- **Objetivo:** preparar el catálogo para el disclosure y las alternativas de solo lectura.
- **Archivos:** `src/components/ui/Icon.svelte` (modificar), `src/components/ui/Button.svelte` (modificar), `src/components/quiz/SharedText.svelte` (modificar), `src/app.css` (modificar).
- **Pasos:**
  1. Añadir el icono `chevron-down` al catálogo (`07 §7.6`).
  2. Añadir `ariaExpanded` y `ariaControls` opcionales al `Button` (disclosure).
  3. Añadir `abiertoInicial` a `SharedText` para reutilizarlo cerrado en la revisión.
  4. Añadir los tintes `--color-ok-soft` y `--color-bad-soft` a `app.css` (`07 §7.19`).
- **Criterios:** RF-22, `07 §7.6`, `§7.9.4`, `§7.9.10`, `§7.19`.
- **Verificación:** V0.
- **Estado:** [x]

### T-9.3 — Acordeón de pregunta y alternativas marcadas

- **Objetivo:** cada pregunta con su estado, clave, alternativas y explicación.
- **Archivos:** `src/components/results/ReviewQuestion.svelte` (crear), `src/components/results/ReviewOption.svelte` (crear).
- **Pasos:**
  1. `ReviewQuestion`: `<details>`/`<summary>` nativo cerrado por defecto; píldora de estado con icono + palabra, «Pregunta {n}», enunciado y línea de clave; chevron que rota al abrir.
  2. Cuerpo: alternativas A–E de solo lectura, aviso de pregunta en blanco y panel «Explicación».
  3. `ReviewOption`: burbuja A–E, texto y marcas «Correcta» / «Tu respuesta»; la clave en `ok`/`ok-soft`, la elegida errónea en `bad`/`bad-soft`; nunca solo color.
- **Criterios:** RF-22, `07 §7.9.16`, `§7.12`.
- **Verificación:** V0 + V2.
- **Estado:** [x]

### T-9.4 — Bloque de revisión e integración en Resultados

- **Objetivo:** agrupar por área y tema e integrarlo con el botón de despliegue y el «Home» final.
- **Archivos:** `src/components/results/AnswerReview.svelte` (crear), `src/components/results/ResultsScreen.svelte` (modificar), `src/components/results/AreaCard.svelte` (modificar), `src/lib/config.ts` (modificar).
- **Pasos:**
  1. `AnswerReview`: agrupa los bloques por área en el orden del intento; título, ayuda, área con punto de acento, título del tema y texto común cerrado.
  2. `ResultsScreen`: botón secundario «Mostrar/Ocultar respuestas correctas» con `aria-expanded`/`aria-controls`, estado local que nace cerrado y montaje del bloque entre el recordatorio y el «Home».
  3. Mover `NOMBRE_AREA` a `config.ts` y reutilizarlo en `AreaCard` y `AnswerReview`.
- **Criterios:** RF-22, RF-21, RN-11, `05 §5.6`, `07 §7.10.3`.
- **Verificación:** V0 + V2.
- **Estado:** [x]

### T-9.5 — Especificaciones, microcopy y documentación

- **Objetivo:** dejar las especificaciones como fuente de verdad e incorporar el plan a la hoja de ruta.
- **Archivos:** `docs/especificaciones/01-vision-y-alcance.md`, `02-requerimientos-funcionales.md`, `03-modelo-de-datos.md`, `05-pantallas-y-ui.md`, `06-stack.md`, `07-design.md`; `docs/plans/00-contrato.md`, `07-resultados.md`, `08-calidad-y-despliegue.md`, `README.md`; `README.md` raíz; `DESIGN.md`.
- **Pasos:**
  1. `01 §1.4` #6 (alcance) y retirar la revisión de `01 §1.5`.
  2. `02 §RF-22` con criterios de aceptación.
  3. `03`: explicación usada; la revisión se deriva del `Intento`.
  4. `05 §5.6`/`§5.7`: wireframe y estados.
  5. `06 §6.7` y `07 §7.16` #7: resolver la mención de fase 2.
  6. `07 §7.9.16`, `§7.10.3` (#5/#6), `§7.11`, `§7.12` y `§7.19`: componente, orden, microcopy, teclado y tokens.
  7. `DESIGN.md` y README raíz: tintes y resumen del resultado.
- **Criterios:** `00-contrato §9`; trazabilidad RF-22.
- **Verificación:** V0 (lectura cruzada de citas).
- **Estado:** [x]

### T-9.6 — Verificación de la pantalla (V2 + V3)

- **Objetivo:** comprobar la revisión contra `07 §7.9.16`/`§7.12`/`§7.14` y los casos borde.
- **Archivos:** — (verificación; hallazgos se corrigen en su tarea).
- **Pasos:** recorrer el flujo real (configurar → responder acertando, fallando y dejando en blanco → resultados → mostrar/ocultar) a 360/390/430/768 px; comprobar el orden vertical, el acordeón por pregunta, la clave y la explicación, el texto común de Comprensión de lectura (E-06), el intento en blanco (E-04), los símbolos matemáticos (E-10), el teclado (botón + `<summary>`) y el retorno al `Home` (RN-05). Auditar con `web-design-guidelines` y pasar `impeccable`.
- **Criterios:** `07 §7.9.16`, `§7.12`, `§7.14`; E-04, E-06, E-10; RF-14/RN-11.
- **Verificación:** checklist marcada + hallazgos corregidos o registrados.
- **Estado:** [x]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RF-22 (revisión de respuestas) | T-9.1…T-9.6 |
| RF-14 (sin feedback en el quiz) | T-9.1, T-9.6 (lectura) |
| RF-19, RF-20 (resultados existentes) | T-9.4 |
| RF-21 (Home final y descarte) | T-9.4, T-9.6 |
| RN-05 (sin memoria entre intentos) | T-9.4, T-9.6 |
| RN-06 (orden del material) | T-9.1 |
| RN-07 (clasificación) | T-9.1 |
| RN-11 (solo áreas incluidas) | T-9.4, T-9.6 |
| E-04 (quiz en blanco) | T-9.3, T-9.6 |
| E-06 (texto común con q < 5) | T-9.4, T-9.6 |
| E-10 (símbolos matemáticos) | T-9.6 |
| RNF-01, RNF-02, RNF-06, RNF-08 | T-9.2…T-9.6 |
| `05 §5.6`, `§5.7` | T-9.4, T-9.5 |
| `07 §7.9.16`, `§7.10.3`, `§7.11`, `§7.12`, `§7.19` | T-9.2…T-9.6 |

## 7. Verificación final del plan

- [x] Desde resultados, «Mostrar respuestas correctas» despliega la revisión y «Ocultar» la pliega; el bloque nace cerrado.
- [x] La revisión cubre todas las preguntas del intento, agrupadas por área y tema, y cada una se abre de forma individual.
- [x] Cada pregunta muestra estado, clave, elección del usuario (si hubo), alternativas marcadas y explicación.
- [x] Los modos de un solo área no mencionan la otra (RN-11) y el texto común se ofrece cerrado (E-06).
- [x] La revisión no altera el puntaje ni las respuestas, y «Home» sigue descartando el intento (RN-05).
- [x] Teclado y foco: el botón y los acordeones se operan con Tab + Enter/Espacio; el estado expandido se expone.
- [x] `npm run check`, `npm run test` y `npm run build` en verde.
- [x] Auditoría `web-design-guidelines` sin hallazgos pendientes tras corregir el contraste de «No respondida»; el detector `impeccable` no está disponible en el entorno (queda el juicio visual fino como pendiente humano).

## 8. Registro de desvíos y decisiones

_(append-only)_

### Aprobación y decisiones (2026-10-17)

- **Cambio funcional aprobado por el usuario:** la «pantalla de revisión con explicaciones» que `01 §1.5`/`06 §6.7`/`07 §7.16` dejaban para fase 2 pasa a `01 §1.4` y a `02 §RF-22` (M). Se registran las especificaciones antes del cierre, según `00-contrato §9`.
- **Decisiones de diseño (usuario):** la revisión se despliega **en la misma pantalla de resultados** (no en hoja ni pantalla aparte); cada pregunta es un **acordeón cerrado por defecto** (no todas abiertas ni con «mostrar todas»); se actualizan especificaciones y plan.
- **Orden vertical:** el botón de revisión va tras el recordatorio y el bloque de revisión antes del «Home»; «Home» conserva su posición de cierre (RF-21) y el orden de `07 §7.10.3` se numera 1–6.
- **Tensiones resueltas:** (a) `--color-ok-fill`/`bad-fill` no cumplen contraste como texto: la revisión usa `--color-ok`/`--color-bad`/`--color-neutral` y añade tintes `ok-soft`/`bad-soft` (`07 §7.19`); (b) `SharedText` se abre por defecto en el quiz y cerrado en la revisión mediante `abiertoInicial`, sin duplicar el componente; (c) el `Button` del catálogo no exponía atributos de disclosure: se le añaden `ariaExpanded`/`ariaControls` opcionales; (d) `NOMBRE_AREA` vivía en `AreaCard`: se mueve a `config.ts` para reutilizarlo.

### Cierre de la ejecución (2026-10-17)

- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → 190 módulos, CSS 8.96 KB gzip, JS 52.24 KB gzip (dentro del presupuesto de `06 §6.2`); `npm run test` → 118 pruebas en verde (8 archivos; +5 de `clasificarRespuesta`/`opcionesRevisadas`); `svelte-autofixer` sobre los componentes nuevos y modificados: sin hallazgos (el `Map` de `AnswerReview` se sustituyó por un array, sin `SvelteMap`).
- **V1:** `clasificarRespuesta` cubre correcta/incorrecta/no respondida y `opcionesRevisadas` cubre clave ≠ elegida, acierto, blanco y orden del material (RN-06).
- **V2 (DOM, navegador real con la app servida en `5173`):**
  - **Flujo por defecto (13 bloques · 26 preguntas):** resultados → botón «Mostrar respuestas correctas» (`aria-expanded="true"`, `aria-controls` apuntando al bloque) → **26 acordeones** con estados `correcta: 3 · incorrecta: 21 · noRespondida: 2`, **26 claves** marcadas (`opcionesCorrectas = 26`) y 21 «Tu respuesta» en las elegidas erróneas. Al abrir una pregunta se ven estado, enunciado, línea de clave, alternativas marcadas y la explicación. Las **26 explicaciones y claves** coinciden palabra por palabra con `questions.json` (`bancoOk = true`).
  - **Ocultar/mostrar y reinicio:** «Ocultar» retira el bloque y deja `aria-expanded="false"`; al volver a mostrar, los 26 acordeones reaparecen **cerrados** (`abiertas = 0`). «Home» descarta el intento: el bloque desaparece y vuelve el panel.
  - **E-06 (Comprensión de lectura, Solo Verbal · 11 temas · 1 pregunta):** 11 temas y 11 acordeones; el tema de lectura ofrece el desplegable «Texto» **cerrado** al abrir la revisión (3 párrafos disponibles); `scrollWidth == clientWidth == 360` y 0 elementos desbordados a 360 px de ancho.
  - **E-04 + RN-11 (Solo Matemático · 1 tema · 1 pregunta, en blanco):** 1 acordeón `noRespondida`, aviso «No marcaste ninguna alternativa.», 1 clave marcada, 0 seleccionadas y **ninguna mención** a «Razonamiento Verbal».
  - **Teclado:** `Enter` sobre el `<summary>` alterna el acordeón (abierto → cerrado → abierto) y `Enter` sobre el botón de revisión lo despliega/pliega con `aria-expanded` sincronizado; foco visible en ambos.
  - **Consola:** solo los mensajes informativos de Vite; sin errores ni avisos.
- **V3 — `web-design-guidelines`:** repasados `ReviewOption.svelte`, `ReviewQuestion.svelte`, `AnswerReview.svelte`, `ResultsScreen.svelte`, `Button.svelte`, `Icon.svelte` y `SharedText.svelte`. Sin hallazgos críticos: los iconos son decorativos (`aria-hidden`), el único control nuevo es un `<button>` real y los acordeones son `<details>` nativos, hay `:focus-visible`, `prefers-reduced-motion` para el chevron, `hover` solo con puntero fino, `touch-action` heredado del cuerpo, `overflow-wrap`/`min-width: 0` en los textos y ningún `transition: all`. **Hallazgo 1 (corregido):** `neutral` (#64748B) sobre `surface-2` daba **4.34:1** en la píldora «No respondida»; se cambia a `ink-2` (**6.92:1**) en el componente y en `07 §7.9.16`.
- **Contraste (calculado sobre los tokens):** `ok`/`ok-soft` 5.21:1 · `bad`/`bad-soft` 5.91:1 · blanco/`ok` 5.48:1 · blanco/`bad` 6.47:1 · `ink` sobre los tintes >16:1.
- **Pendiente humano:** el detector `impeccable` (`scripts/impeccable.cmd`) ya no está en el repo y el ejecutor no puede recibir capturas, así que el juicio visual fino y el pase en móvil real quedan como pendientes humanos, igual que en los Planes 07–08.
