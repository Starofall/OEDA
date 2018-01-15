from flask import jsonify
from flask import request
from flask_restful import Resource
from oeda.crowdnav_config import Config
import traceback
import json


class CrowdNavConfigController(Resource):
    @staticmethod
    def get():
        try:
            knobs = json.loads(open('oeda/crowdnav_config/knobs.json').read())
            outputs = json.loads(open('oeda/crowdnav_config/outputs.json').read())
            data = {
                "name": "CrowdNav",
                "description": "Simulation based on SUMO",
                "kafkaTopicRouting": Config.kafkaTopicRouting,
                "kafkaHost": Config.kafkaHost,
                "kafkaTopicTrips": Config.kafkaTopicTrips,
                "kafkaTopicPerformance": Config.kafkaTopicPerformance,
                "kafkaCommandsTopic": Config.kafkaCommandsTopic,
                "knobs": knobs,
                "outputs": outputs
            }
            resp = jsonify(data)
            resp.status_code = 200
            return resp

        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404
