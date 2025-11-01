import Adafruit_BBIO.I2C as I2C

i2c_device = I2C.I2C(2, 0x44) # Bus 1 (I2C2), device address 0x77

i2c_device.writeBytes(register_address, [data_byte1, data_byte2])

print(dir(i2c_device))
