from oeda.log import *
from threading import Timer
from oeda.service.threadpool import getCachedThreadPool
from oeda.rtxlib.workflow import execute_workflow
from oeda.service.rtx_definition import *
from oeda.databases import db
import traceback
from oeda.controller.running_experiment_results import set_dict as set_dict

execution_scheduler_timer = None


def find_open_experiments():
    ids, experiments = db().get_experiments()
    new_experiments = experiments
    i = 0
    for _ in experiments:
        new_experiments[i]["id"] = ids[i]
        i += 1

    return filter(lambda x: x["status"] == "OPEN", new_experiments)


def set_experiment_status(experiment_id, status):
    db().update_experiment_status(experiment_id, status)


def set_target_system_status(target_id, status):
    db().update_target_system_status(target_id, status)


def get_target_system(target_system_id):
    return db().get_target(target_system_id)


def initialize_execution_scheduler(period):
    # we start the threaded timer to search for experiments with status "OPEN"
    info("Starting execution scheduler")
    global execution_scheduler_timer
    execution_scheduler_timer = Timer(period, search_for_open_experiments, [period]).start()


def search_for_open_experiments(period):
    # put everything in a try, as this function needs to re-schedule the next timer
    try:
        debug("Searching for OPEN experiments")
        open_experiments = find_open_experiments()
        # go through all open experiments and fork_n_run them on RTX
        map(fork_and_run_experiment, open_experiments)
    except Exception as e:
        print(e)
    # re-schedule the task
    Timer(period, search_for_open_experiments, [period]).start()


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

        # example of killing experiment after 10 secs TODO remove this line after testing!
        # Timer(10, kill_experiment, [experiment["id"]]).start()


def kill_experiment(experiment_id):
    debug("Interrupting experiment with id " + experiment_id)
    try:
        getCachedThreadPool().kill_thread(experiment_id)
        return True
    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        return False


def rtx_execution(experiment, target_system, oeda_stop_request):

    def oeda_callback(dictionary, experiment_id):
        """"Custom callback that RTX uses to update us with experiment progress information"""
        set_dict(dictionary, experiment_id)

    try:
        set_experiment_status(experiment["id"], "RUNNING")
        set_target_system_status(experiment["targetSystemId"], "WORKING")
        # convert OEDA to RTX experiment
        workflow = RTXDefinition(experiment, target_system, oeda_callback, oeda_stop_request)
        # here we now start the experiment on a different thread (in the thread pool)
        execute_workflow(workflow)
        set_experiment_status(experiment["id"], "SUCCESS")
        set_target_system_status(experiment["targetSystemId"], "READY")
        # TODO here the analytics part should start and also do updateExperiment(experimentId, analysisResults)

    except RuntimeError as e:
        debug("Experiment INTERRUPTED - " + experiment["id"] + " - " + str(e))
        set_experiment_status(experiment["id"], "INTERRUPTED")
        set_target_system_status(experiment["targetSystemId"], "READY")

    except Exception as e:
        tb = traceback.format_exc()
        print tb
        error("Experiment FAILED - reason: " + str(tb))
        error("Experiment FAILED - " + experiment["id"] + " - " + str(e))
        set_experiment_status(experiment["id"], "ERROR")
        set_target_system_status(experiment["targetSystemId"], "READY")


def get_execution_scheduler_timer():
    global execution_scheduler_timer
    return execution_scheduler_timer


def kill_execution_scheduler_timer():
    debug("Killing execution scheduler")
    try:
        global execution_scheduler_timer
        execution_scheduler_timer = None
        return True
    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        return False
