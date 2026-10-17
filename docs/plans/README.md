# Planes de ejecución — Simulador Beca BCP / ESAN

Esta carpeta contiene los **planes de ejecución** que construyen la app definida en [`docs/especificaciones/`](../especificaciones/README.md) (01–07), en el orden `01 → 08`.

> **Estado global:** 5 / 8 planes completados · **fase actual: Plan 06 (Quiz)** · Los planes se generaron el 2026-10-16; el Plan 01 se ejecutó y cerró el 2026-10-16; el Plan 02 se ejecutó y cerró el 2026-10-16; el Plan 03 se ejecutó y cerró el 2026-10-16; el Plan 04 se ejecutó y cerró el 2026-10-16; el Plan 05 se ejecutó y cerró el 2026-10-17.

## Cómo se usa esta carpeta

1. **Leer primero** [`00-contrato.md`](00-contrato.md): define cómo se generan y cómo se ejecutan los planes (trazabilidad, verificación, estados, commits, control de cambios).
2. Cada plan tiene tareas `T-N.M` con criterios y verificación; su estado se actualiza **en el propio plan** (checkboxes) y en la tabla de abajo.
3. Antes de ejecutar un plan: **revisión de vigencia** contra las especificaciones (`00-contrato §7`).

## Roadmap

| # | Plan | Objetivo en una línea | Depende de | Estimación | Estado |
|---|---|---|---|---|---|
| 01 | [Fundación](01-fundacion.md) | Git, Vite + Svelte 5 + TS + Tailwind 4, tokens, shell, Vitest | — | M | ✅ |
| 02 | [Datos](02-datos.md) | Parser/validador `docs/preguntas/` → `questions.json`, con pruebas | 01 | M | ✅ |
| 03 | [Lógica del intento](03-logica-del-intento.md) | Muestreo, puntaje, porcentajes, validación, persistencia (Vitest) | 01, 02 | M | ✅ |
| 04 | [Componentes base](04-componentes-base.md) | Slider segmentado, stepper, botones, chips, hojas, opción A–E + galería dev | 01 | L | ✅ |
| 05 | [Home](05-home.md) | Saludo + hoja de nombre + panel de configuración + CTA | 03, 04 | M | ✅ |
| 06 | [Quiz](06-quiz.md) | Cabecera, bloques, navegación, texto común, confirmación, cronómetro | 03, 04, 05 | L | ⬜ |
| 07 | [Resultados](07-resultados.md) | Héroe, tarjetas por área, barras, recordatorio, Home | 03, 04, 06 | M | ⬜ |
| 08 | [Calidad y despliegue](08-calidad-y-despliegue.md) | Auditorías de skills, presupuesto, E2E, GitHub + preparación del deploy manual | 01–07 | M | ⬜ |

Orden de ejecución: `01 → 02 → 03 → 04 → 05 → 06 → 07 → 08`. Independencia declarada: el Plan 04 solo requiere el 01 (se ejecuta en su turno).

## Cobertura global (trazabilidad)

Obligatorio (`00-contrato §2.1`). «Fuera de v1» = candidato de fase 2 según `01 §1.5`.

### Requisitos funcionales (RF)

| ID | Plan(es) · Tarea(s) |
|---|---|
| RF-01 (saludo editable) | 05 · T-5.2, T-5.3 |
| RF-02 (persistencia del nombre) | 03 · T-3.4 + 05 · T-5.3 |
| RF-03 (modo del quiz) | 05 · T-5.4 |
| RF-04 (slider de temas RM) | 04 · T-4.4 + 05 · T-5.5 |
| RF-05 (slider de temas RV) | 04 · T-4.4 + 05 · T-5.5 |
| RF-06 (slider de preguntas) | 04 · T-4.4 + 05 · T-5.5 |
| RF-07 (puntajes configurables) | 04 · T-4.3 + 05 · T-5.6 |
| RF-08 (resumen estimado) | 03 · T-3.5 + 05 · T-5.7 |
| RF-09 (botón «Iniciar quiz») | 05 · T-5.7 |
| RF-10 (conservación de la configuración) | 05 · T-5.1–T-5.7 + 07 · T-7.4, T-7.5 |
| RF-11 (config entre recargas) | **Fuera de v1** (C, `01 §1.5`) |
| RF-12 (cabecera del bloque) | 06 · T-6.2 |
| RF-13 (contenido del bloque) | 06 · T-6.1, T-6.3 |
| RF-14 (responder) | 04 · T-4.5 + 06 · T-6.1 |
| RF-15 (navegación entre bloques) | 06 · T-6.4 |
| RF-16 (cronómetro informativo) | 01 · T-1.6 + 03 · T-3.3 + 06 · T-6.2 + 07 · T-7.2 |
| RF-17 (confirmación por blancos) | 04 · T-4.6 + 06 · T-6.6 |
| RF-18 (aviso al salir) | 06 · T-6.7 |
| RF-19 (cálculo al ver resultados) | 03 · T-3.3 + 07 · T-7.1 (disparo: 06 · T-6.6) |
| RF-20 (pantalla de resultados) | 07 · T-7.1–T-7.4 |
| RF-21 (botón «Home») | 07 · T-7.4 |

### Reglas de negocio (RN)

| ID | Plan(es) · Tarea(s) |
|---|---|
| RN-01 (snapshot inmutable) | 03 · T-3.2 |
| RN-02 (temas al azar sin repetición) | 03 · T-3.2 |
| RN-03 (RM primero, luego RV) | 03 · T-3.2 + 06 · T-6.5 |
| RN-04 (preguntas al azar por tema) | 03 · T-3.2 |
| RN-05 (sin memoria entre intentos) | 03 · T-3.2 + 07 · T-7.4 |
| RN-06 (alternativas sin barajar) | 03 · T-3.2 + 06 · T-6.1 |
| RN-07 (clasificación) | 03 · T-3.3 |
| RN-08 (puntaje) | 03 · T-3.3 + 07 · T-7.2 |
| RN-09 (porcentajes, mayor resto) | 03 · T-3.3 + 07 · T-7.3 |
| RN-10 (denominadores por área) | 03 · T-3.3 |
| RN-11 (áreas no incluidas) | 03 · T-3.3 + 07 · T-7.3 |

### Requisitos no funcionales (RNF)

| ID | Plan(es) · Tarea(s) |
|---|---|
| RNF-01 (mobile-first) | 01 · T-1.5 + 05/06/07 · V2 + 08 · T-8.5 |
| RNF-02 (elementos táctiles ≥ 44 px) | 04 · T-4.1–T-4.7 + 08 · T-8.1 |
| RNF-03 (sin backend / estático) | 01 · T-1.2 + 08 · T-8.7 |
| RNF-04 (persistencia local) | 03 · T-3.4 + 05 · T-5.3 + 08 · T-8.5 |
| RNF-05 (rendimiento de navegación) | 02 · T-2.6 + 06 · T-6.4 + 08 · T-8.4 |
| RNF-06 (accesibilidad básica) | 01 · T-1.4 + 04 · todas + 08 · T-8.1 |
| RNF-07 (idioma es-PE) | 01 · T-1.4/T-1.5 + 08 · T-8.2 |
| RNF-08 (contenido matemático sin transformar) | 02 · T-2.2, T-2.5 + 08 · T-8.5 (E-10) |
| RNF-09 (pérdida de progreso advertida) | 06 · T-6.7 + 08 · T-8.5 |

### Casos borde (E)

En cada caso: capa lógica (Vitest, Plan 03) + capa UI (plan de la pantalla) + punta a punta (Plan 08).

| # | Caso | Plan(es) · Tarea(s) |
|---|---|---|
| E-01 | RM con 17 temas | 03 · T-3.6 + 06 · T-6.8 + 08 · T-8.5 |
| E-02 | q = 5 | 03 · T-3.6 + 06 · T-6.8 + 08 · T-8.5 |
| E-03 | Configuración mínima | 03 · T-3.6 + 06 · T-6.8 + 07 · T-7.5 + 08 · T-8.5 |
| E-04 | Quiz en blanco | 03 · T-3.6 + 07 · T-7.5 + 08 · T-8.5 |
| E-05 | Escala 0/0/0 | 03 · T-3.6 + 07 · T-7.5 + 08 · T-8.5 |
| E-06 | Comprensión de lectura con q < 5 | 03 · T-3.6 + 06 · T-6.3, T-6.8 + 08 · T-8.5 |
| E-07 | Atrás + editar respuestas | 03 · T-3.6 + 06 · T-6.4, T-6.8 + 08 · T-8.5 |
| E-08 | Nombre vacío/espacios | 05 · T-5.3 + 08 · T-8.5 |
| E-09 | Puntajes negativos | 01 · T-1.6 + 03 · T-3.6 + 05 · T-5.6 + 07 · T-7.5 + 08 · T-8.5 |
| E-10 | Símbolos matemáticos | 02 · T-2.2, T-2.5 + 07 · T-7.5 + 08 · T-8.5 |

**Resumen de cobertura:** RF 20/20 activos (+ RF-11 fuera de v1) · RN 11/11 · RNF 9/9 · E 10/10.

## Decisiones pendientes que afectan la ejecución (`07 §7.16`)

| # | Decisión | Afecta | Efecto si no se resuelve |
|---|---|---|---|
| 1 | Captura/CSS del CodePen del slider | 04 · T-4.4 | **Resuelta (2026-10-16, plan 04):** no hay captura/CSS en el repo; rige `07 §7.8` + `§7.18` (Anexo B) como especificación vinculante de la capa visual |
| 2 | Autofocus del nombre en móvil | 05 · T-5.3 | **Resuelta (2026-10-16, plan 05):** se aplica la propuesta de `07` — autofocus del campo **solo** con `(pointer: fine)` (evita el teclado emergente en móvil táctil) |
| 3 | «Home» → «Inicio» | 07 · T-7.4 | Por defecto: «Home» como en `02`/`05` |

Se resuelven en la **revisión de vigencia** previa a la ejecución de su plan (`00-contrato §7`).

## Changelog

| Fecha | Cambio |
|---|---|
| 2026-10-16 | Se crea el contrato (`00-contrato.md`) y los 8 planes de ejecución (01–08), con matriz global de trazabilidad. Estados: todos ⬜. |
| 2026-10-16 | Control de cambios previo a la ejecución (decisión del usuario, `00-contrato §9`): el deploy a Cloudflare Pages es **manual del usuario** y queda fuera de la orquestación; T-8.7 pasa a «preparación del deploy manual», T-8.5 explicita emulación móvil + pase manual, y el DoD del contrato (`§6`) se ajusta en consecuencia. |
| 2026-10-16 | Se ejecuta y cierra el Plan 01 (T-1.1–T-1.6, un commit por tarea): fundación verificada (`check`, `build`, `test`, `preview` en verde; V2 mínimo con capturas a 360/1280 px; detector `impeccable` limpio). |
| 2026-10-16 | Se ejecuta y cierra el Plan 02 (T-2.1–T-2.6, un commit por tarea): `scripts/build-questions.mjs` extrae y valida el material (28 temas · 140 preguntas · 85 RM + 55 RV) y genera `src/data/questions.json` determinista (130 084 bytes, 20.9 KB gzip), integrado en `dev`/`build`; 27 pruebas Vitest en verde. Sin desvíos funcionales: dos decisiones registradas en el §8 del plan (reparto T-2.2/T-2.3 y casos negativos verificados en copia aislada para no tocar `docs/preguntas/`). |
| 2026-10-16 | Se ejecuta y cierra el Plan 03 (T-3.1–T-3.6, un commit por tarea): dominio puro (`types`, `generator`, `scoring`, `config`, `storage`) con 92 pruebas Vitest en verde (6 archivos), RN-01…RN-11 cubiertas por nombre de test y casos E-01…E-10 en su capa lógica. Sin desvíos funcionales: decisiones registradas en el §8 del plan (validación de k en ambas áreas + disponibilidad del banco, renumerado 1..q sobre la copia del bloque, duración 0 si `terminadoEn` es nulo, plantilla literal del resumen según `07 §7.11`, y E-10 omitible si falta el banco generado). |
| 2026-10-16 | Se inicia el Plan 04 con su revisión de vigencia (contrato §7): decisión `07 §7.16 (#1)` resuelta (rige `07 §7.8` + Anexo B), T-4.1 se amplía a las cuatro variantes de `07 §7.9.4` (incluye icono) y se añade `Icon.svelte` como pieza compartida de los iconos en línea de `07 §7.6`. Estado del plan: 🔄. |
| 2026-10-16 | Se ejecuta y cierra el Plan 04 (T-4.1–T-4.8, un commit por tarea): catálogo de `src/components/ui/*` (botones e iconos, chips, progreso, barra inferior, stepper, **slider segmentado**, fila A–E, hoja modal y tooltip) con la galería de desarrollo (`#dev`, excluida del bundle) como superficie de verificación. `check`, `build` y `test` en verde (106 pruebas; 14 nuevas de `parsearEntero`/`indiceDesdeX`); V2 por DOM a 360/430/1280 px (0 controles por debajo de 44×44, separación ≥8 px, sin scroll horizontal, consola limpia); `grep -ri "gallery" dist/` sin resultados; auditoría `web-design-guidelines` sin hallazgos críticos; `package.json` sin dependencias nuevas. Desvíos registrados en el §8 del plan (aire etiqueta→track del slider, `pointer-events` del input nativo, trampa de foco explícita de la hoja, `{campo}` de los `aria-label` del stepper, tokens `--radius-pill`/`--accent-deep` en `app.css`). |
| 2026-10-17 | Se inicia el Plan 05 con su revisión de vigencia (contrato §7): decisión `07 §7.16 (#2)` resuelta (autofocus del nombre solo con `(pointer: fine)`, ya en la tabla de decisiones); precondición de §4 actualizada y vigencia confirmada contra `02 §RF-01`–`§RF-10`, `05 §5.2`–`§5.3`, `07 §7.9.1`–`§7.9.2`, `§7.10.1`, `§7.11`–`§7.12` y `§7.14`, sin cambios de tareas ni de matriz. Estado del plan: 🔄. |
| 2026-10-17 | Se ejecuta y cierra el Plan 05 (T-5.1–T-5.8, un commit por tarea): máquina de estados en `src/lib/state.svelte.ts` (título por pantalla y foco al `h1`), saludo editable con lápiz y tooltip, hoja de nombre (`<dialog>` con foco condicionado a `(pointer: fine)`, validación de 30 caracteres y persistencia), selector de modo con radios nativos, panel con los tres sliders, puntajes con validación en vivo, resumen en vivo y CTA en barra fija que genera el intento con el banco generado. `check`, `build` y `test` en verde (106 pruebas, sin nuevas); V2 por DOM a 360/390/430/768 px (0 controles por debajo de 44×44, sin scroll horizontal, nada oculto tras la barra, consola limpia); auditoría `web-design-guidelines` sin hallazgos críticos y detector `impeccable` (`detect --json`) vacío; `package.json` sin dependencias nuevas. Desvíos y decisiones registrados en el §8 del plan (verificación de T-5.4 repartida con T-5.5, tarjeta `.tarjeta` en `app.css`, borrador del nombre en `App.svelte`, tope de 30 sin `maxlength`, `note` opcional en `BottomBar`, reserva de scroll corregida a alto de barra + 16 px, padding lateral 20/24, superficies del navegador, tolerancia al texto al 200 % y corrección del aviso `ownership_invalid_mutation` de Svelte compartiendo la configuración con `bind:config`). |
