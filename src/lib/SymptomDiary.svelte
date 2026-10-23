<script>
  import { onMount } from 'svelte'
  import UasGauge from './UasGauge.svelte'
  export let ref = null   // número de la referencia del medidor en la lista de la página

  const blankDays = () => Array.from({ length: 7 }, (_, index) => ({ day: `Día ${index + 1}`, date: '', hives: 0, itch: 0 }))
  const weekdayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  // Los registros son anónimos y viven solo en el almacenamiento local del navegador; nunca se envían a un servidor.
  const STORE_KEY = 'mqu-diario-sintomas'
  let days = blankDays()
  let loaded = false
  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (Array.isArray(saved) && saved.length === 7) days = saved
    } catch { /* sin almacenamiento, el registro vive hasta recargar */ }
    loaded = true
  })
  $: if (loaded) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(days)) } catch { /* el diario sigue funcionando en esta sesión */ }
  }
  let openDateIndex = null
  let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  let pickerPosition = { top: 0, left: 0 }
  $: hivesTotal = days.reduce((sum, day) => sum + Number(day.hives || 0), 0)
  $: itchTotal = days.reduce((sum, day) => sum + Number(day.itch || 0), 0)
  $: calendarCells = getCalendarCells(calendarMonth)
  $: calendarTitle = calendarMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  function clearDiary() {
    days = blankDays()
    openDateIndex = null
  }

  function getCalendarCells(month) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const start = new Date(first.getFullYear(), first.getMonth(), -((first.getDay() + 6) % 7) + 1)
    return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index))
  }

  function dateValue(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function formatDate(value) {
    if (!value) return ''
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function openDatePicker(index, event) {
    if (openDateIndex === index) {
      openDateIndex = null
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const pickerWidth = 320
    const pickerHeight = 420
    const spaceBelow = window.innerHeight - bounds.bottom
    pickerPosition = {
      left: Math.max(12, Math.min(bounds.left, window.innerWidth - pickerWidth - 12)),
      top: spaceBelow < pickerHeight + 8 && bounds.top > spaceBelow
        ? Math.max(12, bounds.top - pickerHeight - 8)
        : Math.min(bounds.bottom + 8, window.innerHeight - pickerHeight - 12)
    }
    const saved = days[index].date
    if (saved) {
      const [year, month] = saved.split('-').map(Number)
      calendarMonth = new Date(year, month - 1, 1)
    } else {
      calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
    openDateIndex = index
  }

  function shiftMonth(amount) {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + amount, 1)
  }

  function selectCalendarDate(date) {
    days = days.map((day, index) => index === openDateIndex ? { ...day, date: dateValue(date) } : day)
    openDateIndex = null
  }

  function closeCalendar(event) {
    if (event.key === 'Escape') openDateIndex = null
  }
</script>

<svelte:window on:keydown={closeCalendar} on:scroll={() => openDateIndex = null} on:resize={() => openDateIndex = null} />

<section class="symptom-diary print-sheet" id="registro" aria-labelledby="diary-tool-title">
  <div class="diary-tool-heading">
    <div><p class="eyebrow">Registro personal</p><h2 id="diary-tool-title">Mi Diario de Síntomas</h2></div>
    <p>Tu registro es anónimo: se guarda solo en este navegador y no se envía a ningún servidor.</p>
  </div>
  <div class="diary-table-wrap">
    <table class="diary-table">
      <thead><tr><th scope="col">Día</th><th scope="col">Fecha</th><th scope="col">Habones (ronchas)<br /><small>0 a 3</small></th><th scope="col">Comezón<br /><small>0 a 3</small></th></tr></thead>
      <tbody>
        {#each days as day, i (day.day)}
          <tr>
            <th scope="row">{day.day}</th>
            <td>
              <span class="sr-only" id={`diary-date-label-${i}`}>Fecha, {day.day}</span>
              <button class="diary-date-trigger" id={`diary-date-${i}`} type="button" aria-labelledby={`diary-date-label-${i} diary-date-value-${i}`} aria-haspopup="dialog" aria-expanded={openDateIndex === i} on:click={(event) => openDatePicker(i, event)}>
                <span id={`diary-date-value-${i}`} class:diary-date-placeholder={!day.date}>{day.date ? formatDate(day.date) : 'Elegir fecha'}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 15H5V9h14v10ZM7 11h3v3H7z" /></svg>
              </button>
            </td>
            <td><label class="sr-only" for={`diary-hives-${i}`}>Habones (ronchas), {day.day}</label><select id={`diary-hives-${i}`} aria-label={`Habones (ronchas), ${day.day}`} bind:value={day.hives}>{#each [0, 1, 2, 3] as score}<option value={score}>{score}</option>{/each}</select></td>
            <td><label class="sr-only" for={`diary-itch-${i}`}>Comezón, {day.day}</label><select id={`diary-itch-${i}`} aria-label={`Comezón, ${day.day}`} bind:value={day.itch}>{#each [0, 1, 2, 3] as score}<option value={score}>{score}</option>{/each}</select></td>
          </tr>
        {/each}
      </tbody>
      <tfoot><tr><th scope="row">Suma de la semana</th><td></td><td>{hivesTotal}</td><td>{itchTotal}</td></tr></tfoot>
    </table>
  </div>
  <UasGauge total={hivesTotal + itchTotal} titulo="Tu puntaje UAS7 de esta semana" aviso="Es la suma de habones (ronchas) y comezón de los 7 días. Llévalo a tu consulta: solo un alergólogo o dermatólogo puede evaluar tu actividad." {ref} />
  {#if openDateIndex !== null}
    <div class="material-date-picker" role="dialog" aria-label="Seleccionar fecha" style={`top:${pickerPosition.top}px;left:${pickerPosition.left}px`}>
      <div class="material-date-picker-heading">
        <button type="button" aria-label="Mes anterior" on:click={() => shiftMonth(-1)}>‹</button>
        <h3 aria-live="polite">{calendarTitle}</h3>
        <button type="button" aria-label="Mes siguiente" on:click={() => shiftMonth(1)}>›</button>
      </div>
      <div class="material-date-grid" aria-label={calendarTitle}>
        {#each weekdayNames as weekday}<span class="material-date-weekday">{weekday}</span>{/each}
        {#each calendarCells as date (dateValue(date))}
          <button class="material-date-day" class:outside-month={date.getMonth() !== calendarMonth.getMonth()} class:selected={days[openDateIndex].date === dateValue(date)} type="button" aria-label={date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} aria-pressed={days[openDateIndex].date === dateValue(date)} on:click={() => selectCalendarDate(date)}>{date.getDate()}</button>
        {/each}
      </div>
      <div class="material-date-picker-footer"><button type="button" on:click={() => openDateIndex = null}>Cancelar</button><button type="button" on:click={() => selectCalendarDate(new Date())}>Hoy</button></div>
    </div>
  {/if}
  <p class="diary-scale">Usa 0 si no observaste el síntoma y de 1 a 3 para registrar su intensidad. Estos totales son solo una forma de ordenar tus notas; no interpretan ni diagnostican tu estado. Recuerda: únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico.</p>
  <div class="diary-tool-actions no-print">
    <button class="button" type="button" on:click={() => window.print()}>Imprimir o guardar como PDF</button>
    <button class="text-button" type="button" on:click={clearDiary}>Borrar este registro</button>
  </div>
</section>
