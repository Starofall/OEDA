#!flask/bin/python
from flask import Flask, jsonify
from flask import Flask, request
from flask_restful import Resource, Api

from controller.targets import TargetController, TargetsListController
from controller.configuration import ConfigurationController
from controller.defintions import DefinitionsListController, DefinitionController
from controller.experiments import ExperimentsListController, ExperimentController

app = Flask(__name__, static_folder="assets")


# Define Frontend Hosting
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html')


@app.route('/control.module.chunk.js')
def control():
    return app.send_static_file('control.module.chunk.js')


@app.route('/landingpage.module.chunk.js')
def landingpage():
    return app.send_static_file('landingpage.module.chunk.js')


@app.route('/inline.module.chunk.js')
def inlinechunk():
    return app.send_static_file('inline.module.chunk.js')


@app.route('/polyfills.bundle.js')
def polyfills():
    return app.send_static_file('polyfills.bundle.js')


@app.route('/vendor.bundle.js')
def vendor():
    return app.send_static_file('vendor.bundle.js')


@app.route('/inline.bundle.js')
def inline():
    return app.send_static_file('inline.bundle.js')


@app.route('/main.bundle.js')
def main():
    return app.send_static_file('main.bundle.js')


@app.route('/styles.bundle.css')
def styles():
    return app.send_static_file('styles.bundle.css')


@app.route('/styles.bundle.js')
def stylesJS():
    return app.send_static_file('styles.bundle.js')


# Defining API Part
api = Api(app)
api.add_resource(ConfigurationController, '/api/configuration')
api.add_resource(DefinitionsListController, '/api/definitions')
api.add_resource(DefinitionController, '/api/definitions/<string:id>')
api.add_resource(ExperimentsListController, '/api/experiments')
api.add_resource(ExperimentController, '/api/experiments/<string:id>')
api.add_resource(TargetsListController, '/api/targets')
api.add_resource(TargetController, '/api/targets/<string:id>')

if __name__ == '__main__':
    from tornado.wsgi import WSGIContainer
    from tornado.httpserver import HTTPServer
    from tornado.ioloop import IOLoop
    from tornado.log import enable_pretty_logging
    from flask_cors import CORS
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    http_server = HTTPServer(WSGIContainer(app))
    http_server.listen(5000)
    enable_pretty_logging()
    IOLoop.instance().start()
