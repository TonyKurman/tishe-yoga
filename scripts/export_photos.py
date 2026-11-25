"""Export selected supplied photographs without retouching; strip EXIF metadata."""
from pathlib import Path
from PIL import Image,ImageOps
import json,hashlib
root=Path(__file__).resolve().parents[1]
selected={
 'vika-seated':'DSC08806.jpg', 'vika-smile':'DSC08804.jpg',
 'vika-portrait':'DSC08948.jpg', 'vika-grounded':'IMG_9306.JPG',
 'flow':'DSC08852.jpg', 'movement':'DSC08859.jpg',
 'hands':'DSC08837.jpg', 'stillness':'DSC08866.jpg',
 'meditation':'DSC08893.jpg', 'rest':'DSC08990.jpg',
 'balance':'DSC08909.jpg', 'detail':'DSC08775.jpg',
 'twist':'DSC08827.jpg', 'portrait-close':'DSC08780.jpg',
 'bow':'DSC08987.jpg', 'reflection':'DSC08790.jpg'
}
dest=root/'dist/assets/photos';dest.mkdir(parents=True,exist_ok=True)
manifest=[]
for name,filename in selected.items():
 source=root/'source-photos'/filename
 with Image.open(source) as original:
  image=ImageOps.exif_transpose(original).convert('RGB')
  for max_width,suffix in [(1600,''),(640,'-640')]:
   copy=image.copy();copy.thumbnail((max_width,2400 if max_width==1600 else 960),Image.Resampling.LANCZOS)
   copy.save(dest/f'{name}{suffix}.webp','WEBP',quality=87 if not suffix else 82,method=6)
  manifest.append({'asset':f'assets/photos/{name}.webp','original':filename,'original_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'original_dimensions':list(image.size),'retouching':False})
(root/'docs/photo-manifest.json').write_text(json.dumps({'source':'https://disk.yandex.ru/d/uKXhJJSy4tPhsg','date':'2026-11-25','photos':manifest},ensure_ascii=False,indent=2)+'\n')
print('Exported',len(manifest),'photographs. Total bytes:',sum(p.stat().st_size for p in dest.glob('*')))
