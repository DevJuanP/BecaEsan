<script lang="ts">
  /**
   * Galería de componentes — solo desarrollo (Plan 04 · T-4.8).
   * Se monta con `#dev` e import dinámico desde `App.svelte`: no entra al
   * bundle de producción (`07 §7.13`). Es la superficie de verificación V2
   * de los componentes de `src/components/ui/*` mientras no viven en pantallas.
   */
  import Button from '../ui/Button.svelte';
</script>

<main class="gal">
  <header class="gal__head">
    <h1 class="gal__title">Galería de componentes</h1>
    <p class="gal__lede">
      Superficie de verificación V2 del Plan 04 (`07 §7.9`, `§7.12`, `§7.14`). Solo desarrollo:
      se monta con <code>#dev</code> y no entra al bundle de producción.
    </p>
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

  .gal__sec {
    margin-bottom: 32px;
    padding: 16px 20px 20px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-card);
    background: var(--color-surface);
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

  .gal__spacer {
    height: 64px;
  }
</style>
