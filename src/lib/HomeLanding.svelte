<script>
  import { casos } from './testimonios.js'
  import { homeArticles, homeSources, routeHref } from './siteContent.js'
  import { blogDrafts } from './blogDrafts.js'
  import Icon from './Icon.svelte'
  import Cita from './Cita.svelte'
  import SkinSamples from './SkinSamples.svelte'
  import Fuentes from './Fuentes.svelte'
  import { reveal } from './reveal.js'

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  const imageFor = slug => {
    const image = blogDrafts.find(draft => draft.slug === slug)?.image
    return image ? `${baseUrl}${image}` : null
  }

  const facts = [
    { value: '+6', unit: 'semanas', text: 'con habones (ronchas) o hinchazón (angioedema) que van y vienen', refs: [1, 2] },
    { value: 'No', unit: 'es contagiosa', text: 'ni es tu culpa', refs: 3 },
    { value: 'Sí', unit: 'tiene tratamiento', text: 'con un alergólogo o dermatólogo', refs: 1 }
  ]

  const route = [
    { icon: 'quiz', title: 'Reconoce tus síntomas', text: 'Identifica las diferencias clave entre una alergia común y la urticaria crónica realizando nuestro test de orientación en menos de 5 minutos.', tag: 'Menos de 5 minutos', cta: 'Hacer el test', href: routeHref('test') },
    { icon: 'download', title: 'Registra tus brotes', text: 'Lleva tu bitácora diaria mediante nuestra Web App gratuita o descargando la plantilla imprimible en PDF para llevarla a tu cita médica.', tag: 'Web App gratuita · PDF', cta: 'Abrir el diario', href: routeHref('diario') },
    { icon: 'stethoscope', title: 'Encuentra tratamiento', text: 'Conoce cómo se aborda la urticaria crónica espontánea y prepara tu conversación con un alergólogo o dermatólogo.', tag: 'Dermatólogos y alergólogos', cta: 'Buscar especialista', href: routeHref('directorio-medico') }
  ]

  const stories = casos.filter(caso => caso.homeQuote)

  const pillars = ['Romper el aislamiento', 'Educar a la sociedad', 'Herramientas prácticas para tu bienestar']

</script>

<div class="home-landing" use:reveal>
  <section class="home-definition" aria-labelledby="home-definition-title" data-reveal>
    <div class="home-definition-copy">
      <p class="eyebrow accent">Información para entender lo que pasa en tu piel</p>
      <h2 id="home-definition-title">¿Qué es la Urticaria Crónica Espontánea?</h2>
      <p class="home-lead">La urticaria crónica espontánea es una afección de la piel caracterizada por la aparición recurrente de <strong>habones (ronchas)</strong> o <strong>hinchazón (angioedema)</strong> durante más de 6 semanas, sin que exista una causa alérgica externa evidente.<Cita refs={[1, 2]} prefix="ref" /></p>
      <p>No es contagiosa ni es tu culpa. Se trata de una respuesta interna del sistema inmune que hoy en día puede tratarse con éxito si acudes con un alergólogo o dermatólogo.<Cita refs={[1, 3]} prefix="ref" /></p>
      <ul class="home-facts" aria-label="Datos clave de la urticaria crónica espontánea">
        {#each facts as fact}
          <li><strong>{fact.value}<small>{fact.unit}</small></strong><span>{fact.text}{#if fact.refs}<Cita refs={fact.refs} prefix="ref" />{/if}</span></li>
        {/each}
      </ul>
      <a class="inline-link" href={routeHref('sintomas')}>Conoce todos los síntomas en detalle <Icon name="arrow_forward" size={18} /></a>
    </div>

    <figure class="home-skin-illustration" aria-labelledby="skin-illustration-caption">
      <SkinSamples />

      <div class="home-timeline" aria-label="Diferencia entre urticaria pasajera y crónica">
        <div class="home-timeline-bar" aria-hidden="true"><span></span><i></i></div>
        <div class="home-timeline-labels">
          <p><strong>Urticaria pasajera</strong><span>Menos de 6 semanas<Cita refs={2} prefix="ref" /></span></p>
          <p><strong>Urticaria crónica</strong><span>Más de 6 semanas, con brotes recurrentes<Cita refs={2} prefix="ref" /></span></p>
        </div>
      </div>
      <figcaption id="skin-illustration-caption">Esquema informativo; la piel puede verse diferente en cada persona.</figcaption>
    </figure>
  </section>

  <section class="home-path" aria-labelledby="home-path-title" data-reveal>
    <div class="home-section-heading"><p class="eyebrow accent">Tres pasos para empezar</p><h2 id="home-path-title">Tu ruta para recuperar el control de tu piel</h2></div>
    <ol class="home-route-grid">
      {#each route as step, i}
        <li>
          <a class="home-route-card" href={step.href}>
            <div class="home-route-top">
              <span class="home-route-icon"><Icon name={step.icon} size={24} /></span>
              <span class="home-route-number" aria-hidden="true">0{i + 1}</span>
            </div>
            <span class="home-route-tag">{step.tag}</span>
            <h3>{i + 1}. {step.title}</h3>
            <p>{step.text}</p>
            <b>{step.cta} <Icon name="arrow_forward" size={17} /></b>
          </a>
        </li>
      {/each}
    </ol>
  </section>

  <section class="home-stories" aria-labelledby="home-stories-title" data-reveal>
    <div class="home-stories-intro">
      <p class="eyebrow accent">Testimonios</p>
      <h2 id="home-stories-title">Historias reales: No estás solo en este camino</h2>
      <p>Miles de mexicanos viven con urticaria crónica. Escuchar y leer cómo otros han vuelto a vivir sin limitaciones es el primer paso para no perder la esperanza.</p>
      <a class="button secondary" href={routeHref('testimonios')}>Ver todos los testimonios <Icon name="arrow_forward" size={18} /></a>
    </div>
    <div class="home-story-grid">
      {#each stories as story}
        <article class="home-story-card">
          <span class="home-story-mark" aria-hidden="true">“</span>
          <h3>Testimonio anónimo</h3>
          <blockquote>{story.homeQuote}</blockquote>
          <footer><small>Anónimo</small></footer>
        </article>
      {/each}
    </div>
  </section>

  <section class="home-blog" aria-labelledby="home-blog-title" data-reveal>
    <div class="home-section-heading home-blog-heading">
      <div><p class="eyebrow accent">Blog · Artículos de muestra</p><h2 id="home-blog-title">Aprende más sobre la Urticaria Crónica Espontánea</h2><p>Temas informativos de muestra para responder a tus dudas diarias:</p></div>
      <a class="inline-link" href={routeHref('blog')}>Ir al blog <Icon name="arrow_forward" size={18} /></a>
    </div>
    <div class="home-article-grid">
      {#each homeArticles as article}
        <article class="home-article-card">
          {#if imageFor(article.slug)}<div class="home-article-media"><img src={imageFor(article.slug)} alt="" loading="lazy" decoding="async" /></div>{/if}
          <div class="home-article-body">
            <span>Artículo de muestra</span>
            <h3><a href={routeHref(`blog/${article.slug}`)}>{article.title}</a></h3>
            <p>{article.text}</p>
            <b aria-hidden="true">Leer artículo completo <Icon name="arrow_forward" size={16} /></b>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="home-about" aria-labelledby="home-about-title" data-reveal>
    <span class="home-about-icon" aria-hidden="true"><Icon name="groups" size={30} /></span>
    <div class="home-about-copy">
      <p class="eyebrow accent">Más que Urticaria</p>
      <h2 id="home-about-title">Conoce a la comunidad 'Más que Urticaria'</h2>
      <p>Somos una asociación creada por y para personas que conviven con la urticaria crónica en México. Nuestra meta es romper el aislamiento, educar a la sociedad y brindarte herramientas prácticas para que recuperes tu bienestar.</p>
      <ul class="home-pillars">
        {#each pillars as pillar}<li><Icon name="check" size={16} />{pillar}</li>{/each}
      </ul>
    </div>
    <a class="button secondary" href={routeHref('sobre-nosotros')}>Conoce más sobre nosotros <Icon name="arrow_forward" size={18} /></a>
  </section>

  <div class="home-refs"><Fuentes sources={homeSources} prefix="ref" /></div>

  <section class="home-final" aria-labelledby="home-final-title" data-reveal>
    <div class="home-final-copy">
      <p class="eyebrow">Más que Urticaria</p>
      <h2 id="home-final-title">Da hoy el primer paso: <em>Tu vida es más grande que las ronchas</em></h2>
      <p>No te acostumbres a la comezón ni a la incertidumbre. Explora nuestras herramientas o encuentra a un alergólogo o dermatólogo hoy mismo.</p>
    </div>
    <div class="home-final-actions">
      <a class="button" href={routeHref('test')}>Ir al Test de Síntomas <Icon name="arrow_forward" size={18} /></a>
      <a class="button home-final-secondary" href={routeHref('directorio-medico')}>Buscar Especialista <Icon name="arrow_forward" size={18} /></a>
    </div>
  </section>
</div>
