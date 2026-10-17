# 05 — Pantallas y UI

Estructura y comportamiento de cada pantalla y componente. El **estilo visual** (colores, tipografía, iconografía, estilo exacto de los sliders) se definirá en `07-design.md`; aquí solo se fija lo funcional y lo estructural, con foco **mobile-first**.

---

## 5.1 Principios de layout (mobile-first)

1. **Base móvil:** diseño y validación primero en ancho 360–430 px; en pantallas grandes, una sola columna centrada con ancho máximo (~720 px) y márgenes mayores. Sin diseños de dos columnas en móvil.
2. **Sin scroll horizontal** en ningún viewport; elementos largos (textos de lectura) hacen salto de línea normal.
3. **Zona del pulgar:** las acciones principales («Iniciar quiz», «Continuar», «Atrás», «Home») viven en **barras fijas inferiores** o al final del contenido, siempre alcanzables.
4. **Táctil:** controles ≥ 44×44 px de área efectiva; separación entre alternativas; ningún gesto obligatorio más allá de tocar y desplazarse.
5. **Sin hover obligatorio:** todo lo que en escritorio usa hover (tooltip del lápiz) tiene equivalente táctil (toque) y etiqueta accesible.
6. **Jerarquía simple:** 1 título por pantalla, 1 acción primaria visible; el resto, secundario.
7. **Estados siempre claros:** seleccionado / no seleccionado / deshabilitado / error no dependen solo del color (ícono o forma de refuerzo).
8. **Confort de lectura:** texto base ≥ 16 px; interlineado cómodo; los enunciados y textos largos nunca en itálica ni gris claro.

---

## 5.2 Pantalla 1 — Home: saludo + panel de configuración

```
┌──────────────────────────────────────┐
│  Hola, Juan ✏️                        │  ← saludo + lápiz (RF-01)
│                                      │
│  Configura tu quiz                   │
│  ┌────────────────────────────────┐  │
│  │ MODO DEL QUIZ                  │  │
│  │ [Matemático] [Verbal] [Completo]│ │  ← selección única (RF-03)
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 8 de 17 temas se eligen al azar│  │
│  │ Temas de Razonamiento          │  │
│  │ Matemático            8 de 17  │  │
│  │ ●━━━━━━━○──────────────        │  │  ← slider horizontal (RF-04)
│  │ Temas de Razonamiento          │  │
│  │ Verbal                5 de 11  │  │
│  │ ●━━━━○─────────────────        │  │  ← slider horizontal (RF-05)
│  │ Preguntas por tema    2 de 5   │  │
│  │ ●━○────────────────────        │  │  ← slider único (RF-06)
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ PUNTAJES                       │  │
│  │ Correcta        [−]  5  [+]    │  │
│  │ No respondida   [−]  0  [+]    │  │  ← RF-07 (defaults 5 / 0 / −2)
│  │ Incorrecta      [−] −2  [+]    │  │
│  └────────────────────────────────┘  │
│  Completo · 13 temas · 26 preguntas  │  ← resumen en vivo (RF-08, S)
│                                      │
│  ┌────────────────────────────────┐  │
│  │         Iniciar quiz           │  │  ← sticky al fondo (RF-09)
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

Comportamiento:

- Al elegir «Solo Matemático» / «Solo Verbal», la sección de sliders del área no incluida se **oculta**; el slider de preguntas por tema y los puntajes permanecen siempre visibles.
- «Iniciar quiz» se mantiene visible (sticky) mientras se desplaza el panel y se deshabilita si algún puntaje es inválido (RF-07).
- En pantallas grandes, el mismo layout en una columna centrada; el CTA puede dejar de ser sticky si todo el contenido cabe.

**Componente slider (horizontal)** — estilo de referencia visual: [CodePen zYqRKBN](https://codepen.io/akex-jester/pen/zYqRKBN) (akex-jester). Requisitos:

- Es un control deslizante horizontal continuo (arrastre/tap), paso 1, siempre entero.
- El **valor es visible en todo momento** (texto «{k} de {máximo}» junto a la etiqueta) y además una **burbuja sobre el pulgar** acompaña al valor mientras se arrastra (detalle visual final en `07-design.md`).
- Pulgar grande y fácil de agarrar; el área táctil del control debe extenderse más allá del track visible.
- Accesible: operable con teclado (flechas) y anunciado correctamente (p. ej. `aria-valuetext="8 de 17 temas"`).
- Etiqueta superior siempre visible: «Temas de Razonamiento Matemático» (1–17), «Temas de Razonamiento Verbal» (1–11), «Preguntas por tema» (1–5).

**Componente puntajes** — cada fila: etiqueta, botón `−`, campo numérico editable (entero, admite negativos), botón `+`. En móvil se abre teclado numérico; el signo se muestra explícitamente («−2»). Estado de error: borde/aviso + «Iniciar quiz» deshabilitado.

## 5.3 Modal de nombre

```
┌──────────────────────────────┐
│  ¿Cómo te llamas?        ✕   │
│                              │
│  ┌────────────────────────┐  │
│  │ Juan                   │  │  ← foco automático, máx. 30
│  └────────────────────────┘  │
│  Máx. 30 caracteres          │
│                              │
│  [ Cancelar ]   [ Guardar ]  │
└──────────────────────────────┘
```

- Se abre al tocar el lápiz o el saludo (RF-01.3).
- Cierre: Guardar (aplica), Cancelar / X / `Escape` / toque fuera (descarta) (RF-01.4).
- Foco: entra al campo al abrir; queda contenido dentro de la modal; al cerrar vuelve al lápiz.
- Guardar vacío = eliminar nombre («Hola»).

## 5.4 Pantalla 2 — Quiz (un bloque por temática)

```
┌──────────────────────────────────────┐
│ RAZONAMIENTO MATEMÁTICO · Bloque 3/13│  ← cabecera fija (RF-12)
│                          ⏱ 04:32     │  ← cronómetro (RF-16)
├──────────────────────────────────────┤
│ Razones y proporciones               │  ← título del tema (RF-13)
│                                      │
│ 1. Dos números son entre sí como 2 es│
│    a 3. Si la suma de sus cuadrados  │
│    es 52, ¿cuál es el mayor?         │
│    ○ A) 4    ● B) 6    ○ C) 8        │  ← una sola selección (RF-14)
│    ○ D) 9    ○ E) 12                 │
│                                      │
│ 2. Las edades de Ana y Beto están…   │
│    ○ A) 8  ○ B) 10 …                 │
│                                      │
├──────────────────────────────────────┤
│ [   Atrás   ]      [   Continuar  ]  │  ← barra fija inferior (RF-15)
└──────────────────────────────────────┘
```

Reglas del bloque:

- La cabecera muestra el **área actual** (RM o RV) de forma destacada: es la respuesta a «¿qué tipo de pregunta es?». Cambia a RV solo al pasar del último bloque de RM (RN-03).
- Si el tema es **Comprensión de lectura**, el texto común se muestra **una vez**, entre el título y la primera pregunta, con tratamiento de lectura cómodo (párrafos, ancho de línea controlado).
- Preguntas numeradas **1..q** dentro del bloque; alternativas en el orden del material (RN-06).
- Estado de alternativa: no seleccionada / **seleccionada** (marcada con relleno + forma, no solo color); sin feedback de acierto.
- Botonera inferior fija:
  - primer bloque → solo **[ Continuar ]** (ocupa el ancho disponible);
  - bloques intermedios → **[ Atrás ] [ Continuar ]**;
  - último bloque → **[ Atrás ] [ Ver resultados ]** (acción principal destacada).
- El área nunca es menos que 44 px; la barra inferior respeta el *safe area* del dispositivo (notch).

## 5.5 Modal de preguntas sin responder

- Aparece solo al pulsar «Ver resultados» con preguntas en blanco (RF-17).
- Texto: «Tienes **X** preguntas sin responder» + detalle «RM: a · RV: b» (solo áreas activas).
- Acciones: **«Volver a revisar»** (secundaria) y **«Ver resultados igualmente»** (primaria).

## 5.6 Pantalla 3 — Resultados

```
┌──────────────────────────────────────┐
│  Resultados                          │
│  ¡Buen trabajo, Juan!                │  ← si hay nombre (RF-20.5, S)
│                                      │
│         PUNTAJE TOTAL                │
│            102                       │  ← héroe de la pantalla (RF-20.1)
│   Escala: +5 · 0 · −2 ★  Tiempo 41:07│
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Razonamiento Matemático        │  │
│  │ 12 de 15 correctas    │  80 %  │  │
│  │ 2 incorrectas         │  13 %  │  │  ← tarjeta por área (RF-20.2)
│  │ 1 no respondida       │   7 %  │  │
│  │ Puntaje del área: 56           │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ Razonamiento Verbal            │  │
│  │ 8 de 11 correctas     │  73 %  │  │
│  │ …                              │  │
│  └────────────────────────────────┘  │
│  Completo · 13 temas · 2 preg. / tema│  ← recordatorio config (S)
│                                      │
│  ┌────────────────────────────────┐  │
│  │             Home               │  │  ← RF-21
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

Reglas:

- Áreas no incluidas **no aparecen** (RN-11) ni se mencionan.
- Cada tarjeta muestra siempre: puntaje del área, % de aciertos, % de erróneas y % de no respondidas, más conteos de apoyo (RF-20).
- Los porcentajes son enteros y suman 100 % (RN-09).
- «Home» conserva nombre y configuración (RF-10) y descarta el intento mostrado.

---

## 5.7 Mapa de estados (pantallas y componentes)

| Pantalla / componente | Estados | Notas |
|---|---|---|
| Home | sin nombre / con nombre | El lápiz siempre presente. |
| Sliders | en uso (burbuja visible) / reposo | Valor textual siempre visible; nunca dependiente de hover. |
| Puntajes | válido / inválido (vacío o fuera de rango) | Inválido → «Iniciar quiz» deshabilitado con explicación. |
| «Iniciar quiz» | habilitado / deshabilitado | Sticky en móvil. |
| Alternativa de respuesta | no seleccionada / seleccionada | Cambiable; sin feedback de corrección. |
| Botonera quiz | primer bloque / intermedio / último bloque | «Atrás» ausente en el primero; «Ver resultados» en el último. |
| Modal sin responder | visible / oculta | Solo si hay preguntas en blanco. |
| Resultados | por áreas incluidas | La escala usada siempre visible. |

## 5.8 Cubierto por `07-design.md`

> El diseño visual está definido en [`07-design.md`](07-design.md). Esta sección queda como **lista de verificación** de lo cubierto:

- Paleta y tokens (color de marca, fondo, superficies, estados, error, éxito).
- Tipografía (familia, escala, pesos) y espaciado (grid y radios).
- **Estilo exacto de los sliders** según la referencia [CodePen zYqRKBN](https://codepen.io/akex-jester/pen/zYqRKBN): track, relleno, pulgar y burbuja de valor; equivalente táctil.
- Iconografía (lápiz, cronómetro, flecha atrás, home) y tamaños.
- Estados visuales (hover solo escritorio, active/pressed, focus, disabled, selected).
- Tratamiento visual de las tarjetas de resultado y del puntaje héroe.
- Microinteracciones (transición entre bloques, feedback de selección) y su duración.
- Tema claro (obligatorio) y decisión sobre tema oscuro (candidato).
