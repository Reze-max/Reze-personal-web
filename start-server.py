# -*- coding: utf-8 -*-
"""Start the local website and AI API together; requires Node.js 24.5+."""
from pathlib import Path
import subprocess

if __name__ == "__main__":
    try:
        subprocess.run(["node", "--use-env-proxy", "server.mjs"], cwd=Path(__file__).resolve().parent, check=True)
    except KeyboardInterrupt:
        pass
