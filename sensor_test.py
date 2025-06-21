from smbus2 import SMBus
from smbus2 import i2c_msg
import struct


bus = SMBus(1)  # i2c-1

DEVICE_ADDR = 0x2a  # Change to your device's address
REGISTER = 0x00

# https://drive.google.com/drive/u/1/folders/13mqlg_fPW99mimwQFQ4ZhsAqHYcJ3kXI
read = i2c_msg.read(DEVICE_ADDR, 4)
bus.i2c_rdwr(read)
data = list(read)  # Convert from i2c_msg to list of ints
pressure = int.from_bytes(data[0:2], byteorder='big')
temp = int.from_bytes(data[2:4], byteorder='big') / pow(2, 8)

print(pressure)
print(temp)