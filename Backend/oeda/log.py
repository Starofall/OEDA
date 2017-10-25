from colorama import Fore

# Log Levels
LEVEL_DEBUG = 4
LEVEL_INFO = 3
LEVEL_WARN = 2
LEVEL_ERROR = 1
LEVEL_NONE = 0
LOG_LEVEL = 3

# Global variable for the folder to log to
LOG_FOLDER = None


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
