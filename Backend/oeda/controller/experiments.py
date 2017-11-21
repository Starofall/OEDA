from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

experiments = {
    "0":
        {
            "id": "123123",
            "name": "CrowdNav Optimization #1",
            "status": "OPEN",
            "targetId":"12313",
            "sample_size":123
        },
    "1":
        {
            "id": "123124",
            "name": "CrowdNav Optimization #2",
            "status": "SUCCESS",
            "targetId":"333333",
            "sample_size":123
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
