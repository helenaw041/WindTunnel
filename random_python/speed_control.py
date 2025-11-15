# test_pwm.py and serve_website.py combined

from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os
import json
import mimetypes
import threading

import Adafruit_BBIO.PWM as PWM
import time
from smbus2 import SMBus
from smbus2 import i2c_msg
import struct
import math

HOST = '0.0.0.0'
PORT = 81
WEBSITE_PATH = "./website"

wind_speed = 0

bus = SMBus(1)  # i2c-1

DEVICE_ADDR = 0x2a  # Change to your device's address
REGISTER = 0x00

GAS_CONSTANT = 287 # J / kg*K
GRAVITY_A = 9.8 # m/s

TARGET_WIND_SPEED = 12
compensation = 0

PWM_PIN = "P2_1"

duty = 15

kp = 0.12 * (1.0 - 0.5)
# ki = 0.1;
# kd = 0.0;

Ti = 0.7005952381 * (1.0 + 0.5)
# was  0.1751488095
# 0.35 was good
Td = 0.35

if Ti == 0.0: 
    ki = 0.0
else:
    ki = kp / Ti

kd = kp * Td

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
        global TARGET_WIND_SPEED
        # Get length of POST data
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)  # read the raw POST data

        # If the POST is JSON
        try:
            data = json.loads(post_data)
            print("Received JSON data:", data)
            
            if (data["command"] == "set_wind_speed"):
                print("Set wind speeed")
                TARGET_WIND_SPEED = data["wind_speed"]
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
    print("Server running on port 8000...")
    server.serve_forever()


def pull_ND210():
    # https://drive.google.com/drive/u/1/folders/13mqlg_fPW99mimwQFQ4ZhsAqHYcJ3kXI
    read = i2c_msg.read(DEVICE_ADDR, 4)
    bus.i2c_rdwr(read)
    data = list(read)  # Convert from i2c_msg to list of ints
    
    pressure_inh20 = struct.unpack(">h", bytes(data[0:2]))[0] / (0.9 * pow(2, 15)) * 0.5 # in inh2o
    #print(pressure_inh20)
    if (pressure_inh20 < 0):
        pressure_inh20 = 0
    pressure = pressure_inh20 * 248.84 # in pascals
    
    temp = int.from_bytes(data[2:4], byteorder='big') / pow(2, 8) + 273.15 # in Kelvin
    
    air_density = pressure / (GAS_CONSTANT * temp)
    
    return pressure, temp, air_density
    
  
integral = 0  
ms_prev = time.time_ns() / 1_000_000
previous = 0
def pid(error):
    global integral, ms_prev, previous
    output = 0.0
    if(error == 0.0):
        output = 0.0
    else:
        ms_now = time.time_ns() / 1_000_000
        proportional = error
        
        dt = ms_now - ms_prev
        integral += error * dt
        derivative = (error - previous) / dt
        
        previous = error
        
        output = (kp * proportional) + (ki * integral) + (kd * derivative)
        ms_prev = time.time_ns() / 1_000_000
    
    return output
    
PWM.start(PWM_PIN, 15, 100, 1)  # (min 15% duty cycle) 25% duty cycle; 100 Hz

time.sleep(.25)  
pressure_zero, _, air_density_zero  = pull_ND210()
elevation = None
while elevation != None:
    try:
        elevation = float(input("Enter elevation in meters: "))
        if elevation < -500 or elevation > 10000:
            print("That seems unrealistic. Please try again.")
            continue
        break
    except ValueError:
        print("Please enter a valid number.")
print(f"Elevation: {elevation} meters")

if __name__ == "__main__":
    # Start server in a separate thread
    threading.Thread(target=start_server, daemon=True).start()
    
    print("Serve is non blocking")
    
    f = 0
    try:
        while True:
            PWM.set_duty_cycle(PWM_PIN, duty)
            
            pressure, temp, air_density = pull_ND210()
            
            wind_speed = math.sqrt(2 * pressure * 4.52 / 1.225)
            
            duty = pid(TARGET_WIND_SPEED-wind_speed) / 40
            #print(f"pressure:{pressure},wind_speed:{wind_speed}, duty:{duty}")
            
            if duty > 100:
                duty = 100
            
            if duty < 15:
                duty = 15
                
            f += 1
            if f%5 == 0:
                print(f"TARGET_WIND_SPEED:{TARGET_WIND_SPEED}wind_speed:{wind_speed},pressure:{pressure}, duty:{duty}")
    
            time.sleep(0.05)
            
    
    except KeyboardInterrupt:
        print("\nInterrupted by user. Cleaning up...")
        PWM.cleanup()