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
    bus.write_i2c_block_data(DEVICE_ADDR, 0, setup_command)
    write = i2c_msg.write(DEVICE_ADDR, [0xE0, 0x00])
    read = i2c_msg.read(DEVICE_ADDR, 6)
    bus.i2c_rdwr(write, read)
    data = list(read)

    temp = int.from_bytes(data[0:2], byteorder='big') # unsure of byte order
    humidity = int.from_bytes(data[4:6], byteorder='big') # unsure of byte order

    return temp, humidity



temp, humidity= poll_hdc3022()
print(temp)
print(humidity)
