# Plan 08 — Calidad y despliegue

> Estado: 🔄 En curso · Depende de: Planes 01–07 · Cubre: `01 §1.7` (criterios de éxito), RNF-01…RNF-09 (verificación final), E-01…E-10 (punta a punta), `06 §6.2` (presupuesto), `§6.6` (runbook de deploy), `07 §7.12`, `§7.13`, `§7.14`, `§7.15` · Estimación: M

## 1. Objetivo

Cerrar la v1: auditar accesibilidad y calidad visual contra las especificaciones, verificar el presupuesto de rendimiento, probar los casos borde de punta a punta, publicar el repositorio en GitHub y **dejar la app lista y documentada para el deploy manual** en Cloudflare Pages (lo ejecuta el usuario; queda fuera de la orquestación). Al terminar, el simulador está construido, verificado y listo para publicarse.

## 2. Alcance

- **Incluye:** auditorías finales (a11y, calidad, skills), presupuesto de rendimiento, prueba E-01…E-10 e2e (emulación móvil), GitHub, **preparación del deploy manual** (T-8.7) y cierre documental.
- **No incluye:** funcionalidad nueva (los hallazgos **funcionales** se manejan por control de cambios, `00-contrato §9`); el **deploy real** en Cloudflare Pages y el **pase en dispositivos reales**, que son tareas manuales del usuario (el plan solo las prepara y documenta).

## 3. Referencias

- Specs: `01 §1.7` (criterios de éxito), `§1.8` (riesgos); `06 §6.2` (presupuesto), `§6.6` (runbook), `§6.7` (fase 2); `07 §7.12` (a11y), `§7.13` (rendimiento visual), `§7.14` (checklist), `§7.15` (skills), `§7.16` (pendientes); `02 §M6` (E-01…E-10); `03 §3.6`.
- Skills: `web-design-guidelines` (auditoría final por archivo); `impeccable` (polish de cierre); `svelte-code-writer`/`svelte-core-bestpractices` (correcciones); `ui-ux-pro-max` (si surge una duda puntual de patrón); `apple-design` (revisión de movimiento); `frontend-design` (autocrítica final).

## 4. Precondiciones

- Planes 01–07 ✅ (cerrados entre el 2026-10-16 y el 2026-10-17) y sus verificaciones finales en verde.
- Cuenta de GitHub del usuario disponible (T-8.6): el repositorio **ya existe** (`origin` = `https://github.com/DevJuanP/BecaEsan.git`) y los push los gestiona el orquestador; T-8.6 se limita a verificar el remoto y completar el README raíz (detalle en §8). La cuenta de Cloudflare y los dispositivos reales solo se necesitan para los pendientes manuales del usuario (T-8.7 y T-8.5), no para ejecutar el plan.
- Decisiones de `07 §7.16 (#1)–(#3)`: **resueltas** el 2026-10-16/17 (tabla de `docs/plans/README.md`): (#1) rige `07 §7.8` + Anexo B; (#2) autofocus del nombre solo con `(pointer: fine)`; (#3) se mantiene «Home». Sin efecto pendiente sobre este plan.

## 5. Tareas

### T-8.1 — Auditoría de accesibilidad integral

- **Objetivo:** verificar y corregir la accesibilidad real de las tres pantallas y las hojas contra `07 §7.12`.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:**
  1. Recorrido de teclado completo: Home (saludo → modo → sliders → puntajes → CTA) → hoja de nombre → quiz (radios con flechas → barra) → hoja de confirmación → resultados → Home. Foco siempre visible y en orden lógico.
  2. Hojas: foco atrapado, `Escape` cancela, el foco vuelve al disparador.
  3. Contraste renderizado: verificar en pantalla real los pares de `07 §7.3.5` (destacar texto secundario, porcentajes, chips y estados deshabilitados).
  4. Zoom 200 % y tamaño de texto del sistema grandes: sin recortes ni scroll horizontal.
  5. `prefers-reduced-motion` y `prefers-reduced-transparency`: transiciones, barras de resultados y barras fijas.
  6. Objetivos táctiles ≥44×44 y separación ≥8 px en pantalla (no solo en la galería).
  7. Semántica: `aria-valuetext` de sliders, `aria-label` de iconos, timer sin `aria-live`, radios reales por pregunta.
- **Criterios:** `07 §7.12`; RNF-02, RNF-06.
- **Verificación:** checklist 1–7 marcada por pantalla; hallazgos corregidos con su re-verificación.
- **Estado:** [x]

### T-8.2 — Checklist de calidad visual + auditoría web-design-guidelines

- **Objetivo:** pasar la checklist de `07 §7.14` en las tres pantallas y hojas, y auditar todo el código UI.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:**
  1. Aplicar `07 §7.14` bloque por bloque (composición, interacción y estados, accesibilidad, movimiento, contenido y copy, superficies del navegador) en Home, Quiz, Resultados y hojas.
  2. Contrastar el copy visible contra el deck de `07 §7.11` (cadenas exactas, «…», «−», tabulares).
  3. Auditoría `web-design-guidelines` sobre todos los archivos UI (`src/**/*.svelte`, `src/app.css`), con hallazgos en formato `archivo:línea`; corregir.
- **Criterios:** `07 §7.14`, `§7.11`; RNF-07.
- **Verificación:** checklist marcada; auditoría sin hallazgos críticos abiertos.
- **Estado:** [x]

### T-8.3 — Pulido final con impeccable

- **Objetivo:** pasada de cierre sobre las pantallas sin re-decidir el sistema.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:** ejecutar `polish`/`critique` de la skill sobre Home, Quiz y Resultados; aplicar solo cambios compatibles con `07`; re-verificar V0/V2 donde se toque.
- **Criterios:** `07 §7.15` (uso de skills al cierre).
- **Verificación:** hallazgos aplicados o descartados con razón registrada.
- **Estado:** [x]

### T-8.4 — Presupuesto de rendimiento

- **Objetivo:** medir y cumplir el compromiso de `06 §6.2` / `07 §7.13`.
- **Archivos:** — (optimizaciones donde correspondan).
- **Pasos:**
  1. Medir sobre `npm run build` + `npm run preview`: JS inicial **gzip ≤ ~80 KB** (desglose Svelte / app / datos), CSS **gzip ≤ ~15 KB**, **0** fuentes web y **0** imágenes raster, **3** requests en el primer render.
  2. Lighthouse móvil con throttling 4G sobre `preview`: sin CLS perceptible; objetivo de carga < 1 s percibida.
  3. Si se excede cualquier métrica: optimizar (p. ej. revisar imports, dividir datos si hiciera falta) y volver a medir. Registrar los números finales.
- **Criterios:** `06 §6.2`; RNF-05.
- **Verificación:** números registrados y dentro de presupuesto.
- **Estado:** [x]

### T-8.5 — Prueba E-01…E-10 de punta a punta (emulación móvil + pase manual documentado)

- **Objetivo:** verificar el producto completo con los casos borde mediante emulación móvil (360–430 px, chrome-devtools) y dejar preparado, con pasos exactos, el pase manual en dispositivos reales (iOS Safari / Android Chrome) como pendiente del usuario.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:**
  1. Ejecutar cada caso **completo** (configurar → resolver → resultados) en viewport móvil emulado: **E-01** RM 17/17; **E-02** q = 5; **E-03** mínimo (k = 1, q = 1); **E-04** quiz en blanco; **E-05** escala 0/0/0; **E-06** comprensión de lectura con q < 5; **E-07** atrás + editar; **E-08** nombre vacío/espacios; **E-09** puntajes negativos; **E-10** símbolos (π, ≈, ×, ², S/) intactos.
  2. Transversales automatizables: sin scroll horizontal, persistencia del nombre tras recarga, 3 requests, 0 fuentes web, consola sin errores.
  3. Documentar el **pase manual en dispositivos reales** (safe areas/notch, rotación, gesto, `beforeunload`) con pasos exactos, para el informe de cierre.
- **Criterios:** `02 §M6` (E-01…E-10); `01 §1.7` (1, 3, 4); RNF-01, RNF-04, RNF-08, RNF-09.
- **Verificación:** matriz E-01…E-10 marcada en emulación móvil; hallazgos corregidos; guía del pase manual documentada.
- **Estado:** [x]

### T-8.6 — Repositorio en GitHub

- **Objetivo:** código publicado y respaldado en GitHub.
- **Archivos:** `README.md` raíz (completar deploy), `.gitignore` (revisión final).
- **Pasos:**
  1. Crear el repositorio (cuenta del usuario; asistir con `gh` si está disponible o por la interfaz web).
  2. Añadir `origin`, push de `main`.
  3. Completar en el README raíz: qué es, comandos, cómo se despliega manualmente (`06 §6.6`; se termina en T-8.7) y enlace a `docs/`.
- **Criterios:** `06 §6.6` (paso 1).
- **Verificación:** `git remote -v` + repositorio accesible con el historial por tarea.
- **Estado:** [x]

### T-8.7 — Preparación del deploy manual (Cloudflare Pages)

- **Objetivo:** dejar la app lista y documentada para que el usuario haga el deploy manual. Este plan **no ejecuta el deploy** (ni por panel ni por CLI).
- **Archivos:** `README.md` (raíz; sección de deploy).
- **Pasos:**
  1. Verificar el build de producción: `npm run build` en verde y `npm run preview` sirviendo `dist/` con las tres pantallas funcionando (assets con hash, sin fuentes web).
  2. Simular el flujo que hará Cloudflare desde un estado limpio (clon temporal del repo: `npm ci && npm run build`) y confirmar que `dist/` se regenera sin pasos manuales.
  3. Completar el `README.md` raíz con el runbook **manual** de `06 §6.6`, listo para seguir: Workers & Pages → Create → Pages → Connect to Git → seleccionar el repositorio; build command `npm run build`; output directory `dist`; Node LTS (≥ 22); smoke test en la URL `*.pages.dev` (HTTPS, carga < 1 s, assets con hash, sin fuentes web, las tres pantallas); verificar el deploy automático con un push de prueba.
  4. Registrar en el informe de cierre el **pendiente manual del usuario**: ejecutar el runbook y validar la URL publicada.
- **Criterios:** `06 §6.6`; RNF-03.
- **Verificación:** build y preview locales en verde; runbook completo en el README; pendiente manual documentado en el informe.
- **Estado:** [ ]

### T-8.8 — Cierre del proyecto

- **Objetivo:** cerrar el DoD del proyecto (`00-contrato §6`) y dejar el mapa de la fase 2.
- **Archivos:** `docs/plans/README.md` (estado global + changelog), `docs/especificaciones/README.md` (estado).
- **Pasos:**
  1. Marcar los 8 planes ✅ en `README.md` y añadir la entrada de cierre al changelog.
  2. Actualizar el README de especificaciones (v1 implementada y desplegada, con la URL).
  3. Listar candidatos de fase 2 **sin implementar** (`01 §1.5`, `06 §6.7`, `07 §7.16`): revisión con explicaciones, PWA/ofﬂine, persistencia de configuración (RF-11), tema oscuro, dominio propio.
- **Criterios:** `00-contrato §6` (DoD del proyecto).
- **Verificación:** matrices sin filas rojas; `01 §1.7` con sus 5 criterios marcados.
- **Estado:** [ ]

## 6. Matriz de trazabilidad del plan

| ID / sección | Tarea(s) |
|---|---|
| `01 §1.7` (criterios de éxito 1–5) | T-8.4 (5), T-8.5 (1, 3, 4), T-8.7 (1) |
| RNF-01 (mobile-first) | T-8.5 |
| RNF-02 (táctil) | T-8.1 |
| RNF-03 (sitio estático) | T-8.7 |
| RNF-04 (persistencia) | T-8.5 |
| RNF-05 (rendimiento) | T-8.4 |
| RNF-06 (accesibilidad) | T-8.1 |
| RNF-07 (idioma) | T-8.2 |
| RNF-08 (contenido matemático) | T-8.5 (E-10) |
| RNF-09 (aviso de salida) | T-8.5 |
| E-01…E-10 (punta a punta) | T-8.5 |
| `06 §6.2` (presupuesto), `§6.6` (runbook de deploy manual) | T-8.4, T-8.6, T-8.7 |
| `07 §7.12`, `§7.13`, `§7.14`, `§7.15` | T-8.1, T-8.2, T-8.3 |
| `00-contrato §6` (DoD del proyecto) | T-8.8 |

## 7. Verificación final del plan

- [ ] Auditoría a11y y checklist `07 §7.14` sin hallazgos críticos abiertos.
- [ ] Presupuesto de `06 §6.2` cumplido, con los números finales registrados.
- [ ] E-01…E-10 verificados de punta a punta en emulación móvil; el pase en dispositivos reales quedó documentado como pendiente del usuario.
- [ ] Repositorio en GitHub con el historial completo y README raíz terminado (incluido el runbook del deploy manual).
- [ ] App lista para el deploy manual: build limpio verificado y runbook probado en local; el deploy lo ejecuta el usuario.
- [ ] `docs/plans/README.md` y el README de especificaciones reflejan el cierre.

## 8. Registro de desvíos y decisiones

- **2026-10-16 · Decisión del usuario (pre-ejecución, `00-contrato §9`):** el deploy a Cloudflare Pages es **manual del usuario** y queda fuera de la ejecución de la orquestación; T-8.7 pasa a «preparación del deploy manual» y T-8.5 explicita el reparto emulación móvil (orquestación) vs. pase manual (usuario). Ajustados: §1, §2, §4, T-8.5, T-8.6, T-8.7, §6, §7. Registrado también en el changelog de `docs/plans/README.md`.

### Revisión de vigencia (2026-10-17, previa a la ejecución)

- **Confrontación con las especificaciones** (`01 §1.7`, `§1.8`; `06 §6.2`, `§6.6`, `§6.7`; `07 §7.12`, `§7.13`, `§7.14`, `§7.15`, `§7.16`; `02 §M6` (E-01…E-10); `03 §3.6`; `00-contrato §5`, `§6`): las secciones citadas por la matriz siguen correspondiendo a T-8.1…T-8.8 y no hay requisitos derogados. Todo lo que el plan necesita ya existe en el repo (app completa de los Planes 01–07, `dist/` reproducible desde `npm run build`, repositorio GitHub con historial por tarea). Vigencia confirmada **sin cambios de tareas ni de matriz**.
- **Precondiciones de §4 verificadas:** Planes 01–07 ✅ en `docs/plans/README.md`; `npm run check` → 0 errores/0 avisos; `npm run build` → 183 módulos (CSS 8.11 KB gzip, JS 50.76 KB gzip); `npm run test` → 113 pruebas en verde.
- **Decisiones `07 §7.16` (#1)–(#3):** resueltas (tabla de `README.md`): (#1) rige `07 §7.8` + Anexo B; (#2) autofocus del nombre solo con `(pointer: fine)`; (#3) «Home» se mantiene. Ninguna condiciona tareas de este plan.
- **T-8.6 (ajuste de vigencia, sin cambio de tareas):** el repositorio de GitHub **ya existe** y `origin` ya está configurado; el push lo gestiona el orquestador. El paso 1 («crear el repositorio») y el push del paso 2 ya están satisfechos; la tarea se limita a verificar `git remote -v`/accesibilidad y completar el README raíz (paso 3).
- **T-8.4 y T-8.5 (método de verificación, restricción de entorno):** el ejecutor no puede recibir imágenes, así que la medición de UI/E2E se hace con `chrome-devtools` **por salidas de texto** (DOM, `evaluate`, consola, red) y no con capturas; el presupuesto se mide sobre los tamaños de build y las métricas de red/DOM de `preview` (no hay Lighthouse instalado ni dependencias fuera del stack de `06 §6.1`), documentando el método. El juicio puramente visual (contraste renderizado con ojo humano, «feel» del gesto) y el pase en dispositivos reales quedan como pendientes humanos documentados.
- **Informe de cierre:** T-8.7.4 exige «registrar en el informe de cierre el pendiente manual»; no existe un archivo de informe previo, así que el informe vive en el §8 de este plan (secciones «Pase manual en dispositivos reales» y «Deploy manual») más el README raíz.

### T-8.1 — Auditoría de accesibilidad integral

- **Método (restricción de entorno):** auditoría por DOM con `chrome-devtools` (viewport emulado 360×800 dpr 3, táctil), sin capturas ni imágenes: recorrido de foco real con `Tab`/flechas/`Escape`, medidas de `getBoundingClientRect`, contraste calculado sobre los **colores computados** (los mismos del render) y volcado de reglas `@media` de las hojas de estilo. El juicio puramente visual queda como pendiente humano (§7).
- **Recorrido de teclado (1):** Home → `Pon aquí tu nombre` (100×44) → radios de modo (grupo `name` único, flechas cambian selección) → sliders RM/RV/preguntas (flechas, `Home` → 1, `End` → 17) → steppers (botón ±, campo, botón +) → `Iniciar quiz` (320×48) → vuelta al navegador. Quiz → radios de cada pregunta (flechas dentro del grupo) → `Atrás` (deshabilitado en el bloque 1) → `Continuar`. Todo con `:focus-visible` = `outline: 2px solid rgb(0,99,189)` (blue-600, `07 §7.12` (2)). Resultados → `Home`. Orden lógico y sin saltos.
- **Hojas (2):** `Escape` cierra (tras la animación de 240 ms) y el foco vuelve al disparador (verificado con `Enter` desde el botón del saludo → foco a `Cerrar` → `Escape` → foco de vuelta en `Pon aquí tu nombre`); trampa de foco real (Tab cicla `campo → Cancelar → Guardar → Cerrar → campo`) tanto en la hoja de nombre como en la de confirmación; `aria-modal="true"` + `aria-labelledby`; la de confirmación abre con foco en `Volver a revisar`; `Enter` abre desde teclado.
- **Contraste renderizado (3):** barrido de todos los pares texto/fondo computados en las tres pantallas (Home 28 pares, Quiz 24, Resultados 24) → **0 fallos AA**; los más ajustados: `Puntaje total` y el recordatorio (13 px 500/600 `ink-3` sobre blanco = 4.55, mínimo exigido 4.5), ayuda y conteos (`ink-3` 4.76), cronómetro (`ink-2` sobre `surface-2` = 6.92), chip RV (`orange-800` sobre `orange-50` = 6.70), botón primario (blanco sobre blue-600 = 5.97), CTA deshabilitado (`ink-disabled` sobre `line` = 2.56, **exento AA** por ser control deshabilitado). Semánticos de resultados con punto + etiqueta + número (nunca solo color).
- **Hallazgo 1 (corregido): desborde horizontal con el texto del sistema al 200 % en Home.** Con la raíz a 32 px, la fila del stepper (etiqueta + grupo `[−][valor][+]` de 168 px) no cabía en los 288 px de la tarjeta y empujaba el documento a `scrollWidth` 390 (> 360): scroll horizontal real y barra fija de 390 px. Se añade `flex-wrap: wrap` a `.stepper__row` con `margin-left: auto` en `.stepper__group` (el grupo cae a su propia línea, alineado a la derecha) y, en la misma pasada, `flex-wrap: wrap` + `margin-left: auto` al encabezado del slider (`.slider__head`), que desbordaba 6 px por el valor «8 de 17» con `nowrap`. Medido de nuevo a 360/430/768 px con la raíz a 32 px: `scrollWidth` = `clientWidth`, 0 elementos fuera del viewport, hoja de nombre a 360 px y barra fija a 360 px; a tamaño normal las filas siguen en una línea (44 px) y el encabezado del slider en una línea.
- **Hallazgo 2 (corregido): separación de 4 px entre las opciones del selector de modo.** `07 §7.12` (3) exige ≥8 px entre objetivos táctiles; los segmentos (`Matemático`/`Verbal`/`Completo`, 87×44) quedaban a 4 px. Se sube `gap` de `.modo` a 8 px (el pill de `§7.9.2` —fondo `surface-2`, padding 4— se mantiene); medido: separaciones de 8 y 9 px, opciones de 87×44. Resto de la pantalla sin pares < 8 px (Quiz y Resultados: 0 pares).
- **Objetivos táctiles (6):** Home (saludo 100×44, modo 87×44, sliders 286×44, stepper 44×44, CTA 320×48), Quiz (alternativas 320×56 con 12 px entre ellas, `summary` del texto 278×44, botonera 44/48), Resultados (`Home` 320×48) → **0 controles < 44×44** (los `input` ocultos de 1×1 de radios y slider delegan el toque en su label/track, patrón de `07 §7.9.2`/`§7.8.6`).
- **Semántica (7):** `aria-valuetext` en los tres sliders («8 de 17 temas», «2 de 5 preguntas»), `aria-label` en todos los botones de icono (lápiz, ±, X) y `aria-hidden` en **todos** los SVG; cronómetro sin `aria-live` (y sin `role`), sin `aria-live` en la barra de progreso; radios **reales** por pregunta (5 por `<fieldset>` con `legend` = enunciado y `name` = id de pregunta); `<details>`/`<summary>` del texto común con `aria-expanded` sincronizado («Ocultar texto»/«Mostrar texto» por clic y por `Enter`); inputs con `inputmode="numeric"`, `autocomplete="given-name"`/`off`, `aria-invalid` + `aria-describedby` en error, y mensaje exacto del deck.
- **Reduced motion/transparency (5):** reglas `@media (prefers-reduced-motion: reduce)` presentes y correctas en `Button`, `ModeSelector`, `Stepper`, `GreetingHeader`, `Sheet`, `OptionRow`, `AreaCard`, `ScoreHero` (transformaciones a `none`, transiciones sin `transform`, hoja con fundido) y `@media (prefers-reduced-transparency: reduce)` en `BottomBar` y `QuizHeader` (fondo sólido + `backdrop-filter: none`). Comprobación funcional con `matchMedia` parcheado desde `initScript` (el motor CSS no se puede emular desde el protocolo disponible): la sección excluida desaparece en 2 ms (fade 0) y la transición de bloque queda con `translateX` 0 (`matrix(1,0,0,1,0,0)`) y solo fundido ≈150 ms.
- **Superficies del navegador (extra de `§7.14`):** `touch-action: manipulation` en `body`, `-webkit-tap-highlight-color: transparent`, `caret` tinta, `overscroll-behavior: contain` en la hoja.
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.12 KB gzip, JS 50.76 KB gzip; `npm run test` → 113 pruebas en verde; `svelte-autofixer` sobre `Stepper.svelte`, `ModeSelector.svelte` y `Slider.svelte`: sin hallazgos.

### T-8.2 — Checklist de calidad visual + auditoría web-design-guidelines

- **Checklist `07 §7.14` por pantalla (Home, Quiz, Resultados y hojas), medida por DOM/CSS:**
  - *Composición:* una sola columna sin scroll horizontal (`scrollWidth` = `clientWidth` a 360/430/768 px); padding lateral 20 px a 360 y 24 px desde 430; medida de texto ≤75ch (`.texto__cuerpo` del texto común); jerarquía por tamaño/peso (título 20/700, héroe 44–56/800, nombre de área 16/600, cuerpo 16/17); **0** mini-etiquetas en mayúsculas (`text-transform: none` en todo el DOM), **0** tarjetas anidadas y **0** elementos con borde + sombra a la vez; radio 12 en controles y 16 en tarjetas.
  - *Interacción y estados:* reposo/pressed/focus/disabled presentes (pressed `scale(0.97)` a 100 ms; focus 2 px + offset; deshabilitado `line` + `ink-disabled` con motivo en texto); **0** reglas `:hover` fuera de `@media (hover: hover) and (pointer: fine)`; objetivos ≥44×44 con ≥8 px (T-8.1); barras fijas con reserva real (`padding-bottom` 89 px = 73 px de barra + 16, más `env(safe-area-inset-bottom)`), `scroll-margin-top: 104px` en las alternativas para que la cabecera sticky no tape el foco.
  - *Movimiento:* **0** `transition: all` con duración > 0 (propiedades explícitas: `background-color`, `border-color`, `color`, `transform`, `box-shadow`, `opacity`); solo `transform`/`opacity` animados; cierre de hoja 240 ms < apertura 340 ms (`07 §7.7.1` (5)); un solo momento orquestado por pantalla (transición de bloque en el quiz, crecimiento único de barras/héroe en resultados).
  - *Contenido y copy:* cadenas exactas del deck verificadas en pantalla — Home («Hola»/«Hola, {nombre}», «Configura tu quiz», «Modo del quiz», «Matemático/Verbal/Completo», etiquetas y captions de los tres sliders, «Puntajes», «Puntos que suma cada tipo de respuesta», «Correcta/No respondida/Incorrecta», resumen «Completo · 13 temas · 26 preguntas», «Iniciar quiz»); hoja de nombre («¿Cómo te llamas?», «Tu nombre», «Ej. Juan», «Máx. 30 caracteres»/«Máximo 30 caracteres.», «Cancelar»/«Guardar»); quiz (chip del área, «Bloque X de Y», «Atrás/Continuar/Ver resultados», «Texto»/«Ocultar texto»/«Mostrar texto», «Tienes {X} preguntas sin responder», «RM: a · RV: b», «Volver a revisar»/«Ver resultados igualmente»); resultados («Resultados», «¡Buen trabajo, {nombre}!», «Puntaje total», «Escala: +5 · 0 · −2», «Tiempo 0:02», «Puntaje del área», «Correctas/Incorrectas/No respondidas», «{c} de {T}», «{p} %», recordatorio, «Home»). Menos tipográfico `−` (U+2212) y `aria-label` completos (radios de modo, campos y botones ±) confirmados; 18 nodos con `tabular-nums`.
  - *Superficies del navegador:* `touch-action: manipulation`, `-webkit-tap-highlight-color: transparent`, `caret` tinta, `::selection` de la paleta, autofill neutralizado, `overscroll-behavior: contain` en hojas, `color-scheme: light` (scrollbar en claro); la prueba en móvil real queda como pendiente humano.
- **Auditoría `web-design-guidelines`** (reglas actuales del repo `vercel-labs/web-interface-guidelines`, aplicadas archivo por archivo sobre `src/**/*.svelte` + `src/app.css` + `index.html`): sin hallazgos en accesibilidad (iconos `aria-hidden`, botones de icono con `aria-label`, controles con label, `<button>` real, semántica antes que ARIA, jerarquía de encabezados), foco (`:focus-visible` global con reemplazo explícito en los dos `outline: none` documentados: título de pantalla y radio oculto de la alternativa), formularios (`autocomplete`, `inputmode`, sin bloqueo de pegado, etiquetas clicables), animación (`prefers-reduced-motion` en todas, solo `transform`/`opacity`, sin `transition: all`), tipografía (sin «...», `tabular-nums`, `text-wrap: balance/pretty`), contenido (contenedores con `overflow-wrap`/`min-width: 0`), rendimiento (sin lecturas de layout en render — solo en handlers de puntero del slider; sin listas grandes), navegación (sin router por diseño de `06 §6.1`), táctil (`touch-action`, tap-highlight, `overscroll-behavior`, drag con alternativa de tap/teclado), safe areas (`env(safe-area-inset-*)` en las cuatro superficies), theming (`theme-color` = fondo, `color-scheme: light`), locale (`Intl.NumberFormat('es-PE')` en `format.ts`) y anti-patrones (0 coincidencias).
- **Hallazgo (corregido, solo desarrollo): `src/components/dev/Gallery.svelte:434`** — el único `:hover` del proyecto fuera de `@media (hover: hover) and (pointer: fine)`: el enlace de navegación de la galería quedaba subrayado tras el toque en táctil. Se envuelve en la media query de `07 §7.5.4` (archivo de desarrollo, excluido del bundle; sin efecto en la app). Sin más hallazgos abiertos.
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.12 KB gzip, JS 50.76 KB gzip; `npm run test` → 113 pruebas en verde; `svelte-autofixer` sobre `Gallery.svelte`: sin hallazgos.

### T-8.3 — Pulido final con impeccable

- **Método:** `impeccable context` (PRODUCT.md cargado; modo **Operate**; `DESIGN.md` pendiente al inicio de la pasada) y detector mecánico `impeccable detect --json src/App.svelte src/components src/app.css` → **`[]`, sin hallazgos**. Pasada de `polish`/`critique` recorriendo el camino completo (Home → hoja → config → quiz → confirmación → resultados → Home) a 360/430/768 px con ratón, teclado y emulación táctil, contra el *craft floor* (contraste, una sola elevación, sin kickers/gradientes/`border-left` de color, radios 12–16, estados completos, superficies del navegador) y contra el sistema ya fijado por `07`.
- **Hallazgo 1 (corregido): nombre largo sin espacios desbordaba Home.** Con un nombre de 29 caracteres (tope 30, RF-01) el botón del saludo medía 385 px y el documento 393 px (> 360): scroll horizontal. El `<span>` del texto tenía `min-width: 0` pero el `overflow-wrap` faltante no reducía el min-content del flex ítem. Se añade `max-width: 100%` al botón y `overflow-wrap: anywhere` al texto (misma convención que el chip del quiz). Medido: botón 320 px, sin scroll horizontal, también con la raíz al 200 %.
- **Hallazgo 2 (corregido): el saludo de resultados desbordaba con el mismo nombre al 200 %.** `.res__saludo` (16 px → 32 px) no partía la palabra: `scrollWidth` 486 > 360. Se añade `overflow-wrap: break-word` (bloque de ancho fijo: basta con partir la palabra). Medido: 360 = 360 a tamaño normal y al 200 %.
- **Hallazgo 3 (corregido): el campo del stepper recortaba «−999» con el texto del sistema al 200 %.** El ancho fijo de 64 px (`07 §7.9.3`) no admitía 4 glifos a 32 px (`scrollWidth` 84 > `clientWidth` 62). Se cambia a `width: max(64px, 5ch)`: a tamaño normal sigue midiendo exactamente 64 px (el grupo conserva sus 168 px) y al 200 % crece lo justo (89 px) para mostrar el valor extremo (E-09). `07 §7.12` (10) pide contenedores que toleren el crecimiento del texto; el valor por defecto de la spec se conserva.
- **`DESIGN.md` + `.impeccable/design.json` (cierre del ciclo de `07 §7.15`).** Los Planes 04–07 difirieron a este plan «el `impeccable` de cierre y el `DESIGN.md` de la raíz»; `07 §7.15` pide generarlo **desde el build real** al terminar la implementación. Se ejecuta el flujo `document` en modo scan: tokens reales de `app.css`, componentes reales del catálogo y la doctrina ya congelada de `07` (concepto «instrumento de medición», paleta, escala, reglas con nombre). El frontmatter YAML lleva los tokens normativos (27 colores con slug descriptivo, 9 roles tipográficos, 5 radios, 11 pasos de espacio y 10 componentes) y el cuerpo las ocho secciones canónicas del formato. El sidecar lleva lo que el esquema no admite (rampas tonales, sombras, movimiento, breakpoints, HTML/CSS de 10 componentes). **Decisión de idioma:** se conservan los encabezados canónicos en inglés que exige el formato DESIGN.md (el parseo de herramientas depende de ellos) y el contenido va en español, como el resto de la documentación (`00-contrato §10`). No se añaden requisitos: el documento describe lo construido.
- **Sin cambios descartados:** el resto de la pasada no encontró defectos (jerarquía, ritmo 4 px, radios, sombras, iconos, estados, copy y movimiento ya conformes a `07`); no se añadió ni una animación nueva (regla del propio `polish`: no animar para que el pulido se note).
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.16 KB gzip, JS 50.76 KB gzip; `npm run test` → 113 pruebas en verde; `svelte-autofixer` sobre `GreetingHeader.svelte`, `ResultsScreen.svelte` y `Stepper.svelte`: sin hallazgos; `.impeccable/design.json` parsea (10 componentes).

### T-8.4 — Presupuesto de rendimiento

- **Método (restricción de entorno):** medición sobre el build de producción servido por `npm run preview` (puerto 4175) con `chrome-devtools` por salidas de texto — tamaños reales del `dist/` (Vite + gzip byte a byte con `zlib`), inventario de archivos, peticiones y pesos de transferencia reales (`performance.getEntriesByType('resource')`), y métricas de carga con `PerformanceObserver` (`FCP`, `LCP`, `CLS`) bajo throttling de red y CPU. Lighthouse móvil se ejecutó con `lighthouse_audit` (device mobile: 1.6 Mbps, 150 ms RTT, CPU 4×) sobre `preview`; el informe no incluye la categoría de rendimiento, así que los números de carga son los medidos con el protocolo.
- **Números finales (build `index-DVl5tlzU.js` + `index-CWpQx4L.css`):**
  - **JS inicial:** 164 515 B → **50.76 KB gzip** (Vite; 49.20 KB medido byte a byte; **44.85 KB Brotli**) ≤ ~80 KB ✔. Desglose del bundle: **datos (`questions.json` inline) 19.70 KB gzip** · **Svelte 5 + app 29.17 KB gzip** (medido extrayendo el literal del array del bundle y comprimiendo el resto).
  - **CSS:** 40 203 B → **8.16 KB gzip** (8.14 medido; 7.08 Brotli) ≤ ~15 KB ✔ (la estimación de `07 §7.13` era 9–12 KB).
  - **HTML:** 545 B → 0.34 KB gzip.
  - **Fuentes web: 0** — 0 `@font-face` en el CSS y 0 archivos de fuente en `dist/` ✔.
  - **Imágenes raster: 0** — el único gráfico es `favicon.svg` (253 B) ✔.
  - **Peticiones en el primer render: 3** — documento + `index-*.js` (50 682 B de transferencia gzip) + `index-*.css` (8 439 B) ✔ (el `favicon.svg` lo pide el navegador por su cuenta, fuera del camino crítico).
  - **CLS: 0** en la corrida de Lighthouse móvil y en el observador (`layout-shift` sin entradas) ✔.
  - **Carga < 1 s en 4G:** con **Fast 4G + CPU 4×** (4 Mbps, 20 ms RTT): **FCP = LCP = 464 ms** ✔; con el perfil móvil de Lighthouse (1.6 Mbps, 150 ms RTT, CPU 4×): FCP = LCP = 1552 ms — la red más lenta que el «4G desde Lima» del presupuesto, registrada como cota inferior conservadora. Transferencia crítica total ≈ 59.7 KB gzip (44.8 KB si Cloudflare sirve Brotli), así que en 4G real la descarga ronda los 120 ms.
  - **RNF-05 (navegación sin esperas):** «Iniciar quiz» monta el primer bloque en 35 ms y «Continuar» cambia de bloque en 24 ms (2 frames, CPU 4×); durante el ciclo completo no se hace **ninguna** petición nueva (el banco se carga una sola vez).
- **Sin optimizaciones necesarias:** ninguna métrica excede el presupuesto, así que no se tocó código en esta tarea (el desglose Svelte+app ≈ 29 KB gzip confirma que el margen restante es amplio).
- **Hallazgo de Lighthouse móvil (no aplicable / registrado):** `label-content-name-mismatch` (WCAG 2.5.3, *peso 0* en la categoría de accesibilidad, que puntúa **100**) en el botón del saludo: su texto visible «Hola» no está contenido en el `aria-label` «Pon aquí tu nombre». El `aria-label` es **microcopy congelado** de `07 §7.9.1`/`§7.11`; cambiarlo exige revisar la especificación (contrato §9), así que se mantiene y queda documentado como excepción deliberada con recomendación para una revisión futura de `07` (p. ej. nombre accesible «Hola, {nombre}. Pon aquí tu nombre»). Los otros fallos del informe son de SEO (`meta-description`, `robots.txt`) y de agentes (`llms.txt`): fuera de alcance por diseño — `06 §6.1`/`01 §1.5` declaran que la app no tiene URLs que compartir ni SEO que cuidar. Accesibilidad y buenas prácticas: **100/100**.
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.16 KB gzip, JS 50.76 KB gzip; `npm run test` → 113 pruebas en verde; `npm run preview` sirviendo `dist/` con las tres pantallas.

### T-8.5 — Prueba E-01…E-10 de punta a punta (emulación móvil + pase manual documentado)

- **Método:** cada caso se ejecutó **completo** (configurar → resolver → resultados) sobre el build de producción (`npm run preview`, puerto 4175) con viewport móvil emulado 360×800 dpr 3 táctil, por DOM (`chrome-devtools` sin capturas), con las claves reales del banco leídas de `questions.json` para dirigir las respuestas. El banco se cargó desde el servidor de desarrollo solo como fuente de claves/verificación (no participa en la app servida).
- **Matriz E-01…E-10 (emulación móvil):**
  | Caso | Evidencia medida |
  |---|---|
  | **E-01** RM con k = 17 | Modo Matemático · 17 temas · 85 preguntas → **17 bloques**, los **17 temas distintos** en orden aleatorio y **85 preguntas distintas** (todo el banco de RM), 5 por bloque; todas correctas → «85 de 85 · 100 %», puntaje **425** = 85 × 5, «Escala: +5 · 0 · −2»; solo tarjeta de RM (RN-11). |
  | **E-02** q = 5 | RM=1 + RV=1, q=5 → cada bloque monta **las 5 preguntas completas de su tema** (ids distintos y del mismo tema); 5 de 5 en ambas áreas; total 50 = 10 × 5. |
  | **E-03** mínimo (k = 1, q = 1) | Completo · 2 temas · 2 preguntas → 2 bloques de 1 pregunta; RM correcta (100/0/0 → +5) y RV incorrecta (0/100/0 → **−2**); total **3**; porcentajes suman 100 % por área. |
  | **E-04** quiz en blanco | «Ver resultados» abre la hoja «Tienes 2 preguntas sin responder» con detalle «RM: 1 · RV: 1» y las dos acciones; al confirmar: puntaje = T × pnr = **0**, «No respondidas 1 de 1 · 100 %», aciertos y erróneas 0 %. |
  | **E-05** escala 0/0/0 | Puntos 0/0/0 aceptados (CTA habilitado); corrida 1 correcta + 1 incorrecta + 1 en blanco → total **0** y por área **0**, «Escala: 0 · 0 · 0», porcentajes calculados igual (50/50/0 y 0/0/100). |
  | **E-06** comprensión de lectura con q < 5 | Verbal · 11 temas · q=1: el bloque «Comprensión de lectura» muestra el panel `<details>` abierto con el toggle «Ocultar texto» (`aria-expanded="true"`) y **solo 1 pregunta**; el texto renderizado coincide **carácter a carácter** con `textoComun` del banco (941 caracteres). |
  | **E-07** atrás + editar | 3 bloques: bloque 1 respondido **incorrectamente** (A, clave C) → avanzar → «Atrás» ×2: el bloque 1 **conserva** la selección previa (A) → se corrige a C → resultados: **2 de 3 correctas** (la respuesta editada es la que cuenta), 1 no respondida, puntaje 10 = 2 × 5. |
  | **E-08** nombre vacío/espacios | Guardar «   » → saludo «Hola», **clave eliminada** de `localStorage` (`null`), sin errores; guardar «Ana» → «Hola, Ana» y `localStorage` «Ana»; tras **recargar**, el saludo y el almacén se conservan (RNF-04). |
  | **E-09** puntajes negativos | Escala +5 · **+1** · **−3**: un bloque en blanco (+1) y uno incorrecto (−3) → total **−2** (menos tipográfico U+2212) y puntaje del área −2; la escala muestra signos explícitos. |
  | **E-10** símbolos (π, ≈, ×, ², S/) | Corrida E-01 con **las 85 preguntas de RM**: **665 textos** (enunciados + opciones, con las repeticiones de los rebloques) comparados contra el banco → **0 diferencias**; 31 bloques contenían símbolos matemáticos (`S/`, `²`, `³`, `π`, `≈`, `≤`, `≥`, `°`). |
- **Transversales automatizables (verificados):** `scrollWidth` = `clientWidth` = 360 en **todos** los pasos de todos los casos (sin scroll horizontal); **exactamente 3 peticiones** al cargar (documento + JS + CSS) y **0** de fuentes o imágenes; nombre persistente tras recarga; **consola sin ningún mensaje** en toda la sesión; RNF-09 confirmado: a mitad del intento el evento `beforeunload` se cancela (el navegador pide confirmación — se observaron los avisos reales al navegar con el intento en curso) y fuera del intento no.
- **Pase manual en dispositivos reales (pendiente del usuario, no ejecutado aquí):** pasos exactos para el informe de cierre.
  1. **iOS Safari (iPhone con notch) y Android Chrome**, sobre la URL publicada `*.pages.dev`, en vertical: comprobar que el saludo «Hola» no queda bajo la barra de estado/notch (`env(safe-area-inset-top)`) y que la barra fija inferior deja aire sobre el gesto inferior (`env(safe-area-inset-bottom)`).
  2. **Rotación:** girar a horizontal en Home (CTA «Iniciar quiz» accesible y con aire), en el quiz (cabecera sticky + botonera visibles, sin scroll horizontal) y en resultados (botón «Home»).
  3. **Gesto:** en la hoja de nombre, arrastrar el asa hacia abajo (debe cerrarse con la animación) y tocar el velo (debe cerrar); en el slider, arrastrar con el dedo (la burbuja sigue 1:1 y el valor hace snap) y tocar una posición (tap-to-jump); comprobar que el doble toque **no** hace zoom.
  4. **Aviso de salida (RNF-09):** a mitad del quiz, recargar la página y cerrar la pestaña → el navegador debe pedir confirmación (iOS Safari puede no mostrarlo en algunos casos: es el comportamiento «si el navegador lo permite» de `01 §RNF-09`).
  5. **Texto del sistema grande:** Ajustes → Accesibilidad → tamaño de texto al máximo equivalente al 200 %; recorrer las tres pantallas (el layout debe envolver, sin recortes ni scroll horizontal).
  6. **Movimiento reducido:** Ajustes → Accesibilidad → «Reducir movimiento» y (Android) «Quitar animaciones»; comprobar que la transición de bloque queda en fundido y que las barras de resultados aparecen en su valor final.
  7. **Contraste y tacto reales:** recorrer con el dedo el panel, el quiz y los resultados comprobando legibilidad a pleno sol y que los objetivos de 44 px se sienten cómodos (juicio humano que no se puede automatizar).
- **V0:** `npm run check` → 0 errores/0 avisos; `npm run build` → CSS 8.16 KB gzip, JS 50.76 KB gzip; `npm run test` → 113 pruebas en verde.

### T-8.6 — Repositorio en GitHub

- **Ajuste de vigencia (registrado en la revisión previa):** el repositorio **ya existe** y `origin` está configurado; los push los gestiona el orquestador, así que esta tarea se limita a verificar el remoto y completar el README raíz (no se ejecutó ningún push).
- **Remoto verificado:** `git remote -v` → `origin https://github.com/DevJuanP/BecaEsan.git` (fetch y push) y `git ls-remote --heads origin` (consulta de solo lectura) responde con `refs/heads/main` → repositorio accesible ✔. El `main` remoto apunta al cierre del Plan 07 (`383b19f`); los commits del Plan 08 quedan locales a la espera del push del orquestador.
- **Historial:** 81 commits en `main`, uno por tarea con Conventional Commits en español (la verificación «historial por tarea» se cumple a nivel de repositorio local y del remoto ya publicado).
- **README raíz completado** (`README.md`): qué es (con el resumen de las tres pantallas y el alcance v1), requisitos (Node LTS ≥ 22), los seis comandos con notas (generación validada del banco, galería `#dev` solo en desarrollo), estructura del proyecto, sección **Deploy** con el runbook de `06 §6.6` para Cloudflare Pages (a verificar y cerrar en T-8.7) y enlaces a `docs/especificaciones/`, `docs/plans/`, `docs/preguntas/` y `DESIGN.md`.
- **V0:** sin cambios de código; `npm run check`/`build`/`test` siguen en verde.
