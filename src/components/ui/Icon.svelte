<script lang="ts" module>
  /**
   * Catálogo de iconos de `07 §7.6`: trazo lineal de 1.75 px, uniones redondeadas,
   * `currentColor` y viewBox 24×24, copiados en línea (cero dependencias).
   * Siempre decorativos: llevan `aria-hidden` y quien los usa aporta el nombre
   * accesible (texto visible o `aria-label` del control).
   */
  export type IconName =
    | 'pencil'
    | 'clock'
    | 'house'
    | 'chevron-left'
    | 'chevron-down'
    | 'arrow-right'
    | 'check'
    | 'x'
    | 'minus'
    | 'plus'
    | 'text-align-left';
</script>

<script lang="ts">
  interface Props {
    name: IconName;
    /**
     * Tamaños de `07 §7.6`: `--icon-16` (metadatos, chips), `--icon-20`
     * (botones, lápiz) y `--icon-24` (cabeceras). Nunca tamaños intermedios.
     */
    size?: 16 | 20 | 24;
  }

  let { name, size = 20 }: Props = $props();
</script>

<svg
  class="icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  {#if name === 'pencil'}
    <path d="M4.75 19.25h3.5L19.5 8a2.475 2.475 0 0 0-3.5-3.5L4.75 15.75v3.5Z" />
    <path d="m14.75 5.75 3.5 3.5" />
  {:else if name === 'clock'}
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.5V12l3.25 2" />
  {:else if name === 'house'}
    <path d="M4.75 10.75 12 5l7.25 5.75v8.5H4.75v-8.5Z" />
    <path d="M10 19.25v-5.5h4v5.5" />
  {:else if name === 'chevron-left'}
    <path d="M14.5 5.75 8.25 12l6.25 6.25" />
  {:else if name === 'chevron-down'}
    <path d="m6.25 9.25 5.75 5.75 5.75-5.75" />
  {:else if name === 'arrow-right'}
    <path d="M4.75 12h14" />
    <path d="M13.25 6.25 19 12l-5.75 5.75" />
  {:else if name === 'check'}
    <path d="M5 12.75 9.5 17.25 19 7" />
  {:else if name === 'x'}
    <path d="m6.5 6.5 11 11" />
    <path d="m17.5 6.5-11 11" />
  {:else if name === 'minus'}
    <path d="M6.5 12h11" />
  {:else if name === 'plus'}
    <path d="M12 6.5v11" />
    <path d="M6.5 12h11" />
  {:else if name === 'text-align-left'}
    <path d="M4.75 6.5h14.5" />
    <path d="M4.75 11h9.5" />
    <path d="M4.75 15.5h14.5" />
    <path d="M4.75 20h9.5" />
  {/if}
</svg>

<style>
  .icon {
    display: block;
    flex: none;
  }
</style>
