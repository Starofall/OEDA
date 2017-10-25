# Abstract interface for a database
#
# A database stores the raw data and the experiment runs of RTX.


class Database:

    def __init__(self):
        pass

    def save_target(self, target_system_id, target_system_data):
        """ saves the data of an OEDA target system with the provided id """
    pass

    def get_target(self, target_system_id):
        """ returns the configuration of an OEDA target system """
        pass


class TargetSystemNotFoundException(Exception):
    pass

