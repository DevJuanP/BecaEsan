# 04 — Flujos

Diagramas de flujo y de navegación de la aplicación. Los identificadores **RF-xx / RN-xx** refieren a `02-requerimientos-funcionales.md`; el modelo de datos, a `03-modelo-de-datos.md`.

## 4.1 Navegación global

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Home
    Home --> ModalNombre : tocar el lápiz
    ModalNombre --> Home : guardar / cancelar
    Home --> Quiz : Iniciar quiz
    Quiz --> Quiz : Continuar / Atrás / responder
    Quiz --> ModalSinResponder : Ver resultados con preguntas en blanco
    ModalSinResponder --> Quiz : Volver a revisar
    ModalSinResponder --> Resultados : Ver resultados igualmente
    Quiz --> Resultados : Ver resultados sin pendientes
    Resultados --> Home : botón Home
```

Reglas de navegación:

- **Home** es el punto de entrada y de retorno: saludo + panel de configuración (RF-01 a RF-11).
- El **quiz** solo se abandona de dos formas: ver resultados o recargar/cerrar la página (se pierde el intento; aviso previo si es posible, RF-18).
- **Resultados** no tiene navegación hacia atrás: solo el botón **Home** (RF-21).
- Al volver a Home se **conserva** la configuración del intento anterior (RF-10) y el nombre (RF-02).

## 4.2 Flujo del nombre (Home)

```mermaid
sequenceDiagram
    actor U as Usuario
    participant H as Home
    participant M as Modal de nombre
    participant LS as Almacenamiento local

    U->>H: toca el lápiz (o saludo)
    H->>M: abre modal con el nombre actual (si existe)
    U->>M: escribe un nombre
    alt Guardar con texto
        M->>M: valida (trim, máx. 30)
        M->>LS: guarda beca-esan.nombre
        M->>H: cierra y saluda «Hola, {nombre}»
    else Guardar vacío
        M->>LS: elimina beca-esan.nombre
        M->>H: cierra y saluda «Hola»
    else Cancelar / Escape / toque fuera
        M->>H: cierra sin cambios
    end
```

Notas: en escritorio el lápiz muestra el tooltip «Pon aquí tu nombre» al hover/focus (RF-01.2); en táctil, el toque abre la modal directamente.

## 4.3 Flujo de configuración e inicio del quiz (Home)

```mermaid
flowchart TD
    A(["Home: panel de configuración"]) --> B{"Elegir modo"}
    B -->|"Solo Matemático"| C["Mostrar sección RM (ocultar RV)"]
    B -->|"Solo Verbal"| D["Mostrar sección RV (ocultar RM)"]
    B -->|"Completo"| E["Mostrar sección RM y sección RV"]
    C --> F["Ajustar sliders: temas y preguntas por tema"]
    D --> F
    E --> F
    F --> G["Ajustar puntajes (correcta / no respondida / incorrecta)"]
    G --> H{"¿Puntajes válidos?"}
    H -->|"No"| I["Marcar error · 'Iniciar quiz' deshabilitado"]
    I --> G
    H -->|"Sí"| J["'Iniciar quiz'"]
    J --> K(["Crear intento (flujo 4.4)"])
```

Notas: los sliders de temas del área oculta conservan su valor (RF-03); el resumen estimado se recalcula en vivo (RF-08); el botón «Iniciar quiz» es sticky en móvil (RF-09).

## 4.4 Flujo de generación del intento (al pulsar «Iniciar quiz»)

```mermaid
flowchart TD
    S(["Iniciar quiz"]) --> SNAP["Snapshot de la configuración (RN-01)"]
    SNAP --> AREA{"Áreas incluidas según modo"}
    AREA -->|"RM"| RM1["Barajar los 17 temas de RM y tomar k_RM (RN-02)"]
    AREA -->|"RV"| RV1["Barajar los 11 temas de RV y tomar k_RV (RN-02)"]
    RM1 --> RM2["Por cada tema: elegir al azar q de sus 5 preguntas (RN-04)"]
    RV1 --> RV2["Por cada tema: elegir al azar q de sus 5 preguntas (RN-04)"]
    RM2 --> ORD["Ordenar bloques: primero RM barajado, luego RV barajado (RN-03)"]
    RV2 --> ORD
    ORD --> GO(["Mostrar bloque 1 · arrancar cronómetro (RF-16)"])
```

Ejemplo verificado con el material actual: modo Completo, RM 10 temas y RV 5 temas, q = 3 → 15 bloques, 45 preguntas; 10 temas distintos de 17 y 5 distintos de 11; 3 preguntas distintas por tema.

## 4.5 Flujo del quiz (por bloques)

```mermaid
flowchart TD
    A(["Bloque actual visible"]) --> B["Cabecera: área + progreso + cronómetro"]
    B --> C["Título del tema (+ texto común si aplica)"]
    C --> D["Preguntas 1..q con alternativas A–E"]
    D --> E{"Acción del usuario"}
    E -->|"Toca una alternativa"| F["Selecciona/edita la respuesta (sin feedback)"]
    F --> E
    E -->|"Atrás (si no es el primero)"| G["Bloque anterior · respuestas conservadas (RF-15)"]
    G --> A
    E -->|"Continuar (si no es el último)"| H["Siguiente bloque"]
    H --> A
    E -->|"Ver resultados (último bloque)"| I{"¿Hay preguntas sin responder?"}
    I -->|"No"| K(["Calcular resultados (flujo 4.6)"])
    I -->|"Sí"| J["Modal: 'Tienes X preguntas sin responder' (RF-17)"]
    J -->|"Volver a revisar"| A
    J -->|"Ver resultados igualmente"| K
```

Notas:

- El cronómetro corre de forma continua entre bloques (RF-16).
- ir «Atrás» no borra nada: las respuestas del bloque actual ya están registradas (RF-15).
- La confirmación de RF-17 solo aparece en el último bloque, al pulsar «Ver resultados».

## 4.6 Flujo de cálculo de resultados

```mermaid
flowchart TD
    A(["Ver resultados"]) --> B["Detener cronómetro (RF-16)"]
    B --> C["Clasificar cada pregunta: correcta / incorrecta / no respondida (RN-07)"]
    C --> D["Por área incluida: contar C, I, NR y calcular puntaje (RN-08)"]
    D --> E["Puntaje total = suma de puntajes por área (RN-08)"]
    E --> F["Porcentajes por área con redondeo a 100 % (RN-09)"]
    F --> G["Tiempo total = terminadoEn − iniciadoEn (RF-20)"]
    G --> H(["Mostrar pantalla de resultados"])
```

## 4.7 Flujo de resultados a un nuevo intento

```mermaid
flowchart LR
    A(["Resultados"]) --> B["Botón Home (RF-21)"]
    B --> C["Home con nombre y configuración conservados (RF-10)"]
    C --> D["Ajustar lo que se quiera"]
    D --> E["Iniciar quiz"]
    E --> F(["Intento nuevo y distinto (RN-05)"])
```

Notas: no hay historial; el intento anterior se descarta al iniciar el siguiente. El usuario puede repetir con la misma configuración y aun así recibir temas y preguntas diferentes (si el azar lo permite).
