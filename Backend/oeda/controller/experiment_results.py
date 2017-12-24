from flask import jsonify
from flask_restful import Resource
import oeda.controller.stages as sc
import json as json
import traceback
from oeda.databases import db


class StageResultsWithExperimentIdController(Resource):

    @staticmethod
    def get(experiment_id, stage_no):
        try:
            res = db().get_data_points(experiment_id=experiment_id, stage_no=stage_no)
            resp = jsonify(res)
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404


class AllStageResultsWithExperimentIdController(Resource):

    @staticmethod
    def get(experiment_id):
        try:
            resp = jsonify(get_all_stage_data(experiment_id))
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404


def get_all_stage_data(experiment_id):
    all_stage_data = []
    new_stages = sc.StageController.get(experiment_id=experiment_id)

    for stage in new_stages:
        data = db().get_data_points(experiment_id=experiment_id, stage_no=stage['number'])
        # wrap the stage data with stage number if there are some data points
        if len(data) != 0:
            stage_and_data = {
                "stage_number": stage["number"],
                "values": data
            }
            json_data = json.dumps(stage_and_data)
            all_stage_data.append(json_data)

    return all_stage_data
