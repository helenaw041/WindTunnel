import Adafruit_BBIO.PWM as PWM
import time

PWM.start("P2_1", 75, 200, 1)  # 25% duty cycle, 200 Hz