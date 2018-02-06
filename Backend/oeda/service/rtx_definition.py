from oeda.databases import db
from oeda.log import *

class RTXDefinition:

    name = None
    folder = None
    _oeda_experiment = None
    _oeda_target = None
    _oeda_callback = None
    _oeda_stop_request = None
    primary_data_provider = None
    secondary_data_providers = None
    change_provider = None
    id = None
    stage_counter = None
    all_knobs = None
    remaining_time_and_stages = None
    incoming_data_types = None

    def __init__(self, oeda_experiment, oeda_target, oeda_callback, oeda_stop_request):
        self._oeda_experiment = oeda_experiment
        self._oeda_target = oeda_target
        self._oeda_callback = oeda_callback
        self._oeda_stop_request = oeda_stop_request
        self.name = oeda_experiment["name"]
        self.id = oeda_experiment["id"]
        self.stage_counter = 1
        self.remaining_time_and_stages = dict() # contains remaining time and stage for an experiment
        self.change_provider = oeda_target["changeProvider"]
        self.incoming_data_types = oeda_target["incomingDataTypes"] # contains all of the data types provided by both config & user

        # set-up primary data provider
        primary_data_provider = oeda_target["primaryDataProvider"]
        primary_data_provider["data_reducer"] = RTXDefinition.primary_data_reducer
        self.primary_data_provider = primary_data_provider

        self.secondary_data_providers = []
        for dp in oeda_target["secondaryDataProviders"]:
            dp["data_reducer"] = RTXDefinition.secondary_data_reducer
            self.secondary_data_providers.append(dp)

        # TODO: knob_value[2] is only provided in step_explorer strategy?
        execution_strategy = oeda_experiment["executionStrategy"]
        if execution_strategy["type"] == 'step_explorer':
            new_knobs = {}
            for knob_key, knob_value in oeda_experiment["executionStrategy"]["knobs"].iteritems():
                new_knobs[knob_key] = ([knob_value[0], knob_value[1]], knob_value[2])
            debug("new knobs in RTXDefinition object" + str(new_knobs), Fore.GREEN)
            execution_strategy["knobs"] = new_knobs

        self.execution_strategy = execution_strategy
        self.state_initializer = RTXDefinition.state_initializer
        self.evaluator = RTXDefinition.evaluator
        self.folder = None
        debug("execution_strategy.knobs in RTXDefinition object" + str(execution_strategy["knobs"]), Fore.GREEN)
        self.setup_stage = RTXDefinition.setup_stage

        if execution_strategy["type"] == "step_explorer" or execution_strategy["type"] == "sequential":
            knob_values = get_experiment_list(execution_strategy["type"], execution_strategy["knobs"])
            knob_keys = get_knob_keys(execution_strategy["type"], execution_strategy["knobs"])
            self.all_knobs = get_all_knobs(knob_keys, knob_values)

    def run_oeda_callback(self, dictionary):
        dictionary['stage_counter'] = self.stage_counter
        self._oeda_callback(dictionary, self.id)

    # TODO: integrate other metrics using a parameter, instead of default average metric
    @staticmethod
    def primary_data_reducer(state, new_data, wf):
        cnt = state["data_points"]
        db().save_data_point(new_data, cnt, wf.id, wf.stage_counter)
        state["overhead"] = (state["overhead"] * cnt + new_data["overhead"]) / (cnt + 1)
        state["data_points"] += 1

        # for data_type in incomingDataTypes:
        #     data_type_name = data_type["name"]
        #     data_type_count = data_type_name + "_cnt"
        #     cnt = state[data_type_count]
        #     db().save_data_point(new_data, cnt, wf.id, wf.stage_counter)
        #     state[data_type_name] = (state[data_type_name] * cnt + new_data[data_type_name]) / (cnt + 1)
        #     state[data_type_count] += 1
        if wf._oeda_stop_request.isSet():
            raise RuntimeError("Experiment interrupted from OEDA while gathering data.")
        return state

    @staticmethod
    def secondary_data_reducer(state, new_data, wf, incomingDataTypes):
        return state
    # def secondary_data_reducer(state, new_data, wf, incomingDataTypes):
    #     for data_type in incomingDataTypes:
    #         data_type_name = data_type["name"]
    #         data_type_count = data_type_name + "_cnt"
    #         cnt = state[data_type_count]
    #         db().save_data_point(new_data, cnt, wf.id, wf.stage_counter)
    #         state[data_type_name] = (state[data_type_name] * cnt + new_data[data_type_name]) / (cnt + 1)
    #         state[data_type_count] += 1
    #     if wf._oeda_stop_request.isSet():
    #         raise RuntimeError("Experiment interrupted from OEDA while gathering data.")
    #     return state

    @staticmethod
    def state_initializer(state, wf):
        state["overhead"] = 0
        state["data_points"] = 0

        # initialize all incoming data types, not only the hard-coded ones; as well as their counts
        # for data_type in wf.incoming_data_types:
        #     state[data_type["name"]] = 0
        #     state[data_type["name"] + "_cnt"] = 0
        return state

    @staticmethod
    def setup_stage(wf, stage_knob):
        # db().save_stage(wf.stage_counter, wf.all_knobs[wf.stage_counter-1], wf.id)
        db().save_stage(wf.stage_counter, stage_knob, wf.id)

    @staticmethod
    def evaluator(result_state, wf):
        wf.stage_counter += 1
        return result_state["overhead"]


def get_experiment_list(strategy_type, knobs):

    if strategy_type == "sequential":
        return [config.values() for config in knobs]

    if strategy_type == "step_explorer":
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

    if strategy_type == "random":
        return [config.values() for config in knobs]


def get_knob_keys(strategy_type, knobs):

    if strategy_type == "sequential":
        '''Here we assume that the knobs in the sequential strategy are specified in the same order'''
        return knobs[0].keys()

    if strategy_type == "step_explorer":
        return knobs.keys()

    if strategy_type == "random":
        return knobs[0].keys()


def get_all_knobs(knob_keys, knob_values):
    all_knobs = []
    for i in range(len(knob_values)):
        knobs = {}
        index = 0
        for k in knob_keys:
            knobs[k] = knob_values[i][index]
            index += 1
        all_knobs.append(knobs)
    return all_knobs