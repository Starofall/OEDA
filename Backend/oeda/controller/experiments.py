from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api
from oeda.databases import db

class ExperimentController(Resource):
    def get(self, experimentId):
        try:
            for i in experiments:
                if experiments[i]["id"] == experimentId:
                    return experiments[i]

            return {"error": "not found"}, 404
        except:
            return {"error": "not found"}, 404

    def post(self, experimentId):
        content = request.get_json()
        print("content" + str(content))
        # here we first check if the experiment can be run and then fork it
        db().save_experiment(experimentId, content)
        return {}, 200



class ExperimentsListController(Resource):
    def get(self):
        experiments = db().get_experiments()
        return experiments
