import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const req=createRequire(import.meta.url);
const {chromium}=req('C:/Users/Amauri/AppData/Local/OpenAI/Codex/runtimes/cua_node/cfb32733c877621e/bin/node_modules/playwright');
const root=process.cwd(), dir=path.join(root,'scratch/ppt_revision');
const orig=JSON.parse(await fs.readFile(path.join(dir,'sections_original.json'),'utf8'));
const sections=orig.map(s=>({...s,screens:[]}));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce',ignoreHTTPSErrors:true});
const page=await context.newPage();
let serial=0;
async function settle(){await page.mouse.move(10,750);await page.waitForTimeout(400);await page.evaluate(()=>document.fonts.ready);}
async function shot(sec,title,source){await settle();let file='capture_'+String(++serial).padStart(3,'0')+'.png';await page.screenshot({path:path.join(dir,file)});sections[sec].screens.push({file,title,section:orig[sec].screens[0].section,source}); console.log(serial,title);}
async function nav(url){await page.goto('http://127.0.0.1:4174'+url,{waitUntil:'load'});await page.waitForTimeout(850);await page.locator('h1').first().waitFor({state:'visible'});await settle();}
async function paged(sec,title,source,scroller=null){
 let dim=await page.evaluate(sel=>{let el=sel?document.querySelector(sel):document.scrollingElement;return {height:el.scrollHeight,client:sel?el.clientHeight:innerHeight};},scroller);
 let max=Math.max(0,dim.height-dim.client), stride=dim.client-120;
 let ys=[];for(let y=0;y<max;y+=stride)ys.push(y);if(!ys.length||ys.at(-1)!==max)ys.push(max);
 for(let i=0;i<ys.length;i++){await page.evaluate(({sel,y})=>{(sel?document.querySelector(sel):document.scrollingElement).scrollTo({top:y,behavior:'instant'});},{sel:scroller,y:ys[i]});await settle();await shot(sec,title+(ys.length>1?' — Captura '+(i+1)+' de '+ys.length:''),source);}
}
const routes={'01_home_dia.png':'/?vista=dia','02_home_calor.png':'/?vista=calor','03_home_frio.png':'/?vista=frio','04_home_madrugada.png':'/?vista=madrugada','05_home_noche_calor.png':'/?vista=noche-calor','06_sintomas.png':'/sintomas/?vista=dia','07_tratamiento.png':'/tratamiento/?vista=dia','08_sobre_nosotros.png':'/sobre-nosotros/?vista=dia','09_error_404.png':'/pagina-inexistente/?vista=dia','10_recursos_hub.png':'/recursos-herramientas/?vista=dia','11_diario_sintomas.png':'/diario/?vista=dia','12_testimonios_comunidad.png':'/testimonios/?vista=dia','18_quiz_intro_landing.png':'/test/?vista=dia','13_directorio_landing.png':'/directorio-medico/?vista=dia','14_blog_feed.png':'/blog/?vista=dia','15_blog_articulo_1.png':'/blog/que-significa-uce/?vista=dia','16_blog_articulo_2.png':'/blog/preparar-consulta/?vista=dia','17_blog_articulo_3.png':'/blog/dietas-restrictivas-uce/?vista=dia'};
for(const sec of [0,1,2]){
 for(const s of orig[sec].screens){if(!routes[s.file])continue;await nav(routes[s.file]);if(sec===0&&s.file!=='01_home_dia.png')await shot(sec,s.title,routes[s.file]);else await paged(sec,s.title,routes[s.file]);
 if(s.file==='11_diario_sintomas.png'){
 await page.locator('#registro').scrollIntoViewIfNeeded();await page.locator('#diary-date-0').click();await shot(sec,'Diario — Selector de fecha','/diario/');await page.getByRole('button',{name:'Hoy',exact:true}).click();await page.locator('#diary-hives-0').selectOption('2');await page.locator('#diary-itch-0').selectOption('3');await page.locator('#registro').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await shot(sec,'Diario — Registro con datos de ejemplo y totales','/diario/');}
 if(s.file==='12_testimonios_comunidad.png'){
 await page.getByRole('button',{name:'Compartir mi Historia',exact:true}).click();await page.locator('#compartir').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await shot(sec,'Testimonios — Formulario para compartir de forma anónima','/testimonios/');await page.locator('input[type=radio][value=nombre]').check();await page.locator('#compartir').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await shot(sec,'Testimonios — Formulario con nombre opcional','/testimonios/');await page.locator('input[type=radio][value=anonimo]').check();await page.locator('#share-title').fill('Ejemplo de registro para preparar mi consulta');await page.locator('#share-story').fill('Estoy anotando cuándo aparecen los síntomas para comentarlo en mi próxima consulta.');await page.locator('#share-consent').check();await page.locator('.composer-form').evaluate(el=>el.scrollIntoView({block:'end',behavior:'instant'}));await shot(sec,'Testimonios — Consentimiento y envío de historia de ejemplo','/testimonios/');await page.getByRole('button',{name:'Enviar mi historia',exact:false}).click();await page.locator('#compartir').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await shot(sec,'Testimonios — Confirmación del registro en el prototipo','/testimonios/');}
 }
 if(sec===0){await nav('/videos/?vista=dia');await shot(sec,'Inicio — Variante con video contextual','/videos/');}
 if(sec===1){await page.goto('http://127.0.0.1:4174/sintomas/?vista=dia',{waitUntil:'load'});let faqs=page.locator('details').first();if(await faqs.count()){await faqs.locator('summary').click();await faqs.scrollIntoViewIfNeeded();await shot(sec,'Síntomas — Pregunta frecuente desplegada','/sintomas/');}}
 if(sec===2){await nav('/recursos-herramientas/?vista=dia#biblioteca');await page.locator('#biblioteca').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.locator('.photo-tile').first().click();await shot(sec,'Biblioteca visual — Imagen ampliada','/recursos-herramientas/#biblioteca');}
}
await nav('/test/?vista=dia');await paged(3,'Introducción al Test de Síntomas (/test/)','/test/');
async function openQuiz(){await nav('/?vista=dia');await page.locator('.hero button').first().click();await page.locator('.modal-inner').waitFor();await settle();}
async function next(){await page.locator('.quiz-nav .nav-next').click();await settle();}
async function pick(label){await page.locator('.options button').filter({hasText:label}).first().click();await settle();}
await openQuiz();await shot(3,'Q0 — Nombre opcional','Quiz: q0');await next();await pick('Ronchas en la piel');await pick('Comezón intensa');await pick('Hinchazón');await shot(3,'Q1 — Síntomas presentados (selección múltiple)','Quiz: q1');await next();await shot(3,'Q1b — Descarte de urgencia (solo si hay hinchazón)','Quiz: q1b');await pick('No — es en párpados');
await shot(3,'Q2 — Tiempo con síntomas','Quiz: q2');await pick('Más de 6 meses');await shot(3,'Q3 — Cantidad de ronchas (solo si se marcaron ronchas)','Quiz: q3');await pick('Moderada (De 20 a 50');await shot(3,'Q4 — Intensidad de comezón (solo si se marcó comezón)','Quiz: q4');await pick('Alta / Severa');await shot(3,'Q5 — Severidad de hinchazón (solo si se marcó hinchazón)','Quiz: q5');await pick('Moderada');
for(const label of ['Actividades diarias','Vida social y relaciones','Vida sexual','Elección de vestimenta','Trabajo o estudios','Calidad de sueño'])await pick(label);
await shot(3,'Q6 — Áreas de vida afectadas (selección múltiple)','Quiz: q6');await next();
for(const [id,title] of [['q7','Actividades diarias'],['q8','Relaciones familiares y sociales'],['q8b','Vida sexual'],['q9','Vestimenta'],['q10','Trabajo o estudios'],['q11','Sueño']]){await shot(3,id.toUpperCase()+' — '+title+' (solo si se marcó esta área en Q6)','Quiz: '+id);await pick('Mucho');}
await pick('Clima caliente');await pick('Estrés emocional');await shot(3,'Q12 — Posibles desencadenantes (selección múltiple)','Quiz: q12');await next();await shot(3,'Q13 — Momento de mayor intensidad','Quiz: q13');await pick('Por la noche o madrugada');await shot(3,'Q14 — Consulta médica previa','Quiz: q14');await pick('Sí');await shot(3,'Q15 — Frecuencia de consulta (solo si Q14 = Sí)','Quiz: q15');await pick('Frecuentemente');await pick('Dermatólogo/a');await shot(3,'Q16 — Especialistas consultados (solo si Q14 = Sí)','Quiz: q16');await next();await shot(3,'Q17 — Tratamiento previo','Quiz: q17');await pick('Sí');await pick('Intermedio');await shot(3,'Q18 — Tipos de tratamiento (solo si Q17 = Sí)','Quiz: q18');await next();await shot(3,'Q19 — Efectividad del tratamiento (solo si Q17 = Sí)','Quiz: q19');await pick('Poco efectivo');await paged(3,'Resultado — Síntomas e impacto altos; tratamiento poco efectivo','Quiz: resultado con tratamiento poco efectivo','.modal');
await page.getByRole('button',{name:'Copiar',exact:true}).click();await shot(3,'Resultado — Confirmación de copia del resumen','Quiz: copiar');
const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar resumen',exact:true}).click()]);await download.saveAs(path.join(dir,'resumen_ejemplo.pdf'));await shot(3,'Resultado — Confirmación de descarga del resumen','Quiz: descargar');
await page.getByRole('button',{name:'Mira nuestro directorio médico',exact:true}).click();await paged(3,'Directorio dentro del quiz — Buscador y acceso para volver','Quiz: directorio','.modal');
await openQuiz();await next();await pick('Hinchazón');await next();await pick('Sí — labios');await shot(3,'Urgencia — Interrupción del cuestionario y llamada al 911','Quiz: urgencia');
await openQuiz();await next();await pick('Ninguno de estos');await next();await paged(3,'Resultado — Ruta sin síntomas (Q1 = Ninguno)','Quiz: sin síntomas','.modal');
async function shortResult(effective=null){await openQuiz();await next();await pick('Ronchas en la piel');await pick('Comezón intensa');await next();await pick('Más de 6 meses');await pick('Moderada (De 20 a 50');await pick('Moderada');await pick('Actividades diarias');await next();await pick('Mucho');await pick('No identifico ningún');await next();await pick('Sin importar');await pick('No');await pick(effective===null?'No':'Sí');if(effective!==null){await pick('Intermedio');await next();await pick(effective);} }
await shortResult();await paged(3,'Resultado — Sin consulta y sin tratamiento previo (saltos Q15–Q16 y Q18–Q19)','Quiz: sin consulta ni tratamiento','.modal');
await shortResult('Muy efectivo');await paged(3,'Resultado — Tratamiento muy efectivo y acceso al directorio','Quiz: tratamiento muy efectivo','.modal');
for(const s of orig[4].screens){await nav(routes[s.file]);await paged(4,s.title.replace('Artículo Blog 3:','Artículo Blog:'),routes[s.file]);if(s.file==='13_directorio_landing.png'){await page.locator('.directory').first().count().then(async n=>{if(n)await page.locator('.directory').first().scrollIntoViewIfNeeded();});let b=page.getByRole('button',{name:/Dermatología/}).first();if(await b.count()){await b.click();await shot(4,'Directorio — Resultados filtrados por dermatología','/directorio-medico/');}}}
await nav('/blog/estres-y-observaciones/?vista=dia');await paged(4,'Artículo Blog — ¿La urticaria empeora con el estrés?','/blog/estres-y-observaciones/');
sections[0].desc='Inicio, contenido inferior y variantes visuales según clima y hora.';
sections[1].desc='Información sobre síntomas, tratamientos e institución, preguntas frecuentes y pantalla 404.';
sections[2].desc='Recursos, diario interactivo, biblioteca visual y estados del formulario de testimonios.';
sections[3].desc='Preguntas Q0–Q19 y condicionales Q1b y Q8b, urgencia, resultados, resumen y directorio.';
sections[4].desc='Directorio de especialistas, catálogo del blog y sus cuatro artículos.';
await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify(sections,null,2));
console.log('DONE',serial);await browser.close();
