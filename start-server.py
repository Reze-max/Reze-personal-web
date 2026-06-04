# -*- coding: utf-8 -*-
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
WORK_DIR = os.path.dirname(os.path.abspath(__file__))

os.chdir(WORK_DIR)
print(f"Serving directory: {WORK_DIR}")
print(f"Preview URL:  http://localhost:{PORT}/preview.html")
print(f"Press Ctrl+C to stop the server\n")

server = HTTPServer(("", PORT), SimpleHTTPRequestHandler)
try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    server.shutdown()
