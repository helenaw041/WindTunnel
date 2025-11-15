from smbus2 import SMBus, i2c_msg
import time

bus = SMBus(2)  # i2c-2
DEVICE_ADDR = 0x44
setup_command = [0x21, 0x30]  # Continuous measurement mode


def poll_hdc3022():
    """Continuously read temperature and humidity from HDC3022."""
    setup_write = i2c_msg.write(DEVICE_ADDR, setup_command)
    bus.i2c_rdwr(setup_write)

    while True:
        try:
            time.sleep(0.5)
            write = i2c_msg.write(DEVICE_ADDR, [0xE0, 0x00])
            read = i2c_msg.read(DEVICE_ADDR, 6)
            bus.i2c_rdwr(write, read)
            data = list(read)

            temp_raw = int.from_bytes(data[0:2], byteorder='big')
            humidity_raw = int.from_bytes(data[3:5], byteorder='big')

            temp = -45 + 175 * (temp_raw / (2**16 - 1))
            humidity = 100 * humidity_raw / (2**16 - 1)

            print(f"Temperature: {temp:.2f} °C | Humidity: {humidity:.2f} %")
        except Exception as e:
            print(f"Error reading HDC3022: {e}")

