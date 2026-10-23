<script>
  // Lista de fuentes consultadas de una sección. Cada <Cita> con el mismo prefijo enlaza aquí.
  import Icon from './Icon.svelte'
  export let sources
  export let prefix
</script>

<footer class="fuentes">
  <h3 class="fuentes-title" id={`${prefix}-fuentes`}><Icon name="menu_book" size={20} /> Referencias</h3>
  <ol class="fuentes-list" aria-labelledby={`${prefix}-fuentes`}>
    {#each sources as s}
      <li id={`${prefix}-fuente-${s.n}`}>
        <span class="fuentes-n">[{s.n}]</span>
        <p>{@html s.text}</p>
        <a class="fuentes-link" href={s.url} target="_blank" rel="noopener">
          Consultar fuente <span class="fuentes-dest"><span class="fuentes-host">{new URL(s.url).hostname.replace('www.', '')}</span> <Icon name="open_in_new" size={16} /></span>
          <span class="sr-only">(se abre en otra pestaña)</span>
        </a>
      </li>
    {/each}
  </ol>
</footer>

<style>
  .fuentes { display: grid; gap: var(--s-3); margin-top: var(--s-4); padding-top: var(--s-4); border-top: 1px solid var(--line); }
  .fuentes-title { display: flex; align-items: center; gap: 8px; margin: 0; font: 700 18px var(--font-barlow); color: var(--ink); scroll-margin-top: 120px; }
  .fuentes-title :global(.icon) { color: var(--accent); }
  .fuentes-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--s-3); margin: 0; padding: 0; list-style: none; }
  .fuentes-list li { display: grid; grid-template-columns: 34px 1fr; align-content: start; column-gap: 10px; row-gap: 12px; padding: var(--s-3) var(--s-4); border: 1px solid var(--line); border-radius: 16px; background: var(--card); scroll-margin-top: 120px; transition: border-color .3s, box-shadow .3s; }
  .fuentes-list li:target { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accentSoft); }
  .fuentes-n { color: var(--accent); font: 700 15px/1.5 var(--font-barlow); }
  .fuentes-list p { margin: 0; color: var(--soft); font-size: 14px; line-height: 1.5; }
  .fuentes-link { grid-column: 2; justify-self: start; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 2px 6px; max-width: 100%; padding: 9px 16px; border: 1.5px solid var(--accent); border-radius: 18px; color: var(--accent); font: 700 14px var(--font-barlow); text-decoration: none; transition: background .2s, color .2s; }
  .fuentes-link:hover { background: var(--accent); color: #fff; }
  .fuentes-link:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  .fuentes-dest { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .fuentes-host { font-weight: 500; text-decoration: underline; text-underline-offset: 3px; }
  @media (max-width: 900px) { .fuentes-link { grid-column: 1 / -1; } }
</style>
