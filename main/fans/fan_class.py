
from enum import Enum

class FanStatus(Enum):
    FAULT = 0
    NEED_CLEAR = 1
    NOT_READY = 2


class Fan:
    def __init__(self) -> None:
        pass

    def startup(self) -> None:
        pass

    def setValue(self, value) -> None:
        pass

    def cleanup(self):
        pass



