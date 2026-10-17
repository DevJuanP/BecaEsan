<script lang="ts">
  import type { Component } from 'svelte';
  import ConfigPanel from './components/home/ConfigPanel.svelte';
  import GreetingHeader from './components/home/GreetingHeader.svelte';
  import NameModal from './components/home/NameModal.svelte';
  import QuizScreen from './components/quiz/QuizScreen.svelte';
  import bancoJson from './data/questions.json';
  import { crearIntento } from './lib/generator';
  import { estado } from './lib/state.svelte';
  import type { Tema } from './lib/types';

  /**
   * Banco de preguntas generado y validado en build (`06 §6.4`, `03 §3.2`): el
   * script de construcción garantiza el contrato, así que se tipa como `Tema[]`.
   */
  const banco = bancoJson as unknown as Tema[];

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
{:else if estado.pantalla === 'home'}
  <main class="app-reserve mx-auto w-full max-w-[640px] px-5 min-[430px]:px-6">
    <GreetingHeader nombre={estado.nombre} onAbrir={abrirHojaNombre} />
    <NameModal
      bind:open={hojaNombreAbierta}
      bind:value={borradorNombre}
      onGuardar={(nombre) => estado.aplicarNombre(nombre)}
    />
    <div class="pt-6">
      <ConfigPanel bind:config={estado.config} onIniciar={iniciarQuiz} />
    </div>
  </main>
{:else if estado.pantalla === 'quiz'}
  <!-- El quiz trae su propio `<main>`: la cabecera sticky (T-6.2) es full-bleed -->
  <QuizScreen />
{:else}
  <main class="app-reserve mx-auto w-full max-w-[640px] px-5 min-[430px]:px-6">
    <h1 class="pt-5 text-2xl font-bold" data-screen-title tabindex="-1">Resultados</h1>
    <p class="text-ink-2">Puntaje y porcentajes (Plan 07).</p>
  </main>

  <!--
    Navegación temporal del placeholder de resultados: la sustituye el botón
    «Home» de la pantalla de resultados (RF-21, Plan 07). El quiz ya no la usa:
    su salida real es «Ver resultados» (RF-17).
  -->
  <nav aria-label="Navegación temporal" class="mx-auto flex w-full max-w-[640px] gap-2 px-5 min-[430px]:px-6">
    <button type="button" class="rounded-control border border-line-strong px-4 py-2" onclick={() => estado.irA('home')}>
      Home
    </button>
  </nav>
{/if}
