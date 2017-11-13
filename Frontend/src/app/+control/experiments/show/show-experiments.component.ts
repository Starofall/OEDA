import {Component, Injectable, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../../shared/modules/api/oeda-api.service";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { Stocks } from './data';

import * as d3 from "d3";
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as $ from "jquery";

import {Observable} from "rxjs/Observable";

@Component({
  selector: 'show-control-experiments',
  templateUrl: './show-experiments.component.html'
})
export class ShowExperimentsComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart1: AmChart;
  private chart2: AmChart;
  private chart3: AmChart;

  // hard-coded rtx_run_id
  private rtx_run_id = "AV9FCKeEkoAcnVWq358x";

  public exp_run_id: string;
  public experimentResults: object;
  public isLogSelected: boolean;
  public initialThresholdForSmoothLineChart: number;


  // attributes for qq plot with D3
  private margin_qq = {top: 20, right: 20, bottom: 30, left: 50};
  private width_qq: number;
  private height_qq: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;

  constructor(private layout: LayoutService, private apiService: OEDAApiService, private AmCharts: AmChartsService, private activatedRoute: ActivatedRoute) {
    this.layout.setHeader("Experiments", "Show Experiment");
    this.isLogSelected = false;
    this.width_qq = 900 - this.margin_qq.left - this.margin_qq.right;
    this.height_qq = 500 - this.margin_qq.top - this.margin_qq.bottom;

  }

  /*
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
  */

  /*chart2Options = {
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
  }*/

  /*chart3Options = {
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
  }*/

  ngOnInit() {
    /*
    const timer = Observable.timer(1000, 2000);
    timer.subscribe(t => {
      this.chartLastValue = this.chartLastValue * (Math.random() + 0.55)
      this.chart1Data[0].values = this.chart1Data[0].values.concat([{x: this.chartIndex, y: this.chartLastValue}])
      // this.nvd3.chart.update();
      this.nvd32.chart.update();
      // this.nvd33.chart.update();
      this.chartIndex += 1
    });
    */
    /*
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
    }*/

    /*
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
    }*/

    /*
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
    }*/
    console.log("ngOnInit works");

    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      // id is retrieved from URI
      this.exp_run_id = params["id"];
    });

    /*
      Newly integrated plots using amChart
    */
    const ctrl = this;
    this.apiService.loadResultOfSingleExperiment(this.rtx_run_id, this.exp_run_id).subscribe(
      data => {
        const experimentResults = JSON.parse(data["ExperimentResults"]);
        ctrl.experimentResults = experimentResults[ctrl.exp_run_id];
        const divId = "chartdiv" + ctrl.exp_run_id;
        const histogramDivId = "histogram" + ctrl.exp_run_id;
        const histogramLogDivId = histogramDivId + "_log";
        const filterSummaryId = "filterSummary" + ctrl.exp_run_id;
        // const filterButtonId = "filterdiv" + index;
        const processedData = ctrl.processData(data, "ExperimentResults", ctrl.exp_run_id, "timestamp", "value");

        // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
        const clonedData = JSON.parse(JSON.stringify(processedData));
        ctrl.initialThresholdForSmoothLineChart = ctrl.calculateThresholdForGivenPercentile(clonedData, 95);

        ctrl.drawSmoothLineChart(divId, filterSummaryId, processedData);
        ctrl.drawHistogram(histogramDivId, processedData, false);
        ctrl.drawHistogram(histogramLogDivId, processedData, true);
      });

    // methods for qq plot with d3
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
  }

  drawHistogram(divID, processedData, isLogSelected) {
    const AmCharts = this.AmCharts;
    const histogram = AmCharts.makeChart(divID, {
      "type": "serial",
      "theme": "light",
      "responsive": {
        "enabled": true
      },
      "columnWidth": 1,
      "dataProvider": this.categorizeData(processedData, isLogSelected),
      "graphs": [{
        "fillColors": "#c55",
        "fillAlphas": 0.9,
        "lineColor": "#fff",
        "lineAlpha": 0.7,
        "type": "column",
        "valueField": "percentage"
      }],
      "categoryField": "binLowerBound",
      "categoryAxis": {
        "startOnAxis": true,
        "title": "Overhead"
      },
      "valueAxes": [{
        "title": "Percentage"
      }]
    });
    return histogram;
  }

  // helper function to distribute overheads in the given data to fixed-size bins (i.e. by 0.33 increment)
  categorizeData(data, isLogSelected) {
    // create bins if log is not selected
    const bins = [];
    const onlyValuesInData = this.extractValuesFromArray(data, "value");
    const transformedData = this.getTransformedData(onlyValuesInData, isLogSelected);

    const upperThresholdForBins = this.getMaximumValueFromArray(transformedData);

    // data is also transformed here
    const nrOfBins = this.determineNumberOfBinsForHistogram(onlyValuesInData, 10);
    const stepSize = upperThresholdForBins / nrOfBins;

    for (let i = 0; i < upperThresholdForBins; i = i + stepSize) {
      // unary plus to convert a string to a number
      const bin = {binLowerBound: +i.toFixed(2), count: 0, percentage: 0};
      bins.push(bin);
    }

    // distribute data to the bins
    for (let j = 0; j < data.length - 1; j = j + 1) {

      let val = data[j]["value"];
      if (isLogSelected) {
        val = Math.log(val);
      }

      for (let k = 0; k < bins.length; k++) {
        if (k === bins.length - 1) {
            if (val >= bins[k]["binLowerBound"] ) {
              bins[k]["count"] = bins[k]["count"] + 1;
            }
        } else {
            if (val >= bins[k]["binLowerBound"] && val < bins[k + 1]["binLowerBound"] ) {
              bins[k]["count"] = bins[k]["count"] + 1;
            }
        }
      }
    }

    // now transform the array to indicate the percentage instead of counts
    for (let k = 0; k < bins.length; k++) {
      // rounding to 2 decimals and indicating the percentage %
      // unary plus to convert a string to a number
      bins[k]["percentage"] = +(bins[k]["count"] * 100 / data.length).toFixed(2);
    }
    return bins;
  }
  drawSmoothLineChart(divID, summaryFieldID, processedData) {
    const ctrl = this;
    let selectedThreshold = -1;
    const AmCharts = this.AmCharts;
    this.chart1 = AmCharts.makeChart(divID, {
      "mouseWheelZoomEnabled": true,
      "mouseWheelScrollEnabled": true,
      "responsive": {
        "enabled": true
      },
      "type": "serial",
      "theme": "light",
      "autoMarginOffset": 10,
      "dataProvider": processedData,
      "valueAxes": [{
        "position": "left",
        "title": "Overhead",
        "precision": 2
      }],
      "graphs": [{
        "balloonText": "[[category]]<br><b><span style='font-size:12px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 6,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": ctrl.initialThresholdForSmoothLineChart,
        "type": "smoothedLine",
        "fillAlphas": 0,
        "valueField": "value",
        "lineAlpha": 0,
        "negativeLineAlpha": 0
      }],
      "chartScrollbar": {
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 55,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "autoGridCount": true,
        "selectedGraphFillAlpha": 0,
        "graphLineAlpha": 0,
        "graphLineColor": "#c2c2c2",
        "selectedGraphLineColor": "#888888",
        "selectedGraphLineAlpha": 1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY-MM-DD HH:NN:SS.QQQ",
        "cursorAlpha": 0,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "valueLineAlpha": 0,
        "fullWidth": true,
        // used to retrieve current position of cursor and respective value, it also rounds to 2 decimals
        "listeners": [{
          "event": "moved",
          "method": function(event) {
            const yValueAsThreshold = event.chart.valueAxes[0].coordinateToValue(event.y);
            const roundedThreshold = yValueAsThreshold.toFixed(2);
            selectedThreshold = roundedThreshold;
          }
        }]
      },
      "categoryField": "timestamp",
      "valueField": "value",
      "dataDateFormat": "YYYY-MM-DD HH:NN:SS.QQQ",
      "categoryAxis": {
        "minPeriod": "fff",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true,
        "position": "bottom-left"
      },
      // an initial guide is created here because we cannot inject new Guide() in AmChartsService class for now
      "guides": [{
          "id": "guideID",
          "value": ctrl.initialThresholdForSmoothLineChart,
          "lineAlpha": "1",
          "lineColor": "#c44"
      }],
      // used to draw a line for at the cursor's position horizontally
      "listeners": [ {
        "event": "init",
        "method": function( e ) {

          /**
           * Pre-zoom disabled for now
           */
          // e.chart.zoomToIndexes( e.chart.dataProvider.length - 40, e.chart.dataProvider.length - 1 );

          /**
           * Add click event on the plot area
           */
          e.chart.chartDiv.addEventListener( "click", function() {

              // we track cursor's last known position by using selectedThreshold variable
              if ( selectedThreshold !== undefined ) {

                // following will get the value of a data point, not with the exact position of cursor
                // const overhead = e.chart.dataProvider[ e.chart.lastCursorPosition ][ e.chart.valueField ];

                // create a new guide or update position of the previous one
                if ( e.chart.valueAxes[0].guides.length === 0 ) {
                  const guide = e.chart.guides[0];
                  guide.value = selectedThreshold;
                  guide.lineAlpha = 1;
                  guide.lineColor = "#c44";
                  e.chart.valueAxes[0].addGuide(guide);
                } else {
                  e.chart.valueAxes[0].guides[0].value = selectedThreshold;
                }

                const nrOfItemsToBeFiltered = processedData.filter(function(item){
                  return item.value > selectedThreshold;
                }).length;

                // reflect changes on html side
                document.getElementById(summaryFieldID).innerHTML = "<p>selected threshold: <b>" + selectedThreshold + "</b> and # of points to be removed: <b>" + nrOfItemsToBeFiltered + "</b></p>";

                // also reflect changes on chart
                e.chart.graphs[0].negativeBase = selectedThreshold;
                e.chart.validateNow();
              } else {
                alert("Please move your cursor to determine the threshold");
              }
          } )
        }
      }]
    });


  }

  drawScatterChart(divID, processedData) {
    this.chart2 = this.AmCharts.makeChart(divID, {
      "type": "xy",
      "theme": "light",
      "autoMarginOffset": 10,
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
        "position": "bottom-left"
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
        "position": "bottom-left"
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

  // helper function that filters out data above the given threshold
  filterOutliers(divID) {
    alert("button of " + divID + " is clicked");
  }

  getAmChartById(id) {
    const allCharts = this.AmCharts.charts;
    for (let i = 0; i < allCharts.length; i++) {
      if (id === allCharts[i].div.id) {
        return allCharts[i];
      }
    }
  }

  getTransformedData(data, isLogSelected) {
    const loggedData = [];
    if (isLogSelected) {
      for (const number of data) {
        loggedData.push(Math.log(number));
      }
      return loggedData;
    }
    return data;
  }

  getMaximumValueFromArray(array) {
    const max_of_array = Math.max.apply(Math, array);
    return max_of_array;
  }

  extractValuesFromArray(array, attribute) {
    const retVal = [];
    for (let i = 0; i < array.length; i++) {
      retVal.push(array[i][attribute]);
    }
    return retVal;
  }

  // metric = array of real numbers (like > 100 or something)
  // IQR = inter-quaartile-range
  determineNumberOfBinsForHistogram(array, defaultBins) {
    const h = this.getBinWidth(array), ulim = Math.max.apply(Math, array), llim = Math.min.apply(Math, array);
    if (h <= (ulim - llim) / array.length) {
      return defaultBins || 10; // Fix num bins if binWidth yields too small a value.
    }
    return Math.ceil((ulim - llim) / h);
  }

  getBinWidth(array) {
    return 2 * this.iqr(array) * Math.pow(array.length, -1 / 3);
  }

  iqr(array) {
    const sorted = array.slice(0).sort(function (a, b) { return a - b; });
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
    return q3 - q1;
  }

  calculateThresholdForGivenPercentile(data, percentile) {
    const sortedData = data.sort(this.sort_by('value', true, parseFloat);
    const index = Math.floor(sortedData.length * percentile / 100 - 1);
    const result = sortedData[index]["value"];
    return +result.toFixed(2);
  }

  // https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
  sort_by(field, reverse, primer) {
    const key = function (x) {return primer ? primer(x[field]) : x[field]};
    return function (a, b) {
      const A = key(a), B = key(b);
      return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1, 1][+!!reverse];
    }
  }

  private initSvg() {
    this.svg = d3.select("svg")
      .append("g")
      .attr("transform", "translate(" + this.margin_qq.left + "," + this.margin_qq.top + ")");
  }

  private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width_qq]);
    this.y = d3Scale.scaleLinear().range([this.height_qq, 0]);
    this.x.domain(d3Array.extent(Stocks, (d) => d.date ));
    this.y.domain(d3Array.extent(Stocks, (d) => d.value ));
  }

  private drawAxis() {

    this.svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height_qq + ")")
      .call(d3Axis.axisBottom(this.x));

    this.svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");
  }

  private drawLine() {
    this.line = d3Shape.line()
      .x( (d: any) => this.x(d.date) )
      .y( (d: any) => this.y(d.value) );

    this.svg.append("path")
      .datum(Stocks)
      .attr("class", "line")
      .attr("d", this.line);
  }
}
