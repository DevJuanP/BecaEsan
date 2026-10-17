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
- **Estado:** [x]

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
- **Estado:** [x]

### T-5.6 — Puntajes

- **Objetivo:** RF-07 con validación en vivo y bloqueo del CTA.
- **Archivos:** `src/components/home/ScoreInputs.svelte` (crear).
- **Pasos:** tres `Stepper` (T-4.3) con etiquetas cortas «Correcta / No respondida / Incorrecta» (aria-labels completos de `07 §7.11`); defaults 5 / 0 / −2; validación con `validarConfig` (Plan 03); campo inválido → error inline + `aria-invalid`; con cualquier error: «Iniciar quiz» deshabilitado + línea de motivo «Corrige los puntajes marcados para iniciar» (`07 §7.9.14`).
- **Criterios:** RF-07, E-09; `07 §7.9.14`.
- **Verificación:** V0 + V2 (vaciado, texto no numérico, fuera de rango, −2 visible con signo `−`).
- **Estado:** [x]

### T-5.7 — Resumen en vivo y CTA «Iniciar quiz»

- **Objetivo:** RF-08 y RF-09 de punta a punta.
- **Archivos:** `src/components/home/ConfigPanel.svelte`, `src/App.svelte` (modificar).
- **Pasos:**
  1. Línea de resumen con `resumenConfig` (Plan 03), tabular, recalculada al instante («Completo · 13 temas · 26 preguntas»).
  2. Barra fija inferior (T-4.2) con «Iniciar quiz» ancho completo, habilitado solo con configuración válida.
  3. Al pulsar: importar el banco (`src/data/questions.json` tipado `Tema[]`), `crearIntento(config, banco)` → guardar en estado → `irA('quiz')` (pantalla de Plan 06; hasta entonces, placeholder).
- **Criterios:** RF-08, RF-09; CA de `02 §RF-09` (genera intento y navega).
- **Verificación:** V0 + V2 (resumen cambia con modo/sliders; CTA deshabilitado con error; el clic genera intento visible en el estado del quiz placeholder).
- **Estado:** [x]

### T-5.8 — Verificación de pantalla (V2 + V3)
- **Objetivo:** cerrar la pantalla contra `07 §7.10.1` + `§7.14`.
- **Archivos:** — (verificación; los hallazgos se corrigen en sus tareas).
- **Pasos:** checklist de `07 §7.14` por bloques (composición, interacción, accesibilidad, movimiento, contenido) sobre Home y su hoja; anchos 360/390/430/768; recorrido de teclado completo (saludo → modo → sliders → steppers → CTA → hoja); `reduced-motion`; RF-10 parcial (config conservada al ir y volver del placeholder). Auditoría `web-design-guidelines` sobre los archivos de la pantalla; pasada `impeccable` de cierre.
- **Criterios:** `07 §7.10.1`, `§7.14`, `§7.12`; RNF-01/02/06.
- **Verificación:** checklist marcada + hallazgos corregidos o registrados.
- **Estado:** [x]

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

- [x] El ciclo «escribir nombre → configurar → Iniciar quiz» funciona completo en un móvil de 360 px sin zoom ni scroll horizontal.
- [x] CA de `02 §RF-01` probados uno a uno (incluye recargar la página con nombre guardado).
- [x] Con «Solo Matemático»/«Solo Verbal» la sección excluida desaparece y los valores se conservan al volver.
- [x] Sliders operables por arrastre, tap y teclado; valor siempre visible (RF-04).
- [x] Con cualquier puntaje inválido, el CTA queda deshabilitado con su motivo visible.
- [x] Auditoría `web-design-guidelines` y pasada `impeccable` de cierre sin hallazgos críticos pendientes.

## 8. Registro de desvíos y decisiones

_(append-only; las entradas de ejecución se añaden al final)_

### Revisión de vigencia (2026-10-17, previa a la ejecución)

- **Decisión pendiente `07 §7.16 (#2)` — autofocus del nombre en móvil: resuelta por el orquestador** (commit `f21f70b`, ya reflejado en la tabla de decisiones de `docs/plans/README.md`): se aplica la **propuesta** de `07`. T-5.3 se implementa con foco automático del campo **solo** con `(pointer: fine)`; en móvil táctil no hay autofocus (evita el teclado emergente sobre la hoja) y el resto de RF-01.3 se cumple literal (foco contenido en la hoja; al cerrar vuelve al lápiz). Precondición de §4 actualizada en consecuencia; no cambian tareas ni matriz.
- **Confrontación con las especificaciones (`02 §RF-01`–`§RF-10`, `§E-08`, `§E-09`; `03 §3.3`, `§3.5`; `04 §4.1`–`§4.4`; `05 §5.2`, `§5.3`, `§5.7`; `06 §6.1`–`§6.3`; `07 §7.9.1`, `§7.9.2`, `§7.9.14`, `§7.10.1`, `§7.11`, `§7.12`, `§7.14`): los RF/RN/RNF/E citados por la matriz siguen correspondiendo a T-5.1…T-5.8 y no hay requisitos derogados. Todo lo que necesitan las tareas ya existe en el repo (`CONFIG_INICIAL`/`validarConfig`/`resumenConfig` de `src/lib/config.ts`, `crearIntento` de `src/lib/generator.ts`, `leerNombre`/`guardarNombre` de `src/lib/storage.ts`, catálogo `src/components/ui/*` del Plan 04). Vigencia confirmada sin cambios de alcance.
- **Rutas de archivos:** el plan crea `src/components/home/*.svelte` (subcarpeta, coherente con `src/components/ui/*` del Plan 04 y con `src/components/dev/Gallery.svelte`); `06 §6.3` propone un listado plano orientativo que los planes concretan — no es un desvío.
- **Pendiente `07 §7.16 (#3)` («Home» → «Inicio»):** afecta solo a T-7.4 (Plan 07); no toca este plan.

### Decisiones de ejecución

- **T-5.1 · navegación temporal conservada hasta T-5.7:** la V2 de T-5.1 («el foco y el título cambian correctamente al navegar») exige poder cambiar de pantalla antes de que exista el CTA real. Se mantiene una `nav` temporal (marcada como tal en `App.svelte` y en el plan) que se retira en T-5.7, cuando «Iniciar quiz» la reemplace; en T-5.7 queda reducida a las pantallas placeholder (ver la entrada de T-5.7). Mismo criterio incremental que la galería del Plan 04; sin cambios de alcance.
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
- **T-5.4 · V2 ejecutada (por DOM, 360 px táctil, sin capturas):** tarjeta «Modo del quiz» (padding 16 en 360 px, radio 16, borde `line`, fondo `surface`) con el grupo en píldora (`role="radiogroup"` con `aria-labelledby` al `h2`, padding 4, fondo `surface-2`, radio 12). **Radios nativos** (`name` común, ocultos con `opacity: 0` y 1×1) con los `aria-label` completos del deck («Solo Razonamiento Matemático» · «Solo Razonamiento Verbal» · «Completo») y etiquetas visibles cortas; inicial «Completo» (RF-03). Opciones de 44 px de alto, radio 10, `label` 15/500 `ink-2`; la seleccionada pasa a fondo `surface`, `ink`, peso 600 y micro-sombra pop (nunca solo color); pressed `surface` + `scale(0.98)`. Teclado: `Tab` enfoca el grupo y las **flechas nativas** recorren y marcan (Completo → Verbal → Matemático → vuelta), con el anillo de 2 px `--color-focus` pintado sobre la opción (`:has(input:focus-visible)`); clic real en la etiqueta también selecciona. Sin scroll horizontal a 360 px y consola sin errores.
- **T-5.4 · reparto de la verificación con T-5.5 (orden de tareas):** la V2 de T-5.4 incluye «Solo Verbal → RM invisible; volver a Completo → valor previo intacto», pero la tarjeta de sliders la crea T-5.5 (ConfigPanel). T-5.4 se cierra con la V2 del selector (arriba) y la ocultación con conservación de valores se verifica en T-5.5, cuando la tarjeta existe; sin cambios de alcance.
- **T-5.4 · tarjeta de sección como utilidad global:** `07 §7.9.5` define la tarjeta (superficie, borde 1 px `line`, radio 16, padding 16/20) y la usan tres componentes de la pantalla (modo, sliders y puntajes). Se añade `.tarjeta` + `.tarjeta__titulo` a `src/app.css` (junto a `.tnum` y `.app-reserve` del Plan 01) en lugar de triplicar el bloque en cada componente.
- **T-5.5 · `ConfigPanel` recibe la configuración compartida y la muta:** en vez de encadenar props por cada campo (modo, tres sliders y tres puntajes), el panel recibe `config` (`estado.config`) y los controles escriben sobre él (`bind:value={config.temasRM}`). Es la fuente única de verdad de `06 §6.2` sin copias intermedias: RF-10 (conservación) y RF-08 (resumen en vivo) salen gratis. Si en T-5.6/T-5.7 hiciera falta, se mantiene el mismo criterio.
- **T-5.5 · ocultación de la sección excluida con `fade` de Svelte:** `07 §7.9.2` pide ocultar con fade de 180 ms «sin animación de altura» y con reduced-motion instantáneo. Se usa `transition:fade` (`svelte/transition`, parte del stack) sobre el envoltorio de cada slider con `duration = prefersReducedMotion.current ? 0 : 180` (`svelte/motion`), porque la transición la maneja JS y una media query CSS no la apagaría. Los valores se conservan siempre (viven en `config`, no en el DOM). El ancho de las tarjetas y la separación de 24 px entre sliders se mantienen.
- **T-5.5 · V0 ejecutada:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 6.00 kB gzip + JS 23.70 kB gzip; `svelte-autofixer` sobre `ConfigPanel.svelte` sin incidencias (se corrigieron dos avisos propios: `prefersReducedMotion.current` —en Svelte 5.57 es `MediaQuery`, no un store— y un selector CSS sin uso).
- **T-5.5 · V2 ejecutada (por DOM, 360 px táctil, sin capturas):** tres sliders con los valores iniciales **8/5/2** y los textos del deck («8 de 17» · «5 de 11» · «2 de 5»), `aria-valuetext` «8 de 17 temas» / «5 de 11 temas» / «2 de 5 preguntas», `min/max/step` 1/17/1 · 1/11/1 · 1/5/1, 17/11/5 segmentos con el relleno azul `#0063BD` (RM y preguntas) y naranja `#EA580C` (RV), track de 44 px, extremos y captions «Al azar, sin repetirse» / «Al azar, dentro de cada tema». Separación de **24 px** entre sliders, tarjeta con padding 16 (360 px), gap 16 entre bloques del panel, título «Configura tu quiz» 20/700 y `region` con nombre accesible. Interacción: tap para saltar (franja 12 → «12 de 17», burbuja visible y segmentos sin transición durante el gesto, burbuja apagada a los ~400 ms de soltar) y teclado real (`→` +1, `Home` → 1, `End` → 5, con el texto de valor, los segmentos y la burbuja siguiendo; anillo de 2 px en el track). **Ocultación (RF-03 + RF-10):** con «Solo Verbal» el slider de RM se va con un fade medido (opacidad 1 → 0.63 a 60 ms → 0.35 a 120 ms → fuera a 180 ms, sin animación de altura) y «Solo Matemático» oculta el de RV; al volver a «Completo» reaparecen con sus valores intactos (12 y 5). Con `prefers-reduced-motion: reduce` forzado por `initScript` la salida es instantánea (sin fade). Sin scroll horizontal a 360 px y consola sin errores.
- **T-5.6 · V0 ejecutada:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 6.19 kB gzip + JS 24.79 kB gzip; `svelte-autofixer` sobre `ScoreInputs.svelte` sin incidencias.
- **T-5.6 · V2 ejecutada (por DOM, 360 px táctil, sin capturas):** tarjeta «Puntajes» con el título `title-3` y el caption «Puntos que suma cada tipo de respuesta» (13 px `ink-3`); tres steppers separados **20 px**. Filas con las etiquetas cortas del deck («Correcta» · «No respondida» · «Incorrecta») y los `aria-label` completos («Puntos por respuesta correcta» · «Puntos por pregunta no respondida» · «Puntos por respuesta incorrecta»); valores iniciales **5 / 0 / −2**, con el menos tipográfico U+2212 en «−2» (código 8722, también tras salir del campo, E-09); campos con `inputmode="numeric"`, `autocomplete="off"`, 64×44 px, botones ± de 44×44 con sus `aria-label`. **Validación en vivo (RF-07, `07 §7.9.14`):** vaciado, texto no numérico («abc» se queda a la vista para corregirlo) y fuera de rango («1000») marcan `aria-invalid="true"`, borde `#B91C1C`, `aria-describedby` al mensaje «Escribe un número entre −999 y 999.» (en `--color-bad`, junto al control) y desaparecen al instante al corregir. Sin scroll horizontal a 360 px. (El «Iniciar quiz» deshabilitado con su motivo es de T-5.7, donde existe el CTA.)
- **T-5.7 · motivo del CTA dentro de la barra fija (`BottomBar` con `note`):** `07 §7.9.14` pide la línea de motivo «sobre el botón», y el botón vive en la barra fija. `BottomBar` (Plan 04) gana un snippet opcional `note` que se apila encima de la fila de acciones, sin tocar el layout existente (la fila conserva `flex: 2`/`1` del primario y del secundario). El estilo del motivo (`caption` `ink-3` centrada) queda en `ConfigPanel`, que es quien aporta el texto; el margen de 6 px no se aplica cuando no hay motivo.
- **T-5.7 · navegación temporal reducida a los placeholders:** la `nav` temporal ya no aparece en Home (su flujo real es el CTA, RF-09) y queda solo en las pantallas placeholder de quiz y resultados, como sustituta del botón «Home» del Plan 07 (RF-21). Así T-5.8 puede verificar la ida y vuelta de RF-10 sin dejar un control temporal a la vista en la pantalla terminada.
- **T-5.7 · banco tipado con conversión explícita:** `src/data/questions.json` se importa de forma estática (entra al bundle: 46.58 kB gzip de JS, dentro del presupuesto de `06 §6.2`) y se tipa con `as unknown as Tema[]` porque el JSON generado no conserva los literales de `Area`/`Letra`; el contrato lo garantiza el validador de build del Plan 02 (`06 §6.4`, `03 §3.2`).
- **T-5.7 · corrección de la reserva de scroll (`.app-reserve`):** medido a 360 px, con la reserva de 64 px que traía el Plan 01 (`07 §7.10.1` y `§7.5.1`) **9 px del resumen quedaban ocultos tras la barra** (73 px reales: botón de 48 + padding 24 + borde 1). Rige la regla funcional de `07 §7.5.3` y `§7.9.6` («padding-bottom equivalente a la barra fija + 16 px… de modo que nada quede oculto»): se añade el token `--bar-height` y la reserva pasa a `calc(--bar-height + 16px + safe-area)` = 89 px, con el resumen 16 px por encima de la barra y 0 px ocultos. Beneficia también a la pantalla del quiz (misma barra).
- **T-5.7 · V0 ejecutada:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 6.43 kB gzip + JS 46.58 kB gzip (incluye el banco); `svelte-autofixer` sobre `ConfigPanel.svelte`, `BottomBar.svelte` y `App.svelte` sin incidencias.
- **T-5.7 · V2 ejecutada (por DOM, 360 px táctil, sin capturas):** resumen «Completo · 13 temas · 26 preguntas» en `label` 500 `ink-2` tabular (el ejemplo literal de `07 §7.10.1`) que se recalcula al instante: «Solo Matemático · 8 temas · 16 preguntas», «Solo Verbal · 5 temas · 10 preguntas» y, con los sliders a tope, «22 temas · 44 preguntas» → «22 temas · 110 preguntas». Barra fija (`position: fixed`, `z-index` 10, ancho completo, botón de 320×48) con «Iniciar quiz» primario azul `#0063BD`; con un puntaje inválido el CTA queda deshabilitado (fondo `line`, texto `ink-disabled`), aparece sobre él «Corrige los puntajes marcados para iniciar» (13 px `ink-3`, centrada, 6 px de aire) y la barra crece a 97 px; el clic en el CTA deshabilitado **no** navega. Al corregir, vuelve el estado habilitado. **CA de `02 §RF-09`:** el clic genera el intento (Completo 8 + 5 temas × 2 = «13 bloques · 26 preguntas» visible en el placeholder) y navega al quiz con título «Simulador · Quiz», foco en el `h1` y scroll arriba; la barra desaparece fuera de Home. **RF-10 (parcial, cierre en Plan 07):** configurando Solo Matemático · RM 17 · 4 preguntas · puntajes 5/1/−1, al iniciar el quiz y volver con el botón temporal de los placeholders, la configuración y el nombre se conservan intactos (17 bloques · 34 preguntas en el intento). Sin scroll horizontal a 360 px, nada oculto tras la barra (16 px de aire) y consola sin errores. Filas con las etiquetas cortas del deck («Correcta» · «No respondida» · «Incorrecta») y los `aria-label` completos («Puntos por respuesta correcta» · «Puntos por pregunta no respondida» · «Puntos por respuesta incorrecta»); valores iniciales **5 / 0 / −2**, con el menos tipográfico U+2212 en «−2» (código 8722, también tras salir del campo, E-09); campos con `inputmode="numeric"`, `autocomplete="off"`, 64×44 px, botones ± de 44×44 con sus `aria-label`. **Validación en vivo (RF-07, `07 §7.9.14`):** vaciado, texto no numérico («abc» se queda a la vista para corregirlo) y fuera de rango («1000») marcan `aria-invalid="true"`, borde `#B91C1C`, `aria-describedby` al mensaje «Escribe un número entre −999 y 999.» (en `--color-bad`, junto al control) y desaparecen al instante al corregir. Sin scroll horizontal a 360 px. (El «Iniciar quiz» deshabilitado con su motivo es de T-5.7, donde existe el CTA.) `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 6.00 kB gzip + JS 23.70 kB gzip; `svelte-autofixer` sobre `ConfigPanel.svelte` sin incidencias (se corrigieron dos avisos propios: `prefersReducedMotion.current` —en Svelte 5.57 es `MediaQuery`, no un store— y un selector CSS sin uso).

### Cierre

- **T-5.8 · checklist `07 §7.14` (V2 por DOM, sin capturas; anchos 360/390/430/768 px):**
  - *Composición:* una columna; **sin scroll horizontal** en los cuatro anchos (`scrollWidth == innerWidth`); padding lateral 20 px y 24 px desde 430 px (se corrigió `App.svelte`, que traía 20/24 desde 768 px); tarjetas con padding 16/20 y radio 16; jerarquía `h1` (saludo) → `h2` (sección, tarjetas, hoja) por tamaño/peso/espacio; sin mini-etiquetas en mayúsculas; sin tarjetas anidadas; **una sola elevación por elemento** (tarjetas con borde 1 px y sin sombra; la opción de modo seleccionada con `surface` + micro-sombra pop).
  - *Interacción y estados:* reposo / pressed / focus / disabled / error presentes en todo lo tocable; hover solo con `(hover: hover) and (pointer: fine)`; 17 objetivos interactivos medidos, **ninguno por debajo de 44×44**; separaciones de 12 px (acciones de barra y steppers), 20 px (filas de puntaje) y 24 px (sliders); botón de barra de 48 px de alto; **nada oculto tras la barra** (16 px de aire sobre el resumen al final del scroll) y `env(safe-area-inset-*)` en la barra, la hoja y el saludo.
  - *Accesibilidad:* contrastes calculados sobre los tokens reales — ink 17.85:1, ink-2 7.58:1, ink-3 4.76:1, blanco sobre azul-600 5.97:1, error 6.47:1, segmentos (gráfico) 3.09:1 y 3.56:1, chip azul-800/azul-50 9.53:1; estados nunca solo por color (peso + forma + texto); `:focus-visible` de 2 px `--color-focus` con offset en **todos** los controles del recorrido real de `Tab`: saludo → radios de modo → 3 sliders → 9 controles de puntaje → CTA, con las flechas moviendo el modo y `Home`/`End`/flechas los sliders; hoja con `Tab` atrapado (X → campo → Cancelar → Guardar → X) y `Escape` que cierra y devuelve el foco al lápiz; radios nativos y `<dialog>`; `aria-valuetext` en lenguaje humano; sin `aria-live` (nada interrumpe).
  - *Movimiento:* solo `transform`/`opacity`; sin `transition: all`; fade de la sección excluida (180 ms) y fundido de la hoja (150 ms) con `prefers-reduced-motion`; las media queries de reduced-motion/transparency se verificaron en el CSS emitido del build (la herramienta no emula esas media features) y el lado JS —duración del fade y autofocus— con `matchMedia` forzado.
  - *Contenido:* cadenas exactas del deck (saludo, ayuda/error del nombre, captions de sliders, motivo del CTA, resumen, etiquetas y `aria-label`); «−» U+2212 en el puntaje negativo; numerales tabulares en valores, resumen y puntajes; casos extremos con contenido real: nombre de 30 caracteres (saludo en dos líneas, sin desbordar), puntaje negativo, mínimos y 100 % del resumen, puntaje inválido y `(pointer: coarse)`.
  - *Navegador:* selección de texto y autofill tematizados desde la paleta (`::selection` azul-100 + ink; `input:-webkit-autofill` con tinta y superficie), `touch-action: manipulation` en el body, `overscroll-behavior: contain` en la hoja, `color-scheme: light` y `theme-color` = `--color-bg`; **texto del sistema al 200 %**: sin scroll horizontal y sin desbordes en ningún control (se corrigió la opción de modo: `min-height` en vez de alto fijo y `overflow-wrap` en la etiqueta, que antes se salía de su caja).
- **T-5.8 · V3 · auditoría `web-design-guidelines` (5 archivos de `src/components/home/*`, `App.svelte`, `BottomBar.svelte` y `app.css`):** sin hallazgos críticos. **Corregidos en esta pasada:** superficies del navegador (`::selection`, autofill) y el desborde de las etiquetas del modo con texto al 200 %. **Desviaciones intencionales, por especificación de `07`/`06`:** sentence case en lugar de Title Case (`07 §7.4.2`); sin skip link (una sola pantalla, `07 §7.12`); `[data-screen-title]:focus { outline: none }` — el único `outline: none` del plan, acotado al `h1` de pantalla que solo recibe foco programático (`07 §7.12` (11)); `placeholder` «Ej. Juan» sin «…» (cadena exacta del deck, `07 §7.11`); sin estado hover en las opciones del modo (`07 §7.9.2` define seleccionada y pressed, no hover); error inline sin `aria-live` (`07 §7.9.14` fija `aria-invalid` + `aria-describedby`); sin `name` en los campos (no hay `<form>` que los envíe).
- **T-5.8 · V3 · pasada `impeccable` de cierre:** `impeccable context --target src/components/home/ConfigPanel.svelte` (PRODUCT.md cargado; modo **Operate**; `DESIGN.md` sigue pendiente del Plan 08) y detector mecánico `impeccable detect --json src/components/home src/App.svelte` → **`[]`, sin hallazgos**. Revisión contra el *craft floor*: contraste ≥4.5:1 (y ≥3:1 en gráficos), sombras con desplazamiento y desenfoque (`--shadow-pop` 1 px/2 px, `--shadow-chrome`, `--shadow-sheet`), más aire arriba del título de sección que debajo (24/16), un solo momento orquestado por pantalla (el fade del área excluida; sin entradas repetidas), sin kickers, sin gradientes, sin `border-left` de color, sin tarjetas anidadas, sin emoji como icono, radios 12–16 con píldora solo en el control segmentado y la barra translúcida como efecto específico (no decorativo) con *fallback* sólido.
- **T-5.8 · observación (sin cambio):** las tres opciones del modo están separadas 4 px —la píldora de `07 §7.9.2` es un solo control con padding 4 y segmentos contiguos, como el control segmentado nativo—, por debajo de los 8 px de `07 §7.12` (3). Esa regla se aplica a objetivos independientes, que sí cumplen 12/20/24 px. Queda anotado por si el humano prefiere otra lectura de la especificación.
- **Pendientes humanos (no bloquean el plan):** (a) el arrastre del slider con dedo real: el navegador automatizado no registra un puntero activo para `setPointerCapture` (misma limitación anotada en el Plan 04; tap, arrastre 1:1 y burbuja sí quedaron verificados); (b) `prefers-reduced-motion`/`reduced-transparency` en un dispositivo real (aquí se verificaron el CSS emitido y el lado JS); (c) prueba en iOS Safari/Android Chrome con rotación (`07 §7.14`); (d) el `DESIGN.md` de la raíz y la pasada de `impeccable` sobre el build son del Plan 08.
