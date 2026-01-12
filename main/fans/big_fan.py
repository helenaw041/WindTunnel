"""
A Class that deals with the operation of the Small Fan 

Big fan uses Modbus RTU on RS-485 using the Comms Hat on the beaglebone Black
"""
import numpy as np
from fans.fan_class import Fan
from pymodbus.client.sync import AsyncModbusSerialClient 
import time

# The Async Client is much faster than the sync one for some reason
# https://pymodbus.readthedocs.io/en/latest/source/client.html

# Configure the Modbus client
# Replace '/dev/ttyUSB0' with your actual port name
client = AsyncModbusSerialClient(
    method='rtu', 
    port='/dev/ttyS4', 
    timeout=1, 
    stopbits=1, 
    bytesize=8, 
    parity='N', 
    baudrate=9600
)

def get_bit(num, n):
  """Returns the value (0 or 1) of the n-th bit of num."""
  # Right shift num by n bits, then bitwise AND with 1
  return (num >> n) & 1

# Uses the status word to get the status of the 
def get_fan_status(status_word):
    pass
    

class BigFan(Fan):
    def __init__(self) -> None:

        client.connect()
        pass

    def startup(self) -> None:
        pass

    def cleanup(self):
        client.close()
        pass



