from flask import request
from flask_restful import Resource
from oeda.databases import user_db
import json, traceback


class ExecutionSchedulerController(Resource):
    @staticmethod
    def post():
        try:
            content = request.get_json()
            print content
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"message": e.message}, 404