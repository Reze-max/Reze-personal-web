"""Package only public website files, never server files or credentials."""
from pathlib import Path
import shutil
import re
import hashlib

root = Path(__file__).resolve().parents[1]
output = root / '_site'
output.mkdir(exist_ok=True)
for name in ['index.html', 'site.css', 'chat.css', 'chat.js', 'theme.css', 'guitar.css', 'guitar.js', 'hero-video.css', 'hero-video.js', 'media-cache.js']:
    shutil.copy2(root / name, output / name)
for file in root.iterdir():
    if file.is_file() and file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.pdf', '.pbix', '.twbx']:
        shutil.copy2(file, output / file.name)
shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
# Version frontend resources so a new deployment does not reuse stale styles/scripts.
html = (output / 'index.html').read_text(encoding='utf-8')
def version(match):
    prefix, name = match.groups()
    file = output / name
    return prefix + name + '?v=' + hashlib.sha256(file.read_bytes()).hexdigest()[:12] + '"'
html = re.sub(r'((?:href|src)=")([^"?]+\.(?:css|js|mp4))"', version, html)
(output / 'index.html').write_text(html, encoding='utf-8')
(output / '.nojekyll').write_text('')
print('Public Pages artifact prepared.')
