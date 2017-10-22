from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

targets = {
    "12313123-12313-123123": {
        "id": "12313123-12313-123123",
        "primaryDataProvider": {
            "type": "mqtt_listener",
            "host": "1231",
            "port": 123,
            "topic": "123123",
            "serializer": "JSON"
        },
        "changeProvider": {
            "type": "mqtt_publisher",
            "topic": "123213",
            "host": "123123",
            "port": 123123,
            "serializer": "JSON"
        },
        "name": "CrowdNav",
        "status": "IDLE",
        "description": "Installed CrowdNav System"
    }
}


class TargetController(Resource):
    def get(self, id):
        try:
            return targets[id]
        except:
            return {"error": "not found"}, 404

    def post(self, id):
        content = request.get_json()
        targets[id] = content
        return {}, 200


class TargetsListController(Resource):
    def get(self):
        return targets.values()
