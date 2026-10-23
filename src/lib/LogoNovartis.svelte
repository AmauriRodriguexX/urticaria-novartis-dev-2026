<script>
  // Logotipo horizontal de Novartis "Reimagining Medicine" (archivo entregado por el equipo).
  // Es monocromo (negro): en el modo oscuro se invierte a blanco.
  import logo from './logos/novartis_logo.svg?url'
  export let alto = 26
  export let etiqueta = 'Novartis, Reimagining Medicine'
</script>

<img class="logo-novartis" src={logo} alt={etiqueta} style={`height:${alto}px`} />

<style>
  .logo-novartis { display: block; width: auto; max-width: 100%; }
  :global(.dark) .logo-novartis { filter: invert(1); }
</style>
