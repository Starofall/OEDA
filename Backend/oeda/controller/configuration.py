from flask import jsonify
from flask import request
from flask_restful import Resource
from oeda.crowdnav_config import Config
import traceback
import json

config = {

}


class ConfigurationController(Resource):

    @staticmethod
    def get():
        try:
            return config
        except:
            return {"error": "not found"}, 404

    @staticmethod
    def post():
        content = request.get_json()
        global config
        config = content
        return {}, 200


# TODO is this comment correct?
# returns _oedaCallback as an API from localhost:5000/api/config/oeda
# TODO Shouldn't this class be named CrowdNavConfigController or similar?
class OEDAConfigController(Resource):

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
