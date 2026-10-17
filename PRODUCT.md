# PRODUCT.md — Simulador Beca BCP / ESAN

> Derivado de las especificaciones aprobadas (`docs/especificaciones/01`–`07`, octubre 2026). No agrega requisitos: si algo difiere, mandan las especificaciones.

## Qué es

App web estática (sin backend) que **simula la prueba de preselección de la Beca BCP en ESAN**: genera ensayos de opción múltiple (A–E) desde `docs/preguntas/` (28 temáticas · 140 preguntas) con selección aleatoria por bloques temáticos, puntaje configurable y resultados por área.

## Para quién y dónde

Un postulante practicando **solo, desde el celular**, en sesiones de 30–60 minutos, con varios intentos. El celular es el dispositivo principal; el escritorio es secundario.

## Job to be done

Configurar un quiz en menos de un minuto y resolver un ensayo cómodo en móvil que mida en serio (puntaje + porcentajes por área) y permita repetir con preguntas distintas.

## Modo de producto (impeccable)

**Operate** — el usuario completa una tarea (resolver y medir). Escaneabilidad, consistencia y expectativas móviles por encima de la expresión; la marca vive en los detalles precisos.

## Verdad de producto (no negociable)

- Fuente única de contenido: `docs/preguntas/` (no duplicar ni reescribir).
- Reglas del intento: RN-01…RN-11 de `02` — aleatoriedad sin repetición, bloques RM → RV, puntajes configurables, porcentajes por área que suman 100.
- Sin cuentas, sin backend, sin historial en v1 (fase 2 candidata: revisión con explicaciones).
- Presupuesto de rendimiento (`06`): ≤80 KB JS gzip inicial · ≤15 KB CSS · 0 KB de fuentes web · <1 s en 4G.

## Voz

Español es-PE, segunda persona, sentence case, sin emojis; tono de entrenador serio y alentador (deck completo en `07`, §7.11).

## Sistema visual

Definido en `docs/especificaciones/07-design.md` (concepto «instrumento de medición»; azul para RM, naranja para RV; tema claro). Cuando exista código, ese documento se materializa como `DESIGN.md` en la raíz del proyecto.

## Supuestos declarados

- La estética (paleta, forma, tipografía) es una decisión de diseño registrada y reversible vía tokens (`07`, §7.19).
- El uso previsto es personal (2–5 personas) y sin fines comerciales.
