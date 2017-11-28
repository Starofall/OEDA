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
        self.experiment_system_type_name = experiment_system_type["name"]

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
        try:
            self.es.index(self.index, self.target_system_type_name, target_system_data, target_system_id)
        except ConnectionError:
            error("Error while saving rtx_run data in elasticsearch. Check connection to elasticsearch and restart.")

    def get_target(self, target_system_id):
        res = self.es.get(self.index, target_system_id, self.target_system_type_name)
        return res["_source"]

    def get_targets(self):
        query = {
            "query": {
                "match_all": {}
            }
        }
        res = self.es.search(self.index, self.target_system_type_name, query)
        return [r["_source"] for r in res["hits"]["hits"]]



    def save_experiment(self, experiment_id, experiment_data):
        #        target_system_data["in_use"] = False
        experiment_data["created"] = datetime.now()
        try:
            self.es.index(self.index, self.experiment_system_type_name, experiment_data, experiment_id)
        except ConnectionError:
            error("Error while saving experiment data in elasticsearch. Check connection to elasticsearch and restart.")

    def get_experiment(self, experiment_id):
        res = self.es.get(self.index, experiment_id, self.experiment_system_type_name)
        return res["_source"]

    def get_experiments(self):
        query = {
            "query": {
                "match_all": {}
            }
        }
        res = self.es.search(self.index, self.experiment_system_type_name, query)
        return [r["_source"] for r in res["hits"]["hits"]]


