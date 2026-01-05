from smbus2 import SMBus, i2c_msg
import struct

DEVICE_ADDR = 0x2A
GAS_CONSTANT = 287  # J/kg*K

bus = SMBus(2)  # I2C-1


def pull_ND210():
    """Reads pressure and temperature from ND210 sensor and computes air density."""
    read = i2c_msg.read(DEVICE_ADDR, 4)