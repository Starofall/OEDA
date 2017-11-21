from flask import Flask, jsonify, request, send_from_directory, make_response
from flask_restful import Resource, Api
import traceback

import numpy as np
from io import BytesIO
import statsmodels.api as sm
import base64

# https://www.pythonanywhere.com/forums/topic/5017/
# https://stackoverflow.com/questions/38061267/matplotlib-graphic-image-to-base64
class QQPlotController(Resource):
    folderName = "generatedPlots"

    def post(self, distribution, scale):
        try:
            print distribution
            print scale
            content = request.get_json()
            # content is array of objects that contain timestamp and value in a sorted (ascending) manner
            measurementsToBePlotted = []

            for measurement in content:
                measurementsToBePlotted.append(measurement['value'])
            # create the qq plot based on the retrieved data against normal distribution
            array = np.asarray(measurementsToBePlotted)
            sortedArray = np.sort(array)
            if scale == "Log":
                sortedArray = np.log(sortedArray)

            fig1 = sm.qqplot(sortedArray, dist=str(distribution).lower(), line='45', fit='true')
            buf1 = BytesIO()
            fig1.savefig(buf1, format='png')
            buf1.seek(0)
            figdata_png = base64.b64encode(buf1.getvalue())
            buf1.close()
            return figdata_png

        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"error": e.message}, 40