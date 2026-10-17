# 03 — Modelo de datos

Describe (a) el **material fuente** que vive en `docs/preguntas/`, (b) el **modelo normalizado** que la aplicación necesita para operar, y (c) el **estado en tiempo de ejecución** (configuración, intento y resultados).

> La decisión de *cómo* se extrae el material (script de construcción vs. conversión manual) corresponde a la fase de stack (`06-stack.md`). Aquí se define el **contrato**: qué datos necesita la app y con qué garantías.

---

## 3.1 Material fuente (verificado)

```
docs/preguntas/
├── README.md                        ← índice del material (no se parsea)
├── razonamiento-matematico/         ← 17 archivos (01-… … 17-…)
│   ├── 01-razones-y-proporciones.md
│   ├── …                            ← cada archivo = 1 temática = 5 preguntas
│   └── 17-estadistica-y-probabilidad.md
└── razonamiento-verbal/             ← 11 archivos (01-… … 11-…)
    ├── 01-analogias.md
    ├── …
    └── 11-organizacion-de-ideas.md
```

Verificación realizada sobre los 28 archivos (formato 100 % consistente):

- Cada archivo tiene exactamente **5 preguntas** numeradas.
- Cada pregunta tiene exactamente **5 alternativas** (`A)`–`E)`).
- Cada archivo tiene una sección **«Clave de respuestas»** con una entrada por pregunta.
- Solo `razonamiento-verbal/03-comprension-de-lectura.md` tiene una sección **`## Texto`** (texto común para sus 5 preguntas).
- Total: **140 preguntas** (85 RM + 55 RV).

### Formato de archivo (reglas observadas)

1. Primera línea: `# {Título de la temática}` (título legible, p. ej. «Razones y proporciones»).
2. Líneas siguientes de metadatos (**no** se parsean; informativos): nivel, número de preguntas, sugerencia.
3. Separador `---`.
4. **Sección opcional `## Texto`**: uno o más párrafos de texto común que aplican a todas las preguntas del archivo (hoy solo en Comprensión de lectura).
5. Preguntas, cada una:
   - enunciado: comienza con `**{n}.**` (negrita y punto), en orden 1–5;
   - alternativas: cinco líneas `{A|B|C|D|E}) {texto}`.
6. Separador `---`.
7. `## Clave de respuestas`, con una línea por pregunta:
   - `**{n}. {LETRA} ({respuesta corta})** — {explicación}`,
   - la parte `({respuesta corta})` es **opcional** (p. ej. en Comprensión de lectura es `**1. B** — …`; en matemática suele ser `**1. B (6)** — …`).

### Tolerancias que el extractor debe manejar

- Acentos, «ñ», comillas angulares «…», símbolos matemáticos (π, ≈, ×, −, ², S/) y números con espacio fino (p. ej. «1 800»).
- Clave con paréntesis explicativa u omitida (ver arriba).
- El texto puede contener saltos de línea internos (párrafos).
- Espacios sobrantes al final de línea: se recortan.

### Fuera del contrato (la app no lo usa en v1)

- La **explicación** de la clave se extrae (es parte del material y se necesitará para la futura revisión), pero la v1 no la muestra.
- Metadatos de nivel/sugerencias: no se usan ni se muestran.

---

## 3.2 Modelo normalizado (requerido por la app)

La app consume una colección normalizada de **temáticas** con sus **preguntas**:

```ts
type Area = 'matematico' | 'verbal';
type Letra = 'A' | 'B' | 'C' | 'D' | 'E';

interface Opcion {
  letra: Letra;
  texto: string;          // «6», «≈ 3,14 cm²», «microscopio», …
}

interface Pregunta {
  id: string;             // "{temaId}#q{n}" — estable
  numero: number;         // 1..5 (orden dentro del archivo)
  enunciado: string;
  opciones: Opcion[];     // exactamente 5, en orden A..E
  correcta: Letra;        // clave del material
  explicacion: string;    // se extrae aunque v1 no la muestre
}

interface Tema {
  id: string;             // "razonamiento-matematico/01-razones-y-proporciones"
  area: Area;
  numero: number;         // 1..17 (RM) / 1..11 (RV), según el nombre del archivo
  titulo: string;         // «Razones y proporciones»
  textoComun: string | null; // texto largo compartido (solo Comprensión de lectura)
  preguntas: Pregunta[];  // exactamente 5
}
```

### Ejemplo (recortado) — tema «Razones y proporciones», pregunta 1

```json
{
  "id": "razonamiento-matematico/01-razones-y-proporciones",
  "area": "matematico",
  "numero": 1,
  "titulo": "Razones y proporciones",
  "textoComun": null,
  "preguntas": [
    {
      "id": "razonamiento-matematico/01-razones-y-proporciones#q1",
      "numero": 1,
      "enunciado": "Dos números son entre sí como 2 es a 3. Si la suma de sus cuadrados es 52, ¿cuál es el mayor de ellos?",
      "opciones": [
        { "letra": "A", "texto": "4" },
        { "letra": "B", "texto": "6" },
        { "letra": "C", "texto": "8" },
        { "letra": "D", "texto": "9" },
        { "letra": "E", "texto": "12" }
      ],
      "correcta": "B",
      "explicacion": "Si los números son 2k y 3k: (2k)² + (3k)² = 52 → 13k² = 52 → k² = 4 → k = 2. Los números son 4 y 6; el mayor es 6."
    }
  ]
}
```

---

## 3.3 Estado en tiempo de ejecución

### Configuración (panel Home)

```ts
type Modo = 'solo-rm' | 'solo-rv' | 'completo';

interface ConfigQuiz {
  modo: Modo;
  temasRM: number;          // 1..17
  temasRV: number;          // 1..11
  preguntasPorTema: number; // 1..5 (única para ambas áreas)
  puntos: {
    correcta: number;       // default 5
    noRespondida: number;   // default 0
    incorrecta: number;     // default -2
  };
}
```

Valores iniciales (primera apertura): `{ modo: 'completo', temasRM: 8, temasRV: 5, preguntasPorTema: 2, puntos: { correcta: 5, noRespondida: 0, incorrecta: -2 } }`.

### Intento (snapshot en el momento de «Iniciar quiz»)

```ts
interface BloqueIntento {
  area: Area;
  temaId: string;
  titulo: string;
  textoComun: string | null;   // copiado del tema si aplica
  preguntas: Pregunta[];       // subconjunto elegido (q), en el orden a mostrar
  respuestas: Record<string, Letra | null>; // clave: pregunta.id
}

interface Intento {
  id: string;                  // generado al iniciar (p. ej. timestamp)
  iniciadoEn: number;          // epoch ms
  config: ConfigQuiz;          // copia (snapshot) de la configuración
  bloques: BloqueIntento[];    // orden final: RM barajado y luego RV barajado
  indiceActual: number;        // bloque visible (0-based)
  terminadoEn: number | null;  // epoch ms al ver resultados (para el tiempo total)
}
```

Notas:

- El intento es **inmutable** salvo `respuestas` (edición permitida dentro de cada bloque) e `indiceActual`.
- `preguntas` guarda las referencias/copias necesarias para renderizar sin depender del banco global.

### Resultado (derivado, no persistido)

```ts
interface ResultadoArea {
  area: Area;
  total: number;
  correctas: number;
  incorrectas: number;
  noRespondidas: number;
  puntaje: number;             // fórmula RN-08
  porcentajes: {
    aciertos: number;          // enteros, suman 100 (RN-09)
    erroneas: number;
    noRespondidas: number;
  };
}

interface Resultado {
  puntajeTotal: number;
  areas: ResultadoArea[];      // solo áreas incluidas en el intento
  duracionMs: number;          // terminadoEn - iniciadoEn
  escala: { correcta: number; noRespondida: number; incorrecta: number };
}
```

El resultado se calcula al vuelo (RF-19) y se descarta al iniciar un nuevo intento (fuera de alcance el historial, ver `01`, §1.5).

---

## 3.4 Identificadores

| Entidad | Regla | Ejemplo |
|---|---|---|
| Tema | Ruta del archivo sin extensión | `razonamiento-matematico/01-razones-y-proporciones` |
| Área | `matematico` si la ruta contiene `razonamiento-matematico`; si no, `verbal` | `verbal` |
| Número de tema | Los 2 primeros dígitos del nombre del archivo | `01` → `1` |
| Pregunta | `{temaId}#q{número}` | `razonamiento-verbal/01-analogias#q3` |

Los identificadores deben ser **estables** entre builds (no dependen del azar ni de la sesión).

---

## 3.5 Persistencia local (propuesta)

> Claves sugeridas para la fase de stack; el mecanismo exacto se definirá allí. La única persistencia **obligatoria** en v1 es el nombre (RNF-04).

| Clave propuesta | Contenido | v1 |
|---|---|---|
| `beca-esan.nombre` | Nombre del usuario (string ≤ 30). Se elimina si queda vacío. | M |
| `beca-esan.config` | Última configuración válida del panel. | C (candidato) |

Todo lo demás (intento, respuestas, resultados) vive **en memoria** durante la sesión.

---

## 3.6 Contrato de extracción (criterios de aceptación)

El mecanismo que produzca el modelo de §3.2 debe cumplir:

1. **Cobertura total:** 28 temas y 140 preguntas; ninguna se descarta en silencio.
2. **Integridad por pregunta:** exactamente 5 opciones (A–E), 1 clave válida (letra existente) y explicación no vacía.
3. **Integridad por tema:** exactamente 5 preguntas, numeración 1–5 sin huecos, título no vacío.
4. **Texto intacto:** tildes, «ñ», comillas angulares y símbolos matemáticos se conservan byte a byte (sin reescribir contenido).
5. **Fallo temprano:** si un archivo incumple el contrato, la construcción **falla con un mensaje que identifica archivo y problema** (no se genera un banco parcial silencioso).
6. **Reproducible:** volver a ejecutar la extracción sobre el mismo material produce el mismo resultado.

Riesgo aceptado v1: si en el futuro se agregan temáticas con formatos nuevos (p. ej. imágenes), el contrato deberá extenderse (ver `01`, §1.8).
