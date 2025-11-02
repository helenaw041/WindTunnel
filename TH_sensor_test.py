from smbus2 import SMBus
from smbus2 import i2c_msg
import struct
import math

bus = SMBus(2)  # i2c-1

DEVICE_ADDR = 0x44  # Change to your device's address
REGISTER = 0x00

# TODO:
# Set mode of device with command 0x24 0x0B Trigger-On Demand Mode (Now use auto measurement mode)
# Then read 6 bytes
# - First two bytes are temperature
# - third byte is checksum
# - Fourth and Fifth are humidity
# - Sixth is another checksum

setup_command = [0x21, 0x30]


def poll_hdc3022():
    setup_write = i2c_msg.write(DEVICE_ADDR, setup_command)
    bus.i2c_rdwr(setup_write)

    while (True):
        try: 
            write = i2c_msg.write(DEVICE_ADDR, [0xE0, 0x00])
            read = i2c_msg.read(DEVICE_ADDR, 6)
            bus.i2c_rdwr(write, read)
            data = list(read)

            temp_raw = int.from_bytes(data[0:2], byteorder='big') # unsure of byte order
            humidity_raw = int.from_bytes(data[4:6], byteorder='big') # unsure of byte order

            temp = -45 + 175 * (temp_raw / (2**16 - 1))
            humidity = 100 * humidity_raw / (2**16 - 1)

            print(temp)
            print(humidity)
        except:
            pass



temp, humidity= poll_hdc3022()

