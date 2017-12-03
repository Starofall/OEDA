import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {Experiment, Target, OEDAApiService} from "../../../shared/modules/api/oeda-api.service";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import * as d3 from "d3";
import {isNullOrUndefined} from "util";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'show-control-experiments',
  templateUrl: './show-experiments.component.html'
})

// QQ plot reference: https://gist.github.com/mbostock/4349187

export class ShowExperimentsComponent implements OnInit {
  private chart1: AmChart;
  private chart2: AmChart;
  private chart3: AmChart;

  public dataAvailable: boolean;

  private divId: string;
  private histogramDivId: string;
  private qqPlotDivId: string;
  private qqPlotDivIdJS: string;
  private filterSummaryId: string;
  private histogramLogDivId: string;
  private processedData: object;

  public experiment_id: string;
  public experiment: Experiment;
  public targetSystem: Target;

  public initialThresholdForSmoothLineChart: number;

  // following attributes are used for QQ plotting in Python
  public available_distributions: object;
  public distribution: string;
  public scale: string;
  public is_qq_plot_rendered: boolean;

  // following attributes are used for QQ plotting in JavaScript
  public availableStageNosForQQJS: any;

  public selected_stage_for_qq_js: string;
  public qqJSPlotIsRendered: boolean;
  public is_enough_data_for_plots: boolean;
  public is_all_stages_selected: boolean;

  public availableStages = [];
  public selected_stage_no: any;

  constructor(private layout: LayoutService,
              private apiService: OEDAApiService,
              private AmCharts: AmChartsService,
              private activated_route: ActivatedRoute,
              private notify: NotificationsService) {

    this.layout.setHeader("Experiment Results", "");
    this.dataAvailable = false;
    this.is_all_stages_selected = false;
    this.is_qq_plot_rendered = false;
    this.qqJSPlotIsRendered = false;
    this.is_enough_data_for_plots = false;

    this.scale = "Normal";

    this.distribution = "Norm";
    this.available_distributions = ['Norm', 'Gamma', 'Logistic', 'T', 'Uniform', 'Lognorm', 'Loggamma'];

    this.selected_stage_for_qq_js = "Select a stage";

    this.availableStageNosForQQJS = [];


    // subscribe to router event
    this.activated_route.params.subscribe((params: Params) => {
      // id is retrieved from URI
      this.experiment_id = params["id"];

    });
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
    if (!isNullOrUndefined(this.experiment_id)) {
      this.apiService.loadExperimentById(this.experiment_id).subscribe(experiment => {

        if (!isNullOrUndefined(experiment)) {
          this.experiment = experiment;
          if (!isNullOrUndefined(experiment.targetSystemId) && !isNullOrUndefined(experiment.targetSystemId)) {

            // retrieve target system
            this.apiService.loadTargetById(experiment.targetSystemId).subscribe(targetSystem => {
              if (!isNullOrUndefined(targetSystem)) {
                this.targetSystem = targetSystem;

                // retrieve stages
                this.apiService.loadAvailableStagesWithExperimentId(this.experiment_id).subscribe(stages => {
                  if (!isNullOrUndefined(stages)) {
                    // created variable can also be added here if necessary
                    // casting might not have to be done here
                    const all_stages = {"number": "All Stages"};
                    this.availableStages.push(all_stages);
                    for (let j = 0; j < stages.length; j++) {
                      this.availableStages.push(stages[j]);
                    }
                    this.dataAvailable = true;
                  }
                });
              }
            });
          }
        } else {
          this.notify.error("Error", "Cannot retrieve details of selected experiment, make sure DB is up and running");
        }
      });
    } else {
      this.notify.error("Error", "Failed retrieving experiment id, please check URI");
    }

  }

  draw_all_plots(selected_stage_no, data, scale) {
    const ctrl = this;
    // set it to false in case a new scale is selected
    ctrl.is_enough_data_for_plots = false;
    const expRes = JSON.parse(data["ExperimentResults"]);
    if (expRes !== undefined && expRes.length !== 0) {
      ctrl.divId = "chartdiv" + selected_stage_no;
      ctrl.histogramDivId = "histogram" + selected_stage_no;
      ctrl.histogramLogDivId = ctrl.histogramDivId + "_log";
      ctrl.filterSummaryId = "filterSummary" + selected_stage_no;

      ctrl.qqPlotDivId = "qqPlot" + selected_stage_no;
      ctrl.qqPlotDivIdJS = "qqPlotJS" + selected_stage_no;

      ctrl.processedData = ctrl.process_data(data, "ExperimentResults", "timestamp", "value", scale);

      // // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
      const clonedData = JSON.parse(JSON.stringify(ctrl.processedData));
      ctrl.initialThresholdForSmoothLineChart = ctrl.calculate_threshold_for_given_percentile(clonedData, 95);

      ctrl.draw_smooth_line_chart(ctrl.divId, ctrl.filterSummaryId, ctrl.processedData);
      ctrl.draw_histogram(ctrl.histogramDivId, ctrl.processedData, scale);
      ctrl.draw_qq_plot();

      // initial case when page is rendered, check if next stage exists
      if (ctrl.selected_stage_no !== -1 && ctrl.selected_stage_for_qq_js === "Select a stage") {
        // check if next stage exists
        ctrl.availableStages.some(function(element) {
          if (Number(element.number) === Number(ctrl.selected_stage_no) + 1) {
            // TODO: ensure that next stage has enough data?
            ctrl.selected_stage_for_qq_js = (Number(ctrl.selected_stage_no) + 1).toString();
            ctrl.draw_qq_js(ctrl.selected_stage_for_qq_js);
            return true;
          }
        });
      }
      ctrl.is_enough_data_for_plots = true;
    } else {
      ctrl.notify.error("Error", "Selected stage might not contain data points. Please select another stage.");
    }
  }

  draw_histogram(divID, processedData, scale) {
    const AmCharts = this.AmCharts;
    const histogram = AmCharts.makeChart(divID, {
      "type": "serial",
      "theme": "light",
      "responsive": {
        "enabled": true
      },
      "columnWidth": 1,
      "dataProvider": this.categorize_data(processedData, scale),
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
  categorize_data(data, scale) {
    // create bins if log is not selected
    const bins = [];
    const onlyValuesInData = this.extract_values_from_array(data, "value");
    const transformedData = this.get_transformed_data(onlyValuesInData, scale);

    const upperThresholdForBins = this.get_maximum_value_from_array(transformedData);

    // data is also transformed here
    const nrOfBins = this.determine_nr_of_bins_for_histogram(onlyValuesInData, 10);
    const stepSize = upperThresholdForBins / nrOfBins;

    for (let i = 0; i < upperThresholdForBins; i = i + stepSize) {
      // unary plus to convert a string to a number
      const bin = {binLowerBound: +i.toFixed(2), count: 0, percentage: 0};
      bins.push(bin);
    }

    // distribute data to the bins
    for (let j = 0; j < data.length - 1; j = j + 1) {

      let val = data[j]["value"];
      if (this.scale === "Log") {
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

  draw_smooth_line_chart(divID, summaryFieldID, processedData) {
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
          "method": function (event) {
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
      "listeners": [{
        "event": "init",
        "method": function (e) {

          /**
           * Pre-zoom disabled for now
           */
          // e.chart.zoomToIndexes( e.chart.dataProvider.length - 40, e.chart.dataProvider.length - 1 );

          /**
           * Add click event on the plot area
           */
          e.chart.chartDiv.addEventListener("click", function () {

            // we track cursor's last known position by using selectedThreshold variable
            if (selectedThreshold !== undefined) {

              // following will get the value of a data point, not with the exact position of cursor
              // const overhead = e.chart.dataProvider[ e.chart.lastCursorPosition ][ e.chart.valueField ];

              // create a new guide or update position of the previous one
              if (e.chart.valueAxes[0].guides.length === 0) {
                const guide = e.chart.guides[0];
                guide.value = selectedThreshold;
                guide.lineAlpha = 1;
                guide.lineColor = "#c44";
                e.chart.valueAxes[0].addGuide(guide);
              } else {
                e.chart.valueAxes[0].guides[0].value = selectedThreshold;
              }

              const nrOfItemsToBeFiltered = processedData.filter(function (item) {
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
          })
        }
      }]
    });


  }

  draw_qq_plot() {
    const ctrl = this;
    if (ctrl.distribution === "Select a distribution") {
      alert("Please select a distribution");
      return;
    }

    if (ctrl.processedData !== null) {
      const pngFile = ctrl.apiService.getQQPlot(ctrl.distribution, ctrl.scale, ctrl.processedData).subscribe(
        response => {
          const obj = JSON.parse(response._body);
          const imageSrc = 'data:image/jpg;base64,' + obj;
          ctrl.is_qq_plot_rendered = true;
          document.getElementById(ctrl.qqPlotDivId).setAttribute( 'src', imageSrc);
        });
    } else {
      alert("Error occurred, please refresh the page.");
    }
  }

  draw_qq_js(other_stage_no) {
    const ctrl = this;
    // clear svg data, so that two different plots should not overlap with each other upon several rendering
    // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
    d3.select("#" + ctrl.qqPlotDivIdJS).selectAll("*").remove();

    let data_for_x_axis: number[];
    data_for_x_axis = Array<number>();
    let data_for_y_axis: number[];
    data_for_y_axis = Array<number>();

    // TODO: how to guarantee that retrieval operations for both stages have same number of data points for an ongoing experiment?
    // retrieve data for the initially selected stage
    ctrl.apiService.loadDataPointsOfStage(ctrl.experiment_id, ctrl.selected_stage_no).subscribe(
      data => {
        if (isNullOrUndefined(data)) {
          this.notify.error("Error", "Cannot retrieve data for stage " + ctrl.selected_stage_no + " from DB, please try again");
          return;
        }
        data_for_x_axis = ctrl.process_data(data, "ExperimentResults", null, null, ctrl.scale);
        // retrieve data for the newly selected stage
        ctrl.apiService.loadDataPointsOfStage(ctrl.experiment_id, other_stage_no).subscribe(
        data2 => {
          if (isNullOrUndefined(data2)) {
            this.notify.error("Error", "Cannot retrieve data for stage " + other_stage_no + " from DB, please try again");
            return;
          }
          data_for_y_axis = ctrl.process_data(data2, "ExperimentResults", null, null, ctrl.scale);

          function t(t,n){var r=n.length-1;return n=n.slice().sort(d3.ascending),d3.range(t).map(function(a){return n[~~(a*r/t)]})}
          function n(t){return t.x}
          function r(t){return t.y}

          var width = 450,
            height = 450,
            margin = {top: 20, right: 10, bottom: 20, left: 35},
            n1 = data_for_y_axis.length; // number of samples to generate

          var chart = (qq() as any)
            .width(width)
            .height(height)
            .domain([-.1, 1.1])
            .tickFormat(function(d) { return ~~(d * 100); });

          var vis = d3.select("#" + ctrl.qqPlotDivIdJS)
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // let dataForXAxis = <Array<number>> data_for_x_axis;
          // dataForXAxis = dataForXAxis.sort( function(a,b){return a - b; } );
          // let dataForYAxis = <Array<number>> data_for_y_axis;
          // dataForYAxis = dataForYAxis.sort(function(a,b){return a - b; } );

          //if (ctrl.scale === "Log") {
          //	dataForXAxis = ctrl.get_transformed_data(dataForXAxis, ctrl.scale);
          //	dataForYAxis = ctrl.get_transformed_data(dataForYAxis, ctrl.scale);
          //}

          var tm = mean(data_for_x_axis);
          var td = Math.sqrt(variance(data_for_x_axis));

          var g = vis.selectAll("g")
            .data([{
              x: data_for_x_axis,
              y: data_for_y_axis,
              label: "Distribution of Stages"
            }])
            .enter().append("g")
            .attr("class", "qq")
            .attr("transform", function(d, i) { return "translate(" + (width + margin.right + margin.left) * i + ")"; });
          g.append("rect")
            .attr("class", "box")
            .attr("width", width)
            .attr("height", height);
          g.call(chart);
          g.append("text")
            .attr("dy", "1.3em")
            .attr("dx", ".6em")
            .text(function(d) { return d.label; });
          chart.duration(1000);
          window['transition'] = function() {
            g.datum(randomize).call(chart);
          };



          function randomize(d) {
            d.y = d3.range(n).map(Math.random);
            return d;
          }

          // Sample from a normal distribution with mean 0, stddev 1.
          function normal() {
            var x = 0, y = 0, rds, c;
            do {
              x = Math.random() * 2 - 1;
              y = Math.random() * 2 - 1;
              rds = x * x + y * y;
            } while (rds === 0 || rds > 1);
            c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
            return x * c; // throw away extra sample y * c
          }

          // Simple 1D Gaussian (normal) distribution
          function normal1(mean, deviation) {
            return function() {
              return mean + deviation * normal();
            };
          }

          // Welford's algorithm.
          function mean(x) {
            var n = x.length;
            if (n === 0) return NaN;
            var m = 0,
              i = -1;
            while (++i < n) m += (x[i] - m) / (i + 1);
            return m;
          }

          // Unbiased estimate of a sample's variance.
          // Also known as the sample variance, where the denominator is n - 1.
          function variance(x) {
            var n = x.length;
            if (n < 1) return NaN;
            if (n === 1) return 0;
            var m = mean(x),
              i = -1,
              s = 0;
            while (++i < n) {
              var v = x[i] - m;
              s += v * v;
            }
            return s / (n - 1);
          }

          function qq() {
            function a(n) {
              n.each(function(n, r) {
                var a, y, g = d3.select(this),
                  f = t(s, l.call(this, n, r)),
                  m = t(s, d.call(this, n, r)),
                  x = o && o.call(this, n, r) || [d3.min(f), d3.max(f)],
                  h = o && o.call(this, n, r) || [d3.min(m), d3.max(m)],
                  p = d3.scale.linear().domain(x).range([0, e]),
                  v = d3.scale.linear().domain(h).range([i, 0]);
                this.__chart__ ? (a = this.__chart__.x, y = this.__chart__.y) : (a = d3.scale.linear().domain([0, 1 / 0]).range(p.range()), y = d3.scale.linear().domain([0, 1 / 0]).range(v.range())), this.__chart__ = {
                  x: p,
                  y: v
                };
                var _ = g.selectAll("line.diagonal").data([null]);
                _.enter().append("svg:line").attr("class", "diagonal").attr("x1", p(h[0])).attr("y1", v(x[0])).attr("x2", p(h[1])).attr("y2", v(x[1])), _.transition().duration(c).attr("x1", p(h[0])).attr("y1", v(x[0])).attr("x2", p(h[1])).attr("y2", v(x[1]));
                var k = g.selectAll("circle").data(d3.range(s).map(function(t) {
                  return {
                    x: f[t],
                    y: m[t]
                  }
                }));
                k.enter().append("svg:circle").attr("class", "quantile").attr("r", 4.5).attr("cx", function(t) {
                  return a(t.x)
                }).attr("cy", function(t) {
                  return y(t.y)
                }).style("opacity", 1e-6).transition().duration(c).attr("cx", function(t) {
                  return p(t.x)
                }).attr("cy", function(t) {
                  return v(t.y)
                }).style("opacity", 1), k.transition().duration(c).attr("cx", function(t) {
                  return p(t.x)
                }).attr("cy", function(t) {
                  return v(t.y)
                }).style("opacity", 1), k.exit().transition().duration(c).attr("cx", function(t) {
                  return p(t.x)
                }).attr("cy", function(t) {
                  return v(t.y)
                }).style("opacity", 1e-6).remove();
                var A = u || p.tickFormat(4),
                  q = u || v.tickFormat(4),
                  F = function(t) {
                    return "translate(" + p(t) + "," + i + ")"
                  },
                  C = function(t) {
                    return "translate(0," + v(t) + ")"
                  },
                  w = g.selectAll("g.x.tick").data(p.ticks(4), function(t) {
                    return this.textContent || A(t)
                  }),
                  b = w.enter().append("svg:g").attr("class", "x tick").attr("transform", function(t) {
                    return "translate(" + a(t) + "," + i + ")"
                  }).style("opacity", 1e-6);
                b.append("svg:line").attr("y1", 0).attr("y2", -6), b.append("svg:text").attr("text-anchor", "middle").attr("dy", "1em").text(A), b.transition().duration(c).attr("transform", F).style("opacity", 1), w.transition().duration(c).attr("transform", F).style("opacity", 1), w.exit().transition().duration(c).attr("transform", F).style("opacity", 1e-6).remove();
                var j = g.selectAll("g.y.tick").data(v.ticks(4), function(t) {
                    return this.textContent || q(t)
                  }),
                  z = j.enter().append("svg:g").attr("class", "y tick").attr("transform", function(t) {
                    return "translate(0," + y(t) + ")"
                  }).style("opacity", 1e-6);
                z.append("svg:line").attr("x1", 0).attr("x2", 6), z.append("svg:text").attr("text-anchor", "end").attr("dx", "-.5em").attr("dy", ".3em").text(q), z.transition().duration(c).attr("transform", C).style("opacity", 1), j.transition().duration(c).attr("transform", C).style("opacity", 1), j.exit().transition().duration(c).attr("transform", C).style("opacity", 1e-6).remove()
              })
            }
            var e = 1,
              i = 1,
              c = 0,
              o = null,
              u = null,
              s = 100,
              l = n,
              d = r;
            return a["width"] = function(t) {
              return arguments.length ? (e = t, a) : e
            }, a["height"] = function(t) {
              return arguments.length ? (i = t, a) : i
            }, a["duration"] = function(t) {
              return arguments.length ? (c = t, a) : c
            }, a["domain"] = function(t) {
              return arguments.length ? (o = null == t ? t : d3.functor(t), a) : o
            }, a["count"] = function(t) {
              return arguments.length ? (s = t, a) : s
            }, a["x"] = function(t) {
              return arguments.length ? (l = t, a) : l
            }, a["y"] = function(t) {
              return arguments.length ? (d = t, a) : d
            }, a["tickFormat"] = function(t) {
              return arguments.length ? (u = t, a) : u
            }, a
          }

          ctrl.qqJSPlotIsRendered = true;

        });

      });
  }

  // helper function for graphs
  process_data(jsonObject, outerKey, xAttribute, yAttribute, scale): Array<number> {
    const ctrl = this;
    try {
      if (jsonObject !== undefined && jsonObject.hasOwnProperty(outerKey)) {
        const processedData = [];
        const innerJson = JSON.parse(jsonObject[outerKey]);
        innerJson.forEach(function(element) {
          if (element !== null) {
            if (xAttribute !== null && yAttribute !== null) {
              const newElement = {};
              newElement[xAttribute] = element["created"];
              if (scale === "Log") {
                element["payload"]["overhead"] = Math.log(element["payload"]["overhead"]);
              }
              newElement[yAttribute] = element["payload"]["overhead"];
              processedData.push(newElement);
            } else {
              // this is for plotting qq plot with JS, as it only requires raw data in log or normal scale
              if (scale === "Log") {
                processedData.push(Math.log(element["payload"]["overhead"]));
              } else if (scale === "Normal") {
                processedData.push(element["payload"]["overhead"]);
              } else {
                ctrl.notify.error("Error", "Please provide a valid scale");
                return;
              }
            }
          }
        });
        return processedData;
      } else {
        throw Error("Failed to process/parse data.");
      }
    } catch (err) {
      throw err;
    }
  }

  get_transformed_data(data, scale) {
    const loggedData = [];
    if (scale === "Log") {
      for (const number of data) {
        if (number > 0)
          loggedData.push(Math.log(number));
      }
      return loggedData;
    }
    return data;
  }

  get_maximum_value_from_array(array) {
    const max_of_array = Math.max.apply(Math, array);
    return max_of_array;
  }

  extract_values_from_array(array, attribute) {
    const retVal = [];
    for (let i = 0; i < array.length; i++) {
      retVal.push(array[i][attribute]);
    }
    return retVal;
  }

  calculate_threshold_for_given_percentile(data, percentile) {
    const sortedData = data.sort(this.sort_by('value', true, parseFloat));
    const index = Math.floor(sortedData.length * percentile / 100 - 1);
    const result = sortedData[index]["value"];
    return +result.toFixed(2);
  }

  selectStageNoForQQJS(selected_stage_for_qq_js) {
    this.selected_stage_for_qq_js = selected_stage_for_qq_js;
    this.draw_qq_js(this.selected_stage_for_qq_js);
  }

  selectDistribution(distName) {
    this.distribution = distName;
    this.draw_qq_plot();
  }


// https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
  sort_by(field, reverse, primer) {
    const key = function (x) {return primer ? primer(x[field]) : x[field]};
    return function (a, b) {
      const A = key(a), B = key(b);
      return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1, 1][+!!reverse];
    }
  }

  get_bin_width(array) {
    return 2 * this.iqr(array) * Math.pow(array.length, -1 / 3);
  }

  // metric = array of real numbers (like > 100 or something)
  // IQR = inter-quaartile-range
  determine_nr_of_bins_for_histogram(array, defaultBins) {
    const h = this.get_bin_width(array), ulim = Math.max.apply(Math, array), llim = Math.min.apply(Math, array);
    if (h <= (ulim - llim) / array.length) {
      return defaultBins || 10; // Fix num bins if binWidth yields too small a value.
    }
    return Math.ceil((ulim - llim) / h);
  }

  iqr(array) {
    const sorted = array.slice(0).sort(function (a, b) { return a - b; });
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
    return q3 - q1;
  }

  stage_changed(stage_no: any) {
    const ctrl = this;

    if (isNullOrUndefined(ctrl.scale)) {
      this.notify.error("Error", "Scale is null or undefined, please try again");
      return;
    }

    if (!isNullOrUndefined(stage_no)) {

      if (stage_no === "All Stages") {
        stage_no = -1;
      }
      ctrl.selected_stage_no = stage_no;
      /*
        Draw plots for the selected stage
        If "All Stages" is selected, concat every stage data
      */

      if (ctrl.selected_stage_no === -1) {
        ctrl.apiService.loadDataPointsOfExperiment(ctrl.experiment_id).subscribe(
          data => {
            if (isNullOrUndefined(data)) {
              this.notify.error("Error", "Cannot retrieve data from DB, please try again");
              return;
            }
            ctrl.draw_all_plots(ctrl.selected_stage_no, data, ctrl.scale);
          }
        );
      } else {
        ctrl.apiService.loadDataPointsOfStage(ctrl.experiment_id, ctrl.selected_stage_no).subscribe(
          data => {
            if (isNullOrUndefined(data)) {
              this.notify.error("Error", "Cannot retrieve data from DB, please try again");
              return;
            }
            ctrl.draw_all_plots(ctrl.selected_stage_no, data, ctrl.scale);
          }
        );
      }
    } else {
      this.notify.error("Error", "Stage number is null or undefined, please try again");
      return;
    }
  }

  scale_changed(scale: string) {
    this.scale = scale;
    // TODO: shortcut for now
    this.stage_changed(this.selected_stage_no);
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

    function zoomChart() {
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
        "limitToGraph": "g1"
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

  getAmChartById(id) {
    const allCharts = this.AmCharts.charts;
    for (let i = 0; i < allCharts.length; i++) {
      if (id === allCharts[i].div.id) {
        return allCharts[i];
      }
    }
  }

  // helper function that filters out data above the given threshold
  filter_outliers(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const value = idAttr.nodeValue;
    console.log(target);
    console.log(idAttr);
    console.log(value);
  }

}
