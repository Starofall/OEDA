from flask import jsonify
from flask_restful import Resource
from elasticsearch import Elasticsearch
from datetime import datetime
import oeda.controller.stages as sc


from oeda.databases import db
import json as json
import traceback

# TODO: retrieve these hard-coded values from respective configuration files
elastic_search_index = "rtx"

globalDict = None

class RunningStageResultsWithExperimentIdController(Resource):
    def get(self, experiment_id, stage_no, timestamp):
        try:
            if timestamp is None:
                return {"error": "timestamp should not be null"}, 404
            resp = jsonify(get_data_points_after(experiment_id, stage_no, timestamp))
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404

class RunningAllStageResultsWithExperimentIdController(Resource):

    # first gets all stages of given experiment, then concats all data to a single tuple
    def get(self, experiment_id, timestamp):
        try:
            if timestamp is None:
                return {"error": "timestamp should not be null"}, 404

            all_stage_data = get_all_stage_data_after(experiment_id, timestamp)
            resp = jsonify(all_stage_data)
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404

def get_all_stage_data_after(experiment_id, timestamp):
    all_stage_data = []
    new_stages = sc.StageController.get_stages_after(experiment_id=experiment_id, timestamp=timestamp)

    for stage in new_stages:
        data = get_data_points_after(experiment_id, stage['number'], timestamp)

        # wrap the stage data with stage number
        stage_and_data = {
            "stage_number": stage["number"],
            "values": data
        }
        json_data = json.dumps(stage_and_data)
        all_stage_data.append(json_data)
    return all_stage_data


# Helper Function to fetch data from ES with given parameters
def get_data_points(experiment_id, stage_no):
    res = db().get_data_points(experiment_id=experiment_id, stage_no=stage_no)
    return [r["_source"] for r in res["hits"]["hits"]]

def get_data_points_after(experiment_id, stage_no, timestamp):
    res = db().get_data_points_after(experiment_id=experiment_id, stage_no=stage_no, timestamp=timestamp)
    return [r["_source"] for r in res["hits"]["hits"]]

# no longer needed?
def format_data(res):
    for hit in res["hits"]["hits"]:
        if hit["_source"]:
            parse_date(hit["_source"])
    return res

# ref: https://stackoverflow.com/questions/9507648/datetime-from-string-in-python-best-guessing-string-format
def parse_date(source):
    # used to convert following dates e.g. "2016-03-26T09:25:55.000Z" or "2016-03-26T09:25:55" etc.
    date_patterns = ["%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M", "%Y-%m-%dT%H"]

    for pattern in date_patterns:
        try:
            source["created"] = str(datetime.strptime(source["created"], pattern))
            return source
        except:
            pass

# TODO: both set_dict and get function in OEDACallbackController should be called with experiment_id
# otherwise how should we determine the correct experiment running in background?
def set_dict(dictionary):
    global globalDict
    globalDict = dictionary

# returns _oedaCallback as an API
class OEDACallbackController(Resource):

    def get(self, experiment_id):
        try:
            if experiment_id is None:
                return {"error": "experiment_id should not be null"}, 404

            global globalDict
            if globalDict is None:
                resp = jsonify({"status": "PROCESSING", "message": "OEDA callback has not been processed yet..."})
            else:
                # should return the dict to user after callback is received
                resp = jsonify(globalDict)

            resp.status_code = 200
            return resp

        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404


