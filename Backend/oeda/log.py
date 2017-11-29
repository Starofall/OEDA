from colorama import Fore
import time
import sys

# Log Levels
LEVEL_DEBUG = 4
LEVEL_INFO = 3
LEVEL_WARN = 2
LEVEL_ERROR = 1
LEVEL_NONE = 0
LOG_LEVEL = 4

# Global variable for the folder to log to
LOG_FOLDER = None


def current_milli_time():
    return int(round(time.time() * 1000))

def clearOldLog():
    """ clears the old execution.log file """
    if LOG_FOLDER is not None:
        f = open(LOG_FOLDER + '/execution.log', 'w')
        f.write("\n")


def logToFile(any):
    """ appends the message to the execution.log file """
    if LOG_FOLDER is not None:
        f = open(LOG_FOLDER + '/execution.log', 'ab')
        f.write(str(any) + "\n")


def debug(any, color=Fore.CYAN):
    if LOG_LEVEL >= LEVEL_DEBUG:
        print(color + str(any) + Fore.RESET)


def info(any, color=Fore.GREEN):
    logToFile(any)
    if LOG_LEVEL >= LEVEL_INFO:
        print(color + str(any) + Fore.RESET)


def warn(any, color=Fore.YELLOW):
    logToFile(any)
    if LOG_LEVEL >= LEVEL_WARN:
        print(color + str(any) + Fore.RESET)


def error(any, color=Fore.RED):
    logToFile(any)
    if LOG_LEVEL >= LEVEL_ERROR:
        print(color + "> Error: " + str(any) + Fore.RESET)

def inline_print(str):
    """ writes a line without a newline """
    sys.stdout.write('\r')
    sys.stdout.flush()
    sys.stdout.write('%s\r' % str)
    sys.stdout.flush()

def process(preText, i, total):
    """ used to display the progress bar while experiments run """
    sys.stdout.write('\r')
    sys.stdout.flush()
    size_str = Fore.YELLOW + "> " + preText + "["
    percentage = 30 * i / total
    for j in range(0, percentage):
        size_str += "#"
    for k in range(percentage, 30):
        size_str += "."
    size_str += "] Target: " + str(total) + " | Done: " + str(i) + Fore.RESET
    sys.stdout.write('%s\r' % size_str)
    sys.stdout.flush()