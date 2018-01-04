from rpy2.robjects.packages import importr, data, isinstalled

import rpy2.robjects as robjects


# http://rpy2.readthedocs.io/en/version_2.7.x/lib_dplyr.html
# https://mlr-org.github.io/mlr-tutorial/release/html/
# R package names to be installed
packnames = ('ggplot2', 'mlr')

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

# pi = robjects.r['pi']
# print(pi[0])

mlr = importr('mlr')
datasets = importr('datasets')
iris_env = data(datasets).fetch('iris')
iris = iris_env['iris']
# print(iris)
robjects.r('task = makeClassifTask(data = iris, target = "Species")')
robjects.r('lrn = makeLearner("classif.lda")')
robjects.r('n = nrow(iris)')
robjects.r('train.set = sample(n, size = 2/3*n)')
robjects.r('test.set =setdiff(1:n, train.set)')
robjects.r('model = train(lrn, task, subset = train.set)')
robjects.r('pred = predict(model, task = task, subset = test.set)')
performance = robjects.r('performance(pred, measures = list(mmce, acc))')
print performance