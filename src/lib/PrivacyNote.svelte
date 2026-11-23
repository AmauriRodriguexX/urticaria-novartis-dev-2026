<script>
  // Aviso de privacidad del diario. Se muestra en cada lugar que lleva al diario.
  // El diario guarda los registros solo en el navegador (localStorage): el sitio no los recibe ni los comparte.
  import Icon from './Icon.svelte'
  export let variant = 'compact'   // 'compact' (una línea) · 'banner' (bloque destacado en el diario)
  export let tone = 'light'        // 'light' · 'onDark' (sobre fondos oscuros)
</script>

{#if variant === 'banner'}
  <div class="privacy-note privacy-banner" class:on-dark={tone === 'onDark'}>
    <span class="privacy-icon" aria-hidden="true"><Icon name="lock" size={22} /></span>
    <p><strong>Tu diario es privado.</strong> Tus registros se guardan solo en este dispositivo: el sitio no los guarda, no los envía a ningún servidor y no los comparte con nadie. Si borras los datos de tu navegador, el registro también se borra; usa «Descargar mi registro» para tener un respaldo.</p>
  </div>
{:else}
  <p class="privacy-note privacy-compact" class:on-dark={tone === 'onDark'}>
    <Icon name="lock" size={14} /><span><strong>Privado:</strong> se guarda solo en tu dispositivo. No se envía ni se comparte.</span>
  </p>
{/if}

<style>
  .privacy-compact { display: flex; align-items: flex-start; gap: 6px; margin: 0; color: var(--ok, #1f7a45); font: 500 12.5px/1.4 var(--font-montserrat, system-ui); }
  .privacy-compact :global(.icon) { flex: none; margin-top: 1px; }
  .privacy-compact strong { font-weight: 700; }
  .privacy-compact.on-dark { color: #bfeccd; }
  .privacy-banner { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; border: 1px solid color-mix(in srgb, var(--ok, #1f7a45) 35%, transparent); border-radius: 14px; background: color-mix(in srgb, var(--ok, #1f7a45) 9%, var(--card)); color: var(--ink); }
  .privacy-banner p { margin: 0; font-size: 14.5px; line-height: 1.55; }
  .privacy-icon { display: grid; flex: none; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--ok, #1f7a45); color: var(--bg-solid, #fff); }
</style>
