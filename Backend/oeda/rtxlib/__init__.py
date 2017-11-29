from __future__ import print_function

import time
from colorama import Fore
import sys
import csv


# Small util helper collection
# mainly for logging

# small helper function for
def current_milli_time():
    return int(round(time.time() * 1000))
