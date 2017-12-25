from flask_restful import Resource
from oeda.databases import db


class StageController(Resource):

    @staticmethod
    def get(experiment_id):
        stage_ids, stages = db().get_stages(experiment_id)
        new_stages = stages
        i = 0
        for _ in stages:
            new_stages[i]["id"] = stage_ids[i]
            new_stages[i]["knobs"] = _["knobs"]
            i += 1
        return new_stages

    @staticmethod
    def get_stages_after(experiment_id, timestamp):
        stage_ids, stages = db().get_stages_after(experiment_id, timestamp)
        new_stages = stages
        i = 0
        for _ in stages:
            new_stages[i]["id"] = stage_ids[i]
            new_stages[i]["knobs"] = _["knobs"]
            i += 1
        return new_stages
