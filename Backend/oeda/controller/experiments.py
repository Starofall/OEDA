from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api
from oeda.databases import db

class ExperimentController(Resource):
    def get(self, experimentId):
        return db().get

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
