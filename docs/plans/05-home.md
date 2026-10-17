# Plan 05 — Home

> Estado: 🔄 En curso · Depende de: Planes 03, 04 · Cubre: RF-01…RF-10, RNF-01, RNF-02, RNF-04, RNF-06, RNF-07, E-08, E-09 (UI), `05 §5.2`–`§5.3`, `07 §7.9.1`, `§7.9.2`, `§7.10.1`, `§7.11` · Estimación: M

## 1. Objetivo

La pantalla Home completa: saludo editable con su hoja de nombre, panel de configuración (modo, tres sliders, puntajes, resumen en vivo) y CTA «Iniciar quiz» que genera el intento y navega al quiz. Al terminar, un usuario puede configurar un quiz en menos de un minuto y arrancarlo.

## 2. Alcance

- **Incluye:** máquina de estados de la app, saludo + lápiz + tooltip, hoja de nombre, selector de modo, sliders, puntajes con validación, resumen en vivo, CTA y su barra fija.
- **No incluye:** la pantalla del quiz (Plan 06) y resultados (Plan 07); la verificación completa de RF-10 se cierra en el Plan 07 (ida y vuelta real por resultados).

## 3. Referencias

- Specs: `02 §RF-01`–`§RF-10`, `§E-08`, `§E-09`; `03 §3.3` (ConfigQuiz), `§3.5`; `05 §5.2` (wireframe y comportamiento), `§5.3` (hoja de nombre), `§5.7` (mapa de estados); `07 §7.9.1`, `§7.9.2`, `§7.9.14`, `§7.10.1`, `§7.11` (microcopy exacto), `§7.12`, `§7.14` (checklist).
- Skills: `svelte-code-writer` + `svelte-core-bestpractices` (obligatorias al escribir `.svelte`); `web-design-guidelines` (auditoría V3); `impeccable` (cierre de la pantalla).

## 4. Precondiciones

- Planes 03 y 04 ✅ (cerrados el 2026-10-16); Plan 02 ✅ (el banco generado `src/data/questions.json` se importa al iniciar el intento).
- Decisión `07 §7.16 (#2)` (autofocus del nombre en móvil): **resuelta** el 2026-10-17 (`f21f70b`, `docs(plans): resuelve la decision 2 …`) — se aplica la propuesta de `07`: foco automático del campo **solo** con `(pointer: fine)`; en táctil rige RF-01.3 en lo demás (sin autofocus que despliegue el teclado emergente). Detalle en §8.

## 5. Tareas

### T-5.1 — Estado de la app y navegación

- **Objetivo:** única fuente de verdad del flujo `home | quiz | resultados` con las reglas de foco y título de `07 §7.12`.
- **Archivos:** `src/lib/state.svelte.ts` (crear), `src/App.svelte` (modificar).
- **Pasos:**
  1. `$state`: `screen`, `config` (con `CONFIG_INICIAL` del Plan 03), `nombre` (cargado de `storage.ts` al iniciar, RF-01.1), `intento`, `resultado`.
  2. `irA(screen)`: scroll al inicio, `document.title` («Simulador · Home | Quiz | Resultados») y foco al `h1` de la pantalla (`tabindex="-1"`, sin anillo) — `07 §7.12` (11).
  3. Reemplazar los placeholders del Plan 01; la pantalla `quiz` sigue como placeholder hasta el Plan 06.
- **Criterios:** `06 §6.2` (pantallas como estados), `07 §7.12` (11), RF-01.1.
- **Verificación:** V0 + V2 (el foco y el título cambian correctamente al navegar).
- **Estado:** [x]

### T-5.2 — Saludo + lápiz + tooltip

- **Objetivo:** RF-01.1 y RF-01.2 con el tratamiento de `07 §7.9.1`.
- **Archivos:** `src/components/home/GreetingHeader.svelte` (crear).
- **Pasos:** `h1` que envuelve el botón «Hola» / «Hola, {nombre}» (title-1) + icono `pencil` 20; `aria-label="Pon aquí tu nombre"`; `Tooltip` (T-4.7) en hover/focus de escritorio; tap/clic abre la hoja de T-5.3.
- **Criterios:** RF-01.1, RF-01.2; `07 §7.9.1`.
- **Verificación:** V0 + V2 (con y sin nombre; tooltip solo escritorio).
- **Estado:** [x]

### T-5.3 — Hoja de nombre

- **Objetivo:** RF-01.3, RF-01.4, RF-01.5 y RF-02 completos.
- **Archivos:** `src/components/home/NameModal.svelte` (crear).
- **Pasos:**
  1. Sobre `Sheet` (T-4.6): título «¿Cómo te llamas?», etiqueta «Tu nombre», campo de texto (máx. 30, ayuda «Máx. 30 caracteres» que pasa a mensaje de error si corresponde), X de cierre, «Guardar» (primaria) y «Cancelar» (secundaria) — microcopy exacto de `07 §7.11`.
  2. Foco automático al campo **solo** con `(pointer: fine)` (decisión `07 §7.16 #2` de §4).
  3. `trim` al guardar; vacío → borrar nombre y saludo «Hola» (E-08); guardar con `storage.ts` (Plan 03); el saludo se actualiza al instante; al cerrar, el foco vuelve al lápiz.
  4. Cancelar / X / `Escape` / toque fuera descartan cambios (CA de RF-01).
- **Criterios:** RF-01.3/.4/.5, RF-02, E-08.
- **Verificación:** V0 + V2 con los CA textuales de `02 §RF-01` (guardar → saludo inmediato; recargar → persiste; cancelar con texto → sin cambios; guardar vacío → «Hola»).
- **Estado:** [x]

### T-5.4 — Selector de modo

- **Objetivo:** RF-03 con el patrón de `07 §7.9.2`.
- **Archivos:** `src/components/home/ModeSelector.svelte` (crear).
- **Pasos:** control segmentado con **radios nativos** (flechas del teclado gratis); visible «Matemático / Verbal / Completo» + `aria-label` completos («Solo Razonamiento Matemático», «Solo Razonamiento Verbal», «Completo»); al cambiar, la tarjeta de sliders del área excluida se oculta (fade 180 ms; reduced-motion: instantáneo) **conservando sus valores**.
- **Criterios:** RF-03; `07 §7.9.2`; CA de `02 §RF-03`.
- **Verificación:** V0 + V2 (Solo Verbal → RM invisible; volver a Completo → valor previo intacto).
- **Estado:** [ ]

### T-5.5 — Sliders del panel

- **Objetivo:** RF-04, RF-05 y RF-06 cableados al estado.
- **Archivos:** `src/components/home/ConfigPanel.svelte` (crear; agrupa T-5.4…T-5.7).
- **Pasos:** tres `Slider` (T-4.4) con microcopy de `07 §7.11`:
  - RM: 1–17, azul, valor «{k} de 17», caption «Al azar, sin repetirse»;
  - RV: 1–11, naranja, valor «{k} de 11», caption «Al azar, sin repetirse»;
  - Preguntas: 1–5, azul, valor «{q} de 5», caption «Al azar, dentro de cada tema».
  Separación 24 entre sliders; etiquetas completas («Temas de Razonamiento Matemático», etc.).
- **Criterios:** RF-04, RF-05, RF-06; `07 §7.8`.
- **Verificación:** V0 + V2 (valores iniciales 8/5/2; arrastre, tap y teclado; burbuja; nada depende de hover).
- **Estado:** [ ]

### T-5.6 — Puntajes

- **Objetivo:** RF-07 con validación en vivo y bloqueo del CTA.
- **Archivos:** `src/components/home/ScoreInputs.svelte` (crear).
- **Pasos:** tres `Stepper` (T-4.3) con etiquetas cortas «Correcta / No respondida / Incorrecta» (aria-labels completos de `07 §7.11`); defaults 5 / 0 / −2; validación con `validarConfig` (Plan 03); campo inválido → error inline + `aria-invalid`; con cualquier error: «Iniciar quiz» deshabilitado + línea de motivo «Corrige los puntajes marcados para iniciar» (`07 §7.9.14`).
- **Criterios:** RF-07, E-09; `07 §7.9.14`.
- **Verificación:** V0 + V2 (vaciado, texto no numérico, fuera de rango, −2 visible con signo `−`).
- **Estado:** [ ]

### T-5.7 — Resumen en vivo y CTA «Iniciar quiz»

- **Objetivo:** RF-08 y RF-09 de punta a punta.
- **Archivos:** `src/components/home/ConfigPanel.svelte`, `src/App.svelte` (modificar).
- **Pasos:**
  1. Línea de resumen con `resumenConfig` (Plan 03), tabular, recalculada al instante («Completo · 13 temas · 26 preguntas»).
  2. Barra fija inferior (T-4.2) con «Iniciar quiz» ancho completo, habilitado solo con configuración válida.
  3. Al pulsar: importar el banco (`src/data/questions.json` tipado `Tema[]`), `crearIntento(config, banco)` → guardar en estado → `irA('quiz')` (pantalla de Plan 06; hasta entonces, placeholder).
- **Criterios:** RF-08, RF-09; CA de `02 §RF-09` (genera intento y navega).
- **Verificación:** V0 + V2 (resumen cambia con modo/sliders; CTA deshabilitado con error; el clic genera intento visible en el estado del quiz placeholder).
- **Estado:** [ ]

### T-5.8 — Verificación de pantalla (V2 + V3)

- **Objetivo:** cerrar la pantalla contra `07 §7.10.1` + `§7.14`.
- **Archivos:** — (verificación; los hallazgos se corrigen en sus tareas).
- **Pasos:** checklist de `07 §7.14` por bloques (composición, interacción, accesibilidad, movimiento, contenido) sobre Home y su hoja; anchos 360/390/430/768; recorrido de teclado completo (saludo → modo → sliders → steppers → CTA → hoja); `reduced-motion`; RF-10 parcial (config conservada al ir y volver del placeholder). Auditoría `web-design-guidelines` sobre los archivos de la pantalla; pasada `impeccable` de cierre.
- **Criterios:** `07 §7.10.1`, `§7.14`, `§7.12`; RNF-01/02/06.
- **Verificación:** checklist marcada + hallazgos corregidos o registrados.
- **Estado:** [ ]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RF-01 (saludo, tooltip, hoja, validación) | T-5.2, T-5.3 |
| RF-02 (persistencia del nombre) | T-5.3 (lógica en Plan 03) |
| RF-03 (modo) | T-5.4 |
| RF-04, RF-05, RF-06 (sliders) | T-5.5 |
| RF-07 (puntajes) | T-5.6 |
| RF-08 (resumen) | T-5.7 |
| RF-09 (CTA) | T-5.7 |
| RF-10 (conservación de config) | T-5.1–T-5.7 (cierre en Plan 07) |
| RNF-01, RNF-02, RNF-06, RNF-07 | T-5.8 + todas |
| RNF-04 (persistencia local) | T-5.1, T-5.3 |
| E-08 (nombre vacío) | T-5.3 |
| E-09 (signo −) | T-5.6 |
| `05 §5.2`–`§5.3`, `§5.7` | Todas |
| `07 §7.9.1`, `§7.9.2`, `§7.9.14`, `§7.10.1`, `§7.11` | T-5.2…T-5.8 |

## 7. Verificación final del plan

- [ ] El ciclo «escribir nombre → configurar → Iniciar quiz» funciona completo en un móvil de 360 px sin zoom ni scroll horizontal.
- [ ] CA de `02 §RF-01` probados uno a uno (incluye recargar la página con nombre guardado).
- [ ] Con «Solo Matemático»/«Solo Verbal» la sección excluida desaparece y los valores se conservan al volver.
- [ ] Sliders operables por arrastre, tap y teclado; valor siempre visible (RF-04).
- [ ] Con cualquier puntaje inválido, el CTA queda deshabilitado con su motivo visible.
- [ ] Auditoría `web-design-guidelines` y pasada `impeccable` de cierre sin hallazgos críticos pendientes.

## 8. Registro de desvíos y decisiones

_(append-only; las entradas de ejecución se añaden al final)_

### Revisión de vigencia (2026-10-17, previa a la ejecución)

- **Decisión pendiente `07 §7.16 (#2)` — autofocus del nombre en móvil: resuelta por el orquestador** (commit `f21f70b`, ya reflejado en la tabla de decisiones de `docs/plans/README.md`): se aplica la **propuesta** de `07`. T-5.3 se implementa con foco automático del campo **solo** con `(pointer: fine)`; en móvil táctil no hay autofocus (evita el teclado emergente sobre la hoja) y el resto de RF-01.3 se cumple literal (foco contenido en la hoja; al cerrar vuelve al lápiz). Precondición de §4 actualizada en consecuencia; no cambian tareas ni matriz.
- **Confrontación con las especificaciones (`02 §RF-01`–`§RF-10`, `§E-08`, `§E-09`; `03 §3.3`, `§3.5`; `04 §4.1`–`§4.4`; `05 §5.2`, `§5.3`, `§5.7`; `06 §6.1`–`§6.3`; `07 §7.9.1`, `§7.9.2`, `§7.9.14`, `§7.10.1`, `§7.11`, `§7.12`, `§7.14`): los RF/RN/RNF/E citados por la matriz siguen correspondiendo a T-5.1…T-5.8 y no hay requisitos derogados. Todo lo que necesitan las tareas ya existe en el repo (`CONFIG_INICIAL`/`validarConfig`/`resumenConfig` de `src/lib/config.ts`, `crearIntento` de `src/lib/generator.ts`, `leerNombre`/`guardarNombre` de `src/lib/storage.ts`, catálogo `src/components/ui/*` del Plan 04). Vigencia confirmada sin cambios de alcance.
- **Rutas de archivos:** el plan crea `src/components/home/*.svelte` (subcarpeta, coherente con `src/components/ui/*` del Plan 04 y con `src/components/dev/Gallery.svelte`); `06 §6.3` propone un listado plano orientativo que los planes concretan — no es un desvío.
- **Pendiente `07 §7.16 (#3)` («Home» → «Inicio»):** afecta solo a T-7.4 (Plan 07); no toca este plan.

### Decisiones de ejecución

- **T-5.1 · navegación temporal conservada hasta T-5.7:** la V2 de T-5.1 («el foco y el título cambian correctamente al navegar») exige poder cambiar de pantalla antes de que exista el CTA real. Se mantiene una `nav` temporal (marcada como tal en `App.svelte` y en el plan) que se retira en T-5.7, cuando «Iniciar quiz» y el botón «Home» del Plan 07 la reemplacen. Mismo criterio incremental que la galería del Plan 04; sin cambios de alcance.
- **T-5.1 · estado como clase `$state` en módulo `.svelte.ts`:** `src/lib/state.svelte.ts` exporta la clase `EstadoApp` y una instancia única `estado` (fuente única de verdad de `06 §6.2`). `config` se inicializa con una copia mutable de `CONFIG_INICIAL` (el default del Plan 03 está congelado en profundidad) y `nombre` con `leerNombre()` (RF-01.1/§RF-02). El título inicial del documento se fija en el constructor, para que la primera carga no dependa de una navegación.
- **T-5.1 · anillo del título de pantalla:** `07 §7.12` (11) pide foco al `h1` «sin anillo visible para este movimiento programático», en tensión con la regla «jamás `outline: none` sin reemplazo» de §7.12.2. Se añade a `src/app.css` la regla `[data-screen-title]:focus { outline: none }`, acotada al título de pantalla (`tabindex="-1"`, fuera del orden de tabulación); ningún control interactivo pierde su anillo.
- **T-5.1 · V0 ejecutada:** `npm run check` → 0 errores y 0 avisos; `npm run build` → 114 módulos, CSS 3.69 kB gzip + JS 14.31 kB gzip (sin dependencias nuevas).
- **T-5.1 · V2 ejecutada (por DOM, 360 px):** título inicial «Simulador · Home»; al pulsar la navegación temporal: «Simulador · Quiz» → «Simulador · Resultados» → «Simulador · Home», con `document.activeElement` = `h1[data-screen-title][tabindex="-1"]` en los tres casos (`outline-style: none`, `scrollY` 0) y consola sin errores.
- **T-5.2 · un solo botón con el saludo y el lápiz:** `07 §7.9.1` pide que el `h1` envuelva **un** botón con el texto del saludo + el lápiz y `aria-label="Pon aquí tu nombre"` (lo que `05 §5.3` necesita: «se abre al tocar el lápiz **o el saludo**»). Se implementa así, con el envoltorio `Tooltip` del Plan 04 dentro del `h1` (`role="presentation"`, decorativo). **Observación de accesibilidad (sin cambio de alcance):** al llevar el botón un `aria-label`, el nombre calculado del `h1` pasa a ser «Pon aquí tu nombre» y el texto del saludo («Hola, Juan») no se anuncia a lectores de pantalla. Es consecuencia literal de `07 §7.9.1` + `07 §7.11` (el deck fija una única cadena para ese `aria-label`); se respeta y se deja anotado por si el humano quiere abrir un micro-ajuste de `07` (fuera de v1 del plan).
- **T-5.2 · V0 ejecutada:** `npm run check` → 0 errores/0 avisos; `npx @sveltejs/mcp svelte-autofixer` sobre `GreetingHeader.svelte` → sin problemas ni sugerencias.
- **T-5.2 · V2 ejecutada (por DOM, 360 px táctil + escritorio):** sin nombre guardado → «Hola»; con `beca-esan.nombre = "Ana"` y recarga → «Hola, Ana» (RF-01.1, lectura de RF-02). Botón: 100×44 px (área táctil ≥44), radio 12, fondo transparente, `title-1` (22 px/700/27.5 px/tracking −0.22 px), lápiz de 20×20 con tinta `#475569` (`ink-2`) a 8 px del texto; `aria-label="Pon aquí tu nombre"`; texto alineado al padding lateral de pantalla (20 px) y sin scroll horizontal a 360 px. Tooltip: en escritorio con `(hover: hover) and (pointer: fine)` el chip aparece sobre el botón (8 px por encima, fondo `#0F172A`, texto blanco 13 px, radio 8, padding 6×10, `z-index` 60, fundido 0.12 s) tras los 300 ms de hover; en emulación táctil el chip queda en `display: none` (`aria-hidden`), un `pointerenter` sintético no lo muestra y no se programa ningún temporizador. Consola sin errores.
- **T-5.3 · el borrador del nombre vive en `App.svelte`, no en la hoja:** cada apertura debe partir del nombre guardado y descartar lo escrito antes (RF-01.4), y el descarte tiene que funcionar también con `Escape` y toque fuera, que cierran la hoja sin pasar por un botón. En vez de reiniciar estado dentro de un `$effect` (malpractice que el autofixer de Svelte señala), `abrirHojaNombre()` en `App.svelte` reinicia el borrador y lo pasa con `bind:value`; la hoja queda presentacional y sin estado propio. El `$effect` que queda solo hace foco (efecto externo al DOM), sin escribir estado.
- **T-5.3 · tope de 30 caracteres (interpretación):** el campo **no** usa `maxlength` (lo bloquearía el pegado y el mensaje de error del deck nunca podría aparecer). Se deja escribir el texto completo: con más de 30 caracteres la ayuda «Máx. 30 caracteres» pasa a error «Máximo 30 caracteres.» con `aria-invalid` y `aria-describedby` (`07 §7.9.11`, `§7.9.14`) y «Guardar» sigue aplicando `trim` + tope de 30, que es el contrato ya probado de `guardarNombre` (Plan 03, `02 §RF-01.4`). No se bloquea el guardado: RF-01.4 no lo pide (solo RF-07 bloquea el CTA).
- **T-5.3 · V0 ejecutada:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 5.28 kB gzip + JS 20.22 kB gzip; `svelte-autofixer` sobre `NameModal.svelte` sin incidencias (quedan solo sugerencias genéricas sobre `$effect`/`bind:this`, revisadas: el efecto no escribe estado y `bind:this` sigue el patrón del Plan 04).
- **T-5.3 · V2 ejecutada (por DOM, 360 px táctil y escritorio 1280 px):** hoja = `<dialog>` nativo con `aria-modal`, título «¿Cómo te llamas?», X «Cerrar», «Cancelar»/«Guardar» (móvil apiladas, 680/736 px; escritorio en fila a la derecha, diálogo de 400 px). Campo: etiqueta visible «Tu nombre», alto 48, radio 12, borde `line-strong`, 16 px de fuente (evita el zoom de iOS), `placeholder` «Ej. Juan», `autocomplete="given-name"` y ayuda «Máx. 30 caracteres». **CA de `02 §RF-01` uno a uno:** guardar «Ana» → saludo «Hola, Ana» inmediato + `beca-esan.nombre = "Ana"` + hoja cerrada; recargar → «Hola, Ana»; cancelar con «Pedro» → sin cambios; guardar vacío/espacios → saludo «Hola» y clave eliminada (E-08); `trim` («␣␣␣Lucía␣␣␣» → «Lucía»). X, `Escape` real y clic en el scrim descartan. **Foco:** con puntero fino entra al campo al abrir (`07 §7.16` #2) y **vuelve al lápiz** al cerrar (clic real); en emulación táctil (`pointer: coarse`) el campo **no** recibe autofocus (el foco inicial queda en la X de la hoja, dentro de la modal). Error de longitud: ayuda en `#B91C1C`, `aria-invalid="true"`, borde `bad` y vuelta instantánea al corregir. Sin scroll horizontal a 360 px y consola sin errores.
