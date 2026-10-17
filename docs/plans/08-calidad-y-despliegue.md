# Plan 08 — Calidad y despliegue

> Estado: ⬜ Pendiente · Depende de: Planes 01–07 · Cubre: `01 §1.7` (criterios de éxito), RNF-01…RNF-09 (verificación final), E-01…E-10 (punta a punta), `06 §6.2` (presupuesto), `§6.6` (runbook de deploy), `07 §7.12`, `§7.13`, `§7.14`, `§7.15` · Estimación: M

## 1. Objetivo

Cerrar la v1: auditar accesibilidad y calidad visual contra las especificaciones, verificar el presupuesto de rendimiento, probar los casos borde de punta a punta en dispositivos reales, publicar el repositorio en GitHub y desplegar en Cloudflare Pages. Al terminar, el simulador está **en producción** y el DoD del proyecto (`00-contrato §6`) se cumple.

## 2. Alcance

- **Incluye:** auditorías finales (a11y, calidad, skills), presupuesto de rendimiento, prueba E-01…E-10 e2e, GitHub, Cloudflare Pages y cierre documental.
- **No incluye:** funcionalidad nueva; cualquier hallazgo **funcional** se maneja por control de cambios (`00-contrato §9`).

## 3. Referencias

- Specs: `01 §1.7` (criterios de éxito), `§1.8` (riesgos); `06 §6.2` (presupuesto), `§6.6` (runbook), `§6.7` (fase 2); `07 §7.12` (a11y), `§7.13` (rendimiento visual), `§7.14` (checklist), `§7.15` (skills), `§7.16` (pendientes); `02 §M6` (E-01…E-10); `03 §3.6`.
- Skills: `web-design-guidelines` (auditoría final por archivo); `impeccable` (polish de cierre); `svelte-code-writer`/`svelte-core-bestpractices` (correcciones); `ui-ux-pro-max` (si surge una duda puntual de patrón); `apple-design` (revisión de movimiento); `frontend-design` (autocrítica final).

## 4. Precondiciones

- Planes 01–07 ✅ y sus verificaciones finales en verde.
- Cuenta de GitHub del usuario disponible (para T-8.6) y cuenta de Cloudflare (para T-8.7).
- Decisiones de `07 §7.16 (#1)–(#3)` resueltas o explícitamente pospuestas (anotar en el registro).

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

### T-8.5 — Prueba E-01…E-10 de punta a punta en dispositivos reales

- **Objetivo:** verificar el producto completo con los casos borde, en iOS Safari y Android Chrome (360–430 px).
- **Archivos:** — (correcciones donde correspondan).
- **Pasos:** ejecutar cada caso **completo** (configurar → resolver → resultados):
  - **E-01** RM 17/17; **E-02** q = 5; **E-03** mínimo (k = 1, q = 1); **E-04** quiz en blanco; **E-05** escala 0/0/0; **E-06** comprensión de lectura con q < 5; **E-07** atrás + editar; **E-08** nombre vacío/espacios; **E-09** puntajes negativos; **E-10** símbolos (π, ≈, ×, ², S/) intactos.
  - Transversales: safe areas (notch y gesto inferior), rotación, sin scroll horizontal, `beforeunload` (donde el navegador lo permita), persistencia del nombre tras recarga, 3 requests, 0 fuentes web.
- **Criterios:** `02 §M6` (E-01…E-10); `01 §1.7` (1, 3, 4); RNF-01, RNF-04, RNF-08, RNF-09.
- **Verificación:** matriz E-01…E-10 marcada en ambos navegadores; hallazgos corregidos.
- **Estado:** [ ]

### T-8.6 — Repositorio en GitHub

- **Objetivo:** código publicado y respaldado en GitHub.
- **Archivos:** `README.md` raíz (completar deploy), `.gitignore` (revisión final).
- **Pasos:**
  1. Crear el repositorio (cuenta del usuario; asistir con `gh` si está disponible o por la interfaz web).
  2. Añadir `origin`, push de `main`.
  3. Completar en el README raíz: qué es, comandos, cómo se despliega (`06 §6.6`) y enlace a `docs/`.
- **Criterios:** `06 §6.6` (paso 1).
- **Verificación:** `git remote -v` + repositorio accesible con el historial por tarea.
- **Estado:** [ ]

### T-8.7 — Deploy en Cloudflare Pages

- **Objetivo:** la app publicada, rápida y con deploys automáticos.
- **Archivos:** — (configuración de plataforma).
- **Pasos (runbook de `06 §6.6`):**
  1. Workers & Pages → Create → Pages → Connect to Git → seleccionar el repositorio.
  2. Build command `npm run build`; output directory `dist`; Node LTS (≥ 22).
  3. Primer deploy; smoke test en la URL `*.pages.dev`: HTTPS, carga < 1 s, assets con hash, sin fuentes web, las tres pantallas funcionando.
  4. Verificar el deploy automático con un push de prueba.
- **Criterios:** `06 §6.6`; RNF-03.
- **Verificación:** URL funcionando en móvil real desde Lima; push → build automático verde.
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
| `06 §6.2` (presupuesto), `§6.6` (deploy) | T-8.4, T-8.6, T-8.7 |
| `07 §7.12`, `§7.13`, `§7.14`, `§7.15` | T-8.1, T-8.2, T-8.3 |
| `00-contrato §6` (DoD del proyecto) | T-8.8 |

## 7. Verificación final del plan

- [ ] Auditoría a11y y checklist `07 §7.14` sin hallazgos críticos abiertos.
- [ ] Presupuesto de `06 §6.2` cumplido, con los números finales registrados.
- [ ] E-01…E-10 verificados de punta a punta en iOS Safari y Android Chrome.
- [ ] Repositorio en GitHub con el historial completo y README raíz terminado.
- [ ] App desplegada en Cloudflare Pages con deploys automáticos y smoke test pasado.
- [ ] `docs/plans/README.md` y el README de especificaciones reflejan el cierre.

## 8. Registro de desvíos y decisiones

_(vacío — se completa durante la ejecución)_
