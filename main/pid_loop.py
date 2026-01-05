import numpy as np

class PIDLoop:
    ki = 0.0
    kp = 0.0
    kd = 0.0

    integral_min = -100
    integral_max = 100

    output_min = 0
    output_max = 1

    integral = 0.0
    last_error = None 

    def set_tune(self):
        # This gets tune with two variable somehow, I believe this code is wrong
        kp = 0.12 * (1.0 - 0.5)
        Ti = 0.7005952381 * (1.0 + 0.5)
        Td = 0.35

        if Ti == 0.0:
            ki = 0.0
        else:
            ki = kp / Ti

        kd = kp * Td

    def reset(self):
        self.integral = 0.0
        self.last_error = None

    def update(self, target_value, current_value, deltatime):

        # deltatime is in ms

        error = target_value - current_value 
        self.integral = np.clip(self.integral + error * deltatime, self.integral_min, self.integral_max)

        derivative = ( error - self.last_error ) / deltatime
        self.last_error = error

        output = error * self.kp + self.integral * self.ki + derivative * self.kd
        return np.clip(output, self.output_min, self.output_max)
