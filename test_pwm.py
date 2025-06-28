import Adafruit_BBIO.PWM as PWM
import time

PWM.start("P2_1", 75, 200, 1)  # 50% duty cycle, 1 kHz

# time.sleep(5)

# while(1){   
#     PWM.set_duty_cycle("P2_01", 75)  # Change duty cycle to 75%
#     time.sleep(2)

# PWM.stop("P2_01")
# PWM.cleanup()