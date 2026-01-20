from enum import Enum
import time
import math
import threading
import requests
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

from fan_controller import FanController
from fans.big_fan import BigFan
from fans.fan_class import Fan
from fans.small_fan import SmallFan
from pid_loop import PIDLoop
from sensors.TH_sensor import HDC3022
from sensors.pressure_sensor import ND210



class TunnelState(Enum):
    IDLE = 1
    RUNNING_MANUAL = 2
    RUNNING_PROFILE = 3

# Two type of fans (The little one and the big 20kW one)
class FanType(Enum):
    SmallFan = 1
    BigFan = 2

class Globals:
    tunnel_state: TunnelState = TunnelState.IDLE
    fan_type: FanType
    loop: PIDLoop
    controller: FanController
    
    
    air_density: float = 0
    target_wind_speed: float = 0
    current_wind_speed: float = 0

    th_sensor: HDC3022
    pressure_sensor: ND210
    fan: Fan

    # Will pull from config
    port: int = 0
    hostname: str = ""


G = Globals()

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        pass 

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data)
            if data.get("command") == "set_wind_speed":
                G.target_wind_speed = data.get("wind_speed")
                print(f"Target wind speed set to {G.target_wind_speed}")
        except json.JSONDecodeError:
            print("Received raw POST data:", post_data.decode("utf-8"))

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "POST received"}
        self.wfile.write(json.dumps(response).encode())


def start_server():
    server = HTTPServer((G.hostname, G.port), RequestHandler)
    print(f"Server running on port {G.port}...")
    server.serve_forever()

def send_data():
    data = json.dumps({
        "data": {
            "current_wind_speed": [G.current_wind_speed],
            "target_wind_speed": [G.target_wind_speed],
            "air_temperature": [G.th_sensor.temperature],
            "air_humidity": [G.th_sensor.humidity],
            "diff_pressure": [G.pressure_sensor.pressure],
        }
    })
    url = "http://"+G.hostname+":"+str(G.port)
    print(data)
    response = requests.post(url, json=data)

    print(response.status_code)
    print(response.json()["json"])

def update_sensors():
    G.th_sensor.read()
    G.pressure_sensor.read()

    # TODO: Calculate from sensor readings
    G.air_density = 2.225

    G.current_wind_speed = math.sqrt(2 * G.pressure_sensor.pressure * 4.52 / G.air_density)

if __name__ == "__main__":
    """
    This loop will handle the main functionality of the tunnel
    """

    # Read config
    with open("../config.json") as json_data:
        d = json.load(json_data)
        G.hostname = d["listen_hostname"]
        G.port = d['listen_port']

        if d["tunnel_type"] == "small":
            G.fan_type = FanType.SmallFan
            G.fan = SmallFan()
        elif d["tunnel_type"] == "big":
            G.fan_type = FanType.BigFan
            G.fan = BigFan()

    # Start web server
    # threading.Thread(target=start_server, daemon=True).start()
    print("Web server started. Control loop beginning...")

    G.th_sensor = HDC3022()
    G.pressure_sensor = ND210(2)

    G.loop = PIDLoop()
    G.controller = FanController(G.loop, G.fan)

    try:
        while True:
            update_sensors()

            if G.tunnel_state == TunnelState.IDLE:
                pass
            elif G.tunnel_state == TunnelState.RUNNING_MANUAL:
                G.controller.update(G.target_wind_speed, G.current_wind_speed) 

            time.sleep(0.05)

            send_data()

    except KeyboardInterrupt:
        print("\nInterrupted by user. Cleaning up...")

