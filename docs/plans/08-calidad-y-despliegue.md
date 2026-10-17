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
- **Estado:** [ ]

### T-8.5 — Prueba E-01…E-10 de punta a punta (emulación móvil + pase manual documentado)

- **Objetivo:** verificar el producto completo con los casos borde mediante emulación móvil (360–430 px, chrome-devtools) y dejar preparado, con pasos exactos, el pase manual en dispositivos reales (iOS Safari / Android Chrome) como pendiente del usuario.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:**
  1. Ejecutar cada caso **completo** (configurar → resolver → resultados) en viewport móvil emulado: **E-01** RM 17/17; **E-02** q = 5; **E-03** mínimo (k = 1, q = 1); **E-04** quiz en blanco; **E-05** escala 0/0/0; **E-06** comprensión de lectura con q < 5; **E-07** atrás + editar; **E-08** nombre vacío/espacios; **E-09** puntajes negativos; **E-10** símbolos (π, ≈, ×, ², S/) intactos.
  2. Transversales automatizables: sin scroll horizontal, persistencia del nombre tras recarga, 3 requests, 0 fuentes web, consola sin errores.
  3. Documentar el **pase manual en dispositivos reales** (safe areas/notch, rotación, gesto, `beforeunload`) con pasos exactos, para el informe de cierre.
- **Criterios:** `02 §M6` (E-01…E-10); `01 §1.7` (1, 3, 4); RNF-01, RNF-04, RNF-08, RNF-09.
- **Verificación:** matriz E-01…E-10 marcada en emulación móvil; hallazgos corregidos; guía del pase manual documentada.
- **Estado:** [ ]

### T-8.6 — Repositorio en GitHub

- **Objetivo:** código publicado y respaldado en GitHub.
- **Archivos:** `README.md` raíz (completar deploy), `.gitignore` (revisión final).
- **Pasos:**
  1. Crear el repositorio (cuenta del usuario; asistir con `gh` si está disponible o por la interfaz web).
  2. Añadir `origin`, push de `main`.
  3. Completar en el README raíz: qué es, comandos, cómo se despliega manualmente (`06 §6.6`; se termina en T-8.7) y enlace a `docs/`.
- **Criterios:** `06 §6.6` (paso 1).
- **Verificación:** `git remote -v` + repositorio accesible con el historial por tarea.
- **Estado:** [ ]

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
