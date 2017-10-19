from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

definitions = [
    {
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
    {
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
]


class Definition(Resource):
    def get(self, id):
        return definitions[0]

    def put(self, id):
        print(request)
        definitions[id] = request.form['data']
        return {id: definitions[id]}


class DefinitionsList(Resource):
    def get(self):
        return definitions
