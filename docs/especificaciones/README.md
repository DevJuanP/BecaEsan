# Especificaciones — Simulador de la Prueba de Aptitud (Beca BCP / ESAN)

Este directorio contiene la **especificación** de la aplicación web que funcionará como **simulador de la prueba de preselección** de la Beca BCP en ESAN. El material de práctica ya existe en [`docs/preguntas/`](../preguntas/README.md): 28 temáticas con 140 preguntas y sus claves.

> **Estado:** especificación funcional y stack tecnológico definidos. Falta el diseño visual (`07-design.md`) y los planes de implementación. Todavía no existe código de la aplicación.

## Documentos

| # | Documento | Contenido |
|---|-----------|-----------|
| 01 | [Visión y alcance](01-vision-y-alcance.md) | Contexto, objetivo, usuario, alcance v1, fuera de alcance, requisitos no funcionales y criterios de éxito. |
| 02 | [Requerimientos funcionales](02-requerimientos-funcionales.md) | Requisitos numerados (RF), reglas de negocio (RN) y criterios de aceptación, por módulo. |
| 03 | [Modelo de datos](03-modelo-de-datos.md) | Formato del material fuente, modelo normalizado de preguntas, estado de la app y persistencia local. |
| 04 | [Flujos](04-flujos.md) | Diagramas de navegación y de proceso: nombre, configuración, generación del quiz, quiz y resultados. |
| 05 | [Pantallas y UI](05-pantallas-y-ui.md) | Estructura de cada pantalla, componentes y requisitos mobile-first. |
| 06 | [Stack tecnológico](06-stack.md) | ✅ Definido: Svelte 5 + Vite + TypeScript + Tailwind 4 · deploy gratuito en Cloudflare Pages. |
| — | `07-design.md` | ⏳ Pendiente: sistema visual (colores, tipografía, estilo de componentes). |

## Decisiones clave ya tomadas

Registro rápido; el detalle vive en cada documento.

1. **Una sola barra** de «preguntas por tema» (1–5) aplica a ambas áreas.
2. Si se eligen **menos de 5 preguntas por tema**, las preguntas se toman **al azar** entre las 5 del archivo.
3. El quiz tiene **botón Atrás**: se puede volver a bloques previos y cambiar respuestas.
4. **Cronómetro informativo** (sin límite de tiempo ni entrega automática).
5. **Valores iniciales por comodidad móvil**: modo Completo, RM 8 de 17 temas, RV 5 de 11 temas y 2 de 5 preguntas por tema (≈ 26 preguntas por intento).
6. Los temas se seleccionan y ordenan **al azar, sin repetición**, dentro de cada área.
7. **Mobile-first** es requisito transversal: cada pantalla y componente se diseña y valida primero en celular.
8. Puntajes por defecto: **+5 correcta · 0 no respondida · −2 incorrecta**.
9. **Stack:** Svelte 5 + Vite + TypeScript + Tailwind 4; SPA estática sin backend; deploy gratuito en Cloudflare Pages (detalle en `06-stack.md`).

## Convenciones de los documentos

- **RF-xx**: requisito funcional · **RN-xx**: regla de negocio · **RNF-xx**: requisito no funcional · **CA**: criterio de aceptación.
- Prioridad: **M** (Must — imprescindible en v1) · **S** (Should — deseable) · **C** (Could — candidato a fase 2).
- La interfaz está en español (es-PE).

## Glosario

| Término | Significado |
|---|---|
| **Área** | Componente de la prueba: *Razonamiento Matemático* (RM) o *Razonamiento Verbal y Comunicación* (RV). |
| **Temática (tema)** | Cada archivo de `docs/preguntas/` (28 en total: 17 de RM y 11 de RV). Contiene 5 preguntas. |
| **Bloque** | Pantalla del quiz que agrupa **un tema** con las preguntas elegidas para ese intento. Es la unidad de navegación del quiz. |
| **Intento** | Una ejecución completa del quiz: configuración usada, bloques generados, respuestas y resultados. |
| **No respondida** | Pregunta que quedó en blanco al ver los resultados (tiene puntaje propio configurable). |
| **Clave** | Respuesta correcta de cada pregunta, tomada de la sección «Clave de respuestas» del material. |
