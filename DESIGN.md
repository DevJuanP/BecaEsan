---
name: Simulador Beca BCP / ESAN
description: Instrumento de medición móvil para ensayos de opción múltiple, en tema claro y tipografía del sistema.
colors:
  institutional-blue: "#0063BD"
  institutional-blue-deep: "#004E96"
  institutional-blue-ink: "#063E77"
  blue-tint: "#EAF3FB"
  blue-tint-line: "#D3E5F7"
  verbal-orange: "#EA580C"
  verbal-orange-ink: "#C2410C"
  verbal-orange-deep: "#9A3412"
  orange-tint: "#FFF3EA"
  orange-tint-line: "#FBDCC4"
  ink: "#0F172A"
  ink-secondary: "#475569"
  ink-tertiary: "#64748B"
  ink-disabled: "#94A3B8"
  canvas: "#F8FAFC"
  surface: "#FFFFFF"
  surface-sunken: "#F1F5F9"
  line: "#E2E8F0"
  line-strong: "#CBD5E1"
  segment-empty: "#8494A9"
  result-ok: "#047857"
  result-ok-fill: "#059669"
  result-bad: "#B91C1C"
  result-bad-fill: "#DC2626"
  result-neutral: "#64748B"
  result-ok-soft: "#ECFDF5"
  result-bad-soft: "#FEF2F2"
  focus: "#0063BD"
  scrim: "rgba(15, 23, 42, 0.48)"
typography:
  display:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif"
    fontSize: "clamp(2.75rem, 13vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title-1:
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title-2:
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title-3:
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  statement:
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.55
  body:
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.01em"
rounded:
  segment: "7px"
  control: "12px"
  card: "16px"
  sheet-top: "20px"
  pill: "999px"
spacing:
  hairline: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  screen: "20px"
  screen-comfortable: "24px"
  section: "32px"
  hero-gap: "40px"
  bar: "48px"
  scroll-reserve: "64px"
components:
  button-primary:
    backgroundColor: "{colors.institutional-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.institutional-blue-deep}"
  button-primary-active:
    backgroundColor: "{colors.institutional-blue-ink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-ghost:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-icon:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    size: "44px"
  chip-area-matematico:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.institutional-blue-ink}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    height: "28px"
  chip-area-verbal:
    backgroundColor: "{colors.orange-tint}"
    textColor: "{colors.verbal-orange-deep}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    height: "28px"
  chip-time:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    height: "28px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "16px"
  field-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "48px"
  option-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  review-toggle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  review-option-correct:
    backgroundColor: "{colors.result-ok-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  review-option-wrong:
    backgroundColor: "{colors.result-bad-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  slider-segment:
    backgroundColor: "{colors.segment-empty}"
    rounded: "{rounded.segment}"
    height: "22px"
---

# Design System: Simulador Beca BCP / ESAN

## Overview

**Creative North Star: "El instrumento de medición"**

El simulador se dibuja como un instrumento: segmentos que se llenan al cruzar un valor, burbujas A–E que se rellenan al responder, progreso que avanza bloque a bloque y un resultado que se lee como una lectura de escala. La interfaz no decora el ensayo; lo hace medible. Todo lo que no aporta a esa lectura —gradientes, sombras de color, adornos— está fuera.

El sistema es **Operate**: el usuario completa una tarea (configurar, resolver, leer resultados) desde el celular, con una mano y en sesiones de 30–60 minutos. La ambición se muestra como precisión y contención: escaneabilidad, estados completos, ritmo espacial exacto y una paleta restringida con identidad dual —azul institucional para Razonamiento Matemático, naranja para Razonamiento Verbal— sobre neutros fríos.

La personalidad tipográfica vive en la escala, los pesos y los numerales tabulares, no en una cara exótica: se usa el **stack del sistema** (0 KB de fuentes web, cero FOUT, SF Pro en iOS y Roboto en Android ya afinadas para lectura móvil). Tema claro único en v1; los tokens están listos para un tema oscuro de fase 2.

**Key Characteristics:**
- Concepto de instrumento: segmentos, burbujas y escalas como lenguaje de medición.
- Paleta restringida: neutros fríos + un azul primario + un naranja de identidad por área + semánticos solo en resultados.
- Mobile-first real: 360 px como caso base, todo control ≥44×44 y las acciones siempre en la zona del pulgar.
- Una sola forma de elevación por elemento: borde **o** sombra, nunca ambas.
- Sin webfonts, sin imágenes raster, sin librerías de UI: gráficos en CSS y SVG en línea.
- Movimiento solo con `transform`/`opacity`, interrumpible y con variante `reduced-motion`.

## Colors

Paleta restringida con identidad dual: neutros fríos como base, un azul institucional de interacción y un naranja que se activa por contexto (área verbal); los semánticos existen solo en la pantalla de resultados.

### Primary
- **Azul institucional** (#0063BD): acento base de interacción — botones primarios, selección, relleno del slider RM, anillo de foco (`--color-focus` comparte el valor). Contrasta 5.97:1 sobre blanco (AA).
- **Azul institucional profundo** (#004E96): hover del botón primario y burbuja de valor del slider; 8.30:1 con texto blanco (AAA).
- **Azul tinta** (#063E77): pressed profundo y textos sobre tinte azul (chip de área RM, 7.40:1 sobre `#EAF3FB`).

### Secondary
- **Naranja verbal** (#EA580C): relleno del slider RV y burbujas de selección; 3.56:1 sobre blanco, válido como gráfico (WCAG 1.4.11).
- **Naranja verbal tinta** (#C2410C): acento base del área verbal — botones, texto de chip, burbuja de valor; 5.18:1 sobre blanco (AA).
- **Naranja verbal profundo** (#9A3412): pressed profundo y textos sobre tinte naranja (6.70:1 sobre `#FFF3EA`).

### Neutral
- **Tinta** (#0F172A): texto principal; 17.06:1 sobre el fondo de app y 17.85:1 sobre tarjeta.
- **Tinta secundaria** (#475569): texto secundario y etiquetas; 7.58:1 sobre blanco.
- **Tinta terciaria** (#64748B): ayudas, metadatos, conteos; 4.76:1 sobre blanco.
- **Tinta deshabilitada** (#94A3B8): texto de controles deshabilitados (exenta de AA por WCAG; 2.56:1).
- **Lienzo** (#F8FAFC) y **superficie** (#FFFFFF): fondo de la app y tarjetas, barras fijas y hojas.
- **Superficie hundida** (#F1F5F9): chips, filas presionadas y el panel de texto común.
- **Línea** (#E2E8F0) y **línea fuerte** (#CBD5E1): bordes de 1 px de tarjetas y de controles de entrada.
- **Segmento vacío** (#8494A9): segmento «apagado» de la regla del slider (3.09:1 sobre blanco, gráfico de UI).
- **Semánticos de resultados**: aciertos #047857 (texto, 5.48:1) y #059669 (relleno de barra, 3.77:1); errores #B91C1C (texto, 6.47:1) y #DC2626 (relleno, 4.83:1); no respondidas #64748B (4.76:1). **Tintes de la revisión** (`07 §7.9.16`): aciertos #ECFDF5 y errores #FEF2F2, siempre con texto + icono además del color.
- **Velo** (`rgba(15, 23, 42, 0.48)`): scrim detrás de las hojas modales.

### Named Rules

**The Accent Follows the Block Rule.** Dentro del quiz, el acento de interacción es el del área actual (azul en RM, naranja en RV); fuera del quiz el primario es siempre azul. El cambio de acento ocurre una sola vez por intento y es, en sí mismo, la señal de que cambiaste de área.

**The Color Is Never Alone Rule.** Ningún estado se comunica solo con color: la selección añade forma, relleno y peso; los resultados siempre llevan etiqueta y número junto al punto de color. Azul y naranja son, además, el par más seguro para daltonismo (eje azul–amarillo).

**The Restricted Palette Rule.** Nada fuera de esta lista: sin gradientes decorativos, sin sombras de color, sin halos, sin emojis como iconos, sin texto gris sobre gris.

## Typography

**Display Font:** stack del sistema (`system-ui`, `-apple-system`, `Segoe UI`, Roboto, `Helvetica Neue`, Arial, `Noto Sans`) con respaldo de glifos para símbolos matemáticos.
**Body Font:** el mismo stack — una sola familia para todo.

**Character:** la voz tipográfica se construye con escala, peso y numerales tabulares, no con una cara propia. Es deliberado: 0 KB de fuentes, cero FOUT y la mejor legibilidad móvil posible (SF Pro en iOS, Roboto en Android). Tamaños en `rem`, así que respetan el tamaño de texto del sistema (Dynamic Type).

### Hierarchy
- **Display** (800, `clamp(2.75rem, 13vw, 3.5rem)`, 1.02): el puntaje total del intento, una sola vez por pantalla.
- **Title-1** (700, 1.375rem, 1.25): el saludo «Hola, Juan» y el puntaje del área.
- **Title-2** (700, 1.25rem, 1.3): títulos de pantalla («Resultados») y de hoja modal.
- **Title-3** (600, 1rem, 1.4): encabezados de tarjeta («Configura tu quiz», «Modo del quiz»).
- **Statement** (500, 1.0625rem, 1.55): enunciados de pregunta y texto común; medida ≤75 caracteres.
- **Body** (400, 1rem, 1.5): texto general y alternativas.
- **Label** (500, 0.9375rem, 1.4): etiquetas de control y filas de métrica.
- **Caption** (500, 0.8125rem, 1.4): ayudas, «Máx. 30 caracteres», escala y tiempo.
- **Micro** (500, 0.75rem, 1.35): extremos del slider (1 / 17).

### Named Rules

**The Numbers Are Tabular Rule.** Cronómetro, puntajes, porcentajes, valores de slider y contadores «X de Y» usan `font-variant-numeric: tabular-nums`; los números se formatean con `Intl.NumberFormat('es-PE')` y el signo negativo es el menos tipográfico `−` (U+2212).

**The Sentence Case Rule.** Sentence case siempre; sin minúsculas versalitas ni mini-etiquetas en mayúsculas sobre títulos (veto de craft). Tampoco itálica ni gris claro en textos de lectura.

## Layout

Una sola columna mobile-first con `max-width: 640px` centrado y padding lateral de 20 px (360–429 px) o 24 px (≥430 px); en ≥768 px los resultados pasan a dos columnas (una tarjeta por área, `gap: 20px`) y las hojas modales se convierten en diálogo centrado de 400 px. Ritmo espacial en grilla de 4 px: grupos relacionados ≤8 px, separación entre bloques 16–24 px, secciones ≥32 px, y más aire arriba de un título que debajo.

Las acciones viven siempre en la zona del pulgar: CTA de Home, botonera del quiz y acciones de hojas en barras inferiores fijas, con `env(safe-area-inset-bottom/top)` respetado y una reserva de scroll (alto de barra + 16 px) para que nada quede oculto. Sin scroll horizontal en ningún viewport; el layout tolera el texto del sistema al 200 % (contenedores flexibles, `min-width: 0` y `overflow-wrap` donde el contenido de usuario puede ser largo).

## Elevation & Depth

Sistema **plano con capas flotantes**: las tarjetas y paneles son planos (borde de 1 px `--color-line`, sin sombra) y el sistema es explícito al respecto — nunca borde **y** sombra en el mismo elemento. La profundidad aparece solo donde algo se mueve por debajo o por encima: barras fijas translúcidas con `backdrop-filter: blur(12px)` y fallback sólido, hoja modal con sombra y scrim, y la micro-sombra «pop» del segmento seleccionado del selector de modo.

### Shadow Vocabulary
- **Chrome** (`0 -6px 16px rgba(15, 23, 42, 0.06)`): barra inferior al hacer scroll (espejo hacia abajo para la cabecera sticky del quiz).
- **Sheet** (`0 -16px 48px rgba(15, 23, 42, 0.18)`): hoja modal sobre el scrim.
- **Pop** (`0 1px 2px rgba(15, 23, 42, 0.10)`): única micro-sombra permitida en un control (segmento seleccionado).

### Named Rules

**The One Elevation Rule.** Una sola forma de elevación por elemento: borde **o** sombra. `backdrop-filter` solo en las superficies fijas que tienen contenido desplazándose por debajo (cabecera del quiz, barras inferiores), nunca como decoración.

## Shapes

Lenguaje de forma suave y contenido: radios de 7 px en los segmentos de slider y progreso, 12 px en controles (botones, inputs, filas de opción, steppers), 16 px en tarjetas y paneles, 20 px solo en las esquinas superiores de las hojas modales y píldora completa (999 px) en chips y burbujas. Los bordes son de 1 px y **nunca** cambian de grosor en el estado seleccionado (la selección usa relleno + anillo interior con `box-shadow: inset 0 0 0 1px`, evitando layout shift).

## Components

### Buttons
- **Shape:** radio 12 px (`--radius-control`); alto 48 px en barras inferiores, 44 px en contextos menores.
- **Primary:** fondo del acento (`{colors.institutional-blue}`; azul/naranja del área dentro del quiz), texto blanco 600, padding 0 20 px.
- **Hover / Focus:** hover solo con `(hover: hover) and (pointer: fine)` a `accent-700`; pressed a `accent-800` con `scale(0.97)` en 100 ms; foco con `outline: 2px solid` + `outline-offset: 2px`.
- **Secondary / Ghost / Icon:** secundario con borde `line-strong` y fondo `surface`; fantasma sin fondo (toggles como «Ocultar texto»); icono 44×44 con `aria-label` obligatorio.

### Chips
- **Style:** píldora con punto o icono de 16 px + texto `caption` 600; área RM sobre `blue-tint` con tinta azul, área RV sobre `orange-tint` con tinta naranja, cronómetro sobre `surface-sunken` con ancho estable (`5ch` tabular) para no reflowear.

### Cards / Containers
- **Corner Style:** 16 px.
- **Background:** `surface`; las tarjetas nunca se anidan.
- **Shadow Strategy:** ninguna (ver Elevation & Depth).
- **Border:** 1 px `line`.
- **Internal Padding:** 16 px (≤429 px) / 20 px (≥430 px).

### Inputs / Fields
- **Style:** alto 44–48 px, borde 1 px `line-strong`, radio 12 px, fondo `surface`.
- **Focus:** borde `focus` + anillo global de `:focus-visible` (2 px, offset 2 px).
- **Error / Disabled:** borde `bad` + mensaje inline con `aria-invalid` y `aria-describedby`; el valor del stepper usa `inputmode="numeric"` y numerales tabulares.

### Navigation
- **Style:** el quiz no usa router: su cabecera sticky lleva chip de área, «Bloque X de Y», cronómetro y progreso segmentado; la navegación real vive en la barra inferior fija («Atrás»/«Continuar»/«Ver resultados», primario que crece 2 frente al secundario). Las hojas modales usan `<dialog>` nativo con foco atrapado, `Escape` y retorno del foco al disparador.

### Slider segmentado (componente estrella)
Un track de 44 px de alto con N segmentos (uno por tema o pregunta) que se rellenan al cruzar el valor; la burbuja sigue al dedo 1:1 con `setPointerCapture`, el control real es un `<input type="range">` invisible con `aria-valuetext` en lenguaje humano («8 de 17 temas»), y existe alternativa de un solo toque (tap-to-jump) y de teclado (flechas, `Home`/`End`). El acento del relleno sigue al área (azul RM, naranja RV).

### Opción de respuesta (A–E)
Fila de 56 px con radio 12 px, burbuja circular de 28 px con la letra y el texto de la alternativa; la selección añade borde + relleno tintado + peso 600 (nunca solo color) y la burbuja hace un `scale(0.92→1)` de 120 ms. Radios nativos ocultos dentro de `<fieldset>` con el enunciado en `<legend>`: el teclado y los lectores de pantalla funcionan gratis.

### Revisión de respuestas (resultados, RF-22)
Botón secundario de ancho completo que despliega el bloque «Revisión de respuestas»; cada pregunta es un `<details>` nativo cerrado por defecto con píldora de estado (icono + palabra), enunciado, línea de clave («Correcta: B» / «Tu respuesta: D · Correcta: B») y chevron que rota al abrir. Al desplegarla, las alternativas se leen como filas no interactivas: la clave con borde/fondo `ok` + etiqueta «Correcta»; la elegida errónea con borde/fondo `bad` + «Tu respuesta»; debajo, la explicación en un panel `surface-2`. Ningún estado depende del color: siempre hay texto e icono.

## Do's and Don'ts

### Do:
- **Do** mantener todo control interactivo en ≥44×44 px con ≥8 px de separación (RNF-02; supera el mínimo de WCAG 2.2).
- **Do** usar `:focus-visible` con `outline: 2px solid` + `outline-offset: 2px` en todo control, y devolver el foco al disparador al cerrar una hoja.
- **Do** animar solo `transform` y `opacity`, con `prefers-reduced-motion` y `prefers-reduced-transparency` respetados (la hoja y las barras de resultados aparecen en su valor final).
- **Do** reservar el espacio de las barras fijas (alto + 16 px) y respetar `env(safe-area-inset-*)`.
- **Do** probar con el texto del sistema al 200 % y con nombres de hasta 30 caracteres: el layout envuelve, no desborda.

### Don't:
- **Don't** usar kickers ni mini-etiquetas en mayúsculas sobre títulos, gradientes decorativos, sombras de color o `border-left` de color en tarjetas.
- **Don't** combinar borde y sombra en el mismo elemento, ni anidar tarjetas.
- **Don't** usar `transition: all` ni animar `width`, `height`, `top` o `left`.
- **Don't** depender de `:hover` para nada: en táctil no existe; todo hover tiene su equivalente pressed/focus y vive dentro de `@media (hover: hover) and (pointer: fine)`.
- **Don't** introducir webfonts, imágenes raster, librerías de iconos o de UI: los gráficos son CSS y SVG en línea.
- **Don't** cambiar el grosor del borde en estados seleccionados (relleno + anillo interior en su lugar).
