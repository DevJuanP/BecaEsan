# 02 — Requerimientos funcionales

Aplicación: simulador de la prueba de preselección (Beca BCP / ESAN), descrita en [`01-vision-y-alcance.md`](01-vision-y-alcance.md). Este documento define los requisitos funcionales (**RF**), las reglas de negocio (**RN**) y los criterios de aceptación (**CA**) por módulo.

Prioridad: **M** (Must) · **S** (Should) · **C** (Could, candidato a fase 2).

---

## M1. Home y nombre del usuario

### RF-01 — Saludo editable «Hola …» (M)

- **RF-01.1** Al abrir la app (pantalla Home) se muestra un saludo:
  - sin nombre guardado → **«Hola»**;
  - con nombre guardado → **«Hola, {nombre}»**.
- **RF-01.2** Junto al saludo se muestra un **icono de lápiz**. Al pasar el cursor (*hover*) o enfocarlo con teclado (escritorio) muestra el texto **«Pon aquí tu nombre»**. En pantallas táctiles no existe hover: el icono se comporta como botón y lleva `aria-label="Pon aquí tu nombre"`.
- **RF-01.3** Al pulsar el lápiz (o el saludo completo) se abre una **modal** con el título «¿Cómo te llamas?», un campo de texto (con foco automático), botón **«Guardar»** y botón/acción **«Cancelar»**.
- **RF-01.4** Validación del campo:
  - se recortan los espacios al inicio y al final (`trim`);
  - máximo **30 caracteres**;
  - si al guardar queda vacío, se **elimina** el nombre (el saludo vuelve a «Hola»);
  - la modal solo se cierra con «Guardar» (con o sin nombre), «Cancelar», la X, `Escape` o toque fuera del cuadro (estos dos últimos equivalen a cancelar).
- **RF-01.5** La modal muestra ayuda breve: «Máx. 30 caracteres».

**CA:**
- Guardar «Ana» → el saludo pasa a «Hola, Ana» inmediatamente.
- Recargar la página → el saludo sigue mostrando «Hola, Ana».
- Cancelar con texto escrito → el nombre anterior no cambia.

### RF-02 — Persistencia del nombre (M)

- El nombre se guarda en el **almacenamiento local** del navegador (ver claves propuestas en `03-modelo-de-datos.md`, §3.5).
- Si no hay nombre guardado o el almacenamiento no está disponible, la app funciona igual (saludo «Hola»), sin errores visibles.

---

## M2. Panel de configuración

El panel de configuración vive en la misma pantalla Home, debajo del saludo (ver wireframe en `05-pantallas-y-ui.md`).

### RF-03 — Modo del quiz (M)

- Control de selección única con tres opciones:
  - **«Solo Matemático»** (solo RM),
  - **«Solo Verbal»** (solo RV),
  - **«Completo»** (RM + RV).
- Valor inicial: **Completo**.
- Al cambiar de modo, la sección de configuración del área no incluida se **oculta** (sus valores se conservan por si se vuelve a activar).

**CA:** con «Solo Verbal», la sección de RM no es visible y el quiz generado no contiene bloques de RM.

### RF-04 — Slider de cantidad de temas de RM (M)

- **Slider horizontal** (control deslizante) con:
  - rango **1 a 17**, paso 1, entero;
  - valor inicial: **8**;
  - etiqueta: «Temas de Razonamiento Matemático» + nota «se eligen al azar»;
  - valor visible durante todo el uso: **«{k} de 17»** (no depende de hover).
- Los **k** temas se eligen al azar según RN-02.

### RF-05 — Slider de cantidad de temas de RV (M)

- Igual que RF-04 con:
  - rango **1 a 11**, valor inicial **5**, valor visible «{k} de 11»;
  - etiqueta: «Temas de Razonamiento Verbal».

### RF-06 — Slider de preguntas por tema (M)

- **Un único slider horizontal** que aplica a **ambas áreas**:
  - rango **1 a 5**, valor inicial **2**;
  - etiqueta: «Preguntas por tema» + nota «se eligen al azar»;
  - valor visible: **«{q} de 5»**.
- Las **q** preguntas de cada tema se eligen al azar según RN-04.

### RF-07 — Puntajes configurables (M)

- Tres campos numéricos enteros, cada uno con su etiqueta:

| Campo | Descripción | Valor inicial |
|---|---|---|
| «Puntos por respuesta correcta» | Puntos que suma cada acierto. | **5** |
| «Puntos por pregunta no respondida» | Puntos que suma cada pregunta en blanco. | **0** |
| «Puntos por respuesta incorrecta» | Puntos que suma cada error (admite negativos, con signo visible). | **−2** |

- Aceptan **números enteros** (positivos, cero o negativos). Rango permitido: **−999 a 999**.
- Controles cómodos para táctil: botones **−** y **+** (paso 1) junto al campo, con edición manual posible (teclado numérico en móvil).
- Validación: si un campo queda **vacío o inválido**, se marca en error, se muestra un mensaje breve y el botón «Iniciar quiz» queda **deshabilitado** hasta corregirlo.

### RF-08 — Resumen estimado del quiz (S)

- Debajo de los controles se muestra una línea de resumen que se recalcula en vivo, p. ej.:
  - «Completo · 13 temas · 26 preguntas»
  - «Solo Matemático · 8 temas · 16 preguntas»
- Fórmula: preguntas = (temasRM × q si RM incluida) + (temasRV × q si RV incluida).

### RF-09 — Botón «Iniciar quiz» (M)

- Ubicado **al final del panel**; en móvil queda **fijo (sticky) en la parte inferior** de la pantalla mientras se desplaza el panel, siempre visible.
- Habilitado solo si la configuración es válida (RF-07).
- Al pulsarlo: genera el **intento** (RN-01 a RN-06) y navega a la pantalla del quiz (bloque 1).

### RF-10 — Conservación de la configuración (M)

- Al volver al panel (botón «Home» desde resultados), se conservan **todos** los valores configurados en el intento anterior (modo, sliders y puntajes). No se resetea a los valores iniciales.
- Solo un reinicio manual de la app (recarga de página) vuelve a los valores iniciales.

### RF-11 — Persistencia de la configuración entre recargas (C)

- Candidato a fase 2: guardar la última configuración en almacenamiento local para recuperarla tras una recarga. En v1 no es obligatorio.

---

## M3. Generación del intento (reglas de negocio)

> Estas reglas se ejecutan al pulsar «Iniciar quiz» y son el corazón «aleatorio» del simulador.

### RN-01 — Snapshot inmutable (M)

Al iniciar, se crea un **snapshot** con: modo, cantidad de temas por área, preguntas por tema, puntajes y los bloques generados. Cambios posteriores en la configuración (solo posibles fuera del quiz) **no** afectan al intento en curso.

### RN-02 — Selección aleatoria de temas, sin repetición (M)

- Para cada área incluida se elige al azar un conjunto de **k temas distintos** entre los disponibles:
  - RM: k ∈ [1, 17]; RV: k ∈ [1, 11].
- Si k = total de temas del área, se incluyen **todos** (igual se barajan).
- Selección uniforme **sin repetición** (sugerencia de implementación: mezcla Fisher–Yates y tomar los primeros k).

### RN-03 — Orden de los bloques (M)

- Todos los bloques de **RM primero** (en orden barajado) y **después** todos los de RV (en orden barajado). Nunca intercalados.
- Consecuencia de diseño: el distintivo de área del quiz cambia **una sola vez** durante un intento completo.

### RN-04 — Selección aleatoria de preguntas por tema (M)

- De las **5 preguntas** de cada tema se elige un subconjunto de **q preguntas distintas** al azar:
  - q = 5 → todas, sin barajar el orden interno del archivo (se mantiene 1→5);
  - q < 5 → subconjunto aleatorio; se renumera 1..q en el bloque.

### RN-05 — Sin memoria entre intentos (M)

- Cada «Iniciar quiz» genera un conjunto nuevo. Pueden repetirse temas o preguntas de intentos anteriores; no hay ningún estado que lo impida.

### RN-06 — Las alternativas no se barajan (M)

- Dentro de cada pregunta, las opciones A–E se muestran **en el orden del material** y la clave no cambia. (Barajar alternativas queda como candidato a fase 2.)

---

## M4. Pantalla de quiz (ejecución)

### RF-12 — Cabecera del bloque (M)

- Cabecera informativa del bloque actual, siempre visible mientras se hace scroll (sticky):
  - **área actual**, destacada: «Razonamiento Matemático» o «Razonamiento Verbal y Comunicación»; es el dato que responde a «qué tipo de pregunta es»;
  - **progreso** (S): «Bloque X de Y»;
  - **cronómetro** (M): según RF-16.

### RF-13 — Contenido del bloque (M)

En el cuerpo del bloque se muestra, en este orden:

1. **Título de la temática** (tal como aparece en el material, p. ej. «Comprensión de lectura»).
2. **Texto común** (si el tema lo tiene; hoy solo Comprensión de lectura): el texto se muestra **una vez** antes de sus preguntas.
3. **Las q preguntas** elegidas para el intento, **numeradas 1..q**, cada una con su enunciado y sus **5 alternativas (A–E)**.

### RF-14 — Responder (M)

- Cada pregunta admite **una sola** alternativa seleccionada.
- El usuario puede **cambiar** su selección cuantas veces quiera mientras el bloque esté visible, y puede **dejar preguntas en blanco**.
- **No** se muestra ninguna retroalimentación de correcto/incorrecto durante el quiz.
- El estado seleccionado debe ser inequívoco (color/forma, no solo hover).

### RF-15 — Navegación entre bloques (M)

- **«Continuar»**: guarda las respuestas del bloque actual y avanza al siguiente.
- **«Atrás»**: retrocede al bloque anterior; las respuestas ya dadas se **conservan** y son editables. No existe en el primer bloque.
- En el **último bloque**, el botón principal («Continuar») se sustituye por **«Ver resultados»** (ver RF-17).
- Ambos botones viven en una **barra fija inferior** (ver `05-pantallas-y-ui.md`), cómoda para el pulgar.

### RF-16 — Cronómetro informativo (M)

- Inicia cuando aparece el **primer bloque** (justo después de pulsar «Iniciar quiz»).
- Se muestra en la cabecera en formato **m:ss** (y **h:mm:ss** si supera 1 hora).
- **No** impone límite, no pausa y no entrega automáticamente.
- Se detiene al entrar a la pantalla de resultados.

### RF-17 — Confirmación por preguntas en blanco (S)

- Al pulsar «Ver resultados»:
  - si **no** hay preguntas sin responder → se pasa directo a resultados;
  - si **hay**, se muestra una modal: «Tienes X preguntas sin responder (RM: a · RV: b)» con dos acciones:
    - **«Volver a revisar»** → cierra la modal y permite seguir en el quiz;
    - **«Ver resultados igualmente»** → calcula y muestra resultados.
- Los porcentajes del texto solo incluyen las áreas activas del intento.

### RF-18 — Aviso al salir a mitad del intento (S)

- Si el usuario intenta recargar o cerrar la pestaña durante el quiz, se advierte que el progreso se perderá (mecanismo del navegador, p. ej. `beforeunload`, sujeto a soporte móvil). Aplica solo a mitad de quiz.

---

## M5. Resultados

### RN-07 — Clasificación de cada pregunta (M)

Con las respuestas del intento y la clave del material, cada pregunta se clasifica:

| Clasificación | Condición |
|---|---|
| **Correcta** | El usuario seleccionó la alternativa de la clave. |
| **Incorrecta** | El usuario seleccionó una alternativa distinta a la clave. |
| **No respondida** | El usuario no seleccionó ninguna alternativa. |

### RN-08 — Puntaje (M)

- Con los puntajes configurados (`pc` = correcta, `pnr` = no respondida, `pi` = incorrecta):
  - **Puntaje por área** = (correctas × pc) + (no respondidas × pnr) + (incorrectas × pi).
  - **Puntaje total** = suma de los puntajes de las áreas incluidas.
- El puntaje puede ser **negativo** (p. ej. si hubo muchos errores con `pi` negativo).

### RN-09 — Porcentajes por área (M)

- Para cada área incluida, con **T** = total de preguntas de esa área en el intento:
  - **% de aciertos** = correctas ÷ T × 100;
  - **% de erróneas** = incorrectas ÷ T × 100;
  - **% de no respondidas** = no respondidas ÷ T × 100.
- Se muestran como **porcentajes enteros** y se usa redondeo armónico (método del mayor resto) para que **los tres sumen 100 %** exactamente.

### RN-10 — Denominadores correctos (M)

- Todos los porcentajes y puntajes «por área» usan como base las preguntas de **esa área dentro del intento** (no el total global).

### RN-11 — Áreas no incluidas (M)

- Las áreas que no formaron parte del intento **no aparecen** en los resultados. Ej.: en modo «Solo Verbal», no se muestra ningún dato de RM.

### RF-19 — Cálculo al ver resultados (M)

- El cálculo (RN-07 a RN-10) se ejecuta al confirmar «Ver resultados» y produce el objeto de resultados del intento (ver `03-modelo-de-datos.md`, §3.3). No requiere red.

### RF-20 — Pantalla de resultados (M)

La pantalla muestra:

1. **Puntaje total** del intento, calculado con la escala configurada (M). Además, la **escala usada** de forma visible, p. ej. «Escala: +5 · 0 · −2».
2. **Tarjeta por cada área incluida** (M), con:
   - nombre del área;
   - **puntaje del área**;
   - **% de aciertos**, **% de erróneas** y **% de no respondidas**;
   - conteos de apoyo, p. ej. «12 de 15 correctas», «2 incorrectas», «1 no respondida».
3. **Tiempo total** del intento (S), tomado del cronómetro (formato m:ss / h:mm:ss).
4. Recordatorio breve de la configuración del intento (S): p. ej. «Completo · 13 temas · 2 preguntas por tema».
5. Saludo con el nombre si existe (S): p. ej. «¡Buen trabajo, Juan!».

### RF-21 — Botón «Home» (M)

- Al final de los resultados, un botón **«Home»** vuelve al panel de configuración.
- Se conservan el nombre y la configuración usada (RF-10). El intento visualizado se descarta; el próximo «Iniciar quiz» genera un intento **nuevo** (RN-05).

### RF-22 — Revisión de respuestas (M)

- En Resultados, un botón **«Mostrar respuestas correctas»** despliega la revisión del intento; el mismo botón cambia a **«Ocultar respuestas correctas»** y la revisión empieza cerrada.
- La revisión cubre **todas** las preguntas del intento y las agrupa por área y por tema, en el orden del quiz. Solo aparecen las áreas incluidas (RN-11).
- Si el tema tiene texto común (Comprensión de lectura), se ofrece un desplegable **«Texto»** dentro de su bloque.
- Cada pregunta muestra:
  - su estado: **«Correcta»**, **«Incorrecta»** o **«No respondida»**;
  - el enunciado y, si hubo respuesta, la letra marcada y la clave;
  - las cinco alternativas A–E, con la correcta señalada y, cuando corresponde, la elegida por el usuario;
  - la **explicación** de la clave.
- Cada pregunta se despliega y se pliega de forma individual (acordeón); el botón general muestra u oculta la revisión completa.
- La revisión es **solo lectura**: no altera respuestas, puntaje ni configuración, y no cambia RF-14 (el quiz sigue sin retroalimentación).
- Al volver a Home, el intento y su revisión se descartan (RF-21, RN-05).
- El estado se comunica con texto e icono, nunca solo con color; el botón y cada acordeón se operan con teclado y exponen su estado expandido.

**CA:**
- Acertar la pregunta 1 y fallar la 2: la 1 aparece «Correcta» con su clave; la 2, «Incorrecta» con la elegida y la correcta.
- Dejar una pregunta en blanco: aparece «No respondida» y muestra la alternativa correcta y la explicación.
- Abrir el acordeón de una pregunta muestra sus cinco alternativas con la correcta marcada y la explicación; las demás siguen cerradas.
- Volver a Home y generar un intento nuevo: no queda rastro de la revisión anterior.
- Comprensión de lectura: el desplegable «Texto» del tema está disponible dentro de la revisión.

---

## M6. Casos borde y reglas transversales

| # | Caso | Comportamiento esperado |
|---|---|---|
| E-01 | RM con k = 17 temas | Se incluyen los 17 temas, en orden aleatorio (85 preguntas si q = 5). |
| E-02 | q = 5 | Cada bloque incluye las 5 preguntas completas. |
| E-03 | Configuración mínima (k = 1, q = 1) | Intento de 1 pregunta por área incluida; resultados con T = 1 (porcentajes 100/0/0 o 0/100/0, etc.). |
| E-04 | Quiz en blanco | Puntaje = T × pnr; % no respondidas = 100 %; % aciertos y erróneas = 0 %. |
| E-05 | Escala 0 / 0 / 0 | Puntaje total y por área = 0; los porcentajes se calculan igual. |
| E-06 | Comprensión de lectura con q < 5 | El texto común se muestra igual; solo cambian las preguntas mostradas. |
| E-07 | Ir «Atrás» y cambiar respuestas | Las respuestas editadas son las que se usan para el cálculo final. |
| E-08 | Nombre vacío o solo espacios | Se elimina el nombre; sin errores. |
| E-09 | Puntajes con signo negativo | Se muestran con signo (p. ej. «−2») y se usan tal cual en el cálculo. |
| E-10 | Texto con símbolos del material (π, ≈, ×, ², S/) | Se renderizan tal cual; sin transformaciones. |
