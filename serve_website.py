from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os
import json
import mimetypes

HOST = 'localhost'
PORT = 8000
WEBSITE_PATH = "./website"

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Example: parse query string
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        query = urllib.parse.parse_qs(parsed_path.query)

        # for serving the website
        if path == "/":
            path  = "/index.html"

        file_path = WEBSITE_PATH+path

        #print(file_path)

        if os.path.exists(file_path): 

            # Customize GET response here
            self.send_response(200)
            self.send_header('Content-type', mimetypes.guess_type(file_path)[0])
            self.end_headers()

            
            f = open(file_path, "rb")
            response = f.read()
            self.wfile.write(response)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        # Get length of POST data
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode()

        # Example: parse POST body if form-encoded
        parsed_data = urllib.parse.parse_qs(post_data)

        # Customize POST response here
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        print(parsed_data)

        response = {
            "message": "POST request received",
            "data": parsed_data,
        }
        self.wfile.write(json.dumps(response).encode())

if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), MyHandler)
    print(f"Serving on http://{HOST}:{PORT}")
    server.serve_forever()
