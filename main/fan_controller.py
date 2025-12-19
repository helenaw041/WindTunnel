from main.fans.fan_class import Fan
from main.pid_loop import PIDLoop
import time
import math

from main.sensors.TH_sensor import HDC3022
from main.sensors.pressure_sensor import poll_ND210


def get_ms_accuratly():
    return time.time_ns() / 1_000_000

class FanController:
    loop: PIDLoop 
    fan: Fan

    last_ms: float 

    def __init__(self, PIDLoop: PIDLoop, Fan) -> None:
        self.loop = PIDLoop
        self.fan = Fan
        
    def startup(self):
        self.fan.startup()
        self.loop.reset()

    def update(self, target_speed):

        # TODO: Deal with sensor errors
        
        # Reading Sensors
        temp, humidity = self.TH_sensor.read()
        pressure, _ = poll_ND210()

        # Wind Speed Caulcuations

        # TODO: Get air densisty from temperature and humidity
        

        # Calculate deltatime
        ms = get_ms_accuratly()
        deltatime = ms - self.last_ms
        self.last_ms = ms

        value = self.loop.update(wind_speed, target_speed, deltatime)
        self.fan.setValue(value)

    def cleanup(self):
        self.fan.cleanup()
        # TODO: Maybe clean up sensors
