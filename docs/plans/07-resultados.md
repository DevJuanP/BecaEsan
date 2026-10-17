# Plan 07 — Resultados

> Estado: ⬜ Pendiente · Depende de: Planes 03, 04, 06 · Cubre: RF-19, RF-20, RF-21, RN-08…RN-11 (lectura), RF-16 (tiempo total), RF-10 (cierre completo), E-03, E-04, E-05, E-09, E-10, `05 §5.6`, `07 §7.9.12`, `§7.9.13`, `§7.10.3` · Estimación: M

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
- **Estado:** [ ]

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

_(vacío — se completa durante la ejecución)_
