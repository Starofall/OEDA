class RTXDefinition:
    name = None
    folder = None

    _oedaExperiment = None
    _oedaTarget = None
    _oedaCallback = lambda x: x

    def __init__(self, oedaExperiment, oedaTarget, oedaCallback):
        self._oedaExperiment = oedaExperiment
        self._oedaTarget = oedaTarget
        self._oedaCallback = oedaCallback
        self.name = oedaExperiment["name"]
        self.execution_strategy["sample_size"] = oedaExperiment["sample_size"]
        # @todo here we miss all the tranformations from (experiment+targetSystem)->RTXExperiment
        pass

    def default_reducer(state, newData, wf):
        # @todo add default DB storage here
        return state

    def runOedaCallback(self,dict):
        self._oedaCallback(dict)

    execution_strategy = {
        "type": "step_explorer",
        "ignore_first_n_results": 100,
        "sample_size": 100,
        "knobs": {
            "x": ([-4.0, 4.0], 1.6),
            "y": ([-10.0, 10.0], 2.4)
        }
    }

    primary_data_provider = {
        "type": "http_request",
        "url": "http://localhost:3000",
        "serializer": "JSON",
        "data_reducer": default_reducer
    }

    change_provider = {
        "type": "http_request",
        "url": "http://localhost:3000",
        "serializer": "JSON",
    }

    def evaluator(self, resultState, wf):
        # NOT IN USE
        return 1

    def state_initializer(self, state, wf):
        # NOT IN USE
        return state

    def change_event_creator(self, variables, wf):
        return variables
