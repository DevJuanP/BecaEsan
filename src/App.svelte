<script lang="ts">
  import type { Component } from 'svelte';
  import ConfigPanel from './components/home/ConfigPanel.svelte';
  import GreetingHeader from './components/home/GreetingHeader.svelte';
  import NameModal from './components/home/NameModal.svelte';
  import bancoJson from './data/questions.json';
  import { crearIntento } from './lib/generator';
  import { estado } from './lib/state.svelte';
  import type { Tema } from './lib/types';

  /**
   * Banco de preguntas generado y validado en build (`06 §6.4`, `03 §3.2`): el
   * script de construcción garantiza el contrato, así que se tipa como `Tema[]`.
   */
  const banco = bancoJson as unknown as Tema[];

  /** Preguntas del intento en curso (resumen del placeholder del Plan 06). */
  const totalPreguntas = $derived(
    estado.intento?.bloques.reduce((total, bloque) => total + bloque.preguntas.length, 0) ?? 0,
  );

  /** «Iniciar quiz» (`02 §RF-09`): genera el intento y navega al quiz. */
  function iniciarQuiz() {
    estado.intento = crearIntento(estado.config, banco);
    void estado.irA('quiz');
  }

  /** Hoja de nombre (`02 §RF-01.3`): la abre el saludo o el lápiz (T-5.2). */
  let hojaNombreAbierta = $state(false);

  /** Borrador del nombre: solo «Guardar» lo aplica (`02 §RF-01.4`). */
  let borradorNombre = $state('');

  /** Cada apertura parte del nombre guardado; lo escrito antes se descarta. */
  function abrirHojaNombre() {
    borradorNombre = estado.nombre ?? '';
    hojaNombreAbierta = true;
  }

  /**
   * Galería de componentes (Plan 04 · T-4.8): solo desarrollo y con `#dev`.
   * El import dinámico vive detrás de `import.meta.env.DEV` para que no entre
   * al bundle de producción (`07 §7.13`). Conservar este bloque al reemplazar
   * los placeholders (Planes 05–07).
   */
  const enGaleria = import.meta.env.DEV && location.hash === '#dev';
  let Galeria = $state<Component | null>(null);

  if (enGaleria) {
    import('./components/dev/Gallery.svelte').then((modulo) => (Galeria = modulo.default));
  }
</script>

{#if enGaleria}
  {#if Galeria}<Galeria />{/if}
{:else}
  <main class="app-reserve mx-auto w-full max-w-[640px] px-5 min-[430px]:px-6">
    {#if estado.pantalla === 'home'}
      <GreetingHeader nombre={estado.nombre} onAbrir={abrirHojaNombre} />
      <NameModal
        bind:open={hojaNombreAbierta}
        bind:value={borradorNombre}
        onGuardar={(nombre) => estado.aplicarNombre(nombre)}
      />
      <div class="pt-6">
        <ConfigPanel bind:config={estado.config} onIniciar={iniciarQuiz} />
      </div>
    {:else if estado.pantalla === 'quiz'}
      <h1 class="pt-5 text-2xl font-bold" data-screen-title tabindex="-1">Quiz</h1>
      <p class="text-ink-2">Bloques del intento (Plan 06).</p>
      {#if estado.intento}
        <p class="pt-2 text-ink-2">
          Intento generado: {estado.intento.bloques.length} bloques · {totalPreguntas} preguntas.
        </p>
      {/if}
    {:else}
      <h1 class="pt-5 text-2xl font-bold" data-screen-title tabindex="-1">Resultados</h1>
      <p class="text-ink-2">Puntaje y porcentajes (Plan 07).</p>
    {/if}
  </main>

  {#if estado.pantalla !== 'home'}
    <!--
      Navegación temporal de los placeholders de quiz y resultados: la sustituyen
      las pantallas de los Planes 06–07 (el botón «Home» de resultados, RF-21).
      Home no la muestra: su flujo real es el CTA «Iniciar quiz» (RF-09).
    -->
    <nav aria-label="Navegación temporal" class="mx-auto flex w-full max-w-[640px] gap-2 px-5 min-[430px]:px-6">
      <button type="button" class="rounded-control border border-line-strong px-4 py-2" onclick={() => estado.irA('home')}>
        Home
      </button>
    </nav>
  {/if}
{/if}
