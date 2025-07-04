import Adafruit_BBIO.PWM as PWM
import time
from smbus2 import SMBus
from smbus2 import i2c_msg
import struct
import time

bus = SMBus(1)  # i2c-1

DEVICE_ADDR = 0x2a  # Change to your device's address
REGISTER = 0x00

TARGET_PRESSURE = 5000
compensation = 0.001

duty = 50
try:
    while True:
        PWM.start("P2_1", duty, 100, 1)  # (min 15% duty cycle) 25% duty cycle; 100 Hz
        # https://drive.google.com/drive/u/1/folders/13mqlg_fPW99mimwQFQ4ZhsAqHYcJ3kXI
        read = i2c_msg.read(DEVICE_ADDR, 4)
        bus.i2c_rdwr(read)
        data = list(read)  # Convert from i2c_msg to list of ints
        pressure = int.from_bytes(data[0:2], byteorder='big')
        temp = int.from_bytes(data[2:4], byteorder='big') / pow(2, 8)

        print(pressure)
        print(temp)
        duty += (TARGET_PRESSURE-pressure) * compensation 
        print(duty)
        
        if duty > 100:
            duty = 100
        
        if duty < 15:
            duty = 15
        
        time.sleep(0.25)

except KeyboardInterrupt:
    print("\nInterrupted by user. Cleaning up...")
    PWM.cleanup()



