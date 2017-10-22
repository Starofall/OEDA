from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

experiments = {
    "123123":
        {
            "id": "123123",
            "name": "TestName",
            "status": "RUNNING"
        },
    "123124":
        {
            "id": "123124",
            "name": "Done Stuff",
            "status": "SUCCESS"
        }
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
        return experiments.values()
