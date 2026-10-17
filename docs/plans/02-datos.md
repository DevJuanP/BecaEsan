# Plan 02 — Datos

> Estado: ⬜ Pendiente · Depende de: Plan 01 · Cubre: `03 §3.1`–`§3.2`, `§3.4`, `§3.6`, RNF-05, RNF-08, `06 §6.4` · Estimación: M

## 1. Objetivo

Construir `scripts/build-questions.mjs` (Node, **sin dependencias**) que extraiga y **valide** el material de `docs/preguntas/` (28 temáticas · 140 preguntas) y genere `src/data/questions.json` con el modelo normalizado de `03 §3.2`, fallando temprano y con mensaje claro ante cualquier incumplimiento. Es el puente entre el contenido y la app.

## 2. Alcance

- **Incluye:** tipos del modelo, parser, validador del contrato, generación del JSON, pruebas (fixtures + material real), integración con los scripts npm de `dev`/`build`.
- **No incluye:** lógica del intento y puntaje (Plan 03); cualquier edición de `docs/preguntas/` (fuente intocable, `00-contrato §10`).

## 3. Referencias

- Specs: `03 §3.1` (formato y tolerancias), `§3.2` (modelo normalizado), `§3.4` (identificadores), `§3.6` (contrato de extracción y criterios de aceptación), `06 §6.4` (pipeline), `06 §6.3` (scripts), `01 §1.8` (riesgo de formato), RNF-08 (glifos intactos).
- Skills: `svelte-code-writer` (no aplica: no hay `.svelte`); `impeccable` no aplica (plan sin UI).

## 4. Precondiciones

- Plan 01 ✅.
- `docs/preguntas/` intacto (28 archivos, formato verificado en `03 §3.1`).
- `npm run check` y `npm run build` en verde antes de empezar.

## 5. Tareas

### T-2.1 — Tipos del modelo normalizado

- **Objetivo:** contratos TypeScript de área, opción, pregunta y tema, usados por la app y como referencia del parser.
- **Archivos:** `src/lib/types.ts` (crear).
- **Pasos:** declarar `Area`, `Letra`, `Opcion`, `Pregunta` y `Tema` **exactamente** como `03 §3.2` (misma forma y nombres), con comentarios breves de los campos.
- **Criterios:** `03 §3.2`.
- **Verificación:** V0 (`npm run check`).
- **Estado:** [ ]

### T-2.2 — Parser `scripts/build-questions.mjs`

- **Objetivo:** extracción del material según formato y tolerancias de `03 §3.1`, con identificadores de `03 §3.4`.
- **Archivos:** `scripts/build-questions.mjs` (crear).
- **Pasos:**
  1. Recorrer `docs/preguntas/razonamiento-matematico/*.md` (17) y `docs/preguntas/razonamiento-verbal/*.md` (11), en orden de nombre de archivo.
  2. Por archivo: título (`# …`); sección opcional `## Texto` (párrafos hasta el siguiente `---`); preguntas (`**{n}.**` + cinco líneas `A)`–`E)`); clave (`## Clave de respuestas`): letra, parte `({respuesta corta})` **opcional** y explicación tras `—`.
  3. Tolerancias (`03 §3.1`): recorte de espacios finales, párrafos multilínea en el texto común, conservación **byte a byte** de tildes, «ñ», comillas angulares «…» y símbolos (π, ≈, ×, −, ², S/) — sin normalizar Unicode.
  4. Identificadores (`03 §3.4`): `temaId` = ruta sin `.md`; `numero` = primeros 2 dígitos del nombre; `pregunta.id` = `{temaId}#q{n}`.
  5. Estructura para testear: exportar `parseTema(markdown, meta)` y `parseBanco(dir)`; dejar `main()` separado, ejecutable con `node scripts/build-questions.mjs`.
- **Criterios:** `03 §3.1`, `§3.4`; RNF-08.
- **Verificación:** ejecución manual sobre el material real (`node scripts/build-questions.mjs`) sin errores; pruebas formales en T-2.5.
- **Estado:** [ ]

### T-2.3 — Validación del contrato y fallo temprano

- **Objetivo:** cumplir `03 §3.6` al 100 %, con errores que identifican archivo y problema, sin artefactos parciales.
- **Archivos:** `scripts/build-questions.mjs`.
- **Pasos:**
  1. Validar cobertura: exactamente 28 temas y 140 preguntas (85 RM + 55 RV).
  2. Validar por pregunta: cinco opciones con letras exactas A–E, clave ∈ {A…E}, explicación no vacía.
  3. Validar por tema: cinco preguntas numeradas 1–5 sin huecos, título no vacío.
  4. Al fallar: lanzar error con `{archivo}: {problema}`, `process.exitCode = 1` y **no** escribir el JSON (salida a `questions.json.tmp` + rename final solo si todo validó).
- **Criterios:** `03 §3.6` (1–5).
- **Verificación:** casos negativos en T-2.5 + prueba manual con un fixture roto al vuelo (restaurar después).
- **Estado:** [ ]

### T-2.4 — Generación determinista de `src/data/questions.json`

- **Objetivo:** el artefacto que consume la app, regido por `06 §6.4`.
- **Archivos:** `src/data/questions.json` (generado; en `.gitignore`, no se versiona), `scripts/build-questions.mjs`.
- **Pasos:**
  1. Salida determinista: orden fijo (RM 01→17, RV 01→11; preguntas 1→5), campos en orden fijo, indentación 2; **sin timestamps** ni metadatos volátiles.
  2. Misma entrada → mismo archivo **byte a byte** (`03 §3.6.6`).
- **Criterios:** `03 §3.6.6`, `06 §6.4.4`.
- **Verificación:** ejecutar dos veces y comparar hash; registrar tamaño (estimado ≈ 100 KB sin comprimir, `06 §6.4`).
- **Estado:** [ ]

### T-2.5 — Pruebas del parser (Vitest)

- **Objetivo:** contrato verificado por automatización: casos negativos con fixtures y casos positivos sobre el material real.
- **Archivos:** `scripts/build-questions.test.mjs` (crear), `scripts/__fixtures__/*.md` (crear: 5 fixtures rotos + 1 mínimo válido).
- **Pasos:**
  1. Casos negativos (cada uno debe fallar con mensaje útil): a) 4 opciones; b) clave ausente o letra inválida; c) numeración 1, 2, 4…; d) sin `## Clave de respuestas`; e) título vacío.
  2. Casos positivos: fixture mínimo válido completo; y sobre el material real: 28 temas (17 RM / 11 RV), 140 preguntas, 5 opciones por pregunta, claves válidas, `textoComun` solo en Comprensión de lectura.
  3. Determinismo: parsear dos veces y comparar (mismo resultado).
  4. Glifos: el banco generado contiene π, ≈, × y «…» sin alteraciones (RNF-08).
- **Criterios:** `03 §3.1`, `§3.6`; RNF-08; `06 §6.4.3`.
- **Verificación:** V1: `npm run test` en verde.
- **Estado:** [ ]

### T-2.6 — Integración con el ciclo de build

- **Objetivo:** el material se regenera y valida en cada `dev` y `build`, según `06 §6.3`.
- **Archivos:** `package.json`.
- **Pasos:**
  1. `dev`: `node scripts/build-questions.mjs && vite`.
  2. `build`: `node scripts/build-questions.mjs && vite build`.
  3. Conservar `test`, `check` y `preview` del Plan 01.
- **Criterios:** `06 §6.3`, `§6.4`.
- **Verificación:** V0: `npm run build` en verde genera el JSON; romper temporalmente un fixture y confirmar que el build **falla** con mensaje claro (restaurar después).
- **Estado:** [ ]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| `03 §3.1` (formato/tolerancias) | T-2.2, T-2.5 |
| `03 §3.2` (modelo normalizado) | T-2.1, T-2.4 |
| `03 §3.4` (identificadores) | T-2.2 |
| `03 §3.6` (contrato de extracción) | T-2.3, T-2.4, T-2.5 |
| RNF-05 (carga única del banco) | T-2.6 |
| RNF-08 (glifos intactos) | T-2.2, T-2.5 |
| `06 §6.3`–`§6.4` (pipeline y scripts) | T-2.2, T-2.6 |
| `01 §1.8` (riesgo: cambio de formato) | T-2.3, T-2.5 |

## 7. Verificación final del plan

- [ ] `node scripts/build-questions.mjs` corre limpio sobre los 28 archivos reales.
- [ ] `npm run build` genera `src/data/questions.json`; dos ejecuciones producen el mismo hash.
- [ ] `npm run test` en verde (fixtures rotos + material real + determinismo).
- [ ] Un fixture roto provoca fallo de build con `{archivo}: {problema}` y **sin** JSON parcial.

## 8. Registro de desvíos y decisiones

_(vacío — se completa durante la ejecución)_
