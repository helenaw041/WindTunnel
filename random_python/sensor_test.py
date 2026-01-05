from smbus2 import SMBus
from smbus2 import i2c_msg
import struct
import math


GAS_CONSTANT = 287 # J / kg*K
GRAVITY_A = 9.8 # m/s

bus = SMBus(1)  # i2c-1

DEVICE_ADDR = 0x2a  # Change to your device's address
REGISTER = 0x00

def pull_ND210():
    # https://drive.google.com/drive/u/1/folders/13mqlg_fPW99mimwQFQ4ZhsAqHYcJ3kXI
    read = i2c_msg.read(DEVICE_ADDR, 4)
    bus.i2c_rdwr(read)
    data = list(read)  # Convert from i2c_msg to list of ints
    
    pressure = int.from_bytes(data[0:2], byteorder='big') / (0.9 * pow(2, 15)) * 0.5 # in inh20
    temp = int.from_bytes(data[2:4], byteorder='big') / pow(2, 8) + 273.15 # in Kelvin
    air_density = pressure / (GAS_CONSTANT * temp)
    return pressure, temp, air_density
    
pressure_zero, _, air_density_zero  = pull_ND210()

while True:
    try:
        elevation = float(input("Enter elevation in meters: "))
        if elevation < -500 or elevation > 10000:
            print("That seems unrealistic. Please try again.")
            continue
        break
    except ValueError:
        print("Please enter a valid number.")
print(f"Elevation entered: {elevation} meters")

# Bernoulli's Equation for Fluid Speed
constant = PRESSURE_ZERO + AIR_DENSITY_ZERO*GRAVITY_A*elevation # at v=0
wind_speed = math.sqrt((2/air_density) * (constant-pressure-(air_density*GRAVITY_A*elevation)))

print(pressure)
print(temp)
print(air_density)
print(f"Wind Speed: {wind_speed}")
