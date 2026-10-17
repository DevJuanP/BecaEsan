# 01 — Visión y alcance

## 1.1 Contexto

La prueba de preselección de la **Beca BCP** en la Universidad **ESAN** evalúa dos componentes: **Razonamiento Matemático** (RM) y **Razonamiento Verbal y Comunicación** (RV), con preguntas de opción múltiple (A–E).

El proyecto ya cuenta con material de práctica completo en [`docs/preguntas/`](../preguntas/README.md):

- **28 temáticas** (archivos Markdown), cada una con **5 preguntas** y su clave con explicación.
  - Razonamiento Matemático: 17 temáticas → 85 preguntas.
  - Razonamiento Verbal: 11 temáticas → 55 preguntas.
  - **Total: 140 preguntas.**
- Temario oficial de referencia: [`docs/temario/TEMARIO-BCP-AGOSTO.pdf`](../temario/TEMARIO-BCP-AGOSTO.pdf).

Hoy ese material se practica de forma fija: leer archivo por archivo, en el orden del temario. Falta una herramienta que permita **simular la prueba** con condiciones configurables y preguntas variadas en cada intento.

## 1.2 Objetivo del producto

Una **aplicación web mobile-first** que genere y ejecute ensayos de opción múltiple a partir del material existente, con:

- selección **aleatoria** de temáticas y preguntas,
- puntuación **configurable** por el usuario,
- desarrollo del quiz **por bloques** (una temática a la vez),
- resultados con **puntaje y porcentajes por área**.

Principios del producto:

1. **Mobile-first de verdad:** se diseña primero para celular y luego se adapta a pantallas grandes (la mayoría de sesiones de práctica serán desde el teléfono).
2. **Cero fricción:** configurar un quiz y empezar debe tomar menos de un minuto.
3. **Sin infraestructura:** la v1 funciona sin backend ni cuentas; todo corre en el navegador.
4. **Contenido como fuente única de verdad:** las preguntas provienen de `docs/preguntas/`, sin duplicar ni reescribir contenido.
5. **Respuesta inmediata:** el banco es pequeño (~140 preguntas); cargar, iniciar y navegar debe sentirse instantáneo.

## 1.3 Usuario y contexto de uso

- **Usuario:** postulante a la Beca BCP (egresado de secundaria, tercio superior) que se prepara para la evaluación de preselección.
- **Contexto:** sesiones individuales de práctica, mayoritariamente en **celular**, de ~30–60 minutos, repetidas con frecuencia (varios intentos, idealmente con preguntas distintas cada vez).
- Un solo usuario por dispositivo; no hay perfiles ni cuentas en v1.

## 1.4 Alcance de la versión 1 (in scope)

1. **Home con saludo editable:** «Hola …» con icono de lápiz (tooltip «Pon aquí tu nombre»), modal para escribir el nombre y persistencia local.
2. **Panel de configuración** con:
   - Modo del quiz: **solo RM**, **solo RV** o **completo**.
   - Slider horizontal de cantidad de temas: RM 1–17, RV 1–11 (los temas se eligen al azar).
   - Slider horizontal único de preguntas por tema: 1–5 (las preguntas se eligen al azar).
   - Puntaje configurable por pregunta: correcta (default **+5**), no respondida (default **0**) e incorrecta (default **−2**), como campos numéricos enteros.
   - Botón **«Iniciar quiz»** al final del panel.
3. **Generación aleatoria del intento:** temas al azar sin repetición y en orden barajado; preguntas al azar por tema; primero todos los bloques de RM y después los de RV.
4. **Quiz por bloques:** una pantalla por temática con su título, sus preguntas del intento, alternativas A–E, cronómetro informativo y navegación «Atrás» / «Continuar» («Ver resultados» en el último bloque).
5. **Resultados:** puntaje con la escala configurada, porcentajes por área (% de aciertos, % de erróneas, % de no respondidas) y botón **«Home»** para volver a configurar otro quiz.

## 1.5 Fuera de alcance de la v1 (out of scope)

- Backend, cuentas de usuario o sincronización entre dispositivos.
- Historial persistente de intentos y estadísticas de progreso (candidato a fase 2).
- **Pantalla de revisión con clave y explicación por pregunta** (el material las tiene; candidato fuerte a fase 2).
- Temporizador con límite de tiempo o entrega automática (la v1 solo tiene cronómetro informativo).
- Edición del banco de preguntas desde la app.
- Multijugador, rankings o compartir resultados.
- Internacionalización (solo español).
- Modo offline/instalable (PWA): candidato si el stack elegido lo facilita.

> Los ítems marcados como **C** (Could) en `02-requerimientos-funcionales.md` amplían esta lista y no se implementan en v1 salvo decisión expresa.

## 1.6 Requisitos no funcionales

| ID | Requisito | Prioridad |
|---|---|---|
| RNF-01 | **Mobile-first:** todas las pantallas y componentes se diseñan y validan primero en viewports de celular (360–430 px). Ninguna función esencial depende de *hover*. | M |
| RNF-02 | **Elementos táctiles:** controles (botones, sliders, opciones de respuesta) con área táctil ≥ 44×44 px y separación suficiente para evitar toques accidentales. | M |
| RNF-03 | **Sin backend (v1):** la app debe poder publicarse como sitio estático; todo el estado vive en el navegador. | M |
| RNF-04 | **Persistencia local:** el nombre del usuario se guarda en el navegador y sobrevive recargas de página. | M |
| RNF-05 | **Rendimiento:** el banco completo (~140 preguntas) se carga una sola vez; iniciar el quiz y pasar de bloque no recarga la página ni introduce esperas perceptibles. | M |
| RNF-06 | **Accesibilidad básica:** textos legibles (≥ 16 px), contraste suficiente, foco visible, navegación por teclado (modal y sliders) y etiquetas accesibles (`aria-label`) donde no haya texto visible. | M |
| RNF-07 | **Idioma:** interfaz y contenido en español (es-PE); conservar tildes, «ñ» y símbolos matemáticos del material tal cual. | M |
| RNF-08 | **Contenido matemático:** en v1 se muestra como texto Unicode (π, ≈, ×, −, cm²), tal como está en el material. Sin renderizador LaTeX (candidato a fase 2). | M |
| RNF-09 | **Pérdida de progreso:** al recargar o cerrar la página a mitad del quiz se pierde el intento (v1); la app debe advertirlo si el navegador lo permite (prioridad S). | S |

## 1.7 Criterios de éxito de la v1 (Definition of Done)

1. Un usuario en celular puede completar el ciclo completo —nombre → configurar → resolver → ver resultados → volver al panel y repetir— sin ayuda externa y sin errores.
2. El puntaje y los porcentajes de resultados coinciden exactamente con las fórmulas configuradas (ver RN-07 a RN-10 en `02`).
3. La selección aleatoria cumple las reglas, verificado con casos: por ejemplo, RM con 10 temas → exactamente 10 temas distintos de 17; 3 preguntas por tema → 3 preguntas distintas por tema.
4. Ninguna pantalla exige zoom ni scroll horizontal en un celular de 360 px de ancho.
5. La configuración por defecto permite empezar de inmediato una sesión razonable (≈ 26 preguntas).

## 1.8 Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Sesiones largas (hasta 140 preguntas) difíciles de navegar en móvil. | Quiz por bloques cortos, cabecera con progreso, barra de navegación fija inferior, cronómetro informativo. |
| El formato de `docs/preguntas/` cambie y rompa la extracción de datos. | Contrato de datos explícito y validado al 100 % (ver `03`), con fallo temprano en la fase de construcción. |
| Texto largo de comprensión de lectura dentro de un bloque. | El texto se muestra una vez por bloque, con las preguntas debajo (ver `05`). |
| Funciones basadas en *hover* (tooltip del lápiz) no existen en pantallas táctiles. | En táctil, el lápiz es un botón explícito con `aria-label`; el tooltip es solo una mejora de escritorio. |
| Pérdida de progreso por recarga accidental. | Aviso de salida (prioridad S) y, como candidato a fase 2, guardado del intento en curso. |
