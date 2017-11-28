from flask import request
from flask_restful import Resource
from oeda.databases import db


class TargetController(Resource):
    def get(self, target_id):
        target = db().get_target(target_id)
        try:
            return target
        except:
            return {"error": "not found"}, 404

    def post(self, target_id):
        try:
            content = request.get_json()
            content["status"] = "READY"
            db().save_target(target_id, content)
            return {}, 200
        except:
            return {"error": "problem occurred while saving target to DB"}, 404

class TargetsListController(Resource):
    def get(self):
        ids, targets = db().get_targets()
        new_targets = targets
        i = 0
        for target in targets:
            new_targets[i]["id"] = ids[i]
            i += 1

        return new_targets

        # return [t[i]["id"]=ids[i]  for i in 0..len(ids) for t in targets]
