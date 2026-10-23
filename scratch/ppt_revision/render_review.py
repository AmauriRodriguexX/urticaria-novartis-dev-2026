from pathlib import Path
import fitz,json
from PIL import Image,ImageDraw
b=Path('scratch/ppt_revision'); d=b/'final_render'; p=fitz.open(d/'Novartis_Mas_Que_Urticaria_Catalogo_Pantallas_Ajustado.pdf')
assert len(p)==131,len(p)
issues=[]
for i,page in enumerate(p):
 page.get_pixmap(matrix=fitz.Matrix(4/3,4/3),alpha=False).save(d/f'slide_{i+1:03}.png')
 for block in page.get_text('dict')['blocks']:
  if block['type']!=0: continue
  x0,y0,x1,y1=block['bbox']
  if x0<0 or y0<0 or x1>page.rect.width+1 or y1>page.rect.height+1:issues.append({'slide':i+1,'bbox':block['bbox']})
for start in range(0,len(p),12):
 canvas=Image.new('RGB',(1920,3*290),(220,220,220)); draw=ImageDraw.Draw(canvas)
 for j in range(start,min(start+12,len(p))):
  img=Image.open(d/f'slide_{j+1:03}.png').resize((480,270)); x=((j-start)%4)*480; y=((j-start)//4)*290
  canvas.paste(img,(x,y));draw.text((x+4,y+271),f'Diapositiva {j+1}',fill=(0,0,0))
 canvas.save(d/f'contact_{start//12+1:02}.jpg',quality=92)
print(json.dumps({'rendered_pages':len(p),'text_outside_slide':issues,'contact_sheets':11}))
inventory=json.loads((b/'inventory.json').read_text(encoding='utf8'))
print(json.dumps([{'slide':i['slide'],'title':i['title']} for i in inventory if any(x in i['source'] for x in ['q1b','q6','resultado','tratamiento','sin síntomas','copiar','descargar','q19'])],ensure_ascii=False))
