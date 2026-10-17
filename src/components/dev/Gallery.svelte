<script lang="ts">
  /**
   * Galería de componentes — solo desarrollo (Plan 04 · T-4.8).
   * Se monta con `#dev` e import dinámico desde `App.svelte`: no entra al
   * bundle de producción (`07 §7.13`). Es la superficie de verificación V2
   * de los componentes de `src/components/ui/*` mientras no viven en pantallas.
   */
  import Button from '../ui/Button.svelte';
  import BottomBar from '../ui/BottomBar.svelte';
  import Chip from '../ui/Chip.svelte';
  import OptionRow from '../ui/OptionRow.svelte';
  import ProgressSegments from '../ui/ProgressSegments.svelte';
  import Slider from '../ui/Slider.svelte';
  import Sheet from '../ui/Sheet.svelte';
  import Stepper from '../ui/Stepper.svelte';
  import Tooltip from '../ui/Tooltip.svelte';

  /** Valores de demostración de los steppers (defaults de `02 §RF-07`). */
  let correcta = $state(5);
  let noRespondida = $state(0);
  let incorrecta = $state(-2);
  let puntajeEnError = $state(NaN);

  /** Sliders de demostración: 17 (RM, azul), 11 (RV, naranja) y 5 (preguntas). */
  let temasRM = $state(8);
  let temasRV = $state(5);
  let preguntas = $state(2);

  /** Demo de alternativas A–E: una sola selección por pregunta. */
  const alternativas = [
    { id: 'a', letra: 'A', texto: '4' },
    { id: 'b', letra: 'B', texto: '6' },
    { id: 'c', letra: 'C', texto: '8' },
    { id: 'd', letra: 'D', texto: '9' },
    { id: 'e', letra: 'E', texto: '12' },
  ];
  let respuesta = $state('b');
  let respuestaLarga = $state<string | null>(null);

  /** Hoja modal en demo (T-4.6). */
  let hojaDemo = $state(false);
  let nombreDemo = $state('Juan');
</script>

<main class="gal">
  <header class="gal__head">
    <h1 class="gal__title">Galería de componentes</h1>
    <p class="gal__lede">
      Superficie de verificación V2 del Plan 04 (`07 §7.9`, `§7.12`, `§7.14`). Solo desarrollo:
      se monta con <code>#dev</code> y no entra al bundle de producción.
    </p>

    <nav class="gal__nav" aria-label="Secciones de la galería">
      <a href="#botones">Botones</a>
      <a href="#chips">Chips</a>
      <a href="#progreso">Progreso</a>
      <a href="#barra">Barra inferior</a>
      <a href="#stepper">Stepper</a>
      <a href="#slider">Slider</a>
      <a href="#opciones">Opciones A–E</a>
      <a href="#hoja">Hoja modal</a>
      <a href="#tooltip">Tooltip</a>
    </nav>

    <div class="gal__how">
      <p><strong>Cómo se verifica aquí:</strong></p>
      <ul>
        <li><em>Hover:</em> solo con ratón (media `(hover: hover) and (pointer: fine)`); en emulación táctil no existe.</li>
        <li><em>Pressed:</em> mantener el clic; <em>focus:</em> recorrer con `Tab` (anillo de 2 px con 2 px de separación).</li>
        <li><em>Teclado:</em> radios con flechas; slider con flechas, `Home`/`End` y `PageUp`/`PageDown`; hoja con `Tab` (atrapado), `Shift+Tab` y `Escape`.</li>
        <li><em>Slider:</em> tap para saltar, arrastre 1:1 (con o sin ratón), burbuja durante el gesto y `Escape` que revierte.</li>
        <li><em>`reduced-motion` / `reduced-transparency`:</em> DevTools → Rendering → *Emulate CSS media feature* (el automatismo no los emula).</li>
        <li><em>Móvil:</em> 360 y 430 px sin scroll horizontal; objetivos ≥44×44 px con ≥8 px de separación.</li>
      </ul>
    </div>
  </header>

  <section class="gal__sec" id="botones">
    <h2 class="gal__h2">Botones</h2>
    <p class="gal__src">`07 §7.9.4` · hover solo con `(hover: hover) and (pointer: fine)`; pressed al mantener el clic; focus con Tab.</p>

    <div class="gal__row">
      <span class="gal__tag">Primario · contexto (44)</span>
      <div class="gal__items">
        <Button>Iniciar quiz</Button>
        <Button icon="arrow-right" iconPos="start">Continuar</Button>
        <Button icon="arrow-right">Continuar</Button>
        <Button disabled>Iniciar quiz</Button>
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Primario · barra (48)</span>
      <div class="gal__items">
        <Button size="bar" icon="arrow-right">Continuar</Button>
        <Button size="bar" disabled icon="arrow-right">Continuar</Button>
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Secundario</span>
      <div class="gal__items">
        <Button variant="secundario">Atrás</Button>
        <Button variant="secundario" size="bar" icon="chevron-left" iconPos="start">Atrás</Button>
        <Button variant="secundario" disabled>Atrás</Button>
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Fantasma</span>
      <div class="gal__items">
        <Button variant="fantasma">Ocultar texto</Button>
        <Button variant="fantasma" icon="text-align-left" iconPos="start">Mostrar texto</Button>
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Icono</span>
      <div class="gal__items">
        <Button variant="icono" icon="pencil" ariaLabel="Pon aquí tu nombre" />
        <Button variant="icono" icon="x" ariaLabel="Cerrar" />
        <Button variant="icono" icon="pencil" ariaLabel="Pon aquí tu nombre" disabled />
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Ancho completo</span>
      <div class="gal__items gal__items--stack">
        <Button full icon="arrow-right">Iniciar quiz</Button>
        <Button full variant="secundario">Cancelar</Button>
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Acento del área (`data-area="verbal"`)</span>
      <div class="gal__items" data-area="verbal">
        <Button icon="arrow-right">Ver resultados</Button>
        <Button variant="secundario">Atrás</Button>
      </div>
    </div>
  </section>

  <section class="gal__sec" id="chips">
    <h2 class="gal__h2">Chips</h2>
    <p class="gal__src">`07 §7.9.8` · chip de área (RM azul, RV naranja) y chip de cronómetro (tabular, ancho estable, sin `aria-live`).</p>

    <div class="gal__row">
      <span class="gal__tag">Área y cronómetro</span>
      <div class="gal__items">
        <Chip label="Razonamiento Matemático" />
        <Chip label="Razonamiento Verbal y Comunicación" area="verbal" />
        <Chip variant="time" label="04:32" ariaLabel="Tiempo transcurrido" />
        <Chip variant="time" label="1:02:03" ariaLabel="Tiempo transcurrido" />
      </div>
    </div>
  </section>

  <section class="gal__sec" id="progreso">
    <h2 class="gal__h2">Progreso de bloques</h2>
    <p class="gal__src">`07 §7.9.9` · pendiente `line`; completado y actual con el acento (el actual a 6 px). `aria-hidden`.</p>

    <div class="gal__row">
      <span class="gal__tag">N = 1 · bloque 1 (E-03)</span>
      <ProgressSegments total={1} current={1} />
    </div>

    <div class="gal__row">
      <span class="gal__tag">N = 13 · bloque 1</span>
      <ProgressSegments total={13} current={1} />
    </div>

    <div class="gal__row">
      <span class="gal__tag">N = 13 · bloque 5</span>
      <ProgressSegments total={13} current={5} />
    </div>

    <div class="gal__row">
      <span class="gal__tag">N = 17 · bloque 17 (E-01)</span>
      <ProgressSegments total={17} current={17} />
    </div>
  </section>

  <section class="gal__sec" id="barra">
    <h2 class="gal__h2">Barra inferior fija</h2>
    <p class="gal__src">
      `07 §7.9.6` · translúcida + `blur(12px)` con fallback sólido; borde + sombra solo en
      `.is-scrolled` (al hacer scroll en la galería). Aquí va enmarcada; en las pantallas vive fija al fondo.
    </p>

    <div class="gal__row">
      <span class="gal__tag">Un botón (ancho completo)</span>
      <div class="gal__frame">
        <p class="gal__frame-text">Contenido de ejemplo bajo la barra.</p>
        <BottomBar>
          <Button size="bar" full icon="arrow-right">Iniciar quiz</Button>
        </BottomBar>
      </div>
    </div>

    <div class="gal__row">
      <span class="gal__tag">Dos botones (1:2)</span>
      <div class="gal__frame">
        <p class="gal__frame-text">Contenido de ejemplo bajo la barra.</p>
        <BottomBar>
          <Button size="bar" variant="secundario" icon="chevron-left" iconPos="start">Atrás</Button>
          <Button size="bar" icon="arrow-right">Continuar</Button>
        </BottomBar>
      </div>
    </div>
  </section>

  <section class="gal__sec" id="stepper">
    <h2 class="gal__h2">Stepper de puntajes</h2>
    <p class="gal__src">
      `07 §7.9.3` · etiqueta + [−] [valor] [+] (44×44, `aria-label` completos); al enfocar se selecciona
      el texto; `inputmode="numeric"`; error inline de `07 §7.9.14` (con error, «Iniciar quiz» queda
      deshabilitado: Plan 05).
    </p>

    <div class="gal__rows">
      <Stepper
        label="Correcta"
        ariaLabel="Puntos por respuesta correcta"
        bind:value={correcta}
      />
      <Stepper
        label="No respondida"
        ariaLabel="Puntos por pregunta no respondida"
        bind:value={noRespondida}
      />
      <Stepper
        label="Incorrecta"
        ariaLabel="Puntos por respuesta incorrecta"
        bind:value={incorrecta}
      />
      <Stepper
        label="Con error"
        ariaLabel="Puntos por respuesta incorrecta"
        bind:value={puntajeEnError}
        invalid
        errorMessage="Escribe un número entre −999 y 999."
      />
    </div>
  </section>

  <section class="gal__sec" id="slider">
    <h2 class="gal__h2">Slider segmentado</h2>
    <p class="gal__src">
      `07 §7.8` + Anexo B · arrastre 1:1 con captura de puntero, tap para saltar, teclado nativo
      (flechas, `Home`/`End`, `PageUp`/`PageDown`), burbuja de valor, `touch-action: pan-y`, rueda ignorada
      y `Escape`/`pointercancel` que revierten el gesto. 17 segmentos (RM), 11 (RV) y 5 (preguntas).
    </p>

    <div class="gal__rows">
      <Slider
        label="Temas de Razonamiento Matemático"
        unidad="temas"
        max={17}
        bind:value={temasRM}
        caption="Al azar, sin repetirse"
      />
      <Slider
        label="Temas de Razonamiento Verbal"
        unidad="temas"
        max={11}
        area="verbal"
        bind:value={temasRV}
        caption="Al azar, sin repetirse"
      />
      <Slider
        label="Preguntas por tema"
        unidad="preguntas"
        max={5}
        bind:value={preguntas}
        caption="Al azar, dentro de cada tema"
      />
      <Slider
        label="Slider deshabilitado"
        unidad="temas"
        max={5}
        value={3}
        disabled
        caption="Estado §7.8.3 (opacidad 45 %, sin puntero, aria-disabled)"
      />
    </div>
  </section>

  <section class="gal__sec" id="opciones">
    <h2 class="gal__h2">Opciones de respuesta (A–E)</h2>
    <p class="gal__src">
      `07 §7.9.7` · radio nativo oculto + burbuja A–E; alto mínimo 56, padding 12 14, radio 12;
      selección con forma + color + peso; pressed `surface-2`; focus en la fila; sin feedback de corrección.
      La separación de 12 px entre alternativas la pone la pantalla (aquí, el marco).
    </p>

    <fieldset class="gal__field">
      <legend class="gal__legend">Una sola selección, cambiable (flechas entre radios)</legend>
      <div class="gal__opts">
        {#each alternativas as opcion (opcion.id)}
          <OptionRow
            name="demo-p1"
            value={opcion.id}
            letter={opcion.letra}
            text={opcion.texto}
            selected={respuesta === opcion.id}
            onselect={() => (respuesta = opcion.id)}
          />
        {/each}
      </div>
    </fieldset>

    <fieldset class="gal__field">
      <legend class="gal__legend">Sin seleccionar y con texto largo (envoltura)</legend>
      <div class="gal__opts">
        {#each alternativas as opcion (opcion.id)}
          <OptionRow
            name="demo-p2"
            value={opcion.id}
            letter={opcion.letra}
            text={opcion.texto}
            selected={respuestaLarga === opcion.id}
            onselect={() => (respuestaLarga = opcion.id)}
          />
        {/each}
        <OptionRow
          name="demo-p2"
          value="f"
          letter="F"
          text="Una alternativa larga que ocupa varias líneas para comprobar la envoltura del texto dentro de la fila sin romper la burbuja."
          selected={respuestaLarga === 'f'}
          onselect={() => (respuestaLarga = 'f')}
        />
      </div>
    </fieldset>
  </section>

  <section class="gal__sec" id="hoja">
    <h2 class="gal__h2">Hoja modal</h2>
    <p class="gal__src">
      `07 §7.9.11` · `&lt;dialog&gt;` con `showModal()` (foco atrapado, `Escape` y retorno del foco), scrim,
      scroll de fondo bloqueado, drag-to-dismiss desde el asa (umbral 96 px o velocidad &gt; 0.5 px/ms) y
      animaciones de `07 §7.7.3`. Móvil: *bottom-sheet* radio 20; ≥768 px: diálogo centrado de 400 px.
    </p>

    <div class="gal__row">
      <span class="gal__tag">Demo (hoja de nombre como la usará el Plan 05)</span>
      <Button onclick={() => (hojaDemo = true)}>Abrir hoja</Button>
    </div>
  </section>

  <Sheet bind:open={hojaDemo} title="¿Cómo te llamas?" showClose>
    <label class="gal__field-label" for="gal-nombre">Tu nombre</label>
    <input
      id="gal-nombre"
      class="gal__input"
      type="text"
      maxlength="30"
      bind:value={nombreDemo}
      autocomplete="given-name"
    />
    <p class="gal__help">Máx. 30 caracteres</p>
    {#snippet actions()}
      <Button variant="secundario" onclick={() => (hojaDemo = false)}>Cancelar</Button>
      <Button onclick={() => (hojaDemo = false)}>Guardar</Button>
    {/snippet}
  </Sheet>

  <section class="gal__sec" id="tooltip">
    <h2 class="gal__h2">Tooltip</h2>
    <p class="gal__src">
      `07 §7.9.15` · solo `(hover: hover) and (pointer: fine)`: aparece a los 300 ms de hover o de foco,
      se va con un fundido de 120 ms, va `aria-hidden` y no sostiene ninguna función (el disparador lleva
      su `aria-label`). En táctil no existe.
    </p>

    <div class="gal__row">
      <span class="gal__tag">Sobre el disparador (lápiz, como en `07 §7.9.1`)</span>
      <div class="gal__items">
        <Tooltip label="Pon aquí tu nombre">
          <Button variant="icono" icon="pencil" ariaLabel="Pon aquí tu nombre" />
        </Tooltip>
        <Tooltip label="Pon aquí tu nombre">
          <Button variant="secundario">Pasa el cursor o enfoca</Button>
        </Tooltip>
      </div>
    </div>
  </section>

  <div class="gal__spacer" aria-hidden="true"></div>
</main>

<style>
  .gal {
    max-width: 640px;
    margin: 0 auto;
    padding: 24px 20px 0;
  }

  .gal__head {
    margin-bottom: 32px;
  }

  .gal__title {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .gal__lede {
    margin-top: 8px;
    font-size: 0.9375rem;
    line-height: 1.4;
    color: var(--color-ink-2);
  }

  .gal__lede code {
    font-size: 0.875rem;
  }

  .gal__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    margin-top: 12px;
  }

  .gal__nav a {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-blue-700);
  }

  .gal__nav a:hover {
    text-decoration: underline;
  }

  .gal__how {
    margin-top: 12px;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--color-ink-2);
  }

  .gal__how ul {
    margin: 6px 0 0;
    padding-left: 18px;
    list-style: disc;
  }

  .gal__sec {
    margin-bottom: 32px;
    padding: 16px 20px 20px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-card);
    background: var(--color-surface);
    scroll-margin-top: 12px;
  }

  @media (min-width: 430px) {
    .gal__sec {
      padding: 20px 24px 24px;
    }
  }

  .gal__h2 {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .gal__src {
    margin-top: 4px;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .gal__row {
    margin-top: 20px;
  }

  .gal__tag {
    display: block;
    margin-bottom: 8px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-ink-3);
  }

  .gal__items {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
  }

  .gal__items--stack {
    flex-direction: column;
    align-items: stretch;
  }

  .gal__rows {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }

  .gal__field {
    margin-top: 20px;
    border: 0;
  }

  .gal__legend {
    padding: 0;
    margin-bottom: 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-ink-3);
  }

  .gal__opts {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .gal__field-label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-ink-2);
  }

  .gal__input {
    width: 100%;
    height: 48px;
    padding: 0 12px;
    border: 1px solid var(--color-line-strong);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-ink);
    font: inherit;
    font-size: 1rem;
  }

  .gal__help {
    margin-top: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-ink-3);
  }

  /* Marco que aísla una barra `position: fixed` (el `transform` la contiene) */
  .gal__frame {
    position: relative;
    height: 156px;
    overflow: hidden;
    transform: translateZ(0);
    border: 1px dashed var(--color-line-strong);
    border-radius: var(--radius-control);
    background: var(--color-bg);
  }

  .gal__frame-text {
    padding: 12px 16px;
    font-size: 0.8125rem;
    color: var(--color-ink-3);
  }

  .gal__spacer {
    height: 64px;
  }
</style>
