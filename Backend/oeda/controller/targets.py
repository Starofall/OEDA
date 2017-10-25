from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

from oeda.databases import db

targets = {
    "12313123-12313-123123": {
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
        # "in_use": False, (this is set to false when creating the document)
        "description": "Installed CrowdNav System"
    }
}


class TargetController(Resource):

    def get(self, id):

        # just for testing:
        id = "12313123-12313-123123"
        target = db().get_target(id)

        try:
            return target
        except:
            return {"error": "not found"}, 404

    def post(self, id):
        content = request.get_json()

        # just for testing:
        id = "12313123-12313-123123"
        content = targets[id]
        db().save_target(id, content)

        return {}, 200


class TargetsListController(Resource):
    def get(self):
        return targets.values()
