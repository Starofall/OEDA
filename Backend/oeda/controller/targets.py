from flask import request
from flask_restful import Resource

from oeda.databases import db

# targets = {
#     "12313": {
#         "id": "12313",
#         "primary_data_provider": {
#             "type": "kafka_consumer",
#             "topic": "crowd-nav-trips",
#             "kafka_uri": "kafka:9092",
#             "serializer": "JSON"
#         },
#         "change_provider": {
#             "type": "kafka_producer",
#             "topic": "crowd-nav-commands",
#             "kafka_uri": "kafka:9092",
#             "serializer": "JSON"
#         },
#         "name": "CrowdNav",
#         "status": "READY",  # "READY", "WORKING", "ERROR"
#         "description": "Installed CrowdNav System"
#     }
# }


class TargetController(Resource):
    def get(self, target_id):
        target = db().get_target(target_id)
        try:
            return target
        except:
            return {"error": "not found"}, 404

    def post(self, target_id):
        content = request.get_json()
        content["status"] = "READY"
        db().save_target(target_id, content)
        # targets[id] = content
        return {}, 200


class TargetsListController(Resource):
    def get(self):
        targets = db().get_targets()
        return targets
