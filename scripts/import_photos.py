"""Download the user-provided public shoot. Originals stay local and ignored."""
import concurrent.futures,json,urllib.request,urllib.parse
from pathlib import Path
public_key='https://disk.yandex.ru/d/uKXhJJSy4tPhsg'
url='https://cloud-api.yandex.net/v1/disk/public/resources?'+urllib.parse.urlencode({'public_key':public_key,'limit':1000})
with urllib.request.urlopen(url,timeout=40) as response:items=json.load(response)['_embedded']['items']
dest=Path(__file__).resolve().parents[1]/'source-photos'
dest.mkdir(exist_ok=True)
def download(item):
 path=dest/item['name']
 if not path.exists():
  request=urllib.request.Request(item['file'],headers={'User-Agent':'Tishe website asset import'})
  with urllib.request.urlopen(request,timeout=60) as response:path.write_bytes(response.read())
 return item['name']
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for name in pool.map(download,[i for i in items if i['type']=='file']):print(name,flush=True)
