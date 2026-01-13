from fans.fan_class import Fan
from pid_loop import PIDLoop
import time

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

    def update(self, target_speed, current_speed):
        # Calculate deltatime
        ms = get_ms_accuratly()
        deltatime = ms - self.last_ms
        self.last_ms = ms

        value = self.loop.update(current_speed, target_speed, deltatime)
        self.fan.setValue(value)

    def cleanup(self):
        self.fan.cleanup()
