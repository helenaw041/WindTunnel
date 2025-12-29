"""
A Class that deals with the operation of the Small Fan 

Big fan uses Modbus RTU on RS-485 using the Comms Hat on the beaglebone Black
"""
import numpy as np
from main.fans.fan_class import Fan
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
import time

# Configure the Modbus client
# Replace '/dev/ttyUSB0' with your actual port name
client = ModbusClient(
    method='rtu', 
    port='/dev/ttyS4', 
    timeout=1, 
    stopbits=1, 
    bytesize=8, 
    parity='N', 
    baudrate=9600
)

# TODO: Write stuff here

class BigFan(Fan):
    def __init__(self) -> None:

        client.connect()
        pass

    def startup(self) -> None:
        pass

    def cleanup(self):
        pass



