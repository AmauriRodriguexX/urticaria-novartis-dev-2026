<script>
  import { onMount } from 'svelte'
  import UasGauge from './UasGauge.svelte'
  import Icon from './Icon.svelte'
  import PrivacyNote from './PrivacyNote.svelte'
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
  // Se guarda solo en cada cambio; el aviso confirma al usuario que no necesita un botón de guardar.
  let savedAt = null
  let saveFailed = false
  let firstSave = true
  $: if (loaded) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(days)); saveFailed = false } catch { saveFailed = true }
    if (firstSave) firstSave = false
    else savedAt = new Date()
  }
  $: savedLabel = savedAt ? savedAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : ''
  let openDateIndex = null
  let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  let pickerPosition = { top: 0, left: 0 }
  // Avance de la semana: un día cuenta como registrado si tiene fecha o algún puntaje mayor que 0
  const isFilled = d => Boolean(d.date) || Number(d.hives) > 0 || Number(d.itch) > 0
  $: filled = days.filter(isFilled).length
  // Guía visual de la escala (mismos colores que la escala del test)
  const SCALE_COLORS = ['#1f8f4e', '#f2d12e', '#f39a2b', '#e0453a']
  const HIVES_GUIDE = ['Ninguna', 'Menos de 20', 'De 20 a 50', 'Más de 50']
  const ITCH_GUIDE = ['Ninguna', 'Leve', 'Moderada', 'Alta / Severa']
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

  // ── Exportar / importar el registro (JSON anónimo: solo fechas y puntajes, nada personal) ──
  const FILE_ID = 'mas-que-urticaria-diario'
  let fileInput
  let status = ''

  function saveFile(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const link = Object.assign(document.createElement('a'), { href: url, download: name })
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function exportDiary() {
    const data = {
      archivo: FILE_ID,
      version: 1,
      exportado: dateValue(new Date()),
      dias: days.map(d => ({ dia: d.day, fecha: d.date || null, habones: Number(d.hives) || 0, comezon: Number(d.itch) || 0 })),
      totales: { habones: hivesTotal, comezon: itchTotal, uas7: hivesTotal + itchTotal }
    }
    saveFile(JSON.stringify(data, null, 2), `diario-sintomas_${dateValue(new Date())}.json`, 'application/json')
    status = 'Se descargó tu respaldo. Guárdalo para recuperar tu diario en otro navegador o dispositivo con «Cargar un registro».'
  }

  const score = v => Math.max(0, Math.min(3, Math.round(Number(v) || 0)))
  const validDate = v => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '')

  async function importDiary(event) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (data?.archivo !== FILE_ID || !Array.isArray(data.dias) || data.dias.length !== 7) throw new Error('formato')
      days = data.dias.map((d, i) => ({ day: `Día ${i + 1}`, date: validDate(d.fecha), hives: score(d.habones), itch: score(d.comezon) }))
      openDateIndex = null
      status = 'Listo, se cargó tu registro.'
    } catch {
      status = 'No pudimos leer ese archivo. Usa uno descargado desde este diario con «Descargar respaldo».'
    }
  }

  // ── Recordatorio diario durante 7 días (archivo .ics o Google Calendar) ──
  let reminderStart = dateValue(new Date())
  let reminderTime = '21:00'
  const REMINDER_TITLE = 'Registro diario de síntomas'
  $: diaryUrl = typeof window !== 'undefined' ? `${location.origin}${location.pathname}#registro` : ''
  $: reminderText = `Anota hoy tus habones (ronchas) y tu comezón en el diario: ${diaryUrl}`
  $: stamp = `${(reminderStart || dateValue(new Date())).replaceAll('-', '')}T${(reminderTime || '21:00').replace(':', '')}00`
  $: stampEnd = (() => {
    const [h, m] = (reminderTime || '21:00').split(':').map(Number)
    const end = new Date(2000, 0, 1, h, m + 10)
    if (end.getDate() !== 1) return `${stamp.slice(0, 9)}235900` // no cruzar la medianoche
    return `${stamp.slice(0, 9)}${String(end.getHours()).padStart(2, '0')}${String(end.getMinutes()).padStart(2, '0')}00`
  })()

  const icsEscape = v => v.replace(/[\\;,]/g, m => `\\${m}`).replace(/\n/g, '\\n')

  function downloadIcs() {
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mas que Urticaria//Diario de sintomas//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:diario-${now}-${Math.random().toString(36).slice(2)}@masqueurticaria`,
      `DTSTAMP:${now}`,
      `DTSTART:${stamp}`,
      `DTEND:${stampEnd}`,
      'RRULE:FREQ=DAILY;COUNT=7',
      `SUMMARY:${icsEscape(REMINDER_TITLE)}`,
      `DESCRIPTION:${icsEscape(reminderText)}`,
      `URL:${diaryUrl}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(REMINDER_TITLE)}`, 'TRIGGER:PT0M', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n')
    saveFile(ics, 'recordatorio-diario-sintomas.ics', 'text/calendar')
    status = 'Listo. Si tu calendario no se abrió solo, abre el archivo descargado para guardar el recordatorio: se repite 7 días a la hora que elegiste.'
  }
</script>

<svelte:window on:keydown={closeCalendar} on:scroll={() => openDateIndex = null} on:resize={() => openDateIndex = null} />

<section class="symptom-diary print-sheet" id="registro" aria-labelledby="diary-tool-title">
  <div class="diary-tool-heading">
    <div><p class="eyebrow">Registro personal</p><h2 id="diary-tool-title">Mi Diario de Síntomas</h2></div>
  </div>
  <div class="diary-privacy no-print"><PrivacyNote variant="banner" /></div>
  <div class="diary-topbar">
    <div class="diary-progress">
      <ol aria-hidden="true">{#each days as d, i}<li class:done={isFilled(d)}>{#if isFilled(d)}<Icon name="check" size={14} />{:else}{i + 1}{/if}</li>{/each}</ol>
      <p role="status">Llevas <strong>{filled} de 7</strong> días registrados</p>
    </div>
    <div class="diary-reminder no-print">
      <div class="diary-reminder-head">
        <span class="diary-reminder-icon" aria-hidden="true"><Icon name="calendar_month" size={20} /></span>
        <div><h3>Recordatorio diario</h3><p>Un aviso en tu calendario para llenar el diario los 7 días.</p></div>
      </div>
      <div class="diary-reminder-row">
        <label>Empieza el <input type="date" bind:value={reminderStart} /></label>
        <label>A las <input type="time" bind:value={reminderTime} /></label>
        <button class="button" type="button" on:click={downloadIcs}><Icon name="calendar_month" size={18} />Guardar en mi calendario</button>
      </div>
    </div>
  </div>
  <div class="diary-legend">
    <div><strong>Habones (ronchas) en 24 h</strong><ul>{#each HIVES_GUIDE as label, n}<li><i style={`background:${SCALE_COLORS[n]}`}>{n}</i>{label}</li>{/each}</ul></div>
    <div><strong>Comezón</strong><ul>{#each ITCH_GUIDE as label, n}<li><i style={`background:${SCALE_COLORS[n]}`}>{n}</i>{label}</li>{/each}</ul></div>
  </div>
  <div class="diary-table-wrap">
    <table class="diary-table">
      <thead><tr><th scope="col">Día</th><th scope="col">Fecha</th><th scope="col">Habones (ronchas)<br /><small>0 a 3</small></th><th scope="col">Comezón<br /><small>0 a 3</small></th></tr></thead>
      <tbody>
        {#each days as day, i (day.day)}
          <tr>
            <th scope="row">{day.day}</th>
            <td class="cell-date">
              <span class="cell-label" aria-hidden="true">Fecha</span>
              <span class="sr-only" id={`diary-date-label-${i}`}>Fecha, {day.day}</span>
              <button class="diary-date-trigger" id={`diary-date-${i}`} type="button" aria-labelledby={`diary-date-label-${i} diary-date-value-${i}`} aria-haspopup="dialog" aria-expanded={openDateIndex === i} on:click={(event) => openDatePicker(i, event)}>
                <span id={`diary-date-value-${i}`} class:diary-date-placeholder={!day.date}>{day.date ? formatDate(day.date) : 'Elegir fecha'}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 15H5V9h14v10ZM7 11h3v3H7z" /></svg>
              </button>
            </td>
            <td><span class="cell-label" aria-hidden="true">Habones (ronchas)</span><label class="sr-only" for={`diary-hives-${i}`}>Habones (ronchas), {day.day}</label><select style={`--score:${SCALE_COLORS[day.hives] || 'transparent'}`} id={`diary-hives-${i}`} aria-label={`Habones (ronchas), ${day.day}`} bind:value={day.hives}>{#each [0, 1, 2, 3] as score}<option value={score}>{score} · {HIVES_GUIDE[score]}</option>{/each}</select></td>
            <td><span class="cell-label" aria-hidden="true">Comezón</span><label class="sr-only" for={`diary-itch-${i}`}>Comezón, {day.day}</label><select style={`--score:${SCALE_COLORS[day.itch] || 'transparent'}`} id={`diary-itch-${i}`} aria-label={`Comezón, ${day.day}`} bind:value={day.itch}>{#each [0, 1, 2, 3] as score}<option value={score}>{score} · {ITCH_GUIDE[score]}</option>{/each}</select></td>
          </tr>
        {/each}
      </tbody>
      <tfoot><tr><th scope="row">Suma de la semana</th><td class="cell-date"></td><td><span class="cell-label" aria-hidden="true">Habones</span>{hivesTotal}</td><td><span class="cell-label" aria-hidden="true">Comezón</span>{itchTotal}</td></tr></tfoot>
    </table>
  </div>
  {#if filled === 7}
    <UasGauge total={hivesTotal + itchTotal} titulo="Tu puntaje UAS7 de esta semana" aviso="Es la suma de habones (ronchas) y comezón de los 7 días. Llévalo a tu consulta: solo un especialista puede evaluar tu actividad." {ref} />
  {:else}
    <!-- El UAS7 solo es válido con 7 días: con menos, la suma siempre sale baja y puede confundir -->
    <div class="diary-partial">
      <p class="diary-partial-head"><span>Puntaje parcial · {filled} de 7 días</span><strong>{hivesTotal + itchTotal} <small>hasta ahora</small></strong></p>
      <div class="diary-partial-bar" aria-hidden="true"><span style={`width:${(filled / 7) * 100}%`}></span></div>
      <p>Completa los 7 días para obtener tu puntaje UAS7. Elige la fecha de cada día, aunque no hayas tenido síntomas.</p>
    </div>
  {/if}
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
  <p class="diary-saved no-print" class:failed={saveFailed} aria-live="polite">
    {#if saveFailed}No se pudo guardar en este navegador (puede estar en modo privado). Descarga un respaldo antes de cerrar la página.
    {:else}<Icon name="check" size={16} /> Se guarda automáticamente en este dispositivo{#if savedLabel} · último cambio {savedLabel}{/if}{/if}
  </p>
  {#if filled < 7}
    <p class="diary-report-wait no-print"><Icon name="calendar_month" size={18} /><span>Tu informe para el médico estará listo al completar los 7 días <strong>(llevas {filled} de 7)</strong>.</span></p>
  {/if}
  <div class="diary-tool-actions no-print">
    {#if filled === 7}<button class="button" type="button" on:click={() => window.print()}><Icon name="download" size={18} />Descargar informe para mi médico (PDF)</button>{/if}
    <button class="button secondary" type="button" on:click={exportDiary}><Icon name="download" size={18} />Descargar respaldo</button>
    <button class="text-button" type="button" on:click={() => fileInput.click()}>Cargar un registro</button>
    <input class="sr-only" type="file" accept=".json,application/json" tabindex="-1" aria-hidden="true" bind:this={fileInput} on:change={importDiary} />
    <button class="text-button" type="button" on:click={clearDiary}>Borrar este registro</button>
    {#if filled < 7}<button class="text-button" type="button" on:click={() => window.print()}>Imprimir de todos modos</button>{/if}
  </div>

  <p class="diary-status no-print" role="status" aria-live="polite">{status}</p>
</section>
