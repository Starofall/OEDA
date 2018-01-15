import traceback
from elasticsearch.exceptions import ConnectionError
from elasticsearch import Elasticsearch
from elasticsearch.client import IndicesClient
from elasticsearch.exceptions import TransportError
from UserDatabase import UserDatabase
from oeda.log import *


class ElasticSearchDbUsers(UserDatabase):

    def __init__(self, host, port, db_config):
        self.es = Elasticsearch([{"host": host, "port": port}])

        if not self.es.ping():
            error("Cannot connect to elasticsearch cluster for users. Check database configuration in user_db_config.json.")
            exit(0)

        index = db_config["index"]
        self.index = index["name"]

        user_type = db_config["user_type"]
        self.user_type_name = user_type["name"]

        mappings = dict()
        if "mapping" in user_type:
            mappings[self.user_type_name] = user_type["mapping"]
        body = dict()

        if "settings" in index:
            body["settings"] = index["settings"]
        if mappings:
            body["mappings"] = mappings

        try:
            self.indices_client = IndicesClient(self.es)
            if not self.indices_client.exists(self.index):
                self.indices_client.create(index=self.index, body=body)
        except TransportError:
            error("Error while creating elasticsearch cluster for users. Check type mappings in user_db_config.json.")
            print(traceback.format_exc())
            exit(0)

    def get_users(self):
        query = {
            "size": 1000,
            "query": {
                "match_all": {}
            }
        }
        res = self.es.search(index=self.index, doc_type=self.user_type_name, body=query)
        return [r["_source"] for r in res["hits"]["hits"]]

    def get_user(self, username):
        query = {
            "size": 1000,
            "query": {
                "term": {
                    "name": username
                }
            }
        }

        res = self.es.search(index=self.index, doc_type=self.user_type_name, body=query)
        return [r["_id"] for r in res["hits"]["hits"]], [r["_source"] for r in res["hits"]["hits"]]

    def save_user(self, user):
        try:
            self.es.index(index=self.index, doc_type=self.user_type_name, body=user)
        except ConnectionError:
            error("Error while saving user in elasticsearch. Check connection to elasticsearch.")

    def update_user(self, user):
        user_id, retrieved_user = self.get_user(user['name'])
        body = {"doc": {"name": user['name'], "db_configuration": user['db_configuration']}}
        try:
            self.es.update(index=self.index, doc_type=self.user_type_name, id=user_id, body=body)
        except ConnectionError:
            error("Error while updating experiment's status in elasticsearch. Check connection to elasticsearch.")