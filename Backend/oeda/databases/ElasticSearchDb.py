import traceback
from datetime import datetime
from elasticsearch.exceptions import ConnectionError
from elasticsearch import Elasticsearch
from elasticsearch.client import IndicesClient
from elasticsearch.exceptions import TransportError

from Database import Database
from oeda.log import error


class ElasticSearchDb(Database):

    def __init__(self, host, port, db_config):
        self.es = Elasticsearch([{"host": host, "port": port}])

        if not self.es.ping():
            error("cannot connect to elasticsearch cluster. Check database configuration in config.json.")
            exit(0)

        index = db_config["index"]
        self.index = index["name"]

        stage_type = db_config["stage_type"]
        self.stage_type_name = stage_type["name"]

        analysis_type = db_config["analysis_type"]
        self.analysis_type_name = analysis_type["name"]

        data_point_type = db_config["data_point_type"]
        self.data_point_type_name = data_point_type["name"]

        target_system_type = db_config["target_system_type"]
        self.target_system_type_name = target_system_type["name"]

        experiment_system_type = db_config["experiment_type"]
        self.experiment_type_name = experiment_system_type["name"]

        mappings = dict()
        # user can specify an type without a mapping (dynamic mapping)
        if "mapping" in stage_type:
            mappings[self.stage_type_name] = stage_type["mapping"]
        if "mapping" in analysis_type:
            mappings[self.analysis_type_name] = analysis_type["mapping"]
        if "mapping" in data_point_type:
            mappings[self.data_point_type_name] = data_point_type["mapping"]

        body = dict()
        if "settings" in index:
            body["settings"] = index["settings"]
        if mappings:
            body["mappings"] = mappings

        try:
            self.indices_client = IndicesClient(self.es)
            if not self.indices_client.exists(self.index):
                self.indices_client.create(self.index, body)
        except TransportError:
            error("Error while creating elasticsearch. Check type mappings in config.json.")
            print(traceback.format_exc())
            exit(0)

    def save_target(self, target_system_id, target_system_data):
        #        target_system_data["in_use"] = False
        target_system_data["created"] = datetime.now()
        del target_system_data["id"]
        try:
            self.es.index(self.index, self.target_system_type_name, target_system_data, target_system_id)
        except ConnectionError:
            error("Error while saving rtx_run data in elasticsearch. Check connection to elasticsearch and restart.")

    def get_target(self, target_system_id):
        res = self.es.get(self.index, target_system_id, self.target_system_type_name)
        return res["_source"]

    def get_targets(self):
        query = {
            "size" : 1000,
            "query": {
                "match_all": {}
            }
        }
        res = self.es.search(self.index, self.target_system_type_name, query)
        return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]

    def save_experiment(self, experiment_id, experiment_data):
        experiment_data["status"] = "OPEN"
        experiment_data["created"] = datetime.now()
        del experiment_data["id"]
        try:
            self.es.index(self.index, self.experiment_type_name, experiment_data, experiment_id)
        except ConnectionError:
            error("Error while saving experiment data in elasticsearch. Check connection to elasticsearch and restart.")

    def get_experiment(self, experiment_id):
        res = self.es.get(self.index, experiment_id, self.experiment_type_name)
        return res["_source"]

    def get_experiments(self):
        query = {
            "size" : 1000,
            "query": {
                "match_all": {}
            }
        }

        res = self.es.search(self.index, self.experiment_type_name, query)
        return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]

    def update_experiment_status(self, experiment_id, status):
        body = {"doc": {"status": status}}
        try:
            self.es.update(self.index, self.experiment_type_name, experiment_id, body)
        except ConnectionError:
            error("Error while updating experiment's status in elasticsearch. Check connection to elasticsearch.")

    def update_target_system_status(self, target_system_id, status):
        body = {"doc": {"status": status}}
        try:
            self.es.update(self.index, self.target_system_type_name, target_system_id, body)
        except ConnectionError:
            error("Error while updating target system in_use flag in elasticsearch. Check connection to elasticsearch.")

    def save_data_point(self, exp_run, knobs, payload, data_point_count, experiment_id, stage_no):
        data_point_id = experiment_id + "#" + str(stage_no) + "_" + str(data_point_count)
        stage_id = experiment_id + "#" + str(stage_no)
        body = dict()
        body["payload"] = payload
        body["created"] = datetime.now()
        try:
            self.es.index(self.index, self.data_point_type_name, body, data_point_id, parent=stage_id)
        except ConnectionError:
            error("Error while saving data point data in elasticsearch. Check connection to elasticsearch.")

    # returns data_points whose parent is the concatenated stage_id
    def get_data_points(self, experiment_id, stage_no):
        stage_id = experiment_id + "#" + str(stage_no)
        query = {
            "query": {
                "has_parent": {
                    "type": "stage",
                    "query": {
                        "match": {
                            "_id": str(stage_id)
                        }
                    }
                }
            }
        }
        try:
            res1 = self.es.search(self.index, self.data_point_type_name, query)
            # first determine size, otherwise it returns only 10 data (by default)
            size = res1['hits']['total']

            # https://stackoverflow.com/questions/9084536/sorting-by-multiple-params-in-pyes-and-elasticsearch
            # sorting is required for proper visualization of data
            res2 = self.es.search(self.index, body=query, size=size, sort='created')
            return res2
        except ConnectionError:
            error("Error while retrieving data points from elasticsearch. Check connection to elasticsearch.")

    def save_stage(self, stage_no, knobs, experiment_id):
        stage_id = experiment_id + "#" + str(stage_no)
        body = dict()
        body["number"] = stage_no
        body["knobs"] = knobs
        body["created"] = datetime.now()
        try:
            self.es.index(self.index, self.stage_type_name, body, stage_id, parent=experiment_id)
        except ConnectionError:
            error("Error while saving data point data in elasticsearch. Check connection to elasticsearch.")

    def get_stages(self, experiment_id):

        query = {
            "query": {
                "has_parent": {
                    "type": "experiment",
                    "query": {
                        "match": {
                            "_id": str(experiment_id)
                        }
                    }
                }
            }
        }

        try:
            res = self.es.search(self.index, self.stage_type_name, query)
            return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]
        except ConnectionError:
            error("Error while saving data point data in elasticsearch. Check connection to elasticsearch.")
