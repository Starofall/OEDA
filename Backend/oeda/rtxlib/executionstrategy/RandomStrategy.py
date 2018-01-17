from oeda.log import *
from oeda.rtxlib.execution import experimentFunction


def start_random_strategy(wf):
    """ executes experiments by randomly picking values from the provided interval """
    info("> ExecStrategy   | Random", Fore.CYAN)
    wf.totalExperiments = wf.execution_strategy["optimizer_iterations"]
    optimizer_random_starts = wf.execution_strategy["optimizer_random_starts"]
    # optimizer_method = wf.execution_strategy["optimizer_method"]

    # we look at the ranges the user has specified in the knobs
    knobs = wf.execution_strategy["knobs"]
    # we create a list of variable names and a list of knob (from,to)

    variables = []
    range_tuples = []
    # we fill the arrays and use the index to map from gauss-optimizer-value to variable
    for key in knobs:
        variables += [key]
        range_tuples += [(knobs[key][0], knobs[key][1])]

    # we give the minimization function a callback to execute
    # it uses the return value (it tries to minimize it) to select new knobs to test
    # TODO: use mlrMBO or https://github.com/fmfn/BayesianOptimization
    # TODO: or https://github.com/thuijskens/bayesian-optimization
    # TODO: or https://github.com/paulknysh/blackbox/blob/master/blackbox.py
    # TODO: or https://github.com/adebayoj/fairml
    # optimizer_result = gp_minimize(lambda opti_values: self_optimizer_execution(wf, opti_values, variables),
    #                                range_tuples, n_calls=wf.totalExperiments, n_random_starts=optimizer_random_starts)

    # optimizer is done, print results
    # info(">")
    # info("> OptimalResult  | Knobs:  " + str(recreate_knob_from_optimizer_values(variables, optimizer_result.x)))
    # info(">                | Result: " + str(optimizer_result.fun))

def recreate_knob_from_optimizer_values(variables, opti_values):
    """ recreates knob values from a variable """
    knob_object = {}
    # create the knobObject based on the position of the opti_values and variables in their array
    for idx, val in enumerate(variables):
        knob_object[val] = opti_values[idx]
    return knob_object

def self_optimizer_execution(wf, opti_values, variables):
    """ this is the function we call and that returns a value for optimization """
    knob_object = recreate_knob_from_optimizer_values(variables, opti_values)
    # create a new experiment to run in execution
    exp = dict()
    exp["ignore_first_n_results"] = wf.execution_strategy["ignore_first_n_results"]
    exp["sample_size"] = wf.execution_strategy["sample_size"]
    exp["knobs"] = knob_object
    return experimentFunction(wf, exp)
