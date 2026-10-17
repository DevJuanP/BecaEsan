# Plan 07 — Resultados

> Estado: 🔄 En curso · Depende de: Planes 03, 04, 06 · Cubre: RF-19, RF-20, RF-21, RN-08…RN-11 (lectura), RF-16 (tiempo total), RF-10 (cierre completo), E-03, E-04, E-05, E-09, E-10, `05 §5.6`, `07 §7.9.12`, `§7.9.13`, `§7.10.3` · Estimación: M

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
- **Estado:** [ ]

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
- **Estado:** [ ]

### T-7.4 — Recordatorio, Home y cierre del ciclo

- **Objetivo:** RF-20.4, RF-21 y RF-10 completo.
- **Archivos:** `src/components/results/ResultsScreen.svelte`, `src/lib/state.svelte.ts` (modificar).
- **Pasos:**
  1. Recordatorio `caption` `ink-3` con el formato de `07 §7.11`: «{Modo} · {k} temas · {q} preguntas por tema».
  2. Botón «Home» primario azul, ancho completo, icono `house` 20 (etiqueta «Home» según `02`; si el usuario aprueba el cambio sugerido en `07 §7.16 (#3)`, «Inicio»).
  3. Al pulsar: descartar `intento` y `resultado` (RN-05: el próximo quiz es nuevo), conservar `config` y `nombre` (RF-10), `irA('home')`.
- **Criterios:** RF-20.4, RF-21, RF-10, RN-05.
- **Verificación:** V0 + V2 (config y nombre intactos tras el ciclo; siguiente intento distinto).
- **Estado:** [ ]

### T-7.5 — Verificación de pantalla (V2 + V3)

- **Objetivo:** cerrar resultados contra `07 §7.10.3` + `§7.14` y probar los casos borde de lectura.
- **Archivos:** — (verificación; hallazgos se corrigen en sus tareas).
- **Pasos:** checklist `07 §7.14` + especificaciones; casos: **E-03** (T = 1 → 100/0/0), **E-04** (todo en blanco: barra 100 % gris, puntaje = T × pnr, % no respondidas = 100), **E-05** (escala 0 → puntaje 0), **E-09** (puntaje negativo con `−`), **E-10** (preguntas con π/≈/×/² se ven idénticas durante el ciclo). Verificar la suma 100 % en pantalla con varias combinaciones. Modo «Solo Verbal»: ninguna mención a RM (RN-11). Ciclo completo «Home → config → quiz → resultados → Home» con nombre persistido. Auditoría `web-design-guidelines` + pasada `impeccable` de cierre.
- **Criterios:** `07 §7.10.3`, `§7.14`; E-03/04/05/09/10; RN-11; RF-10.
- **Verificación:** checklist marcada + hallazgos corregidos o registrados.
- **Estado:** [ ]

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

- [ ] Ciclo completo real: nombre → configuración → quiz → resultados → Home → segundo intento, sin errores.
- [ ] Porcentajes en pantalla enteros y sumando 100 % en las tarjetas mostradas.
- [ ] Puntaje total y por área coinciden con la aritmética de la escala configurada (incluye negativos).
- [ ] Modos de un solo área: la otra no aparece por ningún lado.
- [ ] Aparición de barras única (sin repetición al re-render); reduced-motion muestra valores finales.
- [ ] Auditoría `web-design-guidelines` y pasada `impeccable` de cierre sin hallazgos críticos pendientes.

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
