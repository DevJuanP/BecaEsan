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
- **Estado:** [ ]

### T-8.2 — Checklist de calidad visual + auditoría web-design-guidelines

- **Objetivo:** pasar la checklist de `07 §7.14` en las tres pantallas y hojas, y auditar todo el código UI.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:**
  1. Aplicar `07 §7.14` bloque por bloque (composición, interacción y estados, accesibilidad, movimiento, contenido y copy, superficies del navegador) en Home, Quiz, Resultados y hojas.
  2. Contrastar el copy visible contra el deck de `07 §7.11` (cadenas exactas, «…», «−», tabulares).
  3. Auditoría `web-design-guidelines` sobre todos los archivos UI (`src/**/*.svelte`, `src/app.css`), con hallazgos en formato `archivo:línea`; corregir.
- **Criterios:** `07 §7.14`, `§7.11`; RNF-07.
- **Verificación:** checklist marcada; auditoría sin hallazgos críticos abiertos.
- **Estado:** [ ]

### T-8.3 — Pulido final con impeccable

- **Objetivo:** pasada de cierre sobre las pantallas sin re-decidir el sistema.
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:** ejecutar `polish`/`critique` de la skill sobre Home, Quiz y Resultados; aplicar solo cambios compatibles con `07`; re-verificar V0/V2 donde se toque.
- **Criterios:** `07 §7.15` (uso de skills al cierre).
- **Verificación:** hallazgos aplicados o descartados con razón registrada.
- **Estado:** [ ]

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
