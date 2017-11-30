from flask import Flask, request
from flask_restful import Resource, Api
from oeda.databases import db

class StageController(Resource):

    def get(self, experiment_id):
        stage_ids, stages = db().get_stages(experiment_id)
        new_stages = stages
        i = 0
        for stage in stages:
            new_stages[i]["id"] = stage_ids[i]
            i += 1
        return new_stages