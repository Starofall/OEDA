from oeda.databases import db

class RTXDefinition:

    name = None
    # folder = None
    _oedaExperiment = None
    _oedaTarget = None
    _oedaCallback = lambda x: x
    primary_data_provider = None
    change_provider = None
    id = None
    stage_counter = None

    # execution_strategy = {
    #     "ignore_first_n_results": 0,
    #     "sample_size": 2,
    #     "type": "step_explorer",
    #     "knobs": {
    #         "route_random_sigma": ([0.0, 0.2], 0.2),
    #         "max_speed_and_length_factor": ([0.0, 0.4], 0.4)
    #     }

    def __init__(self, oedaExperiment, oedaTarget, oedaCallback):
        self._oedaExperiment = oedaExperiment
        self._oedaTarget = oedaTarget
        self._oedaCallback = oedaCallback 
        self.name = oedaExperiment["name"]
        self.id = oedaExperiment["id"]
        self.stage_counter = 0
        # self.execution_strategy["sample_size"] = oedaExperiment["executionStrategy"]["sample_size"]

        # self.wf = ModuleType('workflow')

        primary_data_provider = oedaTarget["primaryDataProvider"]
        primary_data_provider["data_reducer"] = RTXDefinition.primary_data_reducer
        self.primary_data_provider = primary_data_provider
        self.change_provider = oedaTarget["changeProvider"]
        execution_strategy = oedaExperiment["executionStrategy"]
        new_knobs = {}
        for knob_key, knob_value in oedaExperiment["executionStrategy"]["knobs"].iteritems():
            new_knobs[knob_key] = ([knob_value[0], knob_value[1]], knob_value[2])

        print "new_knobs"
        print new_knobs
        execution_strategy["knobs"] = new_knobs
        self.execution_strategy = execution_strategy
        self.state_initializer = RTXDefinition.state_initializer
        self.evaluator = RTXDefinition.evaluator
        self.setup_stage = RTXDefinition.setup_stage
        self.folder = None



    # def run(self):
    #     self.wf.execution_strategy["exp_count"] = \
    #         calculate_experiment_count(self.wf.execution_strategy["type"], self.wf.execution_strategy["knobs"])
    #     self.wf.name = self.wf.rtx_run_id = db().save_rtx_run(self.wf.execution_strategy)
    #     execute_workflow(self.wf)
    #     db().release_target_system(self.target_system_id)
    #     return self.wf.rtx_run_id

    @staticmethod
    def primary_data_reducer(state, newData, wf):
        db().save_data_point(newData, state["data_points"], wf.id, wf.stage_counter)
        state["data_points"] += 1
        return state

    @staticmethod
    def state_initializer(state, wf):
        state["data_points"] = 0
        return state

    @staticmethod
    def setup_stage(wf):
        # db().save_stage(state["stage_number"], wf.id["knobs"], wf.id)
        db().save_stage(wf.stage_counter, None, wf.id)
        wf.stage_counter += 1

    @staticmethod
    def evaluator(resultState, wf):
        return 0

    def runOedaCallback(self,dict):
        self._oedaCallback(dict)

    # def default_reducer(state, newData, wf):
    #     # @todo add default DB storage here
    #     return state
    #

    # execution_strategy = {
    #     "type": "step_explorer",
    #     "ignore_first_n_results": 100,
    #     "sample_size": 100,
    #     "knobs": {
    #         "x": ([-4.0, 4.0], 1.6),
    #         "y": ([-10.0, 10.0], 2.4)
    #     }
    # }
    #
    # primary_data_provider = {
    #     "type": "http_request",
    #     "url": "http://localhost:3000",
    #     "serializer": "JSON",
    #     "data_reducer": default_reducer
    # }
    #
    # change_provider = {
    #     "type": "http_request",
    #     "url": "http://localhost:3000",
    #     "serializer": "JSON",
    # }



    # def evaluator(self, resultState, wf):
    #     # NOT IN USE
    #     return 1
    #
    # def state_initializer(self, state, wf):
    #     # NOT IN USE
    #     return state
    #
    # def change_event_creator(self, variables, wf):
    #     return variables
