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
        rtx_run_type = db_config["rtx_run_type"]
        self.rtx_run_type_name = rtx_run_type["name"]
        analysis_type = db_config["analysis_type"]
        self.analysis_type_name = analysis_type["name"]
        data_point_type = db_config["data_point_type"]
        self.data_point_type_name = data_point_type["name"]
        target_system_type = db_config["target_system_type"]
        self.target_system_type_name = target_system_type["name"]

        mappings = dict()
        # user can specify an type without a mapping (dynamic mapping)
        if "mapping" in rtx_run_type:
            mappings[self.rtx_run_type_name] = rtx_run_type["mapping"]
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

    def get_target(self, target_system_id):
        res = self.es.get(self.index, target_system_id, self.target_system_type_name)
        return res["_source"]

    def save_target(self, target_system_id, target_system_data):
        target_system_data["in_use"] = False
        target_system_data["created"] = datetime.now()
        try:
            self.es.index(self.index, self.target_system_type_name, target_system_data, target_system_id)
        except ConnectionError:
            error("Error while saving rtx_run data in elasticsearch. Check connection to elasticsearch and restart.")
            exit(0)