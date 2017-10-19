from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

experiments = [
    {
        "id": "123123",
        "name": "TestName",
        "status": "RUNNING"
    },
    {
        "id": "123123",
        "name": "Done Stuff",
        "status": "SUCCESS"
    }
]


class Experiment(Resource):
    def get(self, id):
        return experiments[0]

    def post(self, id):
        print(request)
        experiments[id] = request.form['data']
        return {todo_id: experiments[id]}


class ExperimentsList(Resource):
    def get(self):
        return experiments
