from flask import request
from flask_restful import Resource
from oeda.databases import db


class ExperimentController(Resource):

    @staticmethod
    def get(experiment_id):
        return db().get_experiment(experiment_id)

    @staticmethod
    def post(experiment_id):
        content = request.get_json()
        print content
        new_knobs = {}
        for knob in content["executionStrategy"]["knobs"]:
            new_knobs[knob[0]] = [knob[1], knob[2], knob[3]]

        content["executionStrategy"]["knobs"] = new_knobs
        print "content in ExperimentController after:"
        print content
        # here we first check if the experiment can be run and then fork it
        db().save_experiment(experiment_id, content)
        return {}, 200


class ExperimentsListController(Resource):

    @staticmethod
    def get():
        ids, experiments = db().get_experiments()
        new_experiments = experiments
        i = 0
        for _ in experiments:
            new_experiments[i]["id"] = ids[i]
            i += 1
        return new_experiments
