from flask import request
from flask_restful import Resource
from oeda.databases import db


class TargetController(Resource):
    def get(self, id):
        target = db().get_target(id)
        try:
            return target
        except:
            return {"error": "not found"}, 404

    def post(self, id):
        content = request.get_json()
        content["status"] = "READY"
        db().save_target(id, content)
        return {}, 200


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
