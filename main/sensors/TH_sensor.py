from smbus2 import SMBus
import time

DEVICE_ADDR = 0x44  # Default address (or 0x45)

class HDC3022:
    def __init__(self, bus_num=2, address=0x44):
        self.bus = SMBus(bus_num)
        self.address = address
        self.temperature = None
        self.humidity = None
        
    def soft_reset(self):
        """Soft reset the sensor"""
        try:
            # Soft reset command: 0x30A2
            self.bus.write_i2c_block_data(self.address, 0x30, [0xA2])
            time.sleep(0.1)  # Wait for reset
        except OSError as e:
            print(f"Reset failed: {e}")
    
    def trigger_measurement(self):
        """Trigger a measurement"""
        try:
            # Trigger measurement command: 0x2400 (normal mode)
            self.bus.write_i2c_block_data(self.address, 0x24, [0x00])
            time.sleep(0.02)  # Wait for measurement (20ms minimum)
        except OSError as e:
            print(f"Trigger failed: {e}")
    
    def read_measurement(self):
        """Read temperature and humidity"""
        try:
            # Read 6 bytes: temp_msb, temp_lsb, temp_crc, hum_msb, hum_lsb, hum_crc
            data = self.bus.read_i2c_block_data(self.address, 0x00, 6)
            
            # Parse temperature (first 2 bytes)
            temp_raw = (data[0] << 8) | data[1]
            self.temperature = -45 + 175 * (temp_raw / 65535.0)
            
            # Parse humidity (next 2 bytes, skip CRC at data[2])
            hum_raw = (data[3] << 8) | data[4]
            self.humidity = 100 * (hum_raw / 65535.0)
            
            return self.temperature, self.humidity
            
        except OSError as e:
            print(f"Read failed: {e}")
            return None, None
    
    def read(self):
        """Complete read cycle"""
        self.trigger_measurement()
        time.sleep(0.02)  # Wait for conversion
        return self.read_measurement()
    
    def close(self):
        self.bus.close()


# Usage
sensor = HDC3022(bus_num=2, address=0x44)

# Initialize on first use
sensor.soft_reset()

# Read data
temp, humidity = sensor.read()
if temp is not None:
    print(f"Temperature: {temp:.2f}°C")
    print(f"Humidity: {humidity:.2f}%")

sensor.close()


