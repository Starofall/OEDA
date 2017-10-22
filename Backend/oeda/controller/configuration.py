from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api


config = {

}

class ConfigurationController(Resource):

    def get(self):
        try:
            return config
        except:
            return {"error": "not found"}, 404

    def post(self):
        content = request.get_json()
        global config
        config = content
        return {}, 200
