from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

definitions = {
    "123131-12312313-12312312-123123": {
        "id": "123131-12312313-12312312-123123",
        "name": "RTX Test Run #1",
        "description": "Testing cool stuff",
        "target": {
            "name": "CrowdNav Production"
        },
        "creator": {
            "name": "Max Mustermann",
            "email": "mustermann@example.com",
            "role": "USER"
        },
        "definition": {},
        "createdAt": "2016-01-09T14:48:34-08:00"
    },
    "123131-12312313-12312312-3213123": {
        "id": "123131-12312313-12312312-3213123",
        "name": "CrowdNav Optimization",
        "description": "Testing even more cool stuff",
        "target": {
            "name": "CrowdNav Staging"
        },
        "creator": {
            "name": "Max Mustermann",
            "email": "mustermann@example.com",
            "role": "USER"
        },
        "definition": {},
        "createdAt": "2016-01-09T14:48:34-08:00"
    }
}


class DefinitionController(Resource):

    def get(self, id):
        try:
            return definitions[id]
        except:
            return {"error": "not found"}, 404

    def post(self, id):
        content = request.get_json()
        definitions[id] = content
        return {}, 200

class DefinitionsListController(Resource):
    def get(self):
        return definitions.values()


