import {Component, Injectable, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../../shared/modules/api/oeda-api.service";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

import * as d3 from "d3";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'show-control-experiments',
  templateUrl: './show-experiments.component.html'
})
export class ShowExperimentsComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart1: AmChart;
  private chart2: AmChart;
  private chart3: AmChart;

  constructor(private layout: LayoutService, private apiService: OEDAApiService, private AmCharts: AmChartsService) {
    this.layout.setHeader("Experiments", "Show Experiment");
  }

  @ViewChild('nvd3') nvd3;
  @ViewChild('nvd32') nvd32;
  @ViewChild('nvd33') nvd33;

  chartIndex = 0
  chartLastValue = 10

  chart1Data = [{
    "key": "Data Collections / min",
    "bar": true,
    "values": []
  }]

  chart1Options = {
    chart: {
      type: 'lineChart',
      height: 300,
      margin: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 45
      },
      clipEdge: true,
      duration: 500,
      stacked: true,
      xAxis: {
        showMaxMin: false,
        tickFormat: function (d) {
          return d;
          // return d3.time.format('%x')(new Date(d));
        }
      },
      yAxis: {
        axisLabel: 'Entries',
        axisLabelDistance: -20,
        tickFormat: function (d) {
          return d3.format(',f')(d);
        }
      }
    }
  }

  chart2Options = {
    chart: {
      type: 'linePlusBarChart',
      height: 300,
      margin: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 45
      },
      clipEdge: true,
      duration: 500,
      stacked: true,
      xAxis: {
        showMaxMin: false,
        tickFormat: function (d) {
          return d3.format(',f')(d);
          // return d3.time.format('%x')(new Date(d));
        }
      },
      yAxis: {
        axisLabel: 'Entries',
        axisLabelDistance: -20,
        tickFormat: function (d) {
          return d3.format(',f')(d);
        }
      }
    }
  }

  chart3Options = {
    chart: {
      type: 'historicalBarChart',
      height: 300,
      margin: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 45
      },
      clipEdge: true,
      duration: 500,
      stacked: true,
      xAxis: {
        showMaxMin: false,
        tickFormat: function (d) {
          return d3.format(',f')(d);
          // return d3.time.format('%x')(new Date(d));
        }
      },
      yAxis: {
        axisLabel: 'Entries',
        axisLabelDistance: -20,
        tickFormat: function (d) {
          return d3.format(',f')(d);
        }
      }
    }
  }

  ngOnInit() {

    const timer = Observable.timer(1000, 2000);
    timer.subscribe(t => {
      this.chartLastValue = this.chartLastValue * (Math.random() + 0.55)
      this.chart1Data[0].values = this.chart1Data[0].values.concat([{x: this.chartIndex, y: this.chartLastValue}])
      this.nvd3.chart.update();
      this.nvd32.chart.update();
      this.nvd33.chart.update();
      this.chartIndex += 1
    });
    {

      const xValues = ['A', 'B', 'C', 'D', 'E'];
      const yValues = ['W', 'X', 'Y', 'Z'];
      const zValues = [
        [0.00, 0.00, 0.75, 0.75, 0.00],
        [0.00, 0.00, 0.75, 0.75, 0.00],
        [0.75, 0.75, 0.75, 0.75, 0.75],
        [0.00, 0.00, 0.00, 0.75, 0.00]
      ];
      const colorscaleValue = [
        [0, '#3D9970'],
        [1, '#001f3f']
      ];
      const data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: false
      }];
      const layout = {
        title: 'Annotated Heatmap',
        annotations: [],
        xaxis: {
          ticks: '',
          side: 'top'
        },
        yaxis: {
          ticks: '',
          ticksuffix: ' ',
          width: 700,
          height: 700,
          autosize: false
        }
      };
      for (let i = 0; i < yValues.length; i++) {
        for (let j = 0; j < xValues.length; j++) {
          const currentValue = zValues[i][j];
          if (currentValue !== 0.0) {
            var textColor = 'white';
          } else {
            var textColor = 'black';
          }
          const result = {
            xref: 'x1',
            yref: 'y1',
            x: xValues[j],
            y: yValues[i],
            text: zValues[i][j],
            font: {
              family: 'Arial',
              size: 12,
              // color: 'rgb(50, 171, 96)',
              color: textColor
            },
            showarrow: false
          };
          layout.annotations.push(result);
        }
      }
      window["Plotly"].newPlot('myDiv', data, layout);
    }

    function normal() {
      var x = 0,
        y = 0,
        rds, c;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        rds = x * x + y * y;
      } while (rds == 0 || rds > 1);
      c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
      return x * c; // throw away extra sample y * c
    }

    {


      let N = 2000,
        a = -1,
        b = 1.2;

      let step = (b - a) / (N - 1);
      let t = new Array(N), x = new Array(N), y = new Array(N);

      for (let i = 0; i < N; i++) {
        t[i] = a + step * i;
        x[i] = (Math.pow(t[i], 3)) + (0.3 * normal() );
        y[i] = (Math.pow(t[i], 6)) + (0.3 * normal() );
      }

      let trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        name: 'points',
        marker: {
          color: 'rgb(102,0,0)',
          size: 2,
          opacity: 0.4
        },
        type: 'scatter'
      };
      let trace2 = {
        x: x,
        y: y,
        name: 'density',
        ncontours: 20,
        colorscale: 'Hot',
        reversescale: true,
        showscale: false,
        type: 'histogram2dcontour'
      };
      let trace3 = {
        x: x,
        name: 'x density',
        marker: {color: 'rgb(102,0,0)'},
        yaxis: 'y2',
        type: 'histogram'
      };
      let trace4 = {
        y: y,
        name: 'y density',
        marker: {color: 'rgb(102,0,0)'},
        xaxis: 'x2',
        type: 'histogram'
      };
      let data = [trace1, trace2, trace3, trace4];
      let layout = {
        showlegend: false,
        autosize: false,
        width: 600,
        height: 550,
        margin: {t: 50},
        hovermode: 'closest',
        bargap: 0,
        xaxis: {
          domain: [0, 0.85],
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          domain: [0, 0.85],
          showgrid: false,
          zeroline: false
        },
        xaxis2: {
          domain: [0.85, 1],
          showgrid: false,
          zeroline: false
        },
        yaxis2: {
          domain: [0.85, 1],
          showgrid: false,
          zeroline: false
        }
      };
      window["Plotly"].newPlot('heat2', data, layout);
    }

  }

  /*
     Newly integrated plots using amChart
  */
  // to avoid "no dom element in ...." error
  ngAfterViewInit() {
    // hard-coded routing and exp_run ids
    const routing = "AV9FCKeEkoAcnVWq358x";
    const rtx_run_id = "AV9FCKeEkoAcnVWq358x";
    const exp_run_ids = ["0", "1", "2"];

    // TODO: chartdiv1, chartdiv2 etc. should be dynamically generated at front-end and passed here
    exp_run_ids.forEach((exp_run_id, index) => {
      this.apiService.loadSingleResultOfExperiment(rtx_run_id, exp_run_id).subscribe(
        data => {
          const divId = "chartdiv" + index;
          const processedData = this.processData(data, "ExperimentResults", exp_run_id, "timestamp", "value");
          if (index % 3 === 0) {
            this.drawSmoothLineChart(divId, processedData);
          } else if (index % 3 === 1) {
            this.drawScatterChart(divId, processedData);
          } else {
            this.drawLineChart(divId, processedData);
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.AmCharts.destroyChart(this.chart1);
    }
    if (this.chart2) {
      this.AmCharts.destroyChart(this.chart2);
    }
    if (this.chart3) {
      this.AmCharts.destroyChart(this.chart3);
    }
  }

  drawSmoothLineChart(divID, processedData) {
    this.chart1 = this.AmCharts.makeChart(divID, {
      "mouseWheelZoomEnabled": true,
      "mouseWheelScrollEnabled": true,
      "type": "serial",
      "theme": "light",
      "marginRight": 80,
      "dataProvider": processedData,
      "valueAxes": [{
        "position": "left",
        "title": "Average Overhead"
      }],
      "graphs": [{
        "balloonText": "[[category]]<br><b><span style='font-size:12px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 6,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": 3.2, // threshold to indicate outliers etc. dummy variable for now
        "type": "smoothedLine",
        "fillAlphas": 0.2,
        "valueField": "value"
      }],
      "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY-MM-DD HH:NN:SS.QQQ",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "categoryField": "timestamp",
      "dataDateFormat": "YYYY-MM-DD HH:NN:SS.QQQ",
      "categoryAxis": {
        "minPeriod": "fff",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true,
        "position": "bottom-right"
      }
    });

    this.chart1.addListener("rendered", zoomChart);

    function zoomChart(){
      this.chart1.zoomToIndexes(processedData.length - 40, processedData.length - 1);
    }
  }

  drawScatterChart(divID, processedData) {
    this.chart2 = this.AmCharts.makeChart(divID, {
      "type": "xy",
      "theme": "light",
      "autoMarginOffset": 20,
      "dataProvider": processedData,
      "dataDateFormat": "YYYY-MM-DD HH:NN:SS.QQQ",
      "mouseWheelZoomEnabled": true,
      "mouseWheelScrollEnabled": true,
      "startDuration": 1.5,
      "chartCursor": {},
      "graphs": [{
        "bullet": "diamond",
        "lineAlpha": 0,
        "lineThickness": 2,
        "lineColor": "#b0de09",
        "xField": "timestamp",
        "yField": "value",
        "balloonText": "timestamp:[[timestamp]] overhead:[[value]]"
      }],
      "valueAxes": [{
        "id": "v1",
        "position": "left",
        "title": "Average Overhead"
      }, {
        "id": "v2",
        "position": "bottom",
        "type": "date",
        "minPeriod": "fff"
      }],

      "trendLines": [{
        "finalValue": processedData[processedData.length - 1]["value"],
        "finalXValue": processedData[processedData.length - 1]["timestamp"],
        "initialValue": processedData[0]["value"],
        "initialXValue": processedData[0]["timestamp"],
        "lineColor": "#FF6600"
      }],
      "export": {
        "enabled": true,
        "position": "bottom-right"
      }
    });
    this.chart2.addListener("rendered", zoomChart);

    function zoomChart(){
      this.chart2.zoomToIndexes(processedData.length - 40, processedData.length - 1);
    }
  }

  drawLineChart(divID, processedData) {
    this.chart3 = this.AmCharts.makeChart(divID, {
      "type": "serial",
      "theme": "light",
      "marginRight": 80,
      "autoMarginOffset": 20,
      "marginTop": 7,
      "dataProvider": processedData,
      "valueAxes": [{
        "axisAlpha": 0.2,
        "dashLength": 1,
        "position": "left",
        "title": "Average Overhead"
      }],
      "mouseWheelZoomEnabled": true,
      "graphs": [{
        "id": "g1",
        "balloonText": "[[value]]",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": "red line",
        "valueField": "value",
        "useLineColorForBulletBorder": true,
        "balloon":{
          "drop":true
        }
      }],
      "chartScrollbar": {
        "autoGridCount": true,
        "graph": "g1",
        "scrollbarHeight": 40
      },
      "chartCursor": {
        "limitToGraph":"g1"
      },
      "dataDateFormat": "YYYY-MM-DD HH:NN:SS.QQQ",
      "categoryField": "timestamp",
      "categoryAxis": {
        "parseDates": true,
        "minPeriod": "fff",
        "axisColor": "#DADADA",
        "dashLength": 1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true,
        "position": "bottom-right"
      }
    });

    this.chart3.addListener("rendered", zoomChart);

    // this method is called when chart is first inited as we listen for "rendered" event
    function zoomChart() {
      this.chart3.zoomToIndexes(processedData.length - 40, processedData.length - 1);
    }
  }

  // helper function for graphs
  processData(jsonObject, outerKey, innerKey, xAttribute, yAttribute) {
    try {
      if (jsonObject !== undefined && jsonObject.hasOwnProperty(outerKey)) {
        const processedData = [];
        const innerJson = JSON.parse(jsonObject[outerKey]);
        innerJson[innerKey].forEach(function(element) {
          if (element !== null && element.hasOwnProperty("exp_run")) {
            const newElement = {};
            newElement[xAttribute] = element["created"];
            newElement[yAttribute] = element["payload"]["overhead"];
            processedData.push(newElement);
          }
        });
        return processedData;
      } else {
        throw Error("Failed to process/parse data.");
      }
    } catch(err) {
      throw err;
    }
  }
}
