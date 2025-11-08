import time
import math
import threading
import Adafruit_BBIO.PWM as PWM

from pressure_sensor import pull_ND210
from temp_humidity_sensor import poll_hdc3022
from web_server import start_server

# --- Constants ---
GAS_CONSTANT = 287      # J / kg*K
GRAVITY_A = 9.8         # m/s²
PWM_PIN = "P2_1"
HOST = '0.0.0.0'
PORT = 81

# --- Control variables ---
TARGET_WIND_SPEED = 12
duty = 15

kp = 0.12 * (1.0 - 0.5)
Ti = 0.7005952381 * (1.0 + 0.5)
Td = 0.35

if Ti == 0.0:
    ki = 0.0
else:
    ki = kp / Ti

kd = kp * Td

integral = 0
ms_prev = time.time_ns() / 1_000_000
previous = 0


def pid(error):
    global integral, ms_prev, previous
    output = 0.0
    if error == 0.0:
        return 0.0

    ms_now = time.time_ns() / 1_000_000
    dt = ms_now - ms_prev
    if dt <= 0:
        dt = 1

    proportional = error
    integral += error * dt
    derivative = (error - previous) / dt

    previous = error
    output = (kp * proportional) + (ki * integral) + (kd * derivative)
    ms_prev = ms_now

    return output


if __name__ == "__main__":
    # Start web server
    threading.Thread(target=start_server, args=(HOST, PORT), daemon=True).start()
    print("Web server started. Control loop beginning...")

    # Setup PWM
    PWM.start(PWM_PIN, 15, 100, 1)

    time.sleep(0.25)
    pressure_zero, _, _ = pull_ND210()

    try:
        while True:
            PWM.set_duty_cycle(PWM_PIN, duty)

            pressure, temp, air_density = pull_ND210()
            wind_speed = math.sqrt(2 * pressure * 4.52 / 1.225)

            duty = pid(TARGET_WIND_SPEED - wind_speed) / 40

            if duty > 100:
                duty = 100
            if duty < 15:
                duty = 15

            print(f"Target:{TARGET_WIND_SPEED:.1f}  "
                  f"Wind:{wind_speed:.2f} m/s  "
                  f"Pressure:{pressure:.2f} Pa  "
                  f"Duty:{duty:.2f}%")

            time.sleep(0.05)

    except KeyboardInterrupt:
        print("\nInterrupted by user. Cleaning up...")
        PWM.cleanup()

