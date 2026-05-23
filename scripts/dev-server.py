#!/usr/bin/env python3
import http.server
import socket
import socketserver

PORT_START = 5173
PORT_TRIES = 20


def find_port(start):
    for port in range(start, start + PORT_TRIES):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("", port))
                return port
            except OSError:
                continue
    raise SystemExit(f"No free port found between {start} and {start + PORT_TRIES - 1}")


port = find_port(PORT_START)
handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", port), handler) as httpd:
    print(f"Serving at http://localhost:{port}/", flush=True)
    print(f"Contact  — http://localhost:{port}/#contact", flush=True)
    print(f"Insights — http://localhost:{port}/#insights", flush=True)
    print("Press Ctrl+C to stop.", flush=True)
    httpd.serve_forever()
