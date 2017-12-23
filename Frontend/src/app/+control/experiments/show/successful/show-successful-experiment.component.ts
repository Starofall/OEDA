import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../../../shared/modules/helper/layout.service";
import {Experiment, Target, OEDAApiService, Entity} from "../../../../shared/modules/api/oeda-api.service";
import {AmChartsService, AmChart} from "@amcharts/amcharts3-angular";
import * as d3 from "d3";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'show-successful-experiment',
  templateUrl: './show-successful-experiment.component.html'
})

// QQ plot reference: https://gist.github.com/mbostock/4349187

export class ShowSuccessfulExperimentComponent implements OnInit {
  private chart1: AmChart; // scatter plot
  private chart2: AmChart; // scatter chart
  private chart3: AmChart; // line chart
  private chart4: AmChart; // histogram

  public dataAvailable: boolean;
  public is_collapsed: boolean;

  private qqPlotDivIdJS: string;

  private processedData: object;
  private first_render_of_page: boolean;
  private all_data: Entity[];
  private incoming_data_type_name: string; // for labels of plots etc. TODO: what should happen if we have more than one data type?

  public experiment_id: string;
  public experiment: Experiment;
  public targetSystem: Target;

  public initial_threshold_for_scatter_chart: number;

  // following attributes are used for QQ plotting in Python
  public available_distributions: object;
  public distribution: string;
  public scale: string;
  public is_qq_plot_rendered: boolean;

  public selected_stage_for_qq_js: string;
  public qqJSPlotIsRendered: boolean;
  public is_enough_data_for_plots: boolean;
  public is_all_stages_selected: boolean;

  public availableStages = [];
  public availableStagesForQQJS = [];

  public selected_stage_no: number;

  constructor(private layout: LayoutService,
              private apiService: OEDAApiService,
              private AmCharts: AmChartsService,
              private activated_route: ActivatedRoute,
              private router: Router,
              private notify: NotificationsService) {

    this.layout.setHeader("Successful Experiment Results", "");
    this.dataAvailable = false;
    this.is_all_stages_selected = false;
    this.is_qq_plot_rendered = false;
    this.qqJSPlotIsRendered = false;
    this.is_enough_data_for_plots = false;
    this.is_collapsed = true;
    this.first_render_of_page = true;
    this.all_data = new Array<Entity>();
    // initially selected stage is "All Stages"
    this.selected_stage_no = -1;
    this.scale = "Normal";

    this.distribution = "Norm";
    this.available_distributions = ['Norm', 'Gamma', 'Logistic', 'T', 'Uniform', 'Lognorm', 'Loggamma'];

    this.selected_stage_for_qq_js = "Select a stage";

    // subscribe to router event
    this.activated_route.params.subscribe((params: Params) => {
      // id is retrieved from URI
      if (params["id"] && this.router.url.toString().includes("/control/experiments/show")) {
        this.experiment_id = params["id"];
      }
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

  /* tslint:disable */

  ngOnInit() {

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
    if (!isNullOrUndefined(this.experiment_id)) {
      this.apiService.loadExperimentById(this.experiment_id).subscribe(experiment => {

        if (!isNullOrUndefined(experiment)) {
          this.experiment = experiment;
          if (!isNullOrUndefined(experiment.targetSystemId) && !isNullOrUndefined(experiment.targetSystemId)) {

            // retrieve target system
            this.apiService.loadTargetById(experiment.targetSystemId).subscribe(targetSystem => {
              if (!isNullOrUndefined(targetSystem)) {
                this.targetSystem = targetSystem;
                this.incoming_data_type_name = targetSystem.incomingDataTypes[0]["name"].toString();
                // retrieve stages
                this.apiService.loadAvailableStagesWithExperimentId(this.experiment_id).subscribe(stages => {
                  if (!isNullOrUndefined(stages)) {
                    stages.sort(this.sort_by('number', true, parseInt));
                    // created variable can also be added here if necessary
                    // casting might not have to be done here
                    const all_stages = {"number": "All Stages"};
                    this.availableStages.push(all_stages);
                    for (let j = 0; j < stages.length; j++) {
                      this.availableStages.push(stages[j]);
                    }
                    // prepare available stages for qq js that does not include all stages
                    this.availableStagesForQQJS = this.availableStages.slice(1);
                    this.dataAvailable = true;
                    // fetch all data from server
                    this.fetch_data();
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

  stage_changed(stage_no: number) {
    const ctrl = this;
    if (isNullOrUndefined(ctrl.scale)) {
      this.notify.error("Error", "Scale is null or undefined, please try again");
      return;
    }

    if (stage_no.toString() === "All Stages") {
      stage_no = -1;
    }
    ctrl.selected_stage_no = stage_no;

    if (!isNullOrUndefined(stage_no)) {
      if (ctrl.selected_stage_no === -1) {
        if (!isNullOrUndefined(ctrl.all_data)) {
          // redraw plots with all data that was previously retrieved
          ctrl.draw_all_plots(ctrl.all_data);
        } else {
          // fetch data from server again and draw plots
          ctrl.fetch_data();
        }
      } else {
        /*
          Draw plots for the selected stage by retrieving it from local storage
        */
        const stage_data = ctrl.get_data_from_local_structure(stage_no);
        if (!isNullOrUndefined(stage_data)) {
          ctrl.draw_all_plots(stage_data);
        } else {
          this.notify.error("", "Please select another stage");
          return;
        }
      }
    } else {
      this.notify.error("Error", "Stage number is null or undefined, please try again");
      return;
    }
  }

  private get_data_from_local_structure(stage_no) {
    const ctrl = this;
    const retrieved_data = ctrl.all_data[stage_no - 1];
    if (retrieved_data !== undefined) {
      if (retrieved_data['values'].length == 0) {
        this.notify.error("Error", "Selected stage might not contain data points. Please select another stage.");
        return;
      }
    } else {
      this.notify.error("Error", "Cannot retrieve data from local storage");
      return;
    }
    return retrieved_data;
  }

  private process_response(response): Entity[] {
    const ctrl = this;

    if (isNullOrUndefined(response)) {
      ctrl.notify.error("Error", "Cannot retrieve data from DB, please try again");
      return;
    }

    // we can retrieve more than one array of stages and data points
    for (let index in response) {
      if (response.hasOwnProperty(index)) {
        let parsed_json_object = JSON.parse(response[index]);
        // distribute data points to empty bins
        let new_entity = ctrl.createEntity();
        new_entity.stage_number = parsed_json_object['stage_number'].toString();
        new_entity.values = parsed_json_object['values'];
        // important assumption here: we retrieve stages and data points in a sorted manner with respect to created field
        // thus, pushed new_entity will have a key of its "stage_number" with this assumption
        // e.g. [ 0: {stage_number: 0, values: ...}, 1: {stage_number: 1, values: ...}...]
        ctrl.all_data.push(new_entity);
      }
    }
    return ctrl.all_data;
  }

  private fetch_data() {
    const ctrl = this;
    ctrl.apiService.loadAllDataPointsOfExperiment(ctrl.experiment_id).subscribe(
      data => {
        if (isNullOrUndefined(data)) {
          this.notify.error("Error", "Cannot retrieve data from DB, please try again");
          return;
        }
        ctrl.all_data = ctrl.process_response(data);
        ctrl.draw_all_plots(ctrl.all_data);
      }
    );
  }

  scale_changed(scale: string) {
    this.scale = scale;
    // trigger plot drawing process
    this.stage_changed(this.selected_stage_no);
  }

  draw_all_plots(stage_object) {
    const ctrl = this;

    if (stage_object !== undefined && stage_object.length !== 0) {

      // draw graphs for all_data
      if (ctrl.selected_stage_no === -1) {
        let processedData: any;
        processedData = ctrl.process_all_stage_data(stage_object, "timestamp", "value", ctrl.scale);
        // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
        const clonedData = JSON.parse(JSON.stringify(processedData));
        ctrl.initial_threshold_for_scatter_chart = ctrl.calculate_threshold_for_given_percentile(clonedData, 95, 'value');

        ctrl.draw_scatter_plot("chartdiv", "filterSummary", processedData);
        ctrl.draw_histogram("histogram", processedData);
        ctrl.draw_qq_plot();
      }
      // draw graphs for selected stage data
      else {
        let processedData: any;
        processedData = ctrl.process_single_stage_data(stage_object,"timestamp", "value", ctrl.scale);
        const clonedData = JSON.parse(JSON.stringify(processedData));
        ctrl.initial_threshold_for_scatter_chart = ctrl.calculate_threshold_for_given_percentile(clonedData, 95, 'value');

        ctrl.draw_scatter_plot("chartdiv", "filterSummary", processedData);
        ctrl.draw_histogram("histogram", processedData);

        // check if next stage exists
        ctrl.availableStagesForQQJS.some(function(element) {
          if (Number(element.number) == Number(ctrl.selected_stage_no) + 1) {
            ctrl.selected_stage_for_qq_js = (element.number).toString();
            ctrl.draw_qq_js(ctrl.selected_stage_for_qq_js);
            return true; // required as a callback for .some function
          }
        });
      }
      ctrl.is_enough_data_for_plots = true;
    } else {
      ctrl.notify.error("Error", "Selected stage might not contain data points. Please select another stage.");
      return;
    }
  }

  draw_histogram(divID, processedData) {
    const ctrl = this;
    const AmCharts = this.AmCharts;
    this.chart4 = AmCharts.makeChart(divID, {
      "type": "serial",
      "theme": "light",
      "responsive": {
        "enabled": true
      },
      "columnWidth": 1,
      "dataProvider": this.categorize_data(processedData),
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
        "title": ctrl.incoming_data_type_name
      },
      "valueAxes": [{
        "title": "Percentage"
      }]
    });
  }

  // helper function to distribute overheads in the given data to fixed-size bins (i.e. by 0.33 increment)
  categorize_data(data) {
    const bins = [];
    const onlyValuesInData = this.extract_values_from_array(data, "value");
    const upperThresholdForBins = this.get_maximum_value_from_array(onlyValuesInData);

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

  draw_scatter_plot(divID, summaryFieldID, processedData) {
    const ctrl = this;
    let selectedThreshold = -1;
    const AmCharts = ctrl.AmCharts;
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
        "title": ctrl.incoming_data_type_name,
        "precision": 2
      }],
      "graphs": [{
        "balloonText": "[[category]]<br><b><span style='font-size:12px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 6,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": ctrl.initial_threshold_for_scatter_chart,
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
        "value": ctrl.initial_threshold_for_scatter_chart,
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

    if (ctrl.processedData !== null) {
      const pngFile = ctrl.apiService.getQQPlot(ctrl.experiment_id, ctrl.selected_stage_no.toString(), ctrl.distribution, ctrl.scale).subscribe(
        response => {
          const imageSrc = 'data:image/jpg;base64,' + response;
          document.getElementById("qqPlot").setAttribute( 'src', imageSrc);
          ctrl.is_qq_plot_rendered = true;
        });
    } else {
      alert("Error occurred, please refresh the page.");
    }
  }

  draw_qq_js(other_stage_no) {
    const ctrl = this;
    // clear svg data, so that two different plots should not overlap with each other upon several rendering
    // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
    d3.select("#qqPlotJS").selectAll("*").remove();

    // retrieve data for the initially selected stage
    const data1 = ctrl.get_data_from_local_structure(ctrl.selected_stage_no);

    if (isNullOrUndefined(data1)) {
      ctrl.notify.error("Error", "Selected stage might not contain data. Please select another stage.");
      return;
    }

    let data_for_x_axis = ctrl.process_single_stage_data(data1, null, null, ctrl.scale);

    // retrieve data for the newly selected stage
    const data2 = ctrl.get_data_from_local_structure(other_stage_no);
    if (isNullOrUndefined(data2)) {
      ctrl.notify.error("Error", "Selected stage might not contain data. Please select another stage.");
      return;
    }
    let data_for_y_axis = ctrl.process_single_stage_data(data2, null, null, ctrl.scale);

    var tm = mean(data_for_x_axis);
    var td = Math.sqrt(variance(data_for_x_axis));

    function t(t,n){var r=n.length-1;return n=n.slice().sort(d3.ascending),d3.range(t).map(function(a){return n[~~(a*r/t)]})}
    function n(t){return t.x}
    function r(t){return t.y}

    var width = 300,
      height = 300,
      margin = {top: 20, right: 10, bottom: 20, left: 35},
      n1 = data_for_y_axis.length, // number of samples to generate
      padding = 50;


      // now determine domain of the graph by simply calculating the 95-th percentile of values
      // also p.ticks functions (in qq()) can be changed accordingly.
      const percentile_for_data_x = ctrl.calculate_threshold_for_given_percentile(data_for_x_axis, 95,  null);
      const percentile_for_data_y = ctrl.calculate_threshold_for_given_percentile(data_for_y_axis, 95,  null);

      let scale_upper_bound = percentile_for_data_x;
      if (scale_upper_bound < percentile_for_data_y)
        scale_upper_bound = percentile_for_data_y;


      const min_x = data_for_x_axis.sort(this.sort_by(null, true, parseFloat))[0];
      const min_y = data_for_y_axis.sort(this.sort_by(null, true, parseFloat))[0];

      let scale_lower_bound = min_x;
      if (scale_lower_bound < min_y)
        scale_lower_bound = min_y;

      var chart = (qq() as any)
        .width(width)
        .height(height)
        .domain([scale_lower_bound - tm, scale_upper_bound]) // tm or td can also be subtracted from lower bound
        // .domain([0, 5])
        .tickFormat(function(d) { return ~~(d * 100); });

      var vis = d3.select("#qqPlotJS")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var g = vis.selectAll("g")
        .data([{
          x: data_for_x_axis,
          y: data_for_y_axis,
          // label: "Distribution of Stage Data"
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

      // y-axis title
      vis.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (padding / 2) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Stage " + other_stage_no + " data");

      // x-axis title
      vis.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (width / 2) + "," + (height - (padding / 3) ) + ")" )  // centre below axis
        .text("Stage " + ctrl.selected_stage_no.toString() + " data");

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
            k.enter().append("svg:circle").attr("class", "quantile")
              .attr("r", 4)
              .attr("cx", function(t) {
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
            var A = u || p.tickFormat(5),
              q = u || v.tickFormat(5),
              F = function(t) {
                return "translate(" + p(t) + "," + i + ")"
              },
              C = function(t) {
                return "translate(0," + v(t) + ")"
              },
              w = g.selectAll("g.x.tick").data(p.ticks(5), function(t) {
                return this.textContent || A(t)
              }),
              b = w.enter().append("svg:g").attr("class", "x tick").attr("transform", function(t) {
                return "translate(" + a(t) + "," + i + ")"
              }).style("opacity", 1e-6);
            b.append("svg:line").attr("y1", 0).attr("y2", -6), b.append("svg:text").attr("text-anchor", "middle").attr("dy", "1em").text(A), b.transition().duration(c).attr("transform", F).style("opacity", 1), w.transition().duration(c).attr("transform", F).style("opacity", 1), w.exit().transition().duration(c).attr("transform", F).style("opacity", 1e-6).remove();
            var j = g.selectAll("g.y.tick").data(v.ticks(5), function(t) {
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
  }

  process_single_stage_data(single_stage_object, xAttribute, yAttribute, scale): Array<number> {
    const ctrl = this;
    try {
      if (single_stage_object !== undefined) {
        const processedData = [];
        if (single_stage_object.hasOwnProperty("values")) {
            // now inner element
            single_stage_object['values'].forEach(function(data_point) {
              if (xAttribute !== null && yAttribute !== null) {
                const newElement = {};
                newElement[xAttribute] = data_point["created"];
                if (scale === "Log") {
                  newElement[yAttribute] = Math.log(data_point["payload"][ctrl.incoming_data_type_name]);
                } else if (scale === "Normal") {
                  newElement[yAttribute] = data_point["payload"][ctrl.incoming_data_type_name];
                } else {
                  ctrl.notify.error("Error", "Please provide a valid scale");
                  return;
                }
                processedData.push(newElement);
              } else {
                // this is for plotting qq plot with JS, as it only requires raw data in log or normal scale
                if (scale === "Log") {
                  processedData.push(Math.log(data_point["payload"][ctrl.incoming_data_type_name]));
                } else if (scale === "Normal") {
                  processedData.push(data_point["payload"][ctrl.incoming_data_type_name]);
                } else {
                  ctrl.notify.error("Error", "Please provide a valid scale");
                  return;
                }
              }
            });
          }
        return processedData;
      }
    } catch (err) {
      ctrl.notify.error("Error", err.message);
    }
  }

  // stage object contains more than one stages here
  process_all_stage_data(all_stage_object, xAttribute, yAttribute, scale): Array<number> {
    const ctrl = this;
    try {
      if (all_stage_object !== undefined) {
        const processedData = [];
        all_stage_object.forEach(function(stage_bin) {
          let data_array = ctrl.process_single_stage_data(stage_bin, xAttribute, yAttribute, scale);
          data_array.forEach(function(data_value){
            processedData.push(data_value);
          });
        });
        return processedData;
      } else {
        throw Error("Failed to process/parse data.");
      }
    } catch (err) {
      throw err;
    }
  }

  get_maximum_value_from_array(array) {
    const max_of_array = Math.max.apply(Math, array);
    return max_of_array;
  }

  extract_values_from_array(array, attribute) {
    const retVal = [];
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        retVal.push(array[i][attribute]);
      }
    }
    return retVal;
  }

  // if data_field is null, then it is same to first sorting an array of float/int values, then finding the percentile
  calculate_threshold_for_given_percentile(data, percentile, data_field) {
    const sortedData = data.sort(this.sort_by(data_field, true, parseFloat));
    const index = Math.floor(sortedData.length * percentile / 100 - 1);
    if (!isNullOrUndefined(data_field)) {
      const result = sortedData[index][data_field];
      return +result.toFixed(2);
    }
    const result = sortedData[index];
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
    if (!isNullOrUndefined(field)) {
      const key = function (x) {return primer ? primer(x[field]) : x[field]};
      return function (a, b) {
        const A = key(a), B = key(b);
        return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1, 1][+!!reverse];
      }
    }
    return function (a, b) {
      return ( (a < b) ? -1 : ((a > b) ? 1 : 0) ) * [-1, 1][+!!reverse];
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

  private createEntity(): Entity {
    return {
      stage_number: "",
      values: []
    }
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
