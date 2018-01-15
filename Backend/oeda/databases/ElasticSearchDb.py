import traceback
from datetime import datetime
from elasticsearch.exceptions import ConnectionError
from elasticsearch import Elasticsearch
from elasticsearch.client import IndicesClient
from elasticsearch.exceptions import TransportError

from Database import Database
from oeda.log import *


class ElasticSearchDb(Database):

    def __init__(self, host, port, db_config):
        self.es = Elasticsearch([{"host": host, "port": port}])
        try:
            if self.es.ping():
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


                self.indices_client = IndicesClient(self.es)
                if not self.indices_client.exists(self.index):
                    self.indices_client.create(index=self.index, body=body)
            else:
                raise ConnectionError("Host/port values are not valid")
        except TransportError as err1:
            error("Error while creating elasticsearch for experiments. Check type mappings for experiments in experiment_db_config.json.")
            raise err1

    def save_target(self, target_system_id, target_system_data):
        target_system_data["created"] = datetime.now().isoformat(' ')
        del target_system_data["id"]
        try:
            self.es.index(index=self.index, doc_type=self.target_system_type_name, id=target_system_id, body=target_system_data)
        except ConnectionError:
            error("Error while saving target system in elasticsearch. Check connection to elasticsearch and restart.")
        except TransportError:
            error("Error while saving target system in elasticsearch. Check type mappings in experiment_db_config.json.")
            print(traceback.format_exc())
        return target_system_data

    def get_target(self, target_system_id):
        res = self.es.get(index=self.index, doc_type=self.target_system_type_name, id=target_system_id)
        return res["_source"]

    def get_targets(self):
        query = {
            "size" : 1000,
            "query": {
                "match_all": {}
            }
        }
        res = self.es.search(index=self.index, doc_type=self.target_system_type_name, body=query)
        return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]

    def save_experiment(self, experiment_id, experiment_data):
        experiment_data["status"] = "OPEN"
        experiment_data["created"] = datetime.now().isoformat(' ')
        del experiment_data["id"]
        try:
            self.es.index(index=self.index, doc_type=self.experiment_type_name, body=experiment_data, id=experiment_id)
        except ConnectionError:
            error("Error while saving experiment data in elasticsearch. Check connection to elasticsearch and restart.")

    def get_experiment(self, experiment_id):
        res = self.es.get(index=self.index, doc_type=self.experiment_type_name, id=experiment_id)
        return res["_source"]

    def get_experiments(self):
        query = {
            "size": 1000,
            "query": {
                "match_all": {}
            }
        }

        res = self.es.search(index=self.index, doc_type=self.experiment_type_name, body=query)
        return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]

    def update_experiment_status(self, experiment_id, status):
        body = {"doc": {"status": status}}
        try:
            self.es.update(index=self.index, doc_type=self.experiment_type_name, id=experiment_id, body=body)
        except ConnectionError:
            error("Error while updating experiment's status in elasticsearch. Check connection to elasticsearch.")

    def update_target_system_status(self, target_system_id, status):
        body = {"doc": {"status": status}}
        try:
            self.es.update(index=self.index, doc_type=self.target_system_type_name, id=target_system_id, body=body)
        except ConnectionError:
            error("Error while updating target system in_use flag in elasticsearch. Check connection to elasticsearch.")

    def save_stage(self, stage_no, knobs, experiment_id):
        stage_id = self.create_stage_id(experiment_id, str(stage_no))
        body = dict()
        body["number"] = stage_no
        body["knobs"] = knobs
        body["created"] = datetime.now().isoformat(' ')
        try:
            self.es.index(index=self.index, doc_type=self.stage_type_name, body=body, id=stage_id, parent=experiment_id)
        except ConnectionError:
            error("Error while saving stage in elasticsearch. Check connection to elasticsearch.")

    def get_stages(self, experiment_id):
        query = {
            "query": {
                "has_parent": {
                    "parent_type": "experiment",
                    "query": {
                        "match": {
                            "_id": str(experiment_id)
                        }
                    }
                }
            }
        }

        try:
            res = self.es.search(index=self.index, doc_type=self.stage_type_name, body=query, size=10000, sort='created')
            return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]
        except ConnectionError:
            error("Error while getting stages from elasticsearch. Check connection to elasticsearch.")

    def get_stages_after(self, experiment_id, timestamp):
        query = {
            "query": {
                "has_parent": {
                    "parent_type": "experiment",
                    "query": {
                        "match": {
                            "_id": str(experiment_id)
                        }
                    }
                }
            },
            "post_filter": {
                "range": {
                    "created": {
                        "gt": timestamp,
                        "format": "yyyy-MM-dd HH:mm:ss.SSSSSS"
                    }
                }
            }
        }

        try:
            res = self.es.search(index=self.index, doc_type=self.stage_type_name, body=query, sort='created')
            return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]
        except ConnectionError:
            error("Error while getting stage data from elasticsearch. Check connection to elasticsearch.")

    def save_data_point(self, payload, data_point_count, experiment_id, stage_no):
        data_point_id = Database.create_data_point_id(experiment_id, stage_no, data_point_count)
        stage_id = Database.create_stage_id(experiment_id, stage_no)
        body = dict()
        body["payload"] = payload
        body["created"] = datetime.now().isoformat(' ') # used to replace 'T' with ' '
        try:
            self.es.index(index=self.index, doc_type=self.data_point_type_name, body=body, id=data_point_id, parent=stage_id)
        except ConnectionError:
            error("Error while saving data point data in elasticsearch. Check connection to elasticsearch.")

    def get_data_points(self, experiment_id, stage_no):
        stage_id = Database.create_stage_id(experiment_id, stage_no)
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
            # https://stackoverflow.com/questions/9084536/sorting-by-multiple-params-in-pyes-and-elasticsearch
            # sorting is required for proper visualization of data
            res = self.es.search(index=self.index, body=query, size=10000, sort='created')
            return [r["_source"] for r in res["hits"]["hits"]]
        except ConnectionError:
            error("Error while retrieving data points from elasticsearch. Check connection to elasticsearch.")

    def get_data_points_after(self, experiment_id, stage_no, timestamp):
        stage_id = Database.create_stage_id(experiment_id, stage_no)
        query1 = {
            "query": {
                "has_parent": {
                    "parent_type": "stage",
                    "query": {
                        "match": {
                            "_id": str(stage_id)
                        }
                    }
                }
            }
        }

        query2 = {
            "query": {
                "has_parent": {
                    "parent_type": "stage",
                    "query": {
                        "match": {
                            "_id": str(stage_id)
                        }
                    }
                }
            },
            "post_filter": {
                "range": {
                    "created": {
                        "gt": timestamp,
                        "format": "yyyy-MM-dd HH:mm:ss.SSSSSS"
                    }
                }
            }
        }
        try:
            # res1 = self.es.count(self.index, self.data_point_type_name, query1)
            # # first determine size, otherwise it returns only 10 data (by default)
            # size = res1['count']
            # if size is None:
            #     size = 10000

            # https://stackoverflow.com/questions/9084536/sorting-by-multiple-params-in-pyes-and-elasticsearch
            # sorting is required for proper visualization of data
            res = self.es.search(index=self.index, doc_type=self.data_point_type_name, body=query2, size=10000, sort='created')
            return [r["_source"] for r in res["hits"]["hits"]]
        except ConnectionError:
            error("Error while retrieving data points from elasticsearch. Check connection to elasticsearch.")
