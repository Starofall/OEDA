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
            dataProviders = json.loads(open('oeda/crowdnav_config/dataProviders.json').read())
            data = {
                "name": "CrowdNav",
                "description": "Simulation based on SUMO",
                "kafkaTopicRouting": Config.kafkaTopicRouting,
                "kafkaTopicTrips": Config.kafkaTopicTrips,
                "kafkaTopicPerformance": Config.kafkaTopicPerformance,
                "kafkaHost": Config.kafkaHost,
                "kafkaCommandsTopic": Config.kafkaCommandsTopic, # for now, kafkaHost and kafkaCommandsTopic are only fetched & used for populating change provider entity in OEDA
                "knobs": knobs, # used to populate changeableVariables in OEDA
                "dataProviders": dataProviders # used to populate dataProviders in OEDA
            }
            resp = jsonify(data)
            resp.status_code = 200
            return resp

        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404
