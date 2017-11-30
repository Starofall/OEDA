from oeda.log import *
import time
from threading import Timer, current_thread
from oeda.service.threadpool import getCachedThreadPool
from oeda.rtxlib.workflow import execute_workflow
from oeda.service.rtx_definition import *
from oeda.databases import db

# MOCKS
def findOpenExperiments():
    ids, experiments = db().get_experiments()
    new_experiments = experiments
    i = 0
    for exp in experiments:
        new_experiments[i]["id"] = ids[i]
        i += 1

    return filter(lambda x: x["status"] == "OPEN", new_experiments)

    # from oeda.controller.experiments import experiments
    # return filter(lambda x: x["status"] == "OPEN", experiments.values())


def setExperimentStatus(experimentId, status):
    db().update_experiment_status(experimentId, status)

    # from oeda.controller.experiments import experiments
    # experiments[experimentId]["status"] = status
    # debug("Set experiment to " + status + " - " + experimentId)


def setTargetSystemStatus(targetId, status):
    db().update_target_system_status(targetId, status)

    # from oeda.controller.targets import targets
    # targets[targetId]["status"] = status
    # debug("Set target to " + status + " - " + targetId)


def getTargetSystem(targetSystemId):
    return db().get_target(targetSystemId)

    # from oeda.controller.targets import targets
    # return targets.values()[0]


# END MOCKS

def initializeExecutionScheduler():
    # we start the threaded timer to search for experiments with status "OPEN"
    info("Starting execution scheduler")
    # Timer(1, search_for_open_experiments, ()).start()
    Timer(60, search_for_open_experiments, ()).start()


def search_for_open_experiments():
    # put everything in a try, as this function needs to re-schedule the next timer
    try:
        debug("Searching for OPEN experiments")
        open_experiments = findOpenExperiments()
        # go through all open experiments and fork_n_run them on RTX
        map(fork_and_run_experiment, open_experiments)
    except Exception as e:
        print(e)
    # re-schedule the task
    Timer(60, search_for_open_experiments, ()).start()


def fork_and_run_experiment(experiment):
    info("###################")
    info("Found new experiment to run: " + experiment["name"])
    debug("Check target system status")
    targetSystem = getTargetSystem(experiment["targetSystemId"])
    debug("Target system: " + targetSystem["name"])
    if targetSystem["status"] != "READY":
        warn("Target status is NOT READY")
        warn("We have to ignore this for now and wait")
    else:
        debug("Target status is READY")
        debug("Forking experiment NOW")
        # fork RTX execution to threadpool
        getCachedThreadPool().add_task(rtxExecution, experiment, targetSystem)


def rtxExecution(experiment, targetSystem):

    # we create a custom callback that RTX is calling
    # this allows us to update the progress percentage on an experiment
    def oedaCallback(dict):
        info(str(dict))

    try:
        # update the state in the DB
        setExperimentStatus(experiment["id"], "RUNNING")
        setTargetSystemStatus(experiment["targetSystemId"], "WORKING")
        # convert OEDA to RTX experiment
        rtxDefinition = RTXDefinition(experiment, targetSystem, oedaCallback)
        # here we now start the experiment on a differen thread (in the thread pool)
        print "execution_scheduler rtxDefinition"
        print rtxDefinition
        execute_workflow(rtxDefinition)
        # @todo here the analytics part should start and also do
        # @todo updateExperiment(experimentId,analysisResults)
    except Exception as e:
        error("Experiment FAILED - " + experiment["id"] + " - " + str(e))
        setExperimentStatus(experiment["id"], "ERROR")
        setTargetSystemStatus(experiment["targetId"], "READY")
