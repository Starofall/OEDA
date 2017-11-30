from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from elasticsearch import Elasticsearch
from datetime import datetime

from oeda.databases import db
import json as json
import traceback

experimentResults = {
    "123123":
        {
            "id": "123123",
            "name": "TestName",
            "status": "RUNNING"
        },
    "123124":
        {
            "id": "123124",
            "name": "Done Stuff",
            "status": "SUCCESS"
        }
}

# TODO: retrieve these hard-coded values from respective configuration files
elastic_search_index = "rtx"

class StageResultsWithExperimentIdController(Resource):
    def get(self, experiment_id, stage_no):
        try:
            resp = jsonify(ExperimentResults=json.dumps(get_data_points(experiment_id, stage_no)), sort_keys=True)
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404

    def post(self, experiment_id):
        content = request.get_json()
        experimentResults[experiment_id] = content
        # here we first check if the experiment can be run and then fork it
        return {}, 200

class ExperimentsResultsListController(Resource):
    def get(self):
        return experimentResults.values()

# Helper Function to fetch data from ES with given parameters
def get_data_points(experiment_id, stage_no):
    res = db().get_data_points(experiment_id=experiment_id, stage_no=stage_no)
    formatted_res = format_data(res)
    return [r["_source"] for r in formatted_res["hits"]["hits"]]

def format_data(res):
    for hit in res["hits"]["hits"]:
        if hit["_source"]:
            # date format is used to convert following dates e.g. "2016-03-26T09:25:55.000Z" into string without T
            hit["_source"]["created"] = str(datetime.strptime(hit["_source"]["created"], "%Y-%m-%dT%H:%M:%S.%f"))
    return res

# Helper function for finding out available stage ids in the ES
def get_stages_from_db(experiment_id):
    try:
        query = {
            "query": {
                "parent_id": {
                    "type": "experiment",
                    "id": str(experiment_id)
                }
            },
            "size": 0,
            "aggs": {
                "stage_aggregation": {
                    "terms": {
                        "field": "number"
                    }
                }
            }
        }
        es = Elasticsearch()
        es.indices.refresh(index=elastic_search_index)
        res1 = es.search(index=elastic_search_index, body=query)
        print(res1)
        buckets = res1["aggregations"]["stage_aggregation"]["buckets"]
        return buckets

    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        return e.message

def searchWithQuery(experiment_id, stage_id):
    query = {
        "query": {
            "parent_id": {
                "type": "experiment",
                "id": str(experiment_id)
            }
        },
        "post_filter": {
            "term": {"stage": int(stage_id)}
        }
    }
    es = Elasticsearch()
    es.indices.refresh(index=elastic_search_index)
    res1 = es.search(index=elastic_search_index, body=query)
    # first determine size, otherwise it returns only 10 data (by default)
    size = res1['hits']['total']
    # https://stackoverflow.com/questions/9084536/sorting-by-multiple-params-in-pyes-and-elasticsearch
    # sorting is required for proper visualization of data
    res2 = es.search(index=elastic_search_index, body=query, size=size, sort='created')
    return res2
