from smbus2 import SMBus, i2c_msg
import struct

DEVICE_ADDR = 0x2A
GAS_CONSTANT = 287  # J/kg*K

bus = SMBus(1)  # I2C-1


def pull_ND210():
    """Reads pressure and temperature from ND210 sensor and computes air density."""
    read = i2c_msg.read(DEVICE_ADDR, 4)
    bus.i2c_rdwr(read)
    data = list(read)

    # Pressure calculation
    pressure_inh20 = struct.unpack(">h", bytes(data[0:2]))[0] / (0.9 * (2**15)) * 0.5
    if pressure_inh20 < 0:
        pressure_inh20 = 0
    pressure = pressure_inh20 * 248.84  # convert to Pascals

    # Temperature in Kelvin
    temp = int.from_bytes(data[2:4], byteorder='big') / (2**8) + 273.15

    # Air density
    air_density = pressure / (GAS_CONSTANT * temp)

    return pressure, temp, air_density

