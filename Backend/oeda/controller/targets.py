from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

from oeda.databases import db

targets = {
    "12313": {
        "id": "12313",
        "primary_data_provider": {
            "type": "kafka_consumer",
            "topic": "crowd-nav-trips",
            "kafka_uri": "kafka:9092",
            "serializer": "JSON"
        },
        "change_provider": {
            "type": "kafka_producer",
            "topic": "crowd-nav-commands",
            "kafka_uri": "kafka:9092",
            "serializer": "JSON"
        },
        "name": "CrowdNav",
        "status": "READY",  # "READY", "WORKING", "ERROR"
        "description": "Installed CrowdNav System"
    }
}


class TargetController(Resource):
    def get(self, id):

        # just for testing:
        # id = "12313123-12313-123123"
        # target = db().get_target(id)
        try:
            return targets[id]
        except:
            return {"error": "not found"}, 404

    def post(self, id):

        # just for testing:
        # id = "12313123-12313-123123"
        # content = request.get_json()
        # db().save_target(id, content)

        content = request.get_json()
        content["status"] = "READY"
        targets[id] = content
        return {}, 200


class TargetsListController(Resource):
    def get(self):
        return targets.values()
