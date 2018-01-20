from oeda.log import *
from oeda.rtxlib.execution import experimentFunction
from oeda.analysis import blackbox as bb
from skopt import gp_minimize

def random_execution(wf, optimum_values, variables):
    """ this is the function we call and that returns a value for optimization """
    knob_object = recreate_knob_from_optimizer_values(variables, optimum_values)
    # create a new experiment to run in execution
    exp = dict()
    exp["ignore_first_n_results"] = wf.execution_strategy["ignore_first_n_results"]
    exp["sample_size"] = wf.execution_strategy["sample_size"]
    exp["knobs"] = knob_object
    wf.setup_stage(wf, exp["knobs"])
    execution_result = experimentFunction(wf, exp)
    info(">                | execution_result: " + str(execution_result))
    return execution_result


def start_random_strategy(wf):
    """ executes experiments by randomly picking values from the provided interval(s) """
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
        # range_tuples += [ [knobs[key][0], knobs[key][1] ] ]
        range_tuples += [(knobs[key][0], knobs[key][1])]

    info("> RandomStrategy   | wf.totalExperiments" + str(wf.totalExperiments), Fore.CYAN)
    info("> RandomStrategy   | knobs" + str(knobs), Fore.CYAN)
    info("> RandomStrategy   | range_tuples" + str(range_tuples), Fore.CYAN)

    # we give the minimization function a callback to execute
    # it uses the return value (it tries to minimize it) to select new knobs to test
    # TODO: use mlrMBO or https://github.com/fmfn/BayesianOptimization
    # TODO: or https://github.com/thuijskens/bayesian-optimization
    # TODO: or https://github.com/paulknysh/blackbox/blob/master/blackbox.py
    # TODO: or https://github.com/adebayoj/fairml
    # optimizer_result = bb.search(
    #     lambda optimum_values: random_execution(wf, optimum_values, variables), # given function
    #     box=range_tuples, # range of values for each parameter
    #     n=wf.totalExperiments, # number of function calls on initial stage (global search)
    #     m=optimizer_random_starts, # number of function calls on subsequent stage (local search)
    #     batch=4,  # number of calls that will be evaluated in parallel
    #     resfile='output.csv') # text file where results will be saved

    optimizer_result = gp_minimize(lambda opti_values: random_execution(wf, opti_values, variables),
                                   range_tuples, n_calls=wf.totalExperiments, n_random_starts=optimizer_random_starts)

    # optimizer is done, print results
    info(">")
    info("> OptimalResult  | Knobs:  " + str(recreate_knob_from_optimizer_values(variables, optimizer_result.x)))
    info(">                | Result: " + str(optimizer_result.fun))


def recreate_knob_from_optimizer_values(variables, optimum_values):
    """ recreates knob values from a variable """
    knob_object = {}
    # create the knobObject based on the position of the opti_values and variables in their array
    for idx, val in enumerate(variables):
        knob_object[val] = optimum_values[idx]
    return knob_object
