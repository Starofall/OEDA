#!/usr/bin/python
from rtxlib.rtx_run import setup_database
from rtxlib.rtx_run import RTXRun
from analysis_lib.one_sample_tests import AndersonDarling
from analysis_lib.one_sample_tests import DAgostinoPearson
from analysis_lib.one_sample_tests import KolmogorovSmirnov
from analysis_lib.one_sample_tests import ShapiroWilk
from analysis_lib.two_sample_tests import Ttest
from analysis_lib.two_sample_tests import TtestSampleSizeEstimation
from analysis_lib.n_sample_tests import OneWayAnova
from analysis_lib.n_sample_tests import KruskalWallis
from analysis_lib.factorial_tests import FactorialAnova
from analysis_lib.n_sample_tests import Levene
from analysis_lib.n_sample_tests import FlignerKilleen
from analysis_lib.n_sample_tests import Bartlett
from rtxlib.rtx_run import db
from math import ceil
from rtxlib import error, info
from multiprocessing import Pool
from math import pow
import sys
from subprocess import Popen


class TestData:

    primary_data_provider = {
        "type": "kafka_consumer",
        "kafka_uri": "exp1:9092",
        "topic": "crowd-nav-trips",
        "serializer": "JSON"
    }

    change_provider = {
        "type": "kafka_producer",
        "kafka_uri": "exp1:9092",
        "topic": "crowd-nav-commands",
        "serializer": "JSON",
    }


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


def get_execution_strategies(execution_strategy, target_system_names):

    knob_keys = get_knob_keys(execution_strategy["type"], execution_strategy["knobs"])
    knobs_count = len(knob_keys)

    exp_list = get_experiment_list(execution_strategy["type"], execution_strategy["knobs"])
    n = int(ceil(float(len(exp_list)) / target_systems_count))

    list_of_sublists_of_configuration_lists = [exp_list[i:i + n] for i in xrange(0, len(exp_list), n)]

    execution_strategies = dict()
    counter = 0
    for sublist_of_configuration_lists in list_of_sublists_of_configuration_lists:
        strategy = execution_strategy.copy()
        knobs_list = list()
        for configuration_list in sublist_of_configuration_lists:
            inner_knobs_dict = dict()
            for i in range(knobs_count):
                inner_knobs_dict[knob_keys[i]]=configuration_list[i]
            knobs_list.append(inner_knobs_dict)
        strategy["type"] = "sequential"
        strategy["knobs"] = knobs_list
        execution_strategies[target_system_names[counter]] = strategy
        # print knobs_list
        counter += 1

    return execution_strategies


def run_rtx__multiprocess_run(target_system_name):
    info("Running rtx on target system with name: " + str(target_system_name))
    return RTXRun.create(target_system_name, execution_strategies[target_system_name]).run()


if __name__ == '__main__':

    try:
        target_systems_count = int(sys.argv[1])
    except:
        target_systems_count = 1

    # execution_strategy = {
    #     "ignore_first_n_results": 1,
    #     "sample_size": 1,
    #     "type": "step_explorer",
    #     "knobs": {
    #         "route_random_sigma": ([0.00, 0.20], 0.01),
    #         "max_speed_and_length_factor": ([0.00, 0.10], 0.01),
    #         # "exploration_percentage": ([0.0, 0.2], 0.2),
    #         # "average_edge_duration_factor": ([0.8, 1], 0.2),
    #     }
    # }

    execution_strategy = {
        "ignore_first_n_results": 0,
        "sample_size": 10000,
        "type": "sequential",
        "knobs": [
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
            {"route_random_sigma": 0},
        ]
    }

    setup_database()

    target_system_names = []

    for i in range(target_systems_count):
        TestData.primary_data_provider["topic"] = "crowd-nav-trips-" + str(i)
        TestData.change_provider["topic"] = "crowd-nav-commands-" + str(i)
        target_system_name = "CrowdNav-" + str(i)
        target_system_names.append(target_system_name)
        db().save_target_system(target_system_name, TestData.primary_data_provider, TestData.change_provider)

    execution_strategies = get_execution_strategies(execution_strategy, target_system_names)


    for i in range(0, target_systems_count):
        target_system_name = target_system_names[i]
        simulation = Popen(["python", "./run.py", str(target_system_name), str(execution_strategies[target_system_name])])
        print("RTX run " + str(i) + " started...")

        # pool = Pool(target_systems_count)
        # rtx_run_ids = pool.map_async(run_rtx__multiprocess_run, target_system_names)
        # pool.close()
        # pool.join()

        #print "RTX runs finished."

        # y_key = "overhead"

        ##########################
        ## One sample tests (Normality tests)
        ##########################
        # DAgostinoPearson(rtx_run_ids, y_key, alpha=0.05).start()
        # ShapiroWilk(rtx_run_ids, y_key, alpha=0.05).start()
        # AndersonDarling(rtx_run_ids, y_key, alpha=0.05).start()
        # KolmogorovSmirnov(rtx_run_ids, y_key, alpha=0.05).start()

        ##########################
        ## Two-sample tests
        ##########################
        # Ttest(rtx_run_ids, y_key, alpha=0.05).start()
        # TtestSampleSizeEstimation(rtx_run_ids, y_key, mean_diff=0.1, alpha=0.05, power=0.8).start()

        ##########################
        ## N-sample tests
        ##########################

        ##########################
        ## Different distributions tests
        ##########################
        # OneWayAnova(rtx_run_ids, y_key).start()
        # KruskalWallis(rtx_run_ids, y_key).start()

        ##########################
        ## Equal variance tests
        ##########################
        # Levene(rtx_run_ids, y_key).start()
        # Bartlett(rtx_run_ids, y_key).start()
        # FlignerKilleen(rtx_run_ids, y_key).start()

        ##########################
        ## Two-way anova
        ##########################
        # FactorialAnova(rtx_run_ids, y_key, execution_strategy["knobs"].keys()).start()

        # TODO: check:
        # racing algorithms: irace
        # distribution-free statistics: histogram

