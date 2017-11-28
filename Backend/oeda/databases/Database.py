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

    def get_targets(self):
        """ returns all the target systems """
        pass

    def save_experiment(self, experiment_id, experiment_data):
        pass

    def get_target(self, experiment_id):
        pass

    def get_experiments(self):
        """ returns all the experiments """
        pass

class TargetSystemNotFoundException(Exception):
    pass

