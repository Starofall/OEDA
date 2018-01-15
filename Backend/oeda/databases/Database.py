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
        """ saves the data of an OEDA experiment with the provided id """
        pass

    def get_experiment(self, experiment_id):
        """ returns the configuration of an OEDA experiment """
        pass

    def get_experiments(self):
        """ returns all OEDA experiments """
        pass

    def update_experiment_status(self, experiment_id, status):
        """ updates experiment status with provided id """
        pass

    def update_target_system_status(self, target_system_id, status):
        """ updates experiment status with provided id """
        pass

    def save_stage(self, stage_no, knobs, experiment_id):
        """ saves stage of an OEDA experiment with provided configuration and stage no """
        pass

    def get_stages(self, experiment_id):
        """ returns all stages of an OEDA experiment with provided id """
        pass

    def get_stages_after(self, experiment_id, timestamp):
        """ returns all stages of an OEDA experiment that are created after the timestamp """
        pass

    def save_data_point(self, payload, data_point_count, experiment_id, stage_no):
        """ saves data of the given stage """
        pass

    def get_data_points(self, experiment_id, stage_no):
        """ returns data_points whose parent is the concatenated stage_id (see create_stage_id) """
        pass

    def get_data_points_after(self, experiment_id, stage_no, timestamp):
        """ returns data_points that are created after the given timestamp. Data points' parents are the concatenated stage_id (see create_stage_id) """
        pass

    @staticmethod
    def create_stage_id(experiment_id, stage_no):
        return str(experiment_id) + "#" + str(stage_no)

    @staticmethod
    def create_data_point_id(experiment_id, stage_no, data_point_count):
        return str(experiment_id) + "#" + str(stage_no) + "_" + str(data_point_count)


class TargetSystemNotFoundException(Exception):
    pass

