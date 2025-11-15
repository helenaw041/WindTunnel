from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os
import json
import mimetypes

WEBSITE_PATH = "./website"
TARGET_WIND_SPEED = 12  # shared variable


class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        if path == "/":
            path = "/index.html"

        file_path = WEBSITE_PATH + path
        if os.path.exists(file_path):
            self.send_response(200)
            self.send_header('Content-type', mimetypes.guess_type(file_path)[0])
            self.end_headers()
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        global TARGET_WIND_SPEED

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data)
            if data.get("command") == "set_wind_speed":
                TARGET_WIND_SPEED = data.get("wind_speed", TARGET_WIND_SPEED)
                print(f"Target wind speed set to {TARGET_WIND_SPEED}")
        except json.JSONDecodeError:
            print("Received raw POST data:", post_data.decode("utf-8"))

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "POST received"}
        self.wfile.write(json.dumps(response).encode())


def start_server(host="0.0.0.0", port=81):
    server = HTTPServer((host, port), MyHandler)
    print(f"Server running on port {port}...")
    server.serve_forever()

