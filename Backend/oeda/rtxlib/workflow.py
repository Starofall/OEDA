from colorama import Fore

from oeda.log import *
from oeda.rtxlib.changeproviders import init_change_provider
from oeda.rtxlib.dataproviders import init_data_providers
from oeda.rtxlib.executionstrategy import run_execution_strategy
from oeda.rtxlib.preprocessors import init_pre_processors, kill_pre_processors


def execute_workflow(wf):
    """ this is the main workflow for executing a given workflow """
    try:
        info("######################################", Fore.CYAN)
        info("> Workflow       | " + str(wf.name), Fore.CYAN)

        debug("execution_strategy:" + str(wf.execution_strategy))

    except KeyError as e:
        error("definition.py is missing value " + str(e))
        exit(1)
    # initialize the test environment
    init_pre_processors(wf)
    init_change_provider(wf)
    init_data_providers(wf)
    # here we also execute the strategy
    run_execution_strategy(wf)
    # we are done, now we clean up
    kill_pre_processors(wf)
    info("> Finished workflow")
