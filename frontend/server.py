# server.py
import http.server
import socketserver
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

PORT = int(os.getenv('FRONTEND_PORT', 8000))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()