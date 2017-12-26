from flask import request, jsonify
from flask_restful import Resource
from oeda.databases import db
from oeda.controller.running_experiment_results import set_dict as set_dict
import traceback

class ExperimentController(Resource):

    @staticmethod
    def get(experiment_id):
        return db().get_experiment(experiment_id)

    @staticmethod
    def post(experiment_id):
        content = request.get_json()
        new_knobs = {}
        for knob in content["executionStrategy"]["knobs"]:
            new_knobs[knob[0]] = [knob[1], knob[2], knob[3]]

        content["executionStrategy"]["knobs"] = new_knobs
        db().save_experiment(experiment_id, content)
        # here we refresh the status of oeda callback, too
        set_dict(None, experiment_id)
        return {}, 200

    @staticmethod
    def put(experiment_id):
        try:
            if experiment_id is None:
                return {"message": "experiment_id should not be null"}, 404
            content = request.get_json()
            status = content["status"]
            db().update_experiment_status(experiment_id, status)
            resp = jsonify({"message": "Experiment status is updated"})
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"message": e.message}, 404

class ExperimentsListController(Resource):

    @staticmethod
    def get():
        ids, experiments = db().get_experiments()
        new_experiments = experiments
        i = 0
        for _ in experiments:
            new_experiments[i]["id"] = ids[i]
            i += 1
        return new_experiments
