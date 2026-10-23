"""Preserve the supplied PPTX template while replacing screenshot inventory.

Uses native Open XML because the supplied Artifact Tool runtime is unavailable
on this host. No slide layout or screenshot is reconstructed from shapes.
"""
import copy
import json
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
BUILD = Path(__file__).resolve().parent
SOURCE = ROOT / 'Novartis_Mas_Que_Urticaria_Catalogo_Pantallas.pptx'
OUTPUT = ROOT / 'output' / 'Novartis_Mas_Que_Urticaria_Catalogo_Pantallas_Ajustado.pptx'
NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'pr': 'http://schemas.openxmlformats.org/package/2006/relationships',
    'ct': 'http://schemas.openxmlformats.org/package/2006/content-types',
}
for prefix in ['p', 'a', 'r']:
    ET.register_namespace(prefix, NS[prefix])

def xml(element):
    return ET.tostring(element, encoding='utf-8', xml_declaration=True)

def write_paragraph(paragraph, value):
    # Keep the original paragraph formatting and replace only its text runs.
    runs = paragraph.findall('a:r', NS)
    exemplar = copy.deepcopy(runs[0]) if runs else ET.Element('{%s}r' % NS['a'])
    for node in list(paragraph):
        if node.tag in ['{%s}r' % NS['a'], '{%s}br' % NS['a'], '{%s}fld' % NS['a']]:
            paragraph.remove(node)
    for i, line in enumerate(value.split('\n')):
        if i:
            ET.SubElement(paragraph, '{%s}br' % NS['a'])
        run = copy.deepcopy(exemplar)
        text = run.find('a:t', NS)
        if text is None:
            text = ET.SubElement(run, '{%s}t' % NS['a'])
        text.text = line
        paragraph.append(run)

def replace_paragraphs(element, values):
    paragraphs = element.findall('.//a:p', NS)
    meaningful = [p for p in paragraphs if p.findall('a:r', NS)]
    assert len(meaningful) == len(values), (len(meaningful), len(values))
    for p, value in zip(meaningful, values):
        write_paragraph(p, value)

def shorten_title(title):
    swaps = {
        'Home Principal — Escenario Día (General)': 'Inicio: escenario día',
        'Home Principal — Escenario Calor (Temperatura Alta / Sol)': 'Inicio: escenario calor',
        'Home Principal — Escenario Frío (Invierno / Aire Helado)': 'Inicio: escenario frío',
        'Home Principal — Escenario Madrugada (Modo Oscuro 2am - 5am)': 'Inicio: escenario madrugada',
        'Home Principal — Escenario Noche Cálida': 'Inicio: escenario noche cálida',
        'Síntomas de la Urticaria Crónica Espontánea (/sintomas/)': 'Síntomas de la UCE (/sintomas/)',
        'Sobre Nosotros — Más que Urticaria (/sobre-nosotros/)': 'Sobre nosotros (/sobre-nosotros/)',
        'Diario de Síntomas — Bitácora Interactiva (/diario/)': 'Diario de Síntomas (/diario/)',
        "Testimonios y Comunidad — 'No lo estás imaginando' (/testimonios/)": 'Testimonios y comunidad (/testimonios/)',
        'Directorio Médico de Especialistas — Landing Principal (/directorio-medico/)': 'Directorio médico (/directorio-medico/)',
        'Resultado — Síntomas e impacto altos; tratamiento poco efectivo': 'Resultado: tratamiento poco efectivo',
        'Resultado — Sin consulta y sin tratamiento previo (saltos Q15–Q16 y Q18–Q19)': 'Resultado: sin consulta ni tratamiento previo',
        'Resultado — Tratamiento muy efectivo y acceso al directorio': 'Resultado: tratamiento muy efectivo',
        'Directorio dentro del quiz — Buscador y acceso para volver': 'Quiz: directorio y botón Volver',
        'Q3 — Cantidad de ronchas (solo si se marcaron ronchas)': 'Q3: Cantidad de ronchas (si Q1 incluye ronchas)',
        'Q4 — Intensidad de comezón (solo si se marcó comezón)': 'Q4: Intensidad de comezón (si Q1 incluye comezón)',
        'Q5 — Severidad de hinchazón (solo si se marcó hinchazón)': 'Q5: Severidad de hinchazón (si Q1 incluye hinchazón)',
        ' (solo si se marcó esta área en Q6)': ' (si se seleccionó en Q6)',
        'Artículo Blog 1: ¿Qué significa UCE? (/blog/que-significa-uce/)': 'Blog: ¿Qué significa UCE?',
        'Artículo Blog 2: Guía para preparar tu consulta (/blog/preparar-consulta/)': 'Blog: Guía para preparar tu consulta',
        'Artículo Blog: Mitos sobre dietas restrictivas (/blog/dietas-restrictivas-uce/)': 'Blog: Mitos sobre dietas restrictivas',
    }
    for old, new in swaps.items():
        title = title.replace(old, new)
    return title.replace(' — ', ': ').replace('Q8B', 'Q8b')

def main():
    sections = json.loads((BUILD / 'manifest.json').read_text(encoding='utf-8'))
    # Put the urgent branch beside the question that triggers it.
    urgent = next(s for s in sections[3]['screens'] if s['source'] == 'Quiz: urgencia')
    sections[3]['screens'].remove(urgent)
    urgent_index = next(i for i, s in enumerate(sections[3]['screens']) if s['source'] == 'Quiz: q1b')
    sections[3]['screens'].insert(urgent_index + 1, urgent)
    total = sum(len(s['screens']) for s in sections)
    z = zipfile.ZipFile(SOURCE)
    data = {n: z.read(n) for n in z.namelist()}
    templates = {i: ET.fromstring(data[f'ppt/slides/slide{i}.xml']) for i in [1, 2, 3, 4, 9, 14, 19, 47]}
    for n in list(data):
        if re.match(r'ppt/slides/(slide\d+\.xml|_rels/slide\d+\.xml\.rels)$', n) or n.startswith('ppt/media/') or n.startswith('ppt/notesSlides/'):
            del data[n]
    slide_list = []
    inventory = []

    cover = copy.deepcopy(templates[1])
    replace_paragraphs(cover, [
        'NOVARTIS MÉXICO · MÁS QUE URTICARIA',
        'Catálogo Visual de Pantallas y Flujos',
        'Capturas del sitio y del cuestionario en formato laptop 1366 × 768, incluyendo contenido inferior y estados interactivos.\nHome, información, recursos, quiz y directorio médico.',
        'Octubre 2026 | Responsables: Amauri Rodríguez Santos / Edward Alarcón',
    ])
    slide_list.append((cover, None, None))
    index = copy.deepcopy(templates[2])
    descriptions = [
        'Inicio, contenido inferior y variantes según clima y hora.',
        'Síntomas, tratamientos, institución, preguntas frecuentes y 404.',
        'Diario, biblioteca visual y formulario de testimonios.',
        'Preguntas, urgencia, resultados, resumen y directorio.',
        'Directorio médico y los cuatro artículos del blog.',
    ]
    vals = ['ESTRUCTURA DEL SITIO WEB', f'Índice de secciones y capturas ({total} vistas)']
    for section, desc in zip(sections, descriptions):
        vals.extend([section['code'], section['name'].replace(' & ', ' Y '), f"{len(section['screens'])} vistas", desc])
    replace_paragraphs(index, vals)
    slide_list.append((index, None, None))
    counter = 0
    for sec_index, section in enumerate(sections):
        sep = copy.deepcopy(templates[[3, 9, 14, 19, 47][sec_index]])
        replace_paragraphs(sep, [
            section['code'],
            section['name'].replace(' & ', ' Y '),
            descriptions[sec_index] + f"\nTotal de capturas en este bloque: {len(section['screens'])}",
        ])
        slide_list.append((sep, None, None))
        for screenshot in section['screens']:
            counter += 1
            slide = copy.deepcopy(templates[4])
            title = shorten_title(screenshot['title'])
            replace_paragraphs(slide, [f"{screenshot['section']} · VISTA {counter:02d} DE {total}", title])
            slide.find('.//p:pic/p:nvPicPr/p:cNvPr', NS).set('descr', title)
            # Screenshot geometry is unchanged: every capture is 1366 × 768.
            slide_list.append((slide, BUILD / screenshot['file'], screenshot))
            inventory.append({'slide': len(slide_list), 'view': counter, 'title': title, **screenshot})

    ct = ET.fromstring(data['[Content_Types].xml'])
    for child in list(ct):
        part = child.get('PartName', '')
        if part.startswith('/ppt/slides/') or part.startswith('/ppt/notesSlides/'):
            ct.remove(child)
    presentation = ET.fromstring(data['ppt/presentation.xml'])
    ids = presentation.find('p:sldIdLst', NS)
    for child in list(ids):
        ids.remove(child)
    rels = ET.fromstring(data['ppt/_rels/presentation.xml.rels'])
    for child in list(rels):
        if child.get('Type', '').endswith('/slide'):
            rels.remove(child)
    next_rid = max([int(x.get('Id')[3:]) for x in rels] + [0]) + 1

    for i, (slide, image, screenshot) in enumerate(slide_list, 1):
        data[f'ppt/slides/slide{i}.xml'] = xml(slide)
        ET.SubElement(ct, '{%s}Override' % NS['ct'], PartName=f'/ppt/slides/slide{i}.xml', ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml')
        relation_id = f'rId{next_rid + i}'
        ET.SubElement(ids, '{%s}sldId' % NS['p'], id=str(255+i), attrib={'{%s}id' % NS['r']: relation_id})
        ET.SubElement(rels, '{%s}Relationship' % NS['pr'], Id=relation_id, Type=NS['r']+'/slide', Target=f'slides/slide{i}.xml')
        slide_rels = ET.Element('{%s}Relationships' % NS['pr'])
        ET.SubElement(slide_rels, '{%s}Relationship' % NS['pr'], Id='rId1', Type=NS['r']+'/slideLayout', Target='../slideLayouts/slideLayout7.xml')
        if image:
            data[f'ppt/media/capture{i}.png'] = image.read_bytes()
            ET.SubElement(slide_rels, '{%s}Relationship' % NS['pr'], Id='rId2', Type=NS['r']+'/image', Target=f'../media/capture{i}.png')
        data[f'ppt/slides/_rels/slide{i}.xml.rels'] = xml(slide_rels)
    data['ppt/presentation.xml'] = xml(presentation)
    data['ppt/_rels/presentation.xml.rels'] = xml(rels)
    ET.register_namespace('', NS['ct'])
    data['[Content_Types].xml'] = xml(ct)
    app = ET.fromstring(data['docProps/app.xml'])
    for child in app:
        if child.tag.endswith('}Slides'):
            child.text = str(len(slide_list))
    data['docProps/app.xml'] = xml(app)
    OUTPUT.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED) as dest:
        for name, value in data.items():
            dest.writestr(name, value)
    (BUILD / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'output': str(OUTPUT), 'slides': len(slide_list), 'captures': total, 'sections': [len(s['screens']) for s in sections]}, ensure_ascii=False))

if __name__ == '__main__':
    main()
