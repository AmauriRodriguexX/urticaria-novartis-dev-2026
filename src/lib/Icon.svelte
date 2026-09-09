<script>
  // Íconos: Material Symbols Rounded (Google Fonts), descargados como SVG en ./icons.
  // Uso: <Icon name="arrow_forward" size={20} />
  const files = import.meta.glob('./icons/*.svg', { query: '?raw', import: 'default', eager: true })
  export let name
  export let size = 20
  export let label = ''
  $: raw = files[`./icons/${name}.svg`] || ''
  // El SVG trae width/height fijos y sin fill; los quitamos para controlarlos por CSS.
  $: svg = raw.replace(/\s(width|height)="\d+"/g, '').replace('<svg', '<svg fill="currentColor" focusable="false"')
</script>

<span class="icon" style={`--icon-size:${size}px`} aria-hidden={label ? undefined : 'true'} role={label ? 'img' : undefined} aria-label={label || undefined}>{@html svg}</span>

<style>
  .icon { display: inline-flex; flex: none; width: var(--icon-size); height: var(--icon-size); vertical-align: middle; line-height: 0; }
  .icon :global(svg) { width: 100%; height: 100%; }
</style>
