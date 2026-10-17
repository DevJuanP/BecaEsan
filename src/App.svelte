<script lang="ts">
  type Screen = 'home' | 'quiz' | 'resultados';

  let screen: Screen = $state('home');
</script>

<main class="mx-auto w-full max-w-[640px] px-5 md:px-6">
  {#if screen === 'home'}
    <h1 class="pt-5 text-2xl font-bold">Home</h1>
    <p class="text-ink-2">Pantalla inicial (Plan 05).</p>
  {:else if screen === 'quiz'}
    <h1 class="pt-5 text-2xl font-bold">Quiz</h1>
    <p class="text-ink-2">Bloques del intento (Plan 06).</p>
  {:else}
    <h1 class="pt-5 text-2xl font-bold">Resultados</h1>
    <p class="text-ink-2">Puntaje y porcentajes (Plan 07).</p>
  {/if}

  <!-- Navegación temporal de la fundación (la reemplazan los Planes 05–07) -->
  <nav aria-label="Navegación temporal" class="app-reserve flex gap-2 py-4">
    <button type="button" onclick={() => (screen = 'home')}>Home</button>
    <button type="button" onclick={() => (screen = 'quiz')}>Quiz</button>
    <button type="button" onclick={() => (screen = 'resultados')}>Resultados</button>
  </nav>
</main>
