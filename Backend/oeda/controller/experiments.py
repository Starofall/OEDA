from flask import Flask, request
from flask_restful import Resource, Api
from oeda.databases import db

class ExperimentController(Resource):


    def get(self, experimentId):

        return db().get_experiment(experimentId)

        # try:
        #     for i in experiments:
        #         if experiments[i]["id"] == experimentId:
        #             return experiments[i]
        #
        #     return {"error": "not found"}, 404
        # except:
        #     return {"error": "not found"}, 404

    def post(self, experimentId):
        content = request.get_json()
        print content
        new_knobs = {}
        for knob in content["executionStrategy"]["knobs"]:
            new_knobs[knob[0]] = [knob[1], knob[2], knob[3]]

        content["executionStrategy"]["knobs"] = new_knobs
        print "afyer"
        print content
        # here we first check if the experiment can be run and then fork it
        db().save_experiment(experimentId, content)
        return {}, 200



class ExperimentsListController(Resource):

    def get(self):

        ids, experiments = db().get_experiments()

        new_experiments = experiments
        i = 0
        for exp in experiments:
            new_experiments[i]["id"] = ids[i]
            i += 1

        return new_experiments