from flask import request
from flask_restful import Resource
from oeda.databases import db
import traceback

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
            # check if given name is unique
            ids, targets = db().get_targets()

            for target in targets:
                if target['name'] == content['name']:
                    print "girdim"
                    return {"error": "Duplicate target system names"}, 409

            content["status"] = "READY"
            db().save_target(target_id, content)
            return {}, 200
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404

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
