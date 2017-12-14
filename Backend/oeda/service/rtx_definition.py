from oeda.databases import db


class RTXDefinition:

    name = None
    folder = None
    _oedaExperiment = None
    _oedaTarget = None
    _oedaCallback = lambda x: x
    primary_data_provider = None
    change_provider = None
    id = None
    stage_counter = None
    all_knobs = None

    def __init__(self, oedaExperiment, oedaTarget, oedaCallback):
        self._oedaExperiment = oedaExperiment
        self._oedaTarget = oedaTarget
        self._oedaCallback = oedaCallback 
        self.name = oedaExperiment["name"]
        self.id = oedaExperiment["id"]
        self.stage_counter = 1
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
        knob_values = get_experiment_list(execution_strategy["type"], new_knobs)
        knob_keys = get_knob_keys(execution_strategy["type"], execution_strategy["knobs"])
        all_knobs = []
        for i in range(len(knob_values)):
            knobs = {}
            index = 0
            for k in knob_keys:
                knobs[k] = knob_values[i][index]
                index += 1
            all_knobs.append(knobs)
        self.all_knobs = all_knobs

    def run_oeda_callback(self, dictionary):
        # also insert stage counter to the callback
        # https://stackoverflow.com/questions/1024847/add-new-keys-to-a-dictionary
        dictionary['stage_counter'] = self.stage_counter
        self._oedaCallback(dictionary)

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
        db().save_stage(wf.stage_counter, wf.all_knobs[wf.stage_counter], wf.id)

    @staticmethod
    def evaluator(resultState, wf):
        wf.stage_counter += 1
        return 0


def get_experiment_list(type, knobs):

    if type == "sequential":
        return [config.values() for config in knobs]

    if type == "step_explorer":
        variables = []
        parameters_values = []
        for key in knobs:
            variables += [key]
            lower = knobs[key][0][0]
            upper = knobs[key][0][1]
            step = knobs[key][1]

            decimal_points = str(step)[::-1].find('.')
            multiplier = pow(10, decimal_points)

            value = lower
            parameter_values = []
            while value <= upper:
                parameter_values += [[value]]
                value = float((value * multiplier) + (step * multiplier)) / multiplier

            parameters_values += [parameter_values]
        return reduce(lambda list1, list2: [x + y for x in list1 for y in list2], parameters_values)


def get_knob_keys(type, knobs):

    if type == "sequential":
        '''Here we assume that the knobs in the sequential strategy are specified in the same order'''
        return knobs[0].keys()

    if type == "step_explorer":
        return knobs.keys()