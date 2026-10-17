# 07 — Diseño (sistema visual)

Sistema visual completo de la app descrita en `01`–`06`: paleta, tipografía, forma, componentes, movimiento, microcopy y criterios de calidad. `05-pantallas-y-ui.md` define la **estructura** y el comportamiento funcional; este documento define la **piel y el detalle visual** sobre esa estructura (cubre íntegramente la lista de pendientes de `05`, §5.8).

La referencia de estilo del slider ([CodePen zYqRKBN](https://codepen.io/akex-jester/pen/zYqRKBN), «Custom range input with snapping values made with GSAP Draggable») se implementa en §7.8 reproduciendo su comportamiento —arrastre con *snapping* a valores enteros— con Pointer Events nativos y sin dependencias.

> **Modo de producto** (marco *impeccable*): **Operate** — el usuario completa una tarea (configurar → responder → medir). Mandan la escaneabilidad, la consistencia y las expectativas móviles; la expresión vive en detalles precisos, no en decoración.

---

## 7.0 Resumen ejecutivo

1. **Concepto rector:** *instrumento de medición*. Un vocabulario visual de **segmentos** (la marca de la regla) recorre sliders, progreso y resultados; las alternativas usan **burbujas de hoja de respuestas** (A–E).
2. **Estilo:** minimalismo suizo cálido — mucho aire, jerarquía por tamaño/peso/espacio, geometría limpia (base sugerida por `ui-ux-pro-max`: *Minimalism & Swiss Style*).
3. **Color:** neutros fríos + **azul institucional** (primario, RM) + **naranja profundo** (identidad, RV), con semánticos (verde/rojo/gris) solo en resultados. Ambos acentos son los colores del mundo del usuario: la identidad del BCP, la institución de la beca.
4. **Tipografía:** stack del sistema (SF Pro / Roboto / Segoe UI), numerales tabulares, escala estricta. Cero webfonts (presupuesto de `06`).
5. **Slider propio:** barra segmentada con *snapping*, burbuja de valor, tap-para-saltar, teclado y momentum opcional (§7.8). Es la firma del producto.
6. **Movimiento sobrio:** respuesta al instante (pointer-down), arrastre 1:1, un solo momento coreografiado (cambio de bloque direccional + aparición de resultados). `prefers-reduced-motion` respetado.
7. **Mobile-first real:** objetivos táctiles ≥44 px, acciones en la zona del pulgar (barras inferiores fijas), *safe areas*, sin scroll horizontal a 360 px.
8. **Accesibilidad AA verificada:** todos los pares de texto ≥4.5:1 (tabla con valores calculados en §7.3.5), foco visible, semántica nativa (radios reales, `range` real), color nunca como único portador.

---

## 7.1 Principios de diseño

1. **La tarea primero.** Cada pantalla responde *¿dónde estoy? ¿qué sigue? ¿cómo salgo?* (RF-12, RF-15, RF-21). Nada compite con la pregunta o con el botón de avanzar.
2. **Instrumento, no juguete.** Este simulador mide en serio (RN-07–RN-09). Cero gamificación decorativa, cero emojis, cero confeti: la motivación viene de la precisión y del progreso visible.
3. **Densidad en calma.** Suizo: mucho aire, agrupación por proximidad, jerarquía por tamaño/peso/espacio. El color solo comunica estado o identidad de área.
4. **El pulgar manda.** Acciones principales al alcance del pulgar (barras inferiores fijas), objetivos ≥44×44 px, separación ≥8 px, respuesta visual en `pointerdown` (nunca solo al soltar).
5. **Un solo momento memorable.** El cambio de bloque (deslizamiento direccional + acento de área) y la aparición de resultados (barras que crecen). Todo lo demás es silencioso y breve.
6. **La accesibilidad es parte del estilo.** Contraste AA, foco visible, `reduced-motion`, tipografía escalable (rem) y objetivos táctiles no son parches: son decisiones de diseño verificables (§7.12, §7.14).

---

## 7.2 Concepto rector: «instrumento de medición»

El simulador es el **entrenamiento serio** de un postulante: lo que se siente al usarlo debe ser el de un instrumento preciso — una regla, un cronómetro, una hoja de respuestas.

| Gesto visual | De dónde viene | Dónde vive |
|---|---|---|
| **Segmento** (barra de la regla) | El mundo de la medición; las marcas de una regla graduada | Sliders (§7.8), progreso de bloques (§7.9.9), barras de resultados (§7.9.13) |
| **Burbuja de respuesta** (círculo con letra A–E) | La hoja de respuestas de un examen de admisión | Alternativas del quiz (§7.9.7) |
| **Numerales tabulares** | Cronómetro de examen | Puntajes, porcentajes, tiempo, valores de sliders |
| **Acento de área** (azul RM / naranja RV) | Los dos colores de la identidad institucional (BCP) | Chip de área, acento de interacción dentro del quiz, tarjetas de resultados |

**La firma del producto es la barra segmentada:** un único elemento gráfico que aparece en tres sitios distintos cumpliendo siempre una función ligada a la medición (elegir cuántos temas, mostrar el avance, describir una composición de resultados). Es lo que hace reconocible la app sin logos ni decoración.

### 7.2.1 Direcciones consideradas y descartadas

| Dirección | Por qué se descartó |
|---|---|
| **Academia clásica** (fondo crema, serif de alto contraste, acento terracota) | Es el aspecto por defecto de lo generado por IA en 2026; además, un serif de display no aporta nada a una superficie *Operate* móvil donde el texto se lee a 16–17 px. |
| **Gamificado** (claymorphism, stickers, colores vivos — lo que la base de datos sugiere para «apps de estudio» infantiles) | El objetivo declarado es **simular una prueba real**; el tono lúdico contradice el principio «instrumento, no juguete» y el usuario ya rechazó el enfoque infantil al descartar ese material tipográfico. |
| **Tech oscuro** (fondo casi negro, acento neón) | Las sesiones de práctica son diurnas, en interiores y en móvil; el tema claro favorece lectura larga y batería en pantallas LCD. Tema oscuro queda como fase 2 (§7.3.6). |
| **Editorial suizo frío extremo** (retícula visible, cero radio, hairlines) | Hostil en touch; la app necesita áreas táctiles generosas y esquinas amables. Se conserva del suizo lo útil: grilla, aire, jerarquía, cero adornos. |

---

## 7.3 Color

### 7.3.1 Estrategia

**Restringida con identidad dual** (per the guiding skill): neutros fríos como base (slate), **un** color primario de interacción (**azul institucional**) y **un** color de identidad que se activa por contexto (**naranja**, área verbal). Los colores semánticos (éxito/error/neutro) **solo** existen en resultados. Nada más. Sin gradientes decorativos, sin sombras de color, sin halos.

La escena de uso fija el tema: estudiante practicando de día, interior o transporte, en celular → **tema claro** con superficies casi blancas y tinta azul-negra.

### 7.3.2 Paleta completa

**Base (neutros)**

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#F8FAFC` | Fondo de la app |
| `--color-surface` | `#FFFFFF` | Tarjetas, barras fijas, hojas |
| `--color-surface-2` | `#F1F5F9` | Chips, filas presionadas, paneles secundarios (texto común) |
| `--color-line` | `#E2E8F0` | Bordes de 1 px, divisores |
| `--color-line-strong` | `#CBD5E1` | Bordes de controles de entrada (inputs, botones secundarios) |
| `--color-ink` | `#0F172A` | Texto principal (tinta) |
| `--color-ink-2` | `#475569` | Texto secundario |
| `--color-ink-3` | `#64748B` | Texto de ayuda, metadatos |
| `--color-ink-disabled` | `#94A3B8` | Texto en controles deshabilitados (exento AA por WCAG; contraste 2.56) |
| `--color-segment-empty` | `#8494A9` | Segmento «vacío» de la regla (≥3:1 sobre blanco: gráfico de UI, WCAG 1.4.11) |

**Azul institucional — primario y área RM** (`data-area="matematico"`)

| Token | Hex | Uso |
|---|---|---|
| `--color-blue-50` | `#EAF3FB` | Tinte de selección, fondos de chip RM |
| `--color-blue-100` | `#D3E5F7` | Bordes sobre tinte, barra de progreso completada |
| `--color-blue-600` | `#0063BD` | **Acento base**: botones primarios, selección, fill del slider, anillo de foco |
| `--color-blue-700` | `#004E96` | Estados hover/pressed del botón; burbuja de valor |
| `--color-blue-800` | `#063E77` | Pressed profundo / textos sobre tinte azul |

**Naranja — identidad del área RV** (`data-area="verbal"`)

| Token | Hex | Uso |
|---|---|---|
| `--color-orange-50` | `#FFF3EA` | Tinte de selección, fondos de chip RV |
| `--color-orange-100` | `#FBDCC4` | Bordes sobre tinte |
| `--color-orange-600` | `#EA580C` | Fill del slider RV y burbujas de selección (gráfico, 3.56:1) |
| `--color-orange-700` | `#C2410C` | **Acento base RV**: botones, texto de chip, burbuja de valor |
| `--color-orange-800` | `#9A3412` | Pressed profundo / textos sobre tinte naranja |

**Semánticos (solo pantalla de resultados)**

| Token | Hex | Uso |
|---|---|---|
| `--color-ok` | `#047857` | Texto «correctas» |
| `--color-ok-fill` | `#059669` | Segmento de barra «correctas» |
| `--color-bad` | `#B91C1C` | Texto «incorrectas» |
| `--color-bad-fill` | `#DC2626` | Segmento de barra «incorrectas» |
| `--color-neutral` | `#64748B` | Texto «no respondidas» |
| `--color-neutral-fill` | `#64748B` | Segmento de barra «no respondidas» |
| `--color-scrim` | `rgba(15, 23, 42, 0.48)` | Velo detrás de hojas modales |

### 7.3.3 Reglas de uso del color

1. **El acento sigue al bloque:** dentro del quiz, el color de interacción (botón primario, burbuja seleccionada, progreso) es el del **área actual** (`--accent` = azul en RM, naranja en RV). Fuera del quiz (Home, resultados) el primario es **siempre azul**. El cambio de acento ocurre **una sola vez** por intento (RN-03) y es en sí mismo la señal de «cambiaste de área».
2. **El color nunca es el único portador** de un estado: la selección añade borde + relleno + peso de texto; los resultados siempre llevan etiqueta y número junto al color.
3. **Azul y naranja es el par más seguro** para daltonismo (eje azul–amarillo): la distinción RM/RV sobrevive a protanopia y deuteranopia.
4. Prohibido: gradientes (salvo ninguno), sombras de color, `border-left` de color en tarjetas (veto de craft), emojis como iconos, texto gris sobre gris.

### 7.3.4 Superficies y elevación

- **Tarjetas/paneles:** `background: var(--color-surface)`, borde `1px var(--color-line)`, **sin sombra** (regla: «una sola forma de elevación por elemento: borde O sombra»). Radio 16 px.
- **Capas flotantes** (únicas con sombra):
  - Barra inferior fija: translúcida + `backdrop-filter: blur(12px)` con fondo `rgba(255,255,255,0.85)`; al hacer scroll recibe `box-shadow: 0 -6px 16px rgba(15,23,42,0.06)` y un borde superior de 1 px (estado `.is-scrolled`, transición 160 ms). Fallback `@supports not (backdrop-filter: blur(1px))`: fondo `#FFFFFF` sólido.
  - Hoja modal: `box-shadow: 0 -16px 48px rgba(15,23,42,0.18)` + scrim.
  - Chip seleccionado del selector de modo: `box-shadow: 0 1px 2px rgba(15,23,42,0.10)` (única micro-sombra «pop» permitida).
- **Uso del blur limitado:** solo en las superficies fijas que tienen contenido desplazándose por debajo (cabecera del quiz y barras inferiores). Jamás como decoración en tarjetas.

### 7.3.5 Contrastes verificados (WCAG 2.2)

Valores calculados (fórmula de luminancia relativa sRGB). **AA texto normal ≥4.5 · Gráficos/UI ≥3.0.**

| Par | Ratio | Cumple |
|---|---|---|
| Tinta `#0F172A` / fondo `#F8FAFC` | 17.06 | AAA |
| Tinta `#0F172A` / tarjeta `#FFFFFF` | 17.85 | AAA |
| Secundario `#475569` / blanco | 7.58 | AAA |
| Ayuda `#64748B` / blanco | 4.76 | AA |
| Azul 600 `#0063BD` / blanco (texto y botón) | 5.97 | AA |
| Blanco / azul 700 `#004E96` (hover) | 8.30 | AAA |
| Azul 800 `#063E77` / tinte `#EAF3FB` (chip) | 7.40 | AAA |
| Naranja 700 `#C2410C` / blanco (texto, botón, burbuja) | 5.18 | AA |
| Blanco / naranja 700 (botón RV) | 5.18 | AA |
| Naranja 800 `#9A3412` / tinte `#FFF3EA` (chip) | 6.70 | AAA |
| Texto aciertos `#047857` / blanco | 5.48 | AA |
| Texto errores `#B91C1C` / blanco | 6.47 | AA |
| Texto/relleno «no respondidas» `#64748B` / blanco | 4.76 | AA |
| Relleno barras aciertos `#059669` / blanco | 3.77 | Gráfico ✓ |
| Relleno barras errores `#DC2626` / blanco | 4.83 | Gráfico ✓ |
| Segmento vacío `#8494A9` / blanco | 3.09 | Gráfico ✓ |
| Chip cronómetro `#475569` / `#F1F5F9` | 6.92 | AAA |
| Blanco / naranja fill `#EA580C` (solo gráfico o texto ≥18.66 px bold) | 3.56 | Gráfico ✓ |

### 7.3.6 Tema oscuro — decisión

**No en v1** (consistente con `01`, §1.5 y `05`, §5.8). Los tokens están diseñados como **variables semánticas**, de modo que la fase 2 solo requiera un bloque `[data-theme="dark"]` con los mismos nombres (por ejemplo: fondo `#0B1220`, superficie `#111A2C`, tinta `#E6EDF7`, azules/naranjas aclarados a 400/300). Regla para esa fase: revalidar **todos** los contrastes en oscuro (nunca asumir los valores del claro).

---

## 7.4 Tipografía

### 7.4.1 Familia

**Stack del sistema** (decisión, no default):

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
             Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

Razones: superficie *Operate* móvil (impeccable: «los stacks del sistema sirven bien a Operate»); Apple HIG: «usa la fuente de la plataforma por defecto antes que una propia»; presupuesto de `06`: **0 KB de fuentes**; cero FOUT; en iOS es SF Pro y en Android Roboto — ambas ya están afinadas para legibilidad móvil. La personalidad tipográfica se logra con la **escala, los pesos y los numerales**, no con una cara exótica. (Anexo §7.17: opción futura de fuente display, fuera de v1.)

### 7.4.2 Escala tipográfica

Tamaños en `rem` (respetan el tamaño de texto del sistema — Dynamic Type). Base 16 px.

| Rol | Tamaño | Peso | Interlineado | Tracking | Ejemplo de uso |
|---|---|---|---|---|---|
| `display` | `clamp(2.75rem, 13vw, 3.5rem)` | 800 | 1.02 | −0.02em | Puntaje total (héroe) |
| `title-1` | 1.375rem (22) | 700 | 1.25 | −0.01em | Saludo «Hola, Juan» |
| `title-2` | 1.25rem (20) | 700 | 1.3 | −0.01em | Título de pantalla / hoja modal |
| `title-3` | 1rem (16) | 600 | 1.4 | 0 | Encabezados de tarjeta/sección («Configura tu quiz») |
| `statement` | 1.0625rem (17) | 500 | 1.55 | 0 | Enunciado de pregunta, texto común |
| `body` | 1rem (16) | 400 | 1.5 | 0 | Texto general, alternativas |
| `label` | 0.9375rem (15) | 500 | 1.4 | 0 | Etiquetas de controles, filas de métrica |
| `caption` | 0.8125rem (13) | 500 | 1.4 | 0 | Ayudas, «Máx. 30 caracteres», escala/tiempo |
| `micro` | 0.75rem (12) | 500 | 1.35 | 0.01em | Extremos de slider (1 / 17) |

Reglas:
- **Peso + tamaño + interlineado como conjunto** para jerarquía (Apple); nunca jerarquía solo por color.
- **Tracking específico por tamaño** (negativo en grande, ~0 en cuerpo) — jamás un valor fijo global.
- Sentence case siempre (en español el Title Case se siente traducido). **Sin minúsculas versalitas ni mini-etiquetas en mayúsculas sobre títulos** (veto de craft: *eyebrow/kicker*).
- Texto largo (enunciados y texto común): medida ≤75 caracteres; `text-wrap: pretty` en párrafos, `text-wrap: balance` en títulos.
- Prohibido: itálica o gris claro en textos de lectura (regla de `05`, §5.1.8); saltos de línea forzados; «…» escrito como `...` (siempre `…`).

### 7.4.3 Números, unidades y formatos

- **Numerales tabulares** (`font-variant-numeric: tabular-nums`) en: cronómetro, puntajes, porcentajes, valores de slider, contadores «X de Y». Evita el baile de dígitos al actualizarse.
- Formato `es-PE` vía `Intl.NumberFormat` para números (sin decimales innecesarios): puntajes enteros; porcentajes enteros con espacio fino antes de `%` renderizado como ` %` (p. ej. «80 %»), consistentes con RN-09 (suman 100).
- Signos: se usa el **signo menos tipográfico** `−` (U+2212, el del material) en puntajes negativos («−2») y en la escala visible («+5 · 0 · −2»).
- Tiempo: `m:ss` («04:32») y `h:mm:ss` si supera 1 hora (RF-16). Se renderiza con dígitos tabulares en un contenedor de ancho estable para evitar reflow.
- Símbolos matemáticos del material (π, ≈, ×, ², S/): se muestran **tal cual** (RNF-08, E-10); el stack incluye `Noto Sans` como respaldo de cobertura de glifos.

---

## 7.5 Espaciado, forma y layout

### 7.5.1 Ritmo espacial (grilla de 4 px)

| Token | px | Uso típico |
|---|---|---|
| `--space-0-5` | 2 | Ajustes de hairlines |
| `--space-1` | 4 | Separación de icono y texto |
| `--space-2` | 8 | Gap entre elementos hermanos pequeños (chips, controles) |
| `--space-3` | 12 | Gap entre botones de la barra inferior; gap interno de filas |
| `--space-4` | 16 | Padding interno compacto (filas de opción, chips de sección) |
| `--space-5` | 20 | **Padding lateral de pantalla (móvil)**; padding de tarjeta en ≤430 px |
| `--space-6` | 24 | Separación entre bloques relacionados; padding de tarjeta ≥430 px |
| `--space-8` | 32 | Separación entre secciones de pantalla |
| `--space-10` | 40 | Aire antes del héroe de resultados |
| `--space-12` | 48 | Altura de botones del botón primario en barras |
| `--space-16` | 64 | Reserva de scroll final (que la barra fija no tape contenido) |

Reglas de ritmo: **más aire arriba de un título que debajo**; grupos relacionados ≤8 px; secciones ≥32 px; el contenido de una pantalla usa una sola retícula vertical (nada de alineaciones a ojo).

### 7.5.2 Forma (radios) y bordes

| Token | Valor | Aplica a |
|---|---|---|
| `--radius-segment` | 7 px | Segmentos de sliders y progreso |
| `--radius-control` | 12 px | Botones, inputs, filas de opción, steppers |
| `--radius-card` | 16 px | Tarjetas, paneles, toolbar |
| `--radius-sheet` | 20 px (solo esquinas superiores) | Hojas modales |
| `--radius-pill` | 999 px | Chips, burbujas de valor/tiempo |

Bordes: 1 px `--color-line` en tarjetas; 1 px `--color-line-strong` en controles de entrada. **Nunca** cambiar el grosor del borde en el estado seleccionado (evita *layout shift*): la selección usa relleno + anillo interior vía `box-shadow: inset 0 0 0 1px`.

### 7.5.3 Breakpoints y composición

| Nombre | Condición | Comportamiento |
|---|---|---|
| base | 360–429 px | Una columna; padding lateral 20 px; todo sticky al fondo |
| cómodo | ≥430 px | Padding lateral 24 px; tarjetas con padding 20 px |
| escritorio | ≥768 px | Columna centrada `max-width: 640px`; resultados en 2 columnas (una tarjeta por área, `gap: 20px`); hojas modales pasan a **diálogo centrado** (ancho 400 px, radio 16 px); estados `:hover` se habilitan |

- **Sin scroll horizontal** en ningún viewport (se validará a 360 px).
- Anchos máximos: 640 px en todas las pantallas (la columna de lectura coincide con la medida tipográfica).
- Zona del pulgar: CTA de Home («Iniciar quiz»), botonera del quiz («Atrás»/«Continuar»/«Ver resultados») y acciones de hojas modales viven **siempre** en la parte inferior.
- **Safe areas:** todo elemento fijo respeta `env(safe-area-inset-bottom/top)` (padding `max(12px, env(safe-area-inset-bottom))`).
- **Reserva de scroll:** el contenido antepone `padding-bottom` equivalente a la barra fija + 16 px, de modo que nada quede oculto tras ella.

### 7.5.4 Política de hover

`:hover` **solo** dentro de `@media (hover: hover) and (pointer: fine)`. En táctil no existe estado hover; todo estado hover tiene su equivalente pressed/focus. Ninguna función depende de hover (RNF-01).

### 7.5.5 Z-index semántico

| Capa | Token | Valor |
|---|---|---|
| Contenido | `--z-content` | 0 |
| Barras fijas (header quiz, barras inferiores) | `--z-chrome` | 10 |
| Scrim de hoja modal | `--z-scrim` | 40 |
| Hoja/diálogo modal | `--z-sheet` | 50 |
| Tooltip | `--z-tooltip` | 60 |

---

## 7.6 Iconografía

- **Estilo:** trazo lineal de **1.75 px**, uniones y remates redondeados, `currentColor`, viewBox 24×24 — inspirado en [Phosphor Icons](https://phosphoricons.com) (MIT), **copiados en línea como SVG** en el código (cero dependencias, cero peticiones — presupuesto de `06`).
- **Tamaños (tokens):** `--icon-16` (metadatos, chips), `--icon-20` (botones, lápiz, toggles), `--icon-24` (cabeceras). Nunca tamaños intermedios arbitrarios.
- **Disciplina:** un solo estilo por jerarquía (nada de mezclar relleno y contorno); palabras antes que iconos cuando hay espacio («Inicio», no solo una casita).

| Icono | Uso | Tamaño |
|---|---|---|
| `pencil` | Editar nombre (RF-01) | 20 |
| `clock` | Cronómetro (RF-16) | 16 |
| `house` | Botón «Home» (RF-21) | 20 |
| `chevron-left` | «Atrás» (RF-15) | 20 |
| `arrow-right` | «Continuar», «Iniciar quiz», «Ver resultados» | 20 |
| `check` | Estados de éxito auxiliares (no en quiz) | 20 |
| `x` | Cerrar hoja/modal | 20 |
| `minus` / `plus` | Steppers de puntaje (RF-07) | 20 |
| `text-align-left` | Toggle mostrar/ocultar texto común (solo Comprensión de lectura) | 20 |

Accesibilidad de iconos (regla fija): decorativo junto a texto visible → `aria-hidden="true"`; icono solo (p. ej. lápiz) → el **control** lleva `aria-label`; icono con significado sin texto → alternativa textual.

---

## 7.7 Movimiento

### 7.7.1 Principios (traducidos de Apple HIG por la skill `apple-design`)

1. **Respuesta inmediata:** el feedback visual ocurre en `pointerdown`, no al soltar (escala 0.97 en botones, relleno al instante en segmentos y opciones).
2. **Manipulación directa:** el slider sigue al dedo 1:1 mientras se arrastra, con `setPointerCapture`; el offset de agarre se respeta.
3. **Interrumpible:** toda animación puede revertirse a medio camino; nada bloquea la entrada.
4. **Continuidad espacial:** el nuevo bloque entra desde el lado de la dirección del gesto (Continuar → desde la derecha; Atrás → desde la izquierda) y sale por el mismo camino.
5. **Salida más rápida que entrada:** cerrar una hoja (240 ms) es más rápido que abrirla (340 ms).
6. **Un solo momento orquestado:** la transición de bloque es el momento de producto; los resultados crecen **una vez** al aparecer. Nada más se anima por decoración.

### 7.7.2 Tokens

```css
--dur-1: 90ms;   /* relleno de segmento */
--dur-2: 120ms;  /* opción seleccionada, burbuja, pressed */
--dur-3: 180ms;  /* micro-fades, cabecera con scroll */
--dur-4: 260ms;  /* transición de bloque, tarjetas de resultados */
--dur-5: 340ms;  /* apertura de hoja (cierre: 240ms) */

--ease-out:   cubic-bezier(0.22, 1, 0.36, 1);    /* por defecto (expo-out) */
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1);    /* reversible */
--ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);    /* hoja modal (spring-like) */
```

Solo se animan `transform` y `opacity` (compositor-friendly); `width/height/top/left` nunca. Nada de `transition: all`.

### 7.7.3 Coreografías

| Momento | Animación | Duración |
|---|---|---|
| Botón (cualquiera) | `scale(0.97)` al presionar; vuelta a 1 al soltar | 100 ms `--ease-out` |
| Opción de respuesta | Burbuja: relleno + `scale 0.92→1`; fila: relleno de fondo | `--dur-2` |
| Slider (arrastre) | Segmentos se rellenan al cruzar; burbuja sigue 1:1 (sin transición durante el arrastre); snap final | instantáneo + settle `--dur-2` |
| Slider (tap para saltar) | Relleno viaja del valor anterior al nuevo | `--dur-4` |
| Pregunta→bloque nuevo | El bloque completo entra desplazado ±24 px + fade; el anterior sale por el lado opuesto | `--dur-4` `--ease-inout` |
| Hoja modal | Sube desde abajo (`translateY(100%)→0`) + scrim fade; cierre: 240 ms | `--dur-5` `--ease-sheet` |
| Cabecera con scroll | Aparece borde + sombra de borde | `--dur-3` |
| Resultados (una vez) | Barras: `scaleX(0→1)` con origen izquierdo, escalonadas 70 ms; puntaje héroe: fade + `scale 0.98→1` | 500 ms + 70 ms/barra, `--ease-out` |
| Cambio de pantalla | Fade cruzado del contenedor | `--dur-3` |

### 7.7.4 Reduced motion

Con `prefers-reduced-motion: reduce`:
- Todas las traslaciones/escalas → **cross-fade corto** (opacidad, 150 ms) o cambio estático.
- La transición de bloque pierde el deslizamiento (solo fade).
- Las barras de resultados aparecen **en su valor final** (sin crecer).
- La hoja modal aparece con fade (sin deslizamiento ni rebote).
- El arrastre 1:1 del slider **se mantiene** (es manipulación directa, no «movimiento decorativo»).
- Además se respeta `prefers-reduced-transparency: reduce` (barras fijas pasan a fondo sólido, sin blur).

---

## 7.8 El slider segmentado (componente estrella)

Referencia: el pen [zYqRKBN](https://codepen.io/akex-jester/pen/zYqRKBN) («Custom range input with **snapping values**», arrastre con GSAP Draggable). Este diseño reproduce su comportamiento esencial —**arrastrar con ajuste a valores enteros**— con un lenguaje visual propio: **la barra segmentada** (cada valor posible es una marca de la regla).

Se usa en: temas RM (1–17), temas RV (1–11) y preguntas por tema (1–5) — RF-04, RF-05, RF-06.

### 7.8.1 Anatomía

```
  Temas de Razonamiento Matemático                    8 de 17      ← etiqueta + valor (siempre visibles)
  ┌──────────────────────────────────────────────────────────┐
  │          ● 8                                             │      ← burbuja de valor (sobre el segmento activo)
  │  ███ ███ ███ ███ ███ ███ ███ ███  ▒▒▒ ▒▒▒ ▒▒▒ ▒▒▒ ▒▒▒…   │      ← 17 segmentos: rellenos | vacíos
  └──────────────────────────────────────────────────────────┘      ← zona táctil completa = 44 px de alto
   1                                                     17         ← extremos (micro, ink-3)
```

- **Segmento relleno:** `--color-blue-600` (RM) · `--color-orange-600` (RV) · `--color-blue-600` (preguntas por tema, sin área).
- **Segmento vacío:** `--color-segment-empty` (3.09:1 sobre blanco — visible para todos, también con baja visión).
- Los segmentos son **pintura** (`aria-hidden`); el control real es invisible y accesible (§7.8.6).

### 7.8.2 Medidas

| Elemento | Valor |
|---|---|
| Zona táctil (todo el track) | Ancho completo × **44 px** de alto (centra 22 px de barras) |
| Segmento | Alto **22 px**, radio **7 px**, `flex: 1` |
| Separación entre segmentos | **4 px** (con ≥12 segmentos) · **6 px** (con ≤11) |
| Extremos (1 / máximo) | `micro` (12 px) `ink-3`, a 6 px bajo el track, solo en los bordes |
| Etiqueta / valor (fila superior) | `label` (15/500, `ink-2`) · valor en `label` 600 tabular (`ink`), ej. «8 de 17» |
| Separación etiqueta → track | 8 px |
| Burbuja | Alto **28 px**, padding 0 10, radio pill, `caption` 600 tabular blanca, a 8 px sobre el track |

En pantalla de 360 px, los 17 segmentos quedan de ≈13 px de ancho (aspecto de regla fina); el objetivo táctil sigue siendo el track completo (320×44), no cada segmento.

### 7.8.3 Estados

| Estado | Visual |
|---|---|
| Reposo | Relleno = acento; vacío = `segment-empty`; extremos visibles |
| Hover (solo `pointer: fine`) | Segmento **vacío** bajo el cursor → fondo `line-strong`; relleno → `accent-700`. Cursor `pointer` |
| Activo (arrastrando) | Burbuja siguiendo el dedo; relleno **sin transición** (respuesta 1:1); cursor `grabbing`; el texto de valor se actualiza en vivo |
| Foco (teclado) | Anillo de foco exterior sobre todo el track (`2 px --color-focus`, offset 4) + burbuja visible |
| Deshabilitado | Opacidad 45 %, sin puntero, `aria-disabled`. (Poco frecuente en v1: al cambiar de modo, la sección se oculta — RF-03) |

### 7.8.4 Interacción (paso a paso)

1. **Tap para saltar:** un toque en cualquier punto del track salta directo al segmento tocado → cumple la alternativa de un solo puntero a las acciones de arrastre (WCAG 2.2 «Dragging Movements»), además de ser lo más rápido en uso real.
2. **Arrastre 1:1:** `pointerdown` captura el puntero (`setPointerCapture`); cada `pointermove` recalcula el índice por la posición X (franja del segmento) y actualiza **sin transición** — el relleno sigue al dedo exactamente.
3. **Slicitud al soltar (opcional, nivel 2):** si el gesto terminó con velocidad, se proyecta el punto de reposo (fórmula de desaceleración de Apple: `project(v) = (v/1000) · 0.998 / (1 − 0.998)`) y se hace *snap* al segmento más cercano al punto proyectado; si no, se queda en el segmento actual. Settle con `--dur-2`.
4. **Cancelación:** `pointercancel` o `Escape` a mitad de gesto revierten al valor previo al gesto.
5. **Teclado** (input nativo invisible): `←`/`→`/`↑`/`↓` ±1; `Home`/`End` a los extremos; `PageUp`/`PageDown` saltos mayores (deterministas, p. ej. ±2).
6. **Rueda del ratón: ignorada** (evita cambios accidentales al hacer scroll sobre el panel).
7. **`touch-action: pan-y`** en el track: el scroll vertical de la página sigue funcionando con el dedo encima; el arrastre horizontal lo captura el slider.
8. **Vibración sutil (opcional, Android):** 8 ms por cada segmento cruzado (`navigator.vibrate`) — feedback háptico en el momento del *snap* (uso «con causa», estilo Apple). En escritorio no aplica.

### 7.8.5 Burbuja de valor

- Muestra **solo el número** (ej. «8»), en blanco, fondo `accent-700` (azul en RM/preguntas, naranja en RV).
- Posición: centrada sobre el **segmento activo** (el último relleno), `translateX(-50%)`, con límite de 20 px respecto a los bordes del track (nunca se corta).
- Aparece al `pointerdown` o al enfocar con teclado; se desvanece **400 ms después** del `pointerup` (fade `--dur-2`). Durante el arrastre **no tiene transición** (debe pegarse al gesto).
- `aria-hidden="true"` (el valor accesible vive en el input, §7.8.6).
- Con `reduced-motion` se mantiene igual: es información, no movimiento.

### 7.8.6 Accesibilidad del slider

- El control real es un **`<input type="range" min="1" max="{m}" step="1">`** superpuesto, con `opacity: 0`, ancho completo y 44 px de alto: teclado, lector de pantalla y semántica nativa gratis.
- `aria-label` = etiqueta de la fila («Temas de Razonamiento Matemático»); **`aria-valuetext` = «8 de 17 temas»** (lenguaje humano, no «8» a secas).
- El valor textual («8 de 17») y los extremos son **siempre visibles** (RF-04: nada depende de hover).
- El foco visible se pinta sobre el track completo (regla de foco §7.12).

### 7.8.7 Notas de implementación

```svelte
<!-- Componente Slider.svelte — estructura de referencia -->
<div class="slider" data-area={area}>
  <div class="slider__head"><span>{label}</span><span class="tnum">{value} de {max}</span></div>
  <div class="slider__track" style:--n={max} style:--value={value}>
    {#each { length: max } as _, i}<span class="seg" class:on={i < value}></span>{/each}
    <input type="range" min={1} max={max} bind:value {label}
           aria-label={label} aria-valuetext={`${value} de ${max}`} />
    <span class="bubble tnum" class:show={active} aria-hidden="true">{value}</span>
  </div>
  <div class="slider__ends"><span>1</span><span>{max}</span></div>
</div>
```

- **Sin GSAP:** el pen de referencia usa GSAP Draggable (~**40 KB**) para un solo control; con Pointer Events nativos (~30 líneas) se obtiene la misma sensación (1:1 + snap) sin dependencias, coherente con el presupuesto de `06`. Si en el futuro aparecen más gestos complejos, se reevalúa.
- Solo se tocan clases y variables CSS por movimiento (nada de medir en cada frame); el CSS de referencia está en el Anexo B (`07.18`).

---

## 7.9 Catálogo de componentes

### 7.9.1 Encabezado de Home (saludo + lápiz + tooltip)

- Fila: `<h1>` que envuelve un **botón** con el texto «Hola, {nombre}» (o «Hola») en `title-1` + icono `pencil` 20 (`ink-2`) a 8 px.
- Botón: sin fondo, área táctil ≥44 px, radio 12; hover (escritorio): fondo `surface-2`; pressed `scale(0.97)`; `aria-label="Pon aquí tu nombre"`.
- **Tooltip** (solo hover/focus, escritorio): chip oscuro (fondo `--color-ink`, texto blanco `caption`, radio 8, padding 6×10) 8 px **arriba** del botón, aparece tras 300 ms de hover/focus, fade 120 ms. En táctil no existe: el botón se toca y abre la hoja (§7.9.11). RF-01.2.

### 7.9.2 Selector de modo (segmentado)

- Contenedor: pill (`radius-control`, fondo `surface-2`, padding 4) con **radios reales** ocultos + labels (teclado con flechas nativo).
- Opción: alto 44, radio 10, label `label`/500 `ink-2`; **seleccionada:** fondo `surface`, `ink` con peso 600 y micro-sombra pop (§7.3.4). Pressed: fondo `surface` + `scale(0.98)`.
- Etiquetas visibles cortas: «Matemático» · «Verbal» · «Completo» (la 05 wireframe coincide). **`aria-label` completos**: «Solo Razonamiento Matemático», «Solo Razonamiento Verbal», «Completo».
- Al cambiar de modo, la sección del área excluida **se oculta** (RF-03) con fade de 180 ms (sin animación de altura; reduced-motion: instantáneo).

### 7.9.3 Stepper numérico (puntajes, RF-07)

- Fila: etiqueta `label`/500 `ink-2` (flex 1) + grupo a la derecha; separación entre filas 20.
- Grupo: botón `−` (44×44, borde `line-strong`, radio 12, icono 20 `ink-2`) · valor (input texto `inputmode="numeric"`, ancho 64, alto 44, centrado, `body` 600 tabular `ink`) · botón `+`. Gap 8.
- Estados del valor: reposo borde `line-strong`; focus borde `--color-focus` + anillo; **error** borde `--color-bad` + mensaje debajo (§7.9.14).
- Extras: al enfocar, el texto se selecciona (reemplazo rápido); botones con `aria-label` («Quitar un punto a…» / «Añadir un punto a…»); admite `−` inicial (E-09) y muestra signo U+2212.

### 7.9.4 Botones

| Variante | Especificación |
|---|---|
| **Primario** | Alto 48 (barras) / 44 (contextos menores) · padding 0 20 · radio 12 · fondo **acento** (azul global; azul/naranja del área dentro del quiz) · texto blanco `body` 600 · icono 20 opcional (gap 8). Hover: `accent-700`; pressed: `accent-800` + `scale(0.97)`; disabled: fondo `line`, texto `ink-disabled`, sin pointer |
| **Secundario** | Fondo `surface`, borde 1 px `line-strong`, texto `ink` 600; hover `surface-2`; pressed fondo `line` |
| **Fantasma** | Sin fondo; texto `ink-2` 600; hover/pressed `surface-2` (usos: «Ocultar texto», toggles) |
| **Icono** | 44×44, radio 12, icono 20 `ink-2`; hover `surface-2` + icono `ink` (usos: lápiz, X) |

En barras inferiores: primario `flex: 2`, secundario `flex: 1`; en Home/resultados: ancho completo. Todo botón es `<button>` real (nunca div clicable).

### 7.9.5 Tarjetas y títulos de sección

- Tarjeta: `surface`, borde 1 px `line`, radio **16**, padding 16 (base) / 20 (≥430 px), separación interna 20.
- Título de sección dentro de tarjeta: `title-3` (16/600) sentencia normal — **sin mini-etiquetas en mayúsculas ni kickers** (veto de craft). Ej.: «Configura tu quiz», «Puntajes».
- Separación entre tarjetas del panel: 16; entre secciones de pantalla: 32. Se privilegia el **aire** a los divisores.

### 7.9.6 Barra inferior fija

- Fija al fondo (`--z-chrome`), fondo translúcido blanco + `blur(12px)` (§7.3.4), borde superior y sombra solo en estado `.is-scrolled`.
- Contenido: `max-width: 640px`, padding `12px 20px calc(12px + env(safe-area-inset-bottom))`.
- Variantes: **[Iniciar quiz]** (ancho completo, deshabilitable); **[Atrás] [Continuar]** (1:2); **[Atrás] [Ver resultados]**.
- El contenido de la pantalla reserva altura equivalente + 16 px para no quedar oculto (§7.5.3).

### 7.9.7 Opción de respuesta (burbuja A–E)

- **Semántica nativa:** cada pregunta es un `<fieldset>` con su enunciado en `<legend>`; cada alternativa es `<label>` con `<input type="radio">` oculto (foco/teclado/lectores gratis). Selección única y cambiable (RF-14).
- Fila: alto mínimo **56**, padding 12 14, radio 12, borde 1 px `line`, fondo `surface`, gap 12; separación entre alternativas 12.
- **Burbuja:** círculo de 28 px, borde 1.5 px `line-strong`, letra A–E `caption` 600 `ink-2` centrada.
- **Seleccionada:** borde de fila `accent-600` + fondo `accent-50` + texto a peso 600 + burbuja con fondo `accent-600` y letra blanca (forma + color + peso: jamás solo color).
- Pressed: fondo `surface-2`. Focus visible: anillo alrededor de la fila (§7.12).
- **Sin feedback de corrección durante el quiz** (RF-14).

### 7.9.8 Cabecera del quiz (RF-12)

- Sticky arriba (`--z-chrome`), fondo translúcido + blur; padding-top `max(8px, env(safe-area-inset-top))`; fila: **chip de área** · «Bloque 3 de 13» (`caption` 600 `ink-2` tabular) · separador flexible · **chip de cronómetro**; debajo, la barra de progreso (§7.9.9).
- **Chip de área:** pill, fondo `accent-50`, borde 1 px `accent-100`, punto de 6 px `accent-600` + texto `caption` 600 `accent-800` («Razonamiento Matemático» / «Razonamiento Verbal y Comunicación»).
- **Chip de cronómetro:** pill, fondo `surface-2`, icono `clock` 16 `ink-3` + tiempo `caption` 600 tabular `ink-2`; contenedor con ancho estable (`ch`) para evitar reflow; **sin** `aria-live` (no debe interrumpir).
- Al hacer scroll: borde inferior + sombra (fade 160 ms).

### 7.9.9 Progreso de bloques (segmentos)

- Barra de **N segmentos** (N = total de bloques del intento), alto 4 px, radio 2, gap 3 px.
- Pendiente: `line`; completado: `accent-600`; **bloque actual:** `accent-600` con alto 6 px (micro-elevación que responde a «estás aquí»).
- `aria-hidden` (el texto «Bloque 3 de 13» ya lo comunica) — redundancia visual a propósito.

### 7.9.10 Panel de texto común (solo Comprensión de lectura, RF-13.2)

- Contenedor: fondo `surface-2`, borde 1 px `line`, radio 16, padding 20; separación: 24 tras el título del tema, 24 antes de la primera pregunta.
- Encabezado (fila, alto ≥44): icono `text-align-left` 20 `ink-3` + «Texto» `label` 600 `ink-2` + toggle **fantasma** a la derecha («Ocultar texto» / «Mostrar texto», `aria-expanded`).
- Implementado con **`<details>`/`<summary>` nativos** (teclado gratis), **abierto por defecto**; contenido en `statement` 17/400, interlineado 1.6, párrafos separados 12, medida ≤75ch, `text-wrap: pretty`. RF-13/E-06.

### 7.9.11 Hojas modales (nombre y confirmación)

- **Móvil (base):** *bottom sheet* — ancho 100 %, radio 20 (solo arriba), fondo `surface`, padding 20 (+ safe-area), asa de 36×4 px (`line-strong`) centrada arriba; sombra de hoja + scrim. Entrada: sube con `--ease-sheet` (`--dur-5`); cierre 240 ms. **Drag-to-dismiss:** arrastrar el asa hacia abajo; umbral 96 px o velocidad > 0.5 px/ms; resistencia tipo rubber-band.
- **Escritorio (≥768):** diálogo centrado, ancho 400, radio 16, misma sombra; entrada fade + `scale(0.98→1)`.
- Comunes: `<dialog>`/rol dialog + `aria-modal`; foco atrapado; `Escape` y clic en scrim = cancelar (RF-01.4); al cerrar, el foco vuelve al disparador (lápiz o «Ver resultados»); scroll del fondo bloqueado (`overscroll-behavior: contain`).
- **Hoja de nombre:** título «¿Cómo te llamas?» (`title-2`), campo de texto (alto 48, `body` 16 — evita el zoom de iOS, borde `line-strong`, radio 12), ayuda «Máx. 30 caracteres» (`caption` `ink-3`) que se convierte en mensaje de error si corresponde; X de cierre arriba a la derecha (icono, 44). Acciones: móvil **apiladas** (Cancelar arriba, Guardar abajo como primaria); escritorio en fila a la derecha.
- **Hoja de confirmación (RF-17):** sin campo; título «Tienes X preguntas sin responder» (con singular/plural correcto, §7.11); detalle `body` `ink-2`: «RM: a · RV: b» (solo áreas activas); acciones: **Ver resultados igualmente** (primaria con acento del área en curso) + **Volver a revisar** (secundaria).

### 7.9.12 Fila de métrica y barra de composición (resultados)

- **Barra de composición:** alto 10 px, radio 6, segmentos con gap de 2 px (blanco); colores: aciertos `ok-fill`, incorrectas `bad-fill`, no respondidas `neutral-fill`; los segmentos con 0 % no se renderizan. Una barra por área (representa el 100 % del área, RN-09).
- **Filas de métrica** (3 por área): punto de 8 px del color del relleno + etiqueta `label` 400 `ink-2` («Correctas», «Incorrectas», «No respondidas») + conteo `caption` `ink-3` («12 de 15») + **porcentaje** a la derecha (`label` 700 tabular `ink`). Alto de fila 24, separación 8.
- Animación de aparición: la barra crece con `scaleX` desde la izquierda una sola vez (§7.7.3); las cifras no cuentan hacia arriba (sin «odómetro»).

### 7.9.13 Puntaje héroe (resultados)

- Etiqueta «Puntaje total» (`caption` 600 `ink-3`) encima del número — es la etiqueta del dato, no un kicker decorativo.
- Número: `display` (clamp 44–56 px), peso 800, tabular, `ink`; negativo con signo `−` (p. ej. «−12»). Puede ser 0 o negativo (RN-08, E-05).
- Debajo, dos metadatos en fila (`caption` `ink-2`, gap 16, wrap permitido): «Escala: +5 · 0 · −2» y «⏱ Tiempo 41:07» (icono 16 `ink-3`).

### 7.9.14 Patrón de validación y error

- El mensaje va **junto al control** (`caption` 500 `--color-bad`, margen 4 arriba), no en un resumen al final; el control en error usa borde `bad` + `aria-invalid="true"` + `aria-describedby`.
- Mientras exista un error: «Iniciar quiz» deshabilitado + línea de motivo sobre el botón («Corrige los puntajes marcados para iniciar», `caption` `ink-3`, centrada).
- Al corregir, el error desaparece al instante (validación en vivo); sin toasts.

### 7.9.15 Tooltip (solo escritorio, mejora progresiva)

- Chip oscuro descrito en §7.9.1; `aria-hidden` (el `aria-label` del botón ya existe); aparece tras 300 ms, se va en 120 ms; nunca en táctil; nunca en elementos sin equivalente accesible.

---

## 7.10 Pantallas — especificación visual

### 7.10.1 Home — saludo + panel de configuración

Composición vertical (móvil, base 360–429 px; entre paréntesis la separación al elemento siguiente):

| # | Elemento | Especificación |
|---|---|---|
| 1 | **Saludo + lápiz** (§7.9.1) | Padding superior 20 (↕ safe-area) · `title-1`; abre la hoja de nombre |
| 2 | **Título «Configura tu quiz»** | `title-2` (24) |
| 3 | **Tarjeta «Modo del quiz»** (16) | Título `title-3` (16) + selector segmentado (§7.9.2); padding de tarjeta |
| 4 | **Tarjeta de sliders** (16) | Tres sliders (§7.8) separados 24: RM → RV → Preguntas por tema. Cada uno: fila etiqueta/valor (8), track (8), extremos (6), caption de al azar. Color del relleno: RM azul, RV naranja, Preguntas por tema azul |
| 5 | **Tarjeta «Puntajes»** (24) | Título `title-3` + caption «Puntos que suma cada tipo de respuesta» (16) + 3 steppers (§7.9.3) separados 20 |
| 6 | **Resumen en vivo** (RF-08) | `label` 500 `ink-2` tabular: «Completo · 13 temas · 26 preguntas»; se recalcula al instante con cada ajuste |
| 7 | **Barra fija** | [Iniciar quiz] primario azul, ancho completo; deshabilitado con motivo visible si hay error (§7.9.14) |
| — | Reserva final | 64 px + safe-area bajo el contenido |

- **Con nombre:** paso 1 muestra «Hola, Juan». **Sin nombre:** «Hola» (el lápiz invita).
- **Modo «Solo Matemático/Verbal»:** la tarjeta de sliders muestra solo el slider del área incluida (RF-03); el valor del área oculta se conserva en memoria.
- Al volver de resultados (RF-10) **todo se conserva**: modo, sliders, puntajes, nombre.
- Escritorio (≥768): columna de 640 centrada; la barra fija se mantiene (consistencia táctil/escritorio).

### 7.10.2 Quiz — un bloque por temática

| # | Elemento | Especificación |
|---|---|---|
| 1 | **Cabecera sticky** (§7.9.8 + §7.9.9) | Chip de área + «Bloque 3 de 13» + cronómetro; barra de progreso segmentada debajo |
| 2 | **Título del tema** | `title-2`; padding superior 24 desde la cabecera |
| 3 | **Panel de texto común** (solo si aplica) | §7.9.10 (24 tras el título; 24 antes de la primera pregunta) |
| 4 | **Preguntas 1..q** | Numeración «1.» `title-3` `ink-2` + enunciado `statement`; opciones separadas 12; separación entre preguntas **32** |
| 5 | **Barra fija** | [Atrás] secundario + [Continuar]/[Ver resultados] primario **con el acento del área** |

- **Acento por área:** en bloques de RM todo el acento interactivo es azul; al entrar a RV cambia a naranja **con el bloque nuevo** (sin cross-fade intermedio) — así el cambio de acento coincide con el cambio de contexto (RN-03).
- **Cambio de bloque:** el bloque entra desplazado ±24 px + fade (dirección del gesto) y el scroll vuelve arriba; respuestas conservadas al ir Atrás (E-07).
- **Primer bloque:** solo [Continuar] (ancho completo). **Último:** [Atrás] [Ver resultados] → confirmación si hay blancos (RF-17, §7.9.11).
- **Cronómetro:** continúa entre bloques; monoespaciado tabular; se detiene al entrar a resultados (RF-16).
- Sin feedback de corrección en ninguna parte del bloque (RF-14).

### 7.10.3 Resultados

| # | Elemento | Especificación |
|---|---|---|
| 1 | **Título «Resultados»** + saludo | `title-2` + «¡Buen trabajo, Juan!» `body` `ink-2` (solo si hay nombre, RF-20.5) |
| 2 | **Puntaje héroe** (32) | Centrado (§7.9.13): etiqueta caption + número `display` + fila escala/tiempo |
| 3 | **Tarjeta por área incluida** (16) | Solo áreas del intento (RN-11). Fila superior: punto de 8 px del acento del área + nombre (`title-3`) + «Puntaje del área» + **puntaje** (`title-1` 700 tabular, alineado a la derecha). Luego: barra de composición (12) + 3 filas de métrica (§7.9.12) |
| 4 | **Recordatorio de configuración** (24) | `caption` `ink-3`: «Completo · 13 temas · 2 preguntas por tema» (RF-20.4) |
| 5 | **Botón «Home»** | Primario azul, ancho completo, icono `house` (RF-21) |
| — | Reserva final | 48 px + safe-area |

- **Aparición (una sola vez):** barras de composición crecen (500 ms, escalonadas 70 ms), héroe con fade+rise 260 ms; con reduced-motion todo aparece en su valor final (§7.7.4).
- Escritorio (≥768): las dos tarjetas de área en **dos columnas** (`grid`, gap 20); el resto igual.
- Casos extremos: puntaje 0 («0», E-05) · negativo («−12», E-09) · área con 100 % en una métrica (una sola barra de color, E-03/E-04).

### 7.10.4 Mapa de casos borde (E-01…E-10) → tratamiento visual

| # | Caso | Tratamiento visual |
|---|---|---|
| E-01 | RM con 17 temas | Barra de progreso con 17 segmentos finos (gap 3); slider a tope con 17 rellenos de ≈13 px; el héroe muestra «17 de 17» |
| E-02 | q = 5 | Bloque de 5 preguntas; el espaciado de 32 entre preguntas ya lo contempla |
| E-03 | Mínimo (k=1, q=1) | Barra de composición de un solo color (100 %); conteos «1 de 1» |
| E-04 | Quiz en blanco | Barra 100 % gris (`neutral-fill`); «No respondidas» al 100 %; puntaje = T × pnr |
| E-05 | Escala 0/0/0 | Puntaje «0»; los porcentajes se muestran igual |
| E-06 | Comprensión de lectura con q<5 | Panel de texto idéntico; menos preguntas debajo |
| E-07 | Atrás + editar | Sin cambio visual especial; la opción editada muestra su nuevo estado |
| E-08 | Nombre vacío/spacios | El saludo vuelve a «Hola»; sin errores visibles |
| E-09 | Puntajes negativos | Signo `−` (U+2212) siempre visible en stepper, escala y puntajes |
| E-10 | π, ≈, ×, ², S/ | Render tal cual; el stack cubre los glifos; sin transformaciones |

---

## 7.11 Microcopy (deck completo)

Tono: español es-PE, segunda persona, sentence case, sin emojis, sin signos de admiración salvo el saludo de resultados. Los «{}» indican valores dinámicos con numerales tabulares. Formato numérico con `Intl.NumberFormat('es-PE')`; signo negativo `−` (U+2212).

### Home

| Elemento | Texto |
|---|---|
| Saludo sin nombre | «Hola» |
| Saludo con nombre | «Hola, {nombre}» |
| `aria-label` saludo/lápiz y tooltip | «Pon aquí tu nombre» |
| Título de sección | «Configura tu quiz» |
| Título de tarjeta de modo | «Modo del quiz» |
| Opciones de modo (visibles) | «Matemático» · «Verbal» · «Completo» |
| Opciones de modo (`aria-label`) | «Solo Razonamiento Matemático» · «Solo Razonamiento Verbal» · «Completo» |
| Slider RM | Etiqueta «Temas de Razonamiento Matemático» · valor «{k} de 17» · `aria-valuetext` «{k} de 17 temas» · caption «Al azar, sin repetirse» |
| Slider RV | Etiqueta «Temas de Razonamiento Verbal» · valor «{k} de 11» · `aria-valuetext` «{k} de 11 temas» · caption «Al azar, sin repetirse» |
| Slider de preguntas | Etiqueta «Preguntas por tema» · valor «{q} de 5» · `aria-valuetext` «{q} de 5 preguntas» · caption «Al azar, dentro de cada tema» |
| Tarjeta de puntajes | Título «Puntajes» · caption «Puntos que suma cada tipo de respuesta» |
| Filas de puntaje | «Correcta» · «No respondida» · «Incorrecta» (`aria-label` completos: «Puntos por respuesta correcta», «Puntos por pregunta no respondida», «Puntos por respuesta incorrecta») |
| Botones ± (`aria-label`) | «Quitar un punto a {campo}» · «Añadir un punto a {campo}» |
| Error de puntaje | «Escribe un número entre −999 y 999.» |
| Motivo de CTA deshabilitado | «Corrige los puntajes marcados para iniciar» |
| Resumen | «{Modo} · {k} temas · {q} preguntas» (Modo ∈ «Completo», «Solo Matemático», «Solo Verbal») |
| CTA | «Iniciar quiz» |

### Hoja de nombre

| Elemento | Texto |
|---|---|
| Título | «¿Cómo te llamas?» |
| Etiqueta del campo | «Tu nombre» |
| Placeholder | «Ej. Juan» |
| Ayuda / error | «Máx. 30 caracteres» / «Máximo 30 caracteres.» |
| Acciones | «Guardar» (primaria) · «Cancelar» (secundaria) · X: `aria-label` «Cerrar» |

### Quiz

| Elemento | Texto |
|---|---|
| Chip RM / RV | «Razonamiento Matemático» / «Razonamiento Verbal y Comunicación» |
| Progreso | «Bloque {X} de {Y}» |
| Cronómetro | «{m:ss}» o «{h:mm:ss}» (con `aria-label` «Tiempo transcurrido») |
| Navegación | «Atrás» · «Continuar» · «Ver resultados» |
| Panel de texto | Encabezado «Texto» · toggles «Ocultar texto» / «Mostrar texto» |
| Confirmación (singular) | «Tienes 1 pregunta sin responder» |
| Confirmación (plural) | «Tienes {X} preguntas sin responder» |
| Detalle | «RM: {a} · RV: {b}» (solo áreas activas; omitir el área con 0 si la otra tiene todas) |
| Acciones | «Volver a revisar» (secundaria) · «Ver resultados igualmente» (primaria) |

### Resultados

| Elemento | Texto |
|---|---|
| Título | «Resultados» |
| Saludo | «¡Buen trabajo, {nombre}!» (solo con nombre) |
| Etiqueta del héroe | «Puntaje total» |
| Escala | «Escala: {+5} · {0} · {−2}» (signos explícitos) |
| Tiempo | «Tiempo {41:07}» (icono reloj) |
| Tarjeta de área | Nombre del área · «Puntaje del área: {56}» |
| Métricas | «Correctas» · «Incorrectas» · «No respondidas» (con conteo «{12} de {15}» y porcentaje «{80} %») |
| Recordatorio | «{Modo} · {k} temas · {q} preguntas por tema» |
| Botón final | «Home» |

Reglas de escritura: los botones nombran su acción («Ver resultados igualmente», no «OK»); los errores dicen qué hacer («Escribe un número entre −999 y 999»), no solo qué pasó; se dice «tú», nunca «usted»; los números siempre con dígitos («3 temas», no «tres temas»).

---

## 7.12 Accesibilidad (consolidada)

1. **Contraste:** todos los pares de texto ≥4.5:1 y gráficos ≥3:1 (§7.3.5, valores calculados). Los estados nunca dependen solo del color (forma + peso + texto).
2. **Foco visible:** `outline: 2px solid var(--color-focus); outline-offset: 2px` (4 px en el slider); **jamás** `outline: none` sin reemplazo; `:focus-visible` (no `:focus`). Las barras fijas y hojas no tapan el elemento enfocado (reserva §7.5.3).
3. **Objetivos táctiles:** todo interactivo ≥44×44 px con ≥8 px de separación (RNF-02; supera el mínimo web de 24 px de WCAG 2.2).
4. **Alternativa al arrastre:** el slider se puede operar con un solo toque (tap-to-jump) y con teclado (WCAG 2.2 «Dragging Movements»).
5. **Teclado (recorrido):**
   - Home: saludo → radios de modo (flechas) → sliders (flechas, Home/End) → steppers (Tab entre botones y campo) → CTA.
   - Quiz: alternativas (flechas entre radios) → [Atrás] → [Continuar].
   - Hojas: foco atrapado; `Escape` cancela; al cerrar, el foco **regresa al disparador**.
   - `Enter`/`Espacio` operan todo botón (nativos).
6. **Semántica primero que ARIA:** `<button>`, `<input type="radio">`, `<input type="range">`, `<fieldset>/<legend>` por pregunta, `<dialog>` para hojas; los divs no son controles.
7. **Lectores de pantalla:** `aria-valuetext` en sliders («8 de 17 temas»); `aria-label` en botones de icono; `aria-expanded` en el toggle de texto; el cronómetro y la barra de progreso **no** usan `aria-live` (evitar interrupciones); el texto «Bloque X de Y» cubre la información de progreso.
8. **Formularios:** etiquetas visibles o `aria-label`; errores inline + `aria-invalid` + `aria-describedby`; `inputmode="numeric"` en puntajes; `autocomplete="given-name"` en el nombre y `autocomplete="off"` en los puntajes; nunca se bloquea pegar.
9. **Movimiento y transparencia:** `prefers-reduced-motion` y `prefers-reduced-transparency` (§7.7.4); animaciones siempre interrumpibles.
10. **Zoom y texto:** `user-scalable` nunca deshabilitado; tamaños en `rem` (respetan la preferencia del sistema); contenedores toleran crecimiento de texto sin romper el layout (ancho flexible, `min-w-0` donde haga falta).
11. **Gestión de foco entre pantallas:** al pasar Home → Quiz → Resultados, el foco se mueve al `<h1>` de la pantalla nueva (`tabindex="-1"`, sin anillo visible para este movimiento programático) y el scroll vuelve arriba; el `document.title` refleja la pantalla («Simulador · Quiz», «Simulador · Resultados»).

---

## 7.13 Rendimiento visual

- **Presupuesto (de `06`):** CSS total ≤15 KB gzip → estimación del sistema completo (tokens + utilidades purgadas + componentes) ≈ **9–12 KB gzip**. Sin cambios al presupuesto de JS.
- **Cero webfonts, cero imágenes raster:** todos los gráficos son CSS + SVG en línea (iconos, nada más). El favicon es un SVG mínimo y `theme-color` = `#F8FAFC`.
- **Cero CLS:** segmentos, barras, chips y héroe con dimensiones reservadas; el cronómetro vive en un contenedor de ancho fijo (`ch`), los porcentajes en columnas alineadas.
- **Solo `transform`/`opacity`** en animaciones; `backdrop-filter` solo en cabecera del quiz y barras inferiores, con fallback sólido (§7.3.4).
- **Render por bloque:** el quiz monta únicamente el bloque visible (las 140 preguntas nunca se dibujan a la vez); cada slider segmentado son ≤17 nodos simples.
- Nada de librerías de UI, iconos, gráficas o animación (el «gráfico» de resultados son divs con anchos porcentuales que suman 100).

## 7.14 Checklist de calidad (pre-entrega, por pantalla)

**Composición**
- [ ] La pantalla responde en 2 segundos: *¿dónde estoy?, ¿qué sigue?, ¿cómo salgo?* (§7.1.1).
- [ ] Una sola columna 360 px sin scroll horizontal; padding lateral 20/24; medida de texto ≤75ch.
- [ ] Jerarquía por tamaño/peso/espacio; sin mini-etiquetas en mayúsculas sobre títulos; sin tarjetas anidadas; una sola elevación por elemento (borde **o** sombra).

**Interacción y estados**
- [ ] Todo lo tocable tiene estados: reposo, pressed (≤120 ms), focus, disabled/error cuando aplica (§7.9).
- [ ] Feedback en `pointerdown`; nada depende de hover; hover solo con `pointer: fine`.
- [ ] Objetivos ≥44×44 con ≥8 px de separación; botón primario de barras a 48 px de alto.
- [ ] Barras fijas no tapan contenido (reserva de scroll) ni el foco; safe-areas respetadas (notch y gesto inferior).

**Accesibilidad**
- [ ] Contraste verificado por par (tabla §7.3.5); estados nunca solo por color.
- [ ] `:focus-visible` presente en todo control (outline 2 px + offset); probado con teclado el recorrido completo de la pantalla.
- [ ] Sliders: operables con tap único y teclado; `aria-valuetext` en lenguaje humano.
- [ ] Radios reales en modo/alternativas; `<dialog>` con trampa y retorno de foco; `Escape` cierra.
- [ ] Con `prefers-reduced-motion` y con texto del sistema al 200 % el layout no se rompe.

**Movimiento**
- [ ] Solo `transform`/`opacity`; sin `transition: all`; salida más rápida que entrada; un solo momento orquestado por pantalla.

**Contenido y copy**
- [ ] Cadenas exactas del deck (§7.11), sentence case, «…» y «−» correctos, números tabulares donde corresponde.
- [ ] Casos extremos probados con contenido real: nombre largo (30), puntaje negativo, 100 % en una métrica, 17 bloques, texto de comprensión + 1 pregunta (E-01…E-10).

**Navegador (superficies que también se diseñan)**
- [ ] Selección de texto, caret, `scrollbar` y autofill no rompen la paleta; `touch-action: manipulation` en el body; `overscroll-behavior: contain` en hojas; doble-tap sin zoom accidental.
- [ ] Probado en móvil real: iOS Safari y Android Chrome (viewport 360–430), con rotación.

## 7.15 Integración con las siete skills

Este documento se redactó aplicando las skills instaladas en `~/.agents/skills/`. Cómo se usó cada una y cómo seguirá usándose:

| Skill | Uso en este documento | Uso futuro (fase de implementación) |
|---|---|---|
| **impeccable** | Marco operativo: modo *Operate* (§7.0), reglas de *craft floor* incorporadas como vetos (§7.1, §7.2.1, §7.9.5 — sin kickers, sin `border-left` de color, radios 12–16, una sola elevación, estados completos, superficies del navegador cuidadas). | Al construir cada pantalla: `detect` (detector mecánico), `audit` (a11y/responsive), `critique` y `polish`; generar el `DESIGN.md` de la raíz **desde el build real** al terminar la implementación. |
| **ui-ux-pro-max** | Consultas reales a su base: estilo recomendado (*Minimalism & Swiss Style*), paleta de referencia de estudio, 20+ reglas UX aplicadas (touch 44/48, alternativa al arrastre WCAG 2.2, focus states, progreso de pasos, `inputmode`, viewport, pull-to-refresh contenido), iconos Phosphor, reglas de la pila Svelte. Descartado con razón: tipografía infantil, claymorphism, morado «study» (§7.2.1). | Consultas puntuales: contraste en modo oscuro (fase 2), patrones nuevos, reglas de la pila en componentes concretos. |
| **frontend-design** | Dirección anti-«default de IA»: concepto propio (§7.2), lista de descartes justificada, un único momento memorable (§7.7.1-6), copy como contenido de diseño (§7.11). | Ritual de autocrítica al añadir funciones nuevas (¿esto es decisión o default?); revisión con capturas. |
| **apple-design** | HIG traducida al web: respuesta en `pointerdown`, arrastre 1:1 con captura de puntero, interrumpibilidad, continuidad espacial y dirección del gesto, el «feel» de la hoja (§7.7, §7.8.4), tipografía por tamaño (tracking/leading), fuente del sistema, safe areas, vibración con causa, `reduced-motion/transparency`. | Revisión del movimiento en el build (slider, hojas, transiciones de bloque) contra §7.7.3. |
| **web-design-guidelines** (Vercel) | Sus reglas web están incorporadas en la checklist §7.14 y en las decisiones de §7.12: `focus-visible`, `tabular-nums`, «…», safe-areas, `touch-action`, `overscroll-behavior`, `min-w-0`, `Intl.*`, `beforeunload` (RF-18), anti-patrones prohibidos. | Pasada de auditoría por archivo (formato `archivo:línea`) al terminar cada componente. |
| **svelte-code-writer** | Referencia para la fase de código (no afecta decisiones visuales). | **Obligatoria** al crear/editar cualquier `.svelte`: consulta de documentación Svelte 5 y análisis del componente. |
| **svelte-core-bestpractices** | Referencia de implementación (runes, `bind:value` para los controles, estilos con alcance de componente). | Aplicar al escribir `Slider.svelte`, `Stepper.svelte`, `QuizBlock.svelte`, etc. |

Además:
- Se creó **`PRODUCT.md`** en la raíz del proyecto (derivado de `01`–`03`, sin requisitos nuevos) para que *impeccable* cargue el contexto del producto en futuras sesiones.
- Cuando exista código, este documento se materializará como **`DESIGN.md`** en la raíz (formato y tokens listos en el Anexo C), cerrando el ciclo de *impeccable*.

## 7.16 Decisiones abiertas y pendientes

| # | Tema | Estado |
|---|---|---|
| 1 | **Verificación fina del slider contra el CodePen** | Confirmado el pen «Custom range input with **snapping values** made with GSAP Draggable», pero CodePen bloquea la lectura del código (403). Para cerrar: comparte una **captura** o el CSS; se ajustará solo la capa visual del componente (formas/medidas del segmento y burbuja); estructura y comportamiento ya están definidos (§7.8). |
| 2 | **Autofocus del nombre en móvil** | RF-01.3 pide foco automático; en móvil desplegaría el teclado sobre la hoja. Propuesta: autofocus solo con `pointer: fine`. Pendiente de tu aprobación (implicaría micro-ajuste de `02`). |
| 3 | **Etiqueta «Home»** | Sugerencia: «Inicio» (más natural en es-PE). Queda «Home» como en `02` hasta que lo apruebes. |
| 4 | **Fuente display opcional** | Fuera de v1 (Anexo A, §7.17); su adopción exige actualizar el presupuesto de `06`. |
| 5 | **Tema oscuro** | Fase 2 (§7.3.6); tokens listos para un bloque `[data-theme="dark"]`. |
| 6 | **GSAP del pen de referencia** | Descartado como dependencia (~40 KB para un control); el snap se replica con Pointer Events (§7.8.7). |
| 7 | **Pantalla de revisión con explicaciones** (fase 2) | Reutilizará los tokens semánticos ya definidos; se diseñará en su propio ciclo. |
| 8 | **Detector mecánico de impeccable** | Al construir: `scripts/impeccable.cmd detect --json` sobre los archivos cambiados, una vez por ronda (§7.15). |

---

## 7.17 Anexo A — Fuente display opcional (fase 2, no en v1)

Si en el futuro se quiere una voz tipográfica propia para títulos/héroe:
- Requisitos: **una sola** variable, subconjunto latino, **autoalojada** (nunca CDN de fuentes), `woff2` ≤40 KB, `font-display: swap` + `preload`, usada **solo** en `display/title-*` (el cuerpo se queda en el stack del sistema).
- Impacto: actualizar `06` («Fuentes web: 0 KB» → «≤40 KB, autoalojadas»); revisar tracking/leading; validar contraste con la misma paleta.
- Candidata evaluada con la base de datos: *Plus Jakarta Sans* (versátil, moderna, no genérica); alternativa de respaldo: quedarse como está (decisión por defecto).

## 7.18 Anexo B — CSS de referencia del slider

```css
/* Slider segmentado — referencia de implementación (ajustar a tokens del Anexo C) */
.slider { --accent: var(--color-blue-600); --accent-strong: var(--color-blue-700); }
.slider[data-area="verbal"] { --accent: var(--color-orange-600); --accent-strong: var(--color-orange-700); }

.slider__head { display: flex; justify-content: space-between; align-items: baseline;
                gap: 12px; margin-bottom: 8px; font-size: .9375rem; }
.slider__head .lbl { color: var(--color-ink-2); font-weight: 500; }
.slider__head .val { color: var(--color-ink); font-weight: 600; font-variant-numeric: tabular-nums; }

.slider__track { position: relative; display: flex; align-items: center; gap: 4px;
                 height: 44px; touch-action: pan-y; }
.slider__track--dense { gap: 4px; } /* ≥12 segmentos */
.slider__track--wide  { gap: 6px; } /* ≤11 segmentos */

.seg { flex: 1; height: 22px; border-radius: 7px; background: var(--color-segment-empty);
       transition: background-color var(--dur-1) var(--ease-out); }
.seg.on { background: var(--accent); }

@media (hover: hover) and (pointer: fine) {
  .slider__track:hover .seg:not(.on) { background: var(--color-line-strong); }
  .slider__track:hover .seg.on { background: var(--accent-strong); }
}

/* Control accesible real (invisible, encima de todo el track) */
.slider__track input[type="range"] { position: absolute; inset: 0; width: 100%; height: 44px;
                                     margin: 0; opacity: 0; cursor: pointer; }
.slider__track:has(input:focus-visible) { outline: 2px solid var(--color-focus);
                                          outline-offset: 4px; border-radius: 10px; }

/* Burbuja */
.bubble { position: absolute; bottom: 34px; transform: translateX(-50%);
          height: 28px; padding: 0 10px; display: grid; place-items: center;
          border-radius: 999px; background: var(--accent-strong); color: #fff;
          font-size: .8125rem; font-weight: 600; font-variant-numeric: tabular-nums;
          opacity: 0; transition: opacity var(--dur-2) var(--ease-out); pointer-events: none; }
.bubble.show { opacity: 1; transition: none; } /* durante el gesto: pegado al dedo */

.slider__ends { display: flex; justify-content: space-between; margin-top: 6px;
                font-size: .75rem; color: var(--color-ink-3); }
```

```js
/* Interacción (Pointer Events, ~30 líneas; sin GSAP) */
function bindSlider(track, { max, value, onChange }) {
  let active = false;
  const setFromX = (x) => {
    const r = track.getBoundingClientRect();
    const i = Math.min(max - 1, Math.max(0, Math.floor(((x - r.left) / r.width) * max)));
    onChange(i + 1);                       // tap-jump + arrastre 1:1 con snap vivo
  };
  track.addEventListener('pointerdown', (e) => { active = true; track.setPointerCapture(e.pointerId); setFromX(e.clientX); });
  track.addEventListener('pointermove', (e) => { if (active) setFromX(e.clientX); });
  track.addEventListener('pointerup',   () => { active = false; });   // + proyección de momentum (opcional) aquí
  track.addEventListener('pointercancel', () => { active = false; }); // revertir al valor previo
}
```

## 7.19 Anexo C — Tokens CSS (listos para `app.css`)

```css
@import "tailwindcss";

@theme {
  /* Superficies y tinta */
  --color-bg: #F8FAFC;            --color-surface: #FFFFFF;
  --color-surface-2: #F1F5F9;     --color-line: #E2E8F0;
  --color-line-strong: #CBD5E1;   --color-ink: #0F172A;
  --color-ink-2: #475569;         --color-ink-3: #64748B;
  --color-ink-disabled: #94A3B8;  --color-segment-empty: #8494A9;

  /* Azul institucional (primario / RM) */
  --color-blue-50: #EAF3FB;   --color-blue-100: #D3E5F7;
  --color-blue-600: #0063BD;  --color-blue-700: #004E96;  --color-blue-800: #063E77;

  /* Naranja (RV) */
  --color-orange-50: #FFF3EA;  --color-orange-100: #FBDCC4;
  --color-orange-600: #EA580C; --color-orange-700: #C2410C; --color-orange-800: #9A3412;

  /* Semánticos (resultados) */
  --color-ok: #047857;        --color-ok-fill: #059669;
  --color-bad: #B91C1C;       --color-bad-fill: #DC2626;
  --color-neutral: #64748B;   --color-focus: #0063BD;

  /* Tipografía */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
               Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

  /* Forma */
  --radius-segment: 7px;  --radius-control: 12px;
  --radius-card: 16px;    --radius-sheet-top: 20px;

  /* Sombras (solo capas flotantes) */
  --shadow-chrome: 0 -6px 16px rgba(15, 23, 42, 0.06);
  --shadow-sheet:  0 -16px 48px rgba(15, 23, 42, 0.18);
  --shadow-pop:    0 1px 2px rgba(15, 23, 42, 0.10);
}

:root {
  /* Espaciado (grilla de 4) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* Movimiento */
  --dur-1: 90ms; --dur-2: 120ms; --dur-3: 180ms; --dur-4: 260ms; --dur-5: 340ms;
  --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);

  /* Z semántico */
  --z-chrome: 10; --z-scrim: 40; --z-sheet: 50; --z-tooltip: 60;

  --color-scrim: rgba(15, 23, 42, 0.48);
  color-scheme: light;
}

/* Acento contextual por área (se aplica dentro del quiz) */
[data-area="matematico"] { --accent: var(--color-blue-600);   --accent-strong: var(--color-blue-700);
                           --accent-soft: var(--color-blue-50); --accent-line: var(--color-blue-100); }
[data-area="verbal"]     { --accent: var(--color-orange-600); --accent-strong: var(--color-orange-700);
                           --accent-soft: var(--color-orange-50); --accent-line: var(--color-orange-100); }

.tnum { font-variant-numeric: tabular-nums; }
```

> Con estos tokens, la implementación en Tailwind 4 queda casi mecánica: `bg-surface`, `text-ink-2`, `border-line`, `rounded-card`, `shadow-sheet`, `data-area` para el acento contextual y las utilidades del sistema para el resto.
