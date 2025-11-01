

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

if __name__ = "__main__":
    duty = None
    while duty == None:
        raw = input('Enter duty: ')
        try:
            duty = int(raw)
        except TypeError:
            print('Done.')

    try:
        PWM.start(PWM_PIN, duty, 100, 1)  # (min 15% duty cycle) 25% duty cycle; 100 Hz
    except KeyboardInterrupt:
        print("\nInterrupted by user. Cleaning up...")
        PWM.cleanup()
