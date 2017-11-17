from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from elasticsearch import Elasticsearch
from datetime import datetime
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
data_point_type_name = "rtx_run"

class ExperimentResultsWithExpRunIdController(Resource):
    def get(self, rtx_run_id, exp_run_id):
        try:
            resp = jsonify(ExperimentResults=json.dumps(get_exp_results(rtx_run_id, exp_run_id)), sort_keys=True)
            resp.status_code = 200
            return resp
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 404

    def post(self, id):
        content = request.get_json()
        experimentResults[id] = content
        # here we first check if the experiment can be run and then fork it
        return {}, 200

class ExperimentsResultsListController(Resource):
    def get(self):
        return experimentResults.values()

# Helper Function to fetch data from ES using parameters
# One difference with the method in previous RTX class is that,
# this does not only return payload but also other attributes of data
def get_data_points(rtx_run_id):
    try:
        buckets = get_exp_runs_from_db(rtx_run_id)
        response_obj = {}
        for bucket in buckets:
            exp_run_id = bucket["key"]
            searchResults = searchWithQuery(rtx_run_id, exp_run_id)
            parseResults(exp_run_id, searchResults, response_obj)
        return response_obj
    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        return e.message

def get_exp_results(rtx_run_id, exp_run_id):
    try:
        response_obj = {}
        searchResults = searchWithQuery(rtx_run_id, exp_run_id)
        parseResults(exp_run_id, searchResults, response_obj)
        return response_obj
    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        return e.message

def parseResults(exp_run_id, searchResult, response_obj):
    results = []
    for hit in searchResult["hits"]["hits"]:
        if hit["_source"]:
            # date format is used to convert following dates e.g. "2016-03-26T09:25:55.000Z" into string without T
            hit["_source"]["created"] = str(datetime.strptime(hit["_source"]["created"], "%Y-%m-%dT%H:%M:%S.%f"))
        results.append(hit["_source"])
    # associate exp_run_id with key in the response object to be returned
    response_obj[str(exp_run_id)] = results

# Helper function for finding out available exp_run ids in the ES
def get_exp_runs_from_db(rtx_run_id):
    try:
        query = {
            "query": {
                "parent_id": {
                    "type": "data_point",
                    "id": str(rtx_run_id)
                }
            },
            "size": 0,
            "aggs": {
                "exp_run_aggregation": {
                    "terms": {
                        "field": "exp_run"
                    }
                }
            }
        }
        es = Elasticsearch()
        es.indices.refresh(index=elastic_search_index)
        res1 = es.search(index=elastic_search_index, body=query)
        print(res1)
        buckets = res1["aggregations"]["exp_run_aggregation"]["buckets"]
        return buckets

    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        return e.message

def searchWithQuery(rtx_run_id, exp_run_id):
    query = {
        "query": {
            "parent_id": {
                "type": "data_point",
                "id": str(rtx_run_id)
            }
        },
        "post_filter": {
            "term": {"exp_run": int(exp_run_id)}
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