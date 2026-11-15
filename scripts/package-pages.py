"""Package only public website files, never server files or credentials."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
output = root / '_site'
output.mkdir(exist_ok=True)
for name in ['index.html', 'chat.css', 'chat.js', 'theme.css', 'guitar.css', 'guitar.js', 'hero-video.css', 'hero-video.js']:
    shutil.copy2(root / name, output / name)
for file in root.iterdir():
    if file.is_file() and file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.pdf', '.pbix', '.twbx']:
        shutil.copy2(file, output / file.name)
shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
(output / '.nojekyll').write_text('')
print('Public Pages artifact prepared.')
