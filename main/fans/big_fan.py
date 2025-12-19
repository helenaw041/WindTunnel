"""
A Class that deals with the operation of the Small Fan 

Big fan uses Modbus RTU on RS-485 using the Comms Hat on the beaglebone Black
"""
import numpy as np
from main.fans.fan_class import Fan

# TODO: Write stuff here

class BigFan(Fan):
    def __init__(self) -> None:
        pass

    def setValue(self, value) -> None:
        pass

    def cleanup(self):
        pass



