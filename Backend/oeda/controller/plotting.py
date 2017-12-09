from flask import Flask, jsonify, request, send_from_directory, make_response
from flask_restful import Resource, Api
from oeda.databases import db
from oeda.controller.experiment_results import get_all_stage_data
import matplotlib.pyplot as plt

import traceback
import json

import numpy as np
from io import BytesIO
import statsmodels.api as sm
import base64

# https://www.pythonanywhere.com/forums/topic/5017/
# https://stackoverflow.com/questions/38061267/matplotlib-graphic-image-to-base64
class QQPlotController(Resource):

    availableScales = ["normal", "log"]

    def get(self, experiment_id, stage_no, distribution, scale):
        try:
            if str(scale).lower() not in self.availableScales:
                return {"error": "Provided scale is not supported"}, 404

            pts = []
            # this case corresponds to all stage data
            if int(stage_no) == -1:
                stages_and_data_points = get_all_stage_data(experiment_id=experiment_id)
                if stages_and_data_points is None:
                    return {"error": "Data points cannot be retrieved for given experiment and/or stage"}, 404
                for entity in stages_and_data_points:
                    entity = json.loads(entity)
                    if len(entity['values']) == 0:
                        pass
                    for data_point in entity['values']:
                        pts.append(data_point["payload"]["overhead"])
            else:
                data_points = self.get_data_points(experiment_id, stage_no)
                if data_points is None:
                    return {"error": "Data points cannot be retrieved for given experiment and/or stage"}, 404
                for data_point in data_points:
                    pts.append(data_point["payload"]["overhead"])

            # create the qq plot based on the retrieved data against normal distribution
            array = np.asarray(pts)
            sorted_array = np.sort(array)
            if str(scale).lower() == "log":
                sorted_array = np.log(sorted_array)

            fig1 = sm.qqplot(sorted_array, dist=str(distribution).lower(), line='45', fit=True)
            buf1 = BytesIO()
            fig1.savefig(buf1, format='png')
            buf1.seek(0)

            figure_data_png = base64.b64encode(buf1.getvalue())
            buf1.close()
            fig1.clf()
            del fig1
            plt.close('all')
            return figure_data_png

        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 40

    # Helper Function to fetch data from ES with given parameters
    def get_data_points(self, experiment_id, stage_no):
        res = db().get_data_points(experiment_id=experiment_id, stage_no=stage_no)
        return [r["_source"] for r in res["hits"]["hits"]]
