from oeda.databases import user_db, setup_user_database, create_instance_for_users, create_instance_for_experiments
import json as json
import blackbox as bb
import traceback

from oeda.controller.experiment_results import AllStageResultsWithExperimentIdController
import oeda.controller.stages as sc

from rpy2.robjects.packages import importr, data, isinstalled

import rpy2.robjects as robjects

# def get_stages(experiment_db, experiment_id):
#     stage_ids, stages = experiment_db.get_stages(experiment_id)
#     new_stages = stages
#     i = 0
#     for _ in stages:
#         new_stages[i]["id"] = stage_ids[i]
#         new_stages[i]["knobs"] = _["knobs"]
#         i += 1
#     return new_stages
#
# def get_all_stage_data(experiment_db, experiment_id):
#     all_stage_data = []
#     new_stages = get_stages(experiment_db=experiment_db, experiment_id=experiment_id)
#
#     for stage in new_stages:
#         data = experiment_db.get_data_points(experiment_id=experiment_id, stage_no=stage['number'])
#         # wrap the stage data with stage number if there are some data points
#         if len(data) != 0:
#             stage_and_data = {
#                 "knobs": stage["knobs"],
#                 "number": stage["number"],
#                 "values": data
#             }
#             json_data = json.dumps(stage_and_data)
#             all_stage_data.append(json_data)
#
#     return all_stage_data
#
# # first retrieve a dummy user (username = test, password = test) that is previously registered to the system via dashboard
# with open('../databases/user_db_config.json') as json_data_file:
#     try:
#         config_data = json.load(json_data_file)
#         db = create_instance_for_users(config_data['db_type'], config_data['host'], config_data['port'], config_data)
#         retrieved_user = db.get_user("test")
#         # print(retrieved_user)
#     except Exception as e:
#         print(e.message)
#         exit(0)
#
# # then retrieve experiments of the user
# with open('../databases/experiment_db_config.json') as json_data_file:
#     # try:
#     config_data = json.load(json_data_file)
#     experiment_db = create_instance_for_experiments(type="elasticsearch", host="localhost", port="9200", config=config_data)
#     exp_ids, exp_info = experiment_db.get_experiments()
#     for exp in exp_info:
#         if exp["status"] is not "RUNNING":
#             ind = exp_info.index(exp)
#             print exp
#             knobs_without_step = []
#             for knob_value in exp["executionStrategy"]["knobs"].values():
#                 print knob_value
#                 knobs_without_step.append(knob_value[:2])
#             data_points = get_all_stage_data(experiment_db=experiment_db, experiment_id=exp_ids[ind])
#             data_points = json.dumps(data_points, indent=4)

    # except Exception as e:
    #     tb = traceback.format_exc()
    #     print(tb)
    #     exit(0)
#
# def fun(par):
#
#     return output

# def main():
#     bb.search(f=fun,  # given function
#               box=[[-10., 10.], [-10., 10.]],  # range of values for each parameter
#               n=20,  # number of function calls on initial stage (global search)
#               m=20,  # number of function calls on subsequent stage (local search)
#               batch=4,  # number of calls that will be evaluated in parallel
#               resfile='output.csv')  # text file where results will be saved

#
# if __name__ == '__main__':
#     main()

# http://rpy2.readthedocs.io/en/version_2.7.x/lib_dplyr.html
# https://mlr-org.github.io/mlr-tutorial/release/html/
# R package names to be installed
packnames = ('ggplot2', 'spoof', 'mlrMBO', 'DiceKriging', 'randomForest')

if all(isinstalled(x) for x in packnames):
    have_tutorial_packages = True
else:
    have_tutorial_packages = False

if not have_tutorial_packages:
    # import R's utility package
    utils = importr('utils')
    # select a mirror for R packages
    utils.chooseCRANmirror(ind = 1) # select the first mirror in the list

    # R vector of strings
    from rpy2.robjects.vectors import StrVector
    # file
    packnames_to_install = [x for x in packnames if not isinstalled(x)]
    if len(packnames_to_install) > 0:
        utils.install_packages(StrVector(packnames_to_install))

mlr = importr('mlrMBO')

# use a pre-defined function
# robjects.r('obj.fun = makeCosineMixtureFunction(1)')

# or create your own objective function
robjects.r('obj.fun = makeSingleObjectiveFunction(name = "my_sphere", fn = function(x) {sum(x*x) + 7}, par.set = makeParamSet(makeNumericVectorParam("x", len = 2L, lower = -5, upper = 5)),minimize = TRUE)')
robjects.r('des = generateDesign(n = 5, par.set = getParamSet(obj.fun), fun = lhs::randomLHS)')
robjects.r('des$y = apply(des, 1, obj.fun)')
robjects.r('surr.km = makeLearner("regr.km", predict.type = "se", covtype = "matern3_2", control = list(trace = FALSE))')
robjects.r('control=makeMBOControl()')
robjects.r('control = setMBOControlTermination(control, iters = 10)')
robjects.r('control = setMBOControlInfill(control, crit = makeMBOInfillCritEI())')
run = robjects.r('run = mbo(obj.fun, design = des, learner = surr.km, control = control, show.info = TRUE)')
print run
