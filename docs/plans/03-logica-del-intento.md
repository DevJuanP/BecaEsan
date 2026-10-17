# Plan 03 — Lógica del intento

> Estado: ⬜ Pendiente · Depende de: Planes 01, 02 · Cubre: RN-01…RN-11, RF-02, RF-07, RF-08, RF-16 (lógica), RNF-04, E-01…E-10 (capa lógica) · Estimación: M

## 1. Objetivo

Implementar el **dominio puro** de la app —sin UI— y probarlo a fondo: creación aleatoria del intento (RN-01…RN-06), clasificación, puntaje y porcentajes (RN-07…RN-11), validación de la configuración y resumen estimado (RF-07, RF-08), persistencia del nombre (RF-02) y duración del intento (RF-16). Todo con Vitest, porque estas reglas son el corazón del simulador (`06 §6.1`).

## 2. Alcance

- **Incluye:** `types.ts` (estado en ejecución), `generator.ts`, `scoring.ts`, `storage.ts`, `config.ts` y sus pruebas; casos borde E-01…E-10 en su capa lógica.
- **No incluye:** render de nada (Planes 04–07); reloj visual en vivo (Plan 06 usa lo definido aquí); clamping de sliders (los sliders ya acotan, RF-04/05/06).

## 3. Referencias

- Specs: `02 §RN-01`–`§RN-11`, `RF-02`, `RF-07`, `RF-08`, `RF-16`, `§M6` (E-01…E-10); `03 §3.3` (estado en ejecución), `§3.5` (persistencia); `01 §1.7` (criterios de éxito 2 y 3); `06 §6.1` (Vitest para lógica pura), `§6.2`.
- Skills: ninguna específica (código TS puro; sin `.svelte`).

## 4. Precondiciones

- Planes 01 y 02 ✅.
- `npm run test` y `npm run build` en verde antes de empezar.

## 5. Tareas

### T-3.1 — Tipos del intento

- **Objetivo:** contratos del estado en ejecución listos para la UI de los Planes 05–07.
- **Archivos:** `src/lib/types.ts` (ampliar).
- **Pasos:** añadir `Modo`, `ConfigQuiz`, `BloqueIntento`, `Intento`, `ResultadoArea` y `Resultado`, **exactamente** como `03 §3.3` (misma forma y nombres).
- **Criterios:** `03 §3.3`.
- **Verificación:** V0 (`npm run check`).
- **Estado:** [x]

### T-3.2 — `generator.ts` — creación del intento

- **Objetivo:** `crearIntento(config, banco, rng)` → `Intento`, cumpliendo RN-01…RN-06 al pie de la letra.
- **Archivos:** `src/lib/generator.ts` (crear).
- **Pasos:**
  1. Normalizar/validar la entrada: k de cada área dentro de rango (1–17 / 1–11) y q ∈ 1–5; error explícito si no (defensa).
  2. Por área incluida: barajar temas con Fisher–Yates y tomar **k distintos** (RN-02); si k = total, incluirlos todos — igual se barajan.
  3. Armar bloques con **RM primero y RV después**, cada grupo en orden barajado (RN-03).
  4. Por tema: q = 5 → las 5 en orden del archivo (1→5); q < 5 → subconjunto aleatorio y renumera 1..q (RN-04); copiar `textoComun` del tema.
  5. `respuestas` inicializadas a `null` por `pregunta.id`; snapshot completo e inmutable salvo `respuestas` e `indiceActual` (RN-01); sin memoria entre intentos (RN-05).
  6. Alternativas **sin barajar** (RN-06 — garantizado por el modelo).
  7. `rng: () => number` inyectable (por defecto `Math.random`) para pruebas deterministas.
- **Criterios:** RN-01…RN-06; `03 §3.3`.
- **Verificación:** V1 (casos en T-3.6) + V0.
- **Estado:** [x]

### T-3.3 — `scoring.ts` — clasificación, puntaje y porcentajes

- **Objetivo:** `calcularResultado(intento)` → `Resultado`, cumpliendo RN-07…RN-11.
- **Archivos:** `src/lib/scoring.ts` (crear).
- **Pasos:**
  1. Clasificar cada pregunta: correcta / incorrecta / no respondida (RN-07).
  2. Por área: totales, puntaje con la escala del intento (RN-08) y porcentajes enteros con **método del mayor resto** de modo que los tres sumen 100 % (RN-09); desempate determinista (orden fijo de categorías) para que el resultado no dependa del azar.
  3. Denominadores por área, nunca globales (RN-10); puntaje total = suma de áreas incluidas (RN-08).
  4. `duracionMs = terminadoEn − iniciadoEn`; áreas no incluidas quedan fuera (RN-11).
- **Criterios:** RN-07…RN-11; `03 §3.3`.
- **Verificación:** V1 (casos en T-3.6) + V0.
- **Estado:** [x]

### T-3.4 — `storage.ts` — persistencia del nombre

- **Objetivo:** leer/guardar/borrar el nombre en `localStorage` sin romper la app cuando el almacenamiento no está disponible (RF-02, RNF-04).
- **Archivos:** `src/lib/storage.ts` (crear).
- **Pasos:**
  1. Clave `beca-esan.nombre` (`03 §3.5`).
  2. API: `leerNombre(): string | null`, `guardarNombre(nombre: string)`, `borrarNombre()`; con `try/catch` silencioso (Safari en modo restringido).
  3. `trim` y límite 30 al guardar; vacío → borrar (RF-01.4 concreta aquí su persistencia).
  4. Para poder probarlo sin navegador: aceptar un objeto `StorageLike` inyectable (por defecto `localStorage` si existe).
- **Criterios:** RF-02, RNF-04, `03 §3.5`.
- **Verificación:** V1 (tests con storage simulado: guardar/leer/borrar, fallo de storage) + V0.
- **Estado:** [x]

### T-3.5 — `config.ts` — validación y resumen

- **Objetivo:** la fuente de verdad de la configuración, sus defaults y el cálculo del resumen en vivo.
- **Archivos:** `src/lib/config.ts` (crear).
- **Pasos:**
  1. `CONFIG_INICIAL` = `{ modo: 'completo', temasRM: 8, temasRV: 5, preguntasPorTema: 2, puntos: { correcta: 5, noRespondida: 0, incorrecta: -2 } }` (`03 §3.3`).
  2. `validarConfig(config)`: puntajes enteros dentro de −999…999; reporta los campos en error con un identificador por campo (la UI mostrará el mensaje de `07 §7.11`).
  3. `resumenConfig(config)`: «Completo · 13 temas · 26 preguntas» con la fórmula de RF-08 y los nombres de modo de `07 §7.11` («Solo Matemático», «Solo Verbal», «Completo»).
- **Criterios:** RF-07, RF-08.
- **Verificación:** V1 (incluye: modo solo-rm excluye temasRV del resumen, etc.) + V0.
- **Estado:** [x]

### T-3.6 — Pruebas de dominio completas (casos borde)

- **Objetivo:** cubrir E-01…E-10 en su capa lógica, los criterios de éxito 2 y 3 de `01 §1.7` y las 11 reglas RN.
- **Archivos:** `src/lib/generator.test.ts`, `src/lib/scoring.test.ts`, `src/lib/config.test.ts`, `src/lib/storage.test.ts` (crear/ampliar).
- **Pasos:**
  1. RNG sembrado (p. ej. mulberry32) para determinismo en todas las pruebas del generador.
  2. Casos: **E-01** (17 de 17, barajados); **E-02** (q = 5, orden 1→5); **E-03** (k = 1, q = 1 → porcentajes 100/0/0 o 0/100/0); **E-04** (en blanco → puntaje = T × pnr; 100 % no respondidas); **E-05** (escala 0/0/0 → puntaje 0, porcentajes igual); **E-06** (textoComun se copia con q < 5); **E-07** (cambiar una respuesta cambia la clasificación final); **E-09** (pi negativo aplicado tal cual); **E-10** sobre el banco real (glifos intactos en el pipeline).
  3. Invariantes: sin repetición de temas; RM siempre antes que RV; k y q exactos; suma de porcentajes = 100 (varios T, incluidos T = 3 y T = 15 con casos 80/13/7).
  4. Defensa: `crearIntento` lanza error con k o q fuera de rango.
- **Criterios:** E-01…E-10 (lógica), RN-01…RN-11, `01 §1.7` (2 y 3).
- **Verificación:** V1: `npm run test` en verde; RN-01…RN-11 con al menos una prueba cada una.
- **Estado:** [x]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| RN-01, RN-02, RN-04, RN-05, RN-06 | T-3.2, T-3.6 |
| RN-03 (orden RM→RV) | T-3.2, T-3.6 |
| RN-07, RN-08, RN-09, RN-10 | T-3.3, T-3.6 |
| RN-11 (áreas no incluidas) | T-3.3, T-3.6 |
| RF-02, RNF-04 (persistencia del nombre) | T-3.4 |
| RF-07 (validación de puntajes) | T-3.5 |
| RF-08 (resumen estimado) | T-3.5 |
| RF-16 (duración, formato en T-1.6) | T-3.3 |
| E-01…E-10 (lógica) | T-3.2, T-3.3, T-3.4, T-3.5, T-3.6 |
| `03 §3.3` (estado en ejecución) | T-3.1, T-3.2, T-3.3 |
| `03 §3.5` (claves de persistencia) | T-3.4 |
| `06 §6.1` (Vitest para lógica pura) | T-3.6 |

## 7. Verificación final del plan

- [ ] `npm run test` en verde con toda la suite de dominio.
- [ ] RN-01…RN-11 con cobertura de pruebas (al menos una prueba por regla, verificable por nombre de test).
- [ ] `npm run check` y `npm run build` en verde; el dominio añade un peso despreciable al bundle.
- [ ] Ninguna función del dominio depende del DOM (importable en entorno `node` de Vitest sin mocks).

## 8. Registro de desvíos y decisiones

### Revisión de vigencia (previa a la ejecución)

Contraste del plan contra `docs/especificaciones/` (02, 03, 06 y 07 §7.11/§7.16): sin cambios que afecten al plan. Las tres decisiones abiertas de `07 §7.16` (CSS del slider, autofocus en móvil y etiqueta «Home») pertenecen a los Planes 04, 05 y 07. Precondiciones verificadas en verde antes de empezar: `npm run check` (0 errores), `npm run test` (27 pruebas) y `npm run build`; Planes 01 y 02 ✅ en `docs/plans/README.md`.

### T-3.2 — interpretación de la validación y del renumerado

- **Validación de entrada.** La tarea pide validar «k de cada área dentro de rango (1–17 / 1–11) y q ∈ 1–5». Se validan **ambas** áreas siempre (aunque el modo excluya una; la UI conserva sus valores ocultos, `02 §RF-03`) y, además, que k no supere los temas disponibles del **banco** en las áreas incluidas (defensa de borde del material; mensaje explícito). q se valida también como entero.
- **Renumerado (RN-04).** La copia de cada pregunta dentro de `BloqueIntento.preguntas` lleva `numero` = posición a mostrar (1..q), como pide la regla («se renumera 1..q en el bloque»); `id` conserva el identificador estable del banco (`{temaId}#q{n}`) y es la clave de `respuestas`.
- **Orden con q < 5.** El subconjunto aleatorio queda en el orden resultante de la mezcla Fisher–Yates (no se reordena al orden del archivo); con q = 5 se mantiene el orden 1→5 del material, como manda RN-04.
- **`id` del intento.** `03 §3.3` sugiere «p. ej. timestamp»: se usa `String(iniciadoEn)` (no se persiste en v1).
- **Snapshot (RN-01).** Copias profundas de la configuración (incluido `puntos`), de los bloques y de cada pregunta/opción: mutar después la configuración o el banco no altera el intento; `respuestas` arranca con `null` por `pregunta.id`.

### T-3.3 — duración y casos defensivos del cálculo

- **`terminadoEn` nulo.** El plan fija `duracionMs = terminadoEn − iniciadoEn`; el tipo lo admite nulo (`03 §3.3`). Interpretación conservadora: si aún es `null` (no debería ocurrir al confirmar «Ver resultados», `02 §RF-16`/`RF-19`), la duración es `0`, y se acota a `≥ 0` por si el reloj salta hacia atrás. `scoring` sigue siendo puro (no consulta `Date.now()`).
- **Respuesta ausente.** Un `id` sin entrada en `respuestas` (objeto incompleto) se clasifica como **no respondida**, igual que `null`.
- **Orden de las áreas.** El de su primera aparición en `bloques` (RM y luego RV, `02 §RN-03`); `puntajeTotal` es la suma de esas áreas incluidas.

### T-3.4 — matices de la capa de almacenamiento

- **Truncado, no rechazo.** `guardarNombre` recorta a 30 caracteres en silencio; la validación con mensaje («Máximo 30 caracteres.») es de la hoja de nombre (Plan 05). Aquí 30 es la última barrera defensiva, coherente con `maxlength` del campo.
- **Lectura tolerante.** `leerNombre` recorta espacios y devuelve `null` si el valor está vacío (E-08 en capa lógica), aunque el valor lo haya puesto otra vía; no trunca al leer.
- **Sin almacenamiento.** El tercer parámetro admite `StorageLike | null` explícito (`null` = sin almacenamiento) además del inyectado para pruebas; las tres funciones son no-op silenciosas si falta o si cada operación lanza.

### T-3.5 — alcance de la validación y plantilla del resumen

- **`validarConfig` valida solo puntajes**, como pide la tarea: los sliders ya acotan k y q (`02 §RF-04`–`RF-06`) y `modo` es un conjunto cerrado. Un valor `NaN` (campo vacío o no numérico en la UI) cuenta como inválido, de modo que el botón «Iniciar quiz» quede deshabilitado con cualquier entrada no resoluble.
- **Plantilla del resumen literal** (`07 §7.11`): «{Modo} · {k} temas · {q} preguntas» siempre en plural; con k = 1 el texto es «1 temas» porque el deck no define variante singular y Plan 08 audita cadenas exactas. Si el producto quiere singularización, exige cambio de microcopy en `07 §7.11` (contrato §9).
- **API pequeña extra:** `etiquetaModo(modo)` se exporta (mismos nombres de modo del deck) para que el recordatorio de resultados del Plan 07 no duplique el mapa; `CONFIG_INICIAL` queda congelado en profundidad para que el default compartido no se mute.

### T-3.6 — E-10 y cobertura por nombre de prueba

- **E-10 y el banco generado.** `src/data/questions.json` es un artefacto generado y no versionado (Plan 02, `00-contrato §10`): las pruebas de banco real (E-10 y la integración de `scoring`) cargan el JSON con `import.meta.glob` y se **omiten con aviso** si aún no existe (clone limpio sin `npm run dev`/`build`). En el flujo normal —`build`/`dev` regeneran el banco antes— corren y quedan en verde (verificado en esta ejecución: 2 pruebas de banco real ejecutadas, no omitidas).
- **Cobertura por nombre.** Cada RN aparece citada en el nombre de su `describe`/`it`: RN-01…RN-06 en `generator.test.ts`, RN-07…RN-11 en `scoring.test.ts` (RN-11 también en generador, áreas excluidas), y E-01…E-07, E-09, E-10 en los casos indicados por la tarea (E-08 queda en `storage.test.ts`, capa lógica).
