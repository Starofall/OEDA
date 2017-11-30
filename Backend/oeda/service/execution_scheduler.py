from oeda.log import *
from threading import Timer
from oeda.service.threadpool import getCachedThreadPool
from oeda.rtxlib.workflow import execute_workflow
from oeda.service.rtx_definition import *
from oeda.databases import db


def find_open_experiments():
    ids, experiments = db().get_experiments()
    new_experiments = experiments
    i = 0
    for _ in experiments:
        new_experiments[i]["id"] = ids[i]
        i += 1

    return filter(lambda x: x["status"] == "OPEN", new_experiments)


def set_experiment_status(experimentId, status):
    db().update_experiment_status(experimentId, status)


def set_target_system_status(targetId, status):
    db().update_target_system_status(targetId, status)


def get_target_system(targetSystemId):
    return db().get_target(targetSystemId)


def initialize_execution_scheduler():
    # we start the threaded timer to search for experiments with status "OPEN"
    info("Starting execution scheduler")
    Timer(10, search_for_open_experiments, ()).start()


def search_for_open_experiments():
    # put everything in a try, as this function needs to re-schedule the next timer
    try:
        debug("Searching for OPEN experiments")
        open_experiments = find_open_experiments()
        # go through all open experiments and fork_n_run them on RTX
        map(fork_and_run_experiment, open_experiments)
    except Exception as e:
        print(e)
    # re-schedule the task
    Timer(10, search_for_open_experiments, ()).start()


def fork_and_run_experiment(experiment):
    info("###################")
    info("Found new experiment to run: " + experiment["name"])
    debug("Check target system status")
    target_system = get_target_system(experiment["targetSystemId"])
    debug("Target system: " + target_system["name"])
    if target_system["status"] != "READY":
        warn("Target status is NOT READY")
        warn("We have to ignore this for now and wait")
    else:
        debug("Target status is READY")
        debug("Forking experiment NOW")
        # fork RTX execution to threadpool
        getCachedThreadPool().add_task(rtx_execution, experiment, target_system)


def rtx_execution(experiment, targetSystem):

    # we create a custom callback that RTX is calling-this allows us to update the progress percentage on an experiment
    def oeda_callback(dict):
        info(str(dict))

    try:
        set_experiment_status(experiment["id"], "RUNNING")
        set_target_system_status(experiment["targetSystemId"], "WORKING")
        # convert OEDA to RTX experiment
        rtx_definition = RTXDefinition(experiment, targetSystem, oeda_callback)
        # here we now start the experiment on a different thread (in the thread pool)
        execute_workflow(rtx_definition)
        set_experiment_status(experiment["id"], "SUCCESS")
        set_target_system_status(experiment["targetSystemId"], "READY")
        # @todo here the analytics part should start and also do
        # @todo updateExperiment(experimentId,analysisResults)
    except Exception as e:
        error("Experiment FAILED - " + experiment["id"] + " - " + str(e))
        set_experiment_status(experiment["id"], "ERROR")
        set_target_system_status(experiment["targetId"], "READY")
