from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

class Configuration(Resource):

    def get(self):
        return targets

    def put(self):
        print(request)
        targets[todo_id] = request.form['data']
        return {todo_id: targets[todo_id]}
