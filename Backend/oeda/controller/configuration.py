from flask import jsonify
from flask import request
from flask_restful import Resource
from oeda.crowdnav_config import Config
import traceback
import json

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


# returns _oedaCallback as an API from localhost:5000/api/config/oeda
class OEDAConfigController(Resource):

    def get(self):
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
