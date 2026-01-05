"""
A Class that deals with the operation of the Small Fan 

the small fan runs on a PWM system
"""
import Adafruit_BBIO.PWM as PWM
from main.fans.fan_class import Fan
import numpy as np

# Expected to be here on the pocket beagle
PWM_PIN = "P2_1" 

PWM_MIN = 15

class SmallFan(Fan):
    def __init__(self) -> None:
        pass

    def startup(self) -> None:
        super().startup()
        PWM.start(PWM_PIN, PWM_MIN, 100, 1)

    def setValue(self, value) -> None:
        # Value should be from 0 to 1
        duty = PWM_MIN + value * (100 - PWM_MIN)
        duty = np.clip(duty, PWM_MIN, 100)
        PWM.set_duty_cycle(PWM_PIN, duty)

    def cleanup(self):
        PWM.cleanup()



    
