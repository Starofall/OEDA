from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

experiments = {
    "0":
        {
            "id": "0",
            "name": "Experiment 0",
            "status": "RUNNING"
        },
    "1":
        {
            "id": "1",
            "name": "Experiment 1",
            "status": "RUNNING"
        },
    "2":
        {
            "id": "2",
            "name": "Experiment 2",
            "status": "RUNNING"
        },
}


class ExperimentController(Resource):
    def get(self, id):
        try:
            return experiments[id]
        except:
            return {"error": "not found"}, 404

    def post(self, id):
        content = request.get_json()
        experiments[id] = content
        # here we first check if the experiment can be run and then fork it
        return {}, 200


class ExperimentsListController(Resource):
    def get(self):
        print experiments
        return experiments.values()
