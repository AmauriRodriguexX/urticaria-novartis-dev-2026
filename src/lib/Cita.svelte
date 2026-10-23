<script>
  // Cita numérica estilo IEEE: [1], [2]. Lleva a su referencia en <Fuentes> (mismo prefijo).
  export let refs
  export let prefix
  $: list = [].concat(refs)
</script>

<span class="cita">{#each list as r, i}{#if i}, {/if}<a href={`#${prefix}-fuente-${r}`} aria-label={`Ver referencia ${r}`} title="Ver referencia">[{r}]</a>{/each}</span>

<style>
  .cita { margin-left: 3px; white-space: nowrap; }
  .cita a { color: var(--accent); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px; }
  .cita a:hover, .cita a:focus-visible { background: var(--accentSoft); border-radius: 3px; outline: none; }
  .cita a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>
