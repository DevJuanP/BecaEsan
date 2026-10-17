# Plan 07 — Resultados

> Estado: ✅ Hecho · Depende de: Planes 03, 04, 06 · Cubre: RF-19, RF-20, RF-21, RN-08…RN-11 (lectura), RF-16 (tiempo total), RF-10 (cierre completo), E-03, E-04, E-05, E-09, E-10, `05 §5.6`, `07 §7.9.12`, `§7.9.13`, `§7.10.3` · Estimación: M

## 1. Objetivo

La pantalla de resultados completa: puntaje total héroe con la escala usada y el tiempo, tarjeta por área con barra de composición y filas de métrica (% aciertos / % erróneas / % no respondidas, enteros que suman 100), recordatorio de configuración y botón «Home» que cierra el ciclo conservando nombre y configuración. Al terminar, el ciclo completo del producto funciona.

## 2. Alcance

- **Incluye:** la pantalla de resultados y el cierre del ciclo (descarte del intento, conservación de config/nombre); la verificación end-to-end de RF-10.
- **No incluye:** el cálculo (ya en Plan 03, se invoca en `T-6.6`); la revisión con explicaciones (fase 2, `01 §1.5`).

## 3. Referencias

- Specs: `02 §RF-19`, `§RF-20`, `§RF-21`, `§RN-08`–`§RN-11`, `§E-03`–`§E-05`, `§E-09`, `§E-10`; `03 §3.3` (Resultado); `05 §5.6` (wireframe y reglas); `07 §7.9.12` (barra y filas), `§7.9.13` (héroe), `§7.10.3` (pantalla), `§7.11` (microcopy), `§7.7.3` (aparición única), `§7.12`, `§7.14`.
- Skills: `svelte-code-writer` + `svelte-core-bestpractices` (obligatorias); `web-design-guidelines` (V3); `impeccable` (cierre de pantalla y del ciclo de UI).

## 4. Precondiciones

- Planes 03, 04 y 06 ✅ (existe un `Resultado` calculado al confirmar «Ver resultados igualmente»).
- `npm run check`, `npm run build` y `npm run test` en verde antes de empezar.

## 5. Tareas

### T-7.1 — Pantalla y datos

- **Objetivo:** RF-19 y RF-20.5: mostrar el resultado calculado y el saludo con nombre.
- **Archivos:** `src/components/results/ResultsScreen.svelte` (crear).
- **Pasos:** recibir `resultado` e `intento` del estado; título «Resultados» (`title-2`) y saludo «¡Buen trabajo, {nombre}!» solo si existe nombre; orden vertical de `07 §7.10.3`.
- **Criterios:** RF-19, RF-20.5; `05 §5.6`.
- **Verificación:** V0 + V2 (con y sin nombre).
- **Estado:** [x]

### T-7.2 — Puntaje héroe, escala y tiempo

- **Objetivo:** RF-20.1 y RF-20.3 con el tratamiento de `07 §7.9.13`.
- **Archivos:** `src/components/results/ScoreHero.svelte` (crear).
- **Pasos:**
  1. Centrado: etiqueta «Puntaje total» (`caption` 600 `ink-3`), número `display` (clamp 44–56, 800, tabular), con signo `−` si es negativo (`formatoEntero`, T-1.6).
  2. Fila de metadatos: «Escala: {+pc} · {pnr} · {pi}» con signos explícitos y «Tiempo {m:ss}» con icono `clock` 16 (`formatDuracion`), `caption` `ink-2`, gap 16 con wrap permitido.
  3. Aparición única: fade + `scale(0.98→1)` 260 ms; con `reduced-motion`: sin transformación.
- **Criterios:** RF-20.1, RF-20.3, E-05, E-09; `07 §7.9.13`, `§7.7.3`.
- **Verificación:** V0 + V2 (puntaje positivo, 0 y negativo; escala 0/0/0; tiempo < 1 h y ≥ 1 h).
- **Estado:** [x]

### T-7.3 — Tarjetas por área

- **Objetivo:** RF-20.2 con barras de composición y métricas, solo áreas incluidas (RN-11).
- **Archivos:** `src/components/results/AreaCard.svelte`, `src/components/results/MetricRow.svelte` (crear).
- **Pasos:**
  1. Fila superior: punto de 8 px del acento del área + nombre (`title-3`) + bloque «Puntaje del área» (`title-1` 700 tabular, alineado a la derecha) — `07 §7.10.3`.
  2. Barra de composición (`07 §7.9.12`): segmentos aciertos `ok-fill` / incorrectas `bad-fill` / no respondidas `neutral-fill`, alto 10, radio 6, gap 2; los % en 0 no se renderizan; animación única `scaleX` 500 ms con entrada escalonada 70 ms (reduced-motion: valor final).
  3. Tres filas de métrica: punto de color + etiqueta («Correctas» / «Incorrectas» / «No respondidas») + conteo «{c} de {T}» (`ink-3`) + «{p} %» a la derecha (`label` 700 tabular).
  4. ≥768 px: las tarjetas de área en dos columnas (gap 20).
- **Criterios:** RF-20.2, RN-11, E-03, E-04; `07 §7.9.12`, `§7.7.3`.
- **Verificación:** V0 + V2 (100/0/0; 0/100/0; todo en blanco; combinaciones 80/13/7; suma 100 % visible; una sola área en modos simples).
- **Estado:** [x]

### T-7.4 — Recordatorio, Home y cierre del ciclo

- **Objetivo:** RF-20.4, RF-21 y RF-10 completo.
- **Archivos:** `src/components/results/ResultsScreen.svelte`, `src/lib/state.svelte.ts` (modificar).
- **Pasos:**
  1. Recordatorio `caption` `ink-3` con el formato de `07 §7.11`: «{Modo} · {k} temas · {q} preguntas por tema».
  2. Botón «Home» primario azul, ancho completo, icono `house` 20 (etiqueta «Home» según `02`; si el usuario aprueba el cambio sugerido en `07 §7.16 (#3)`, «Inicio»).
  3. Al pulsar: descartar `intento` y `resultado` (RN-05: el próximo quiz es nuevo), conservar `config` y `nombre` (RF-10), `irA('home')`.
- **Criterios:** RF-20.4, RF-21, RF-10, RN-05.
- **Verificación:** V0 + V2 (config y nombre intactos tras el ciclo; siguiente intento distinto).
- **Estado:** [x]

### T-7.5 — Verificación de pantalla (V2 + V3)

- **Objetivo:** cerrar resultados contra `07 §7.10.3` + `§7.14` y probar los casos borde de lectura.
- **Archivos:** — (verificación; hallazgos se corrigen en sus tareas).
- **Pasos:** checklist `07 §7.14` + especificaciones; casos: **E-03** (T = 1 → 100/0/0), **E-04** (todo en blanco: barra 100 % gris, puntaje = T × pnr, % no respondidas = 100), **E-05** (escala 0 → puntaje 0), **E-09** (puntaje negativo con `−`), **E-10** (preguntas con π/≈/×/² se ven idénticas durante el ciclo). Verificar la suma 100 % en pantalla con varias combinaciones. Modo «Solo Verbal»: ninguna mención a RM (RN-11). Ciclo completo «Home → config → quiz → resultados → Home» con nombre persistido. Auditoría `web-design-guidelines` + pasada `impeccable` de cierre.
- **Criterios:** `07 §7.10.3`, `§7.14`; E-03/04/05/09/10; RN-11; RF-10.
- **Verificación:** checklist marcada + hallazgos corregidos o registrados.
- **Estado:** [x]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RF-19 (cálculo al ver resultados) | T-7.1 (cálculo en Plan 03, disparo en T-6.6) |
| RF-20.1 (puntaje total + escala) | T-7.2 |
| RF-20.2 (tarjetas por área) | T-7.3 |
| RF-20.3 (tiempo total) | T-7.2 |
| RF-20.4 (recordatorio) | T-7.4 |
| RF-20.5 (saludo) | T-7.1 |
| RF-21 (botón Home) | T-7.4 |
| RF-10 (conservación nombre + config) | T-7.4, T-7.5 |
| RN-08, RN-09, RN-10 (lectura correcta) | T-7.2, T-7.3, T-7.5 |
| RN-11 (áreas no incluidas) | T-7.3, T-7.5 |
| RN-05 (intento nuevo tras Home) | T-7.4 |
| E-03, E-04, E-05, E-09, E-10 | T-7.5 |
| `05 §5.6` | T-7.1…T-7.5 |
| `07 §7.9.12`, `§7.9.13`, `§7.10.3`, `§7.11` | T-7.1…T-7.5 |

## 7. Verificación final del plan

- [x] Ciclo completo real: nombre → configuración → quiz → resultados → Home → segundo intento, sin errores.
- [x] Porcentajes en pantalla enteros y sumando 100 % en las tarjetas mostradas.
- [x] Puntaje total y por área coinciden con la aritmética de la escala configurada (incluye negativos).
- [x] Modos de un solo área: la otra no aparece por ningún lado.
- [x] Aparición de barras única (sin repetición al re-render); reduced-motion muestra valores finales.
- [x] Auditoría `web-design-guidelines` y pasada `impeccable` de cierre sin hallazgos críticos pendientes.

> Evidencia de cada punto en el registro de T-7.5 (§8). La comprobación en **móvil real** (iOS Safari / Android Chrome, `07 §7.14`) y el juicio puramente visual por capturas quedan como pendientes humanos (el ejecutor de este turno no puede recibir imágenes).

## 8. Registro de desvíos y decisiones

_(append-only; las entradas de ejecución se añaden al final)_

### Revisión de vigencia (2026-10-17, previa a la ejecución)

- **Confrontación con las especificaciones** (`02 §RF-19`–`§RF-21`, `§RN-08`–`§RN-11`, `§M6` (E-03, E-04, E-05, E-09, E-10); `03 §3.3` (Resultado/ResultadoArea); `04 §4.6` (cálculo al ver resultados); `05 §5.6`, `§5.7`; `07 §7.7.3`, `§7.9.12`, `§7.9.13`, `§7.10.3`, `§7.11`, `§7.12`, `§7.14`, `§7.16`, `§7.19`): los RF/RN/E citados por la matriz siguen correspondiendo a T-7.1…T-7.5 y no hay requisitos derogados. Todo lo necesario ya existe en el repo (`calcularResultado` invocado en `T-6.6`, el modelo `Resultado` con `escala`/`duracionMs`, `formatoEntero`/`formatDuracion` y el catálogo `src/components/ui/*`: `Button`, `Icon` con `house`/`clock`). Vigencia confirmada **sin cambios de tareas ni de matriz**.
- **Precondiciones de §4 verificadas:** Planes 03, 04 y 06 ✅ en `docs/plans/README.md`; `npm run check` → 0 errores/0 avisos, `npm run build` → 175 módulos (CSS 7.60 KB gzip, JS 49.77 KB gzip), `npm run test` → 106 pruebas en verde.
- **Decisión pendiente `07 §7.16` (#3) — resuelta por el orquestador:** «Home» → «Inicio» **se mantiene «Home»**, tal como en `02`/`05` y `07 §7.11`; no se renombra (T-7.4 sin condicional). La tabla de decisiones de `README.md` ya lo refleja.
- **Tensiones detectadas entre specs (se resuelven en la tarea correspondiente y se registran aquí):** (a) `07 §7.3.2` define `--color-neutral-fill` (segmento de barra «no respondidas»), pero el Anexo C (`§7.19`) y `app.css` no lo incluyen; se añadirá el token a `app.css` (T-7.3). (b) `07 §7.11` da para la tarjeta de área solo «Nombre del área», y el wireframe de `05 §5.6` usa el nombre corto («Razonamiento Verbal») mientras el chip del quiz usa el nombre completo del deck: se reutilizan las cadenas ya congeladas del deck (`§7.11` Quiz) para no inventar microcopy (T-7.3). (c) `07 §7.10.3` describe «Puntaje del área» + puntaje como etiqueta y número alineados a la derecha, y `07 §7.11` lo escribe como «Puntaje del área: {56}»: se implementa la estructura de `§7.10.3` (etiqueta `caption` + número `title-1` 700 tabular) manteniendo el texto exacto de la etiqueta (T-7.3). (d) `05 §5.6` muestra los conteos como «2 incorrectas»/«1 no respondida» y `07 §7.11` como «{c} de {T}»: rige el plan y el deck (T-7.3, «{c} de {T}» en las tres filas).
- **`App.svelte` (pegamento):** el plan lista los componentes a crear; el montaje obliga a sustituir en `App.svelte` el placeholder de resultados (y su navegación temporal) por `<ResultsScreen />`. Cambio de pegamento, sin alcance nuevo; se registra en la entrada de T-7.1.
- **Convención de identificadores:** el plan cita el contrato §10 («identificadores de código en inglés»), pero los Planes 01–06 consolidaron identificadores en español (`estado.pantalla`, `irA`, `calcularResultado`, `aplicarNombre`…). Se mantiene la convención existente del repo por consistencia (cambio mínimo, reversible).
- **Verificación V2 de este plan (nota de entorno):** el ejecutor de este turno no puede recibir imágenes; toda la V2 se hace con `chrome-devtools` **por salidas de texto** (DOM, `evaluate`, `snapshot`, consola): dimensiones, `scrollWidth` vs `clientWidth` a 360 px, atributos ARIA, valores y foco. El juicio puramente visual queda documentado como pendiente humano en el §7 si no es verificable por DOM.

### T-7.1 — Pantalla y datos

- **`App.svelte` (pegamento):** se sustituye el placeholder de resultados y su `<nav>` temporal por `<ResultsScreen />` (el componente trae su propio `<main>`). La pantalla se lee del estado compartido (`estado.resultado`, `estado.nombre`), como `QuizScreen`; no recibe props.
- **Reserva de scroll:** esta pantalla no tiene barra fija (`07 §7.10.3` no la lista), así que no usa `.app-reserve`; aplica la reserva final de 48 px + `env(safe-area-inset-bottom)` con padding lateral 20/24.
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → 177 módulos (CSS 7.52 KB gzip, JS 49.67 KB gzip). `svelte-autofixer` sobre `ResultsScreen.svelte`: sin hallazgos.
- **V2 (por DOM, viewport emulado 360×800 dpr 3, táctil):** flujo real «Home → nombre → config → quiz → resultados» con 2 casos: (a) con nombre → `<h1>` «Resultados», saludo «¡Buen trabajo, Juan!», foco en el `<h1>`, `document.title` «Simulador · Resultados»; (b) sin nombre → sin saludo. En ambos: `main.res` = 360 px, `scrollWidth` = `clientWidth` = 360 (sin scroll horizontal), consola limpia (solo los mensajes `[vite]` de desarrollo). Nota: el emulador de viewport de Chrome es la vía para 360 px (la ventana real no baja de ~500 px en Windows).

### T-7.2 — Puntaje héroe, escala y tiempo

- **Formato con signo explícito:** la escala de `07 §7.9.13`/`§7.4.3` («+5 · 0 · −2») necesita un signo `+` que `formatoEntero` no emite; se añade `formatoConSigno` a `src/lib/format.ts` (módulo puro ya existente, V1) con 4 pruebas nuevas en `format.test.ts` (positivos, cero sin signo, negativos con U+2212 y la composición de la escala). Sin dependencias nuevas.
- **Animación única:** el héroe se anima con un `@keyframes` de CSS (fade + `scale(0.98→1)`, `var(--dur-4)` = 260 ms, `fill-mode: both`), no con transiciones de Svelte: el elemento se crea una sola vez por navegación a la pantalla, así que la animación no puede repetirse en re-render; con `prefers-reduced-motion: reduce` la regla queda en `animation: none` y el elemento se pinta en su estado natural (valor final).
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 7.71 KB gzip, JS 49.93 KB gzip; `npm run test` → 110 pruebas en verde (4 nuevas); `svelte-autofixer` sobre `ScoreHero.svelte` y `ResultsScreen.svelte`: sin hallazgos.
- **V2 (por DOM, viewport 360×800):** 5 casos medidos: (a) positivo (pc=5/pnr=+1/pi=−2, T=2, en blanco) → número «2», escala «Escala: +5 · +1 · −2»; (b) cero (pnr=0) → «0» y «Escala: +5 · 0 · −2»; (c) negativo (pnr=−3) → «−6» (U+2212) y «Escala: +5 · −3 · −2»; (d) escala 0/0/0 → «0» y «Escala: 0 · 0 · 0» (E-05); (e) tiempo ≥ 1 h (desfase de `Date.now` en la página) → «Tiempo 1:01:01» en formato `h:mm:ss`; el caso (a) muestra «Tiempo 0:00» (`m:ss`). Además: etiqueta «Puntaje total» 13 px/600/`ink-3`; número 46.8 px (=`clamp(2.75rem,13vw,3.5rem)` a 360 px)/800/`tabular-nums`; metadatos 13 px `ink-2` con `column-gap: 16px` y `flex-wrap: wrap`; icono de reloj 16 px `aria-hidden`; `getAnimations()` → una sola animación `heroe-aparece` de 260 ms en estado `finished`, y tras cancelarla el estado natural es `opacity: 1`/`transform: none` (camino `reduced-motion`); `scrollWidth` = `clientWidth` = 360; consola limpia.

### T-7.3 — Tarjetas por área

- **Token nuevo en `app.css`:** `--color-neutral-fill: #64748B` (`07 §7.3.2`), ausente del Anexo C (`§7.19`) y por tanto de `app.css`; lo consume el segmento y el punto de «No respondidas». Cambio mínimo y aditivo (sin tocar tokens existentes).
- **Conflicto de spec (color de la etiqueta):** `07 §7.3.2` describe `--color-ok`/`--color-bad`/`--color-neutral` como «Texto «correctas»/«errores»/«no respondidas»», pero `07 §7.9.12` —la spec del componente— fija la etiqueta en `label` 400 **`ink-2`** y el color semántico solo en el punto de 8 px («del color del relleno»). Se aplica `§7.9.12` (regla más específica y mejor contraste: `ink-2` = 7.58:1 frente a 3.77:1 de `ok-fill` como texto, que no cumple AA). Los tokens de texto semánticos quedan disponibles para la pantalla de revisión de fase 2.
- **Nombres de área:** se reutilizan las cadenas del deck ya congeladas en el quiz (`07 §7.11`): «Razonamiento Matemático» / «Razonamiento Verbal y Comunicación» (el wireframe de `05 §5.6` usa la forma corta; no se inventa microcopy).
- **«Puntaje del área»:** estructura de `07 §7.10.3` #3 (etiqueta `caption` `ink-3` sobre el número `title-1` 700 tabular, alineado a la derecha), con el texto exacto de la etiqueta de `§7.11`.
- **Espaciado interno (no fijado por las specs):** 12 px entre la fila superior y la barra y 12 px entre la barra y las tres filas (`07 §7.9.12` fija el alto de la barra, el gap de segmentos y el alto/separación de las filas, no la separación entre bloques). `min-height: 24px` en las filas (en vez de alto fijo) para tolerar el texto del sistema al 200 % (`07 §7.12` (10)).
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.07 KB gzip, JS 50.56 KB gzip; `svelte-autofixer` sobre `AreaCard.svelte` y `MetricRow.svelte`: sin hallazgos.
- **V2 (por DOM; respuestas dirigidas con la clave real del banco, leída del `questions.json` servido por Vite):** (a) **100/0/0** (T=1 por área) → un solo segmento verde de 286 px (100 % del ancho de la barra), filas «1 de 1» / «0 de 1» / «0 de 1» con 100/0/0 %, suma 100 %, puntaje del área 5, puntaje total 10; (b) **0/100/0** → un solo segmento rojo, puntaje «−2» por área (signo U+2212) y total «−4»; (c) **todo en blanco** (E-04, pnr=+1) → barra 100 % gris (`neutral-fill`), «No respondidas 1 de 1 = 100 %», puntaje = T × pnr = 2; (d) **80/13/7** (T=15: 12 correctas, 2 incorrectas, 1 en blanco) → segmentos de 225.6/36.7/19.7 px sobre 286 px (= 80/13/7 % del ancho) y filas «12 de 15» 80 %, «2 de 15» 13 %, «1 de 15» 7 %, suma 100 %; (e) **modo «Solo Matemático»** → una sola tarjeta y `document.body.innerText` sin ninguna mención a Verbal (RN-11). Comunes: barra de 10 px de alto, radio 6 px y gap 2 px; dos animaciones `barra-crece` de 500 ms con retrasos 0 ms y 70 ms (una por tarjeta, `07 §7.7.3`); punto del acento del área (azul `rgb(0,99,189)` RM / naranja `rgb(234,88,12)` RV); puntaje del área 22 px/700; `scrollWidth` = `clientWidth` = 360. A 768 px: `grid-template-columns: 286px 286px` con `column-gap: 20px`, las dos tarjetas en la misma fila (`y` idéntico) y columna de 640 px centrada (`07 §7.10.3`). Consola limpia en todas las corridas.

### T-7.4 — Recordatorio, Home y cierre del ciclo

- **Cierre del ciclo en el estado:** la lógica de «Home» (descartar `intento` y `resultado`, conservar `config` y `nombre`, navegar) vive en `EstadoApp.cerrarResultados()` (`src/lib/state.svelte.ts`), junto al resto de la máquina de estados; el botón solo la invoca. `irA('home')` fija `pantalla` de forma síncrona, así que el descarte del intento y la navegación se aplican en el mismo lote de actualizaciones (sin parpadeo del `{#if resultado !== null}`).
- **Recordatorio:** se compone desde la **instantánea** `estado.intento.config` (`03 §3.3`, RF-20.4), no desde la configuración viva del panel, y reutiliza `etiquetaModo` de `src/lib/config.ts` con el formato literal de `07 §7.11` («{Modo} · {k} temas · {q} preguntas por tema»). Se conserva el plural literal del deck aun con q = 1 («1 preguntas por tema»).
- **Microcopy del botón:** «Home», según la decisión `07 §7.16 (#3)` resuelta (no se renombra a «Inicio»). Icono `house` 20 a la izquierda del texto (convención de los botones con icono del catálogo).
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.10 KB gzip, JS 50.69 KB gzip; `svelte-autofixer` sobre `ResultsScreen.svelte`: sin hallazgos.
- **V2 (por DOM, viewport 360×800, ciclo completo):** con nombre «Juan», modo «Completo», RM=3/RV=2/q=2 y puntos 7/1/−3, el primer intento (todo en blanco) muestra el recordatorio «Completo · 5 temas · 2 preguntas por tema» (13 px/500/`ink-3`); el botón final es un `<button>` `data-variant="primario"` `data-size="bar"` de 48 px de alto, 320 px de ancho (= ancho completo de la columna) con fondo azul `rgb(0,99,189)`, texto «Home» e icono `house` de 20×20 `aria-hidden`. Al pulsarlo: `document.title` «Simulador · Home», saludo «Hola, Juan» (nombre conservado), foco en el `<h1>`, modo «Completo» seleccionado, sliders «3 de 17» / «2 de 11» / «2 de 5» y puntos «7» / «1» / «−3» (configuración conservada, RF-10) y resumen «Completo · 5 temas · 10 preguntas». Un segundo «Iniciar quiz» genera un intento **distinto** (ids de pregunta del primer bloque diferentes, RN-05). Sin scroll horizontal (`scrollWidth` = `clientWidth` = 360) y consola limpia.

### T-7.5 — Verificación de pantalla (V2 + V3)

- **Casos borde medidos por DOM (viewport 360×800; respuestas dirigidas con la clave real del banco):**
  - **E-03** (k = 1, q = 1 → T = 1): tarjeta con 100/0/0 (o 0/100/0 con la respuesta errada), conteos «1 de 1», puntaje del área = pc (5) o pi (−2).
  - **E-04** (quiz en blanco): barra 100 % `neutral-fill` («rgb(100,116,139)»), «No respondidas 1 de 1 = 100 %», puntaje = T × pnr (2 con pnr = +1).
  - **E-05** (escala 0/0/0): «Escala: 0 · 0 · 0» y puntaje «0» con los porcentajes calculados igual.
  - **E-09** (negativos): «−6», «−4», «−2», «−999» y «−1,998» con el menos tipográfico U+2212 (verificado también el `charCodeAt` en las pruebas de `formatoPuntaje`).
  - **E-10** (π, ≈, ×, ², S/): corrida con **los 17 temas de RM y q = 5** (todo el banco de RM, 17 bloques): 527 textos de la pantalla del quiz comparados contra `questions.json` → **0 diferencias** (enunciados, alternativas y títulos se renderizan tal cual); símbolos vistos en pantalla: `S/`, `²`, `³`, `π`, `≈`, `≤`, `≥`, `°`. La pantalla de resultados no muestra texto de preguntas, así que no hay transformación posible (RNF-08).
  - **Suma 100 %:** verificada en pantalla en cuatro combinaciones (100/0/0, 0/100/0, 0/0/100 y 80/13/7 con T = 15 y segmentos de 225.6/36.7/19.7 px sobre 286 px) y con T = 85 (17 temas × 5).
  - **RN-11 en modos simples:** «Solo Matemático» → una sola tarjeta y `document.body.innerText` sin «Verbal»; «Solo Verbal» → una sola tarjeta y sin «Matemático», recordatorio «Solo Verbal · 2 temas · 1 preguntas por tema».
- **Ciclo completo (RF-10, RN-05):** «Home → nombre («Ana») → modo Solo Verbal + sliders 2/1 → quiz → resultados → Home» sin errores: al volver, saludo «Hola, Ana» y configuración intacta (modo «Verbal», sliders «2 de 11» / «1 de 5», resumen «Solo Verbal · 2 temas · 2 preguntas»); el siguiente intento es nuevo. Orden vertical de `07 §7.10.3` confirmado en el DOM: título → saludo → héroe → tarjetas → recordatorio → «Home».
- **Checklist `07 §7.14` (por DOM/CSS, sin imágenes):** padding lateral 20 px a 360 y 24 px a 430; reserva inferior 48 px + safe-area; `text-transform: none` en etiqueta del héroe, recordatorio y nombre de área (sin mini-etiquetas); tarjetas con borde 1 px, **sin** sombra, radio 16 y padding 16 (una sola elevación), 0 tarjetas anidadas; único control (el botón «Home») de 320×48 px con `:focus-visible` (outline 2 px + offset 2 px); jerarquía medida (título 20/700, héroe 46.8/800 tabular, nombre de área 16/600, puntaje 22/700, etiquetas 15, metadatos 13); `prefers-reduced-motion` en héroe y barras (valor final) y `@media (hover: hover) and (pointer: fine)` para los hover (heredados del catálogo); sin `transition: all` ni animación fuera de `transform`/`opacity`.
- **Hallazgo 1 (V3, corregido): formato numérico `Intl`.** `07 §7.4.3` exige `Intl.NumberFormat('es-PE')` para los números y `formatoEntero` (Plan 01) usaba `String(n)`: con configuraciones extremas el héroe podía mostrar «139860» sin separador de millares. Se añade `formatoPuntaje` a `src/lib/format.ts` (usa `Intl.NumberFormat('es-PE')` y sustituye el guion ASCII de `Intl` por el menos U+2212 de E-09) y lo consumen el héroe y el puntaje del área; `formatoEntero`/`formatoConSigno` se mantienen (la escala y el stepper trabajan en ±999, sin millares). Medido en pantalla: «1,998» y «−1,998» (y 999/−999 por área). 3 pruebas nuevas.
- **Hallazgo 2 (V3, corregido): desborde horizontal con el texto del sistema al 200 %.** Con la raíz a 32 px las tarjetas de área medían 356 px en una columna de 320 px (`scrollWidth` 376 > 360): el ítem de grid no podía encogerse por debajo del contenido. Se añade `min-width: 0` a las tarjetas (`.res__areas > *`) manteniendo la fila superior en una sola línea; medido de nuevo a 360/430/1280 px con la raíz a 32 px: `scrollWidth` = `clientWidth`, 0 elementos desbordados, cabecera de tarjeta en una sola fila y sin desborde de filas de métrica. (Se probó primero `flex-wrap` en la cabecera y se descartó: partía la fila superior también a tamaño normal.)
- **Hallazgo 3 (V3, corregido): semántica de lista y ruido para lectores.** La barra de composición es decorativa (los datos están en las filas) → `aria-hidden="true"`; la lista de métricas lleva `role="list"` para conservar la semántica con `list-style: none` (Safari/VoiceOver).
- **V3 — auditoría `web-design-guidelines`:** repasados `ResultsScreen.svelte`, `ScoreHero.svelte`, `AreaCard.svelte` y `MetricRow.svelte` contra las reglas de la skill (accesibilidad, foco, formularios, animación, tipografía, contenido, rendimiento, navegación, táctil, safe areas, i18n). Sin hallazgos pendientes tras los tres corregidos: no hay botones solo-icono sin `aria-label`, no hay controles sin etiqueta, no hay `<div>` clicables (el único control es un `<button>`), no hay `transition: all`, no hay animación sin `prefers-reduced-motion`, los iconos llevan `aria-hidden`, los números van con `tabular-nums` y `Intl`, y los contenedores toleran contenido largo (`min-width: 0` + `overflow-wrap`). No aplican en esta pantalla: virtualización (listas cortas), imágenes, `<video>`, deep-linking por URL (la app es un flujo de pantalla única sin router, `06 §6.3`) ni `beforeunload` (el intento ya terminó).
- **V3 — pasada `impeccable` de cierre:** `scripts/impeccable.cmd detect --json --target src/components/results` → `[]` (sin hallazgos mecánicos). La crítica visual fina (capturas) queda como pendiente humano por la restricción de imágenes del ejecutor.
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.11 KB gzip, JS 50.76 KB gzip; `npm run test` → 113 pruebas en verde; `svelte-autofixer` sobre los cuatro componentes de resultados: sin hallazgos. Consola limpia en todas las corridas de V2.
- **Pendientes humanos:** prueba en móvil real (iOS Safari / Android Chrome con rotación, `07 §7.14`) y el juicio visual por capturas (paleta, jerarquía, aire) que este ejecutor no puede evaluar por imágenes.

### Revisión de vigencia (2026-10-17, Plan 09)

- **Alcance ampliado:** la «pantalla de revisión con explicaciones» que este plan dejó como fase 2 (`§2`) se aprobó e implementó dentro de Resultados en el **Plan 09** (`02 §RF-22`, `07 §7.9.16`). La revisión se añade **después** del recordatorio y **antes** del botón «Home», por lo que el orden original de §7.10.3 se conserva con un elemento intermedio; no se reabren tareas de este plan.
