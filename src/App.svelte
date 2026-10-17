<script lang="ts">
  import type { Component } from 'svelte';
  import GreetingHeader from './components/home/GreetingHeader.svelte';
  import ModeSelector from './components/home/ModeSelector.svelte';
  import NameModal from './components/home/NameModal.svelte';
  import { estado, type Pantalla } from './lib/state.svelte';

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

  /**
   * Navegación temporal mientras no existe el CTA real (T-5.7): permite correr
   * la V2 de T-5.1 (título del documento y foco al `h1`). Se retira en T-5.7.
   */
  const pantallasTemp: readonly { id: Pantalla; etiqueta: string }[] = [
    { id: 'home', etiqueta: 'Home' },
    { id: 'quiz', etiqueta: 'Quiz' },
    { id: 'resultados', etiqueta: 'Resultados' },
  ];
</script>

{#if enGaleria}
  {#if Galeria}<Galeria />{/if}
{:else}
  <main class="mx-auto w-full max-w-[640px] px-5 md:px-6">
    {#if estado.pantalla === 'home'}
      <GreetingHeader nombre={estado.nombre} onAbrir={abrirHojaNombre} />
      <NameModal
        bind:open={hojaNombreAbierta}
        bind:value={borradorNombre}
        onGuardar={(nombre) => estado.aplicarNombre(nombre)}
      />
      <h2 class="pt-6 text-xl font-bold">Configura tu quiz</h2>
      <ModeSelector bind:modo={estado.config.modo} />
      <p class="pt-4 text-ink-2">Sliders y puntajes (T-5.5 a T-5.7).</p>
    {:else if estado.pantalla === 'quiz'}
      <h1 class="pt-5 text-2xl font-bold" data-screen-title tabindex="-1">Quiz</h1>
      <p class="text-ink-2">Bloques del intento (Plan 06).</p>
    {:else}
      <h1 class="pt-5 text-2xl font-bold" data-screen-title tabindex="-1">Resultados</h1>
      <p class="text-ink-2">Puntaje y porcentajes (Plan 07).</p>
    {/if}
  </main>

  <nav aria-label="Navegación temporal" class="app-reserve mx-auto flex w-full max-w-[640px] gap-2 px-5 md:px-6">
    {#each pantallasTemp as pantalla (pantalla.id)}
      <button type="button" class="rounded-control border border-line-strong px-4 py-2" onclick={() => estado.irA(pantalla.id)}>
        {pantalla.etiqueta}
      </button>
    {/each}
  </nav>
{/if}
