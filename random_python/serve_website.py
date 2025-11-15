from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os
import json
import mimetypes
import threading
import time

HOST = '0.0.0.0'
PORT = 81
WEBSITE_PATH = "./website"

wind_speed = 0

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
        post_data = self.rfile.read(content_length)  # read the raw POST data

        # If the POST is JSON
        try:
            data = json.loads(post_data)
            print("Received JSON data:", data)
            
            if (data["command"] == "set_wind_speed"):
                wind_speed = data["wind_speed"]
        except json.JSONDecodeError:
            data = post_data.decode('utf-8')  # fallback to raw text
            print("Received raw data:", data)

        # Customize POST response here
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        response = {
            "message": "POST request received",
            "data": "hello",
        }
        self.wfile.write(json.dumps(response).encode())
        
def start_server():
    server = HTTPServer((HOST, PORT), MyHandler)
    print("Server running on port "+str(port))
    server.serve_forever()

if __name__ == "__main__":
    # Start server in a separate thread
    threading.Thread(target=start_server, daemon=True).start()
    
    print("Serve is non blocking")
    
    while True:
        
        time.sleep(1)
