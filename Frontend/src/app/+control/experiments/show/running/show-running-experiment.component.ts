import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../../../shared/modules/helper/layout.service";
import {Experiment, Target, OEDAApiService, Entity, OedaCallbackEntity} from "../../../../shared/modules/api/oeda-api.service";
import {AmChartsService, AmChart} from "@amcharts/amcharts3-angular";
import {isNullOrUndefined} from "util";
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'show-running-experiment',
  templateUrl: './show-running-experiment.component.html'
})

// QQ plot reference: https://gist.github.com/mbostock/4349187

export class ShowRunningExperimentComponent implements OnInit, OnDestroy {
  private chart1: AmChart; // smooth line
  private chart2: AmChart; // scatter chart
  private chart3: AmChart; // line chart
  private chart4: AmChart; // histogram

  public dataAvailable: boolean;
  public is_collapsed: boolean;

  private divId: string;
  private histogramDivId: string;
  private qqPlotDivId: string;
  private qqPlotDivIdJS: string;
  private filterSummaryId: string;
  private histogramLogDivId: string;
  private processedData: object;
  private timer: any;
  private subscription: any;
  private first_render_of_page: boolean;
  private first_render_of_plots: boolean;
  private experiment_ended: boolean;
  private timestamp: string;

  private all_data: Entity[];

  public experiment_id: string;
  public experiment: Experiment;
  public targetSystem: Target;

  public initialThresholdForSmoothLineChart: number;

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

  public selected_stage_no: any;
  public oedaCallback: OedaCallbackEntity;


  constructor(private layout: LayoutService,
              private apiService: OEDAApiService,
              private AmCharts: AmChartsService,
              private activated_route: ActivatedRoute,
              private router: Router,
              private notify: NotificationsService) {

    this.layout.setHeader("Experiment Results", "");
    this.dataAvailable = false;
    this.is_all_stages_selected = false;
    this.is_qq_plot_rendered = false;
    this.qqJSPlotIsRendered = false;
    this.is_enough_data_for_plots = false;
    this.experiment_ended = false;
    this.is_collapsed = true;
    this.first_render_of_page = true;
    this.all_data = [];
    this.scale = "Normal";
    this.first_render_of_plots = true;

    this.distribution = "Norm";
    this.available_distributions = ['Norm', 'Gamma', 'Logistic', 'T', 'Uniform', 'Lognorm', 'Loggamma'];

    this.selected_stage_for_qq_js = "Select a stage";
    this.oedaCallback = this.create_oeda_callback_entity();


    this.divId = "chartdiv";
    this.histogramDivId = "histogram";
    this.histogramLogDivId = "histogram_log";
    this.filterSummaryId = "filterSummary";
    this.qqPlotDivId = "qqPlot";
    this.qqPlotDivIdJS = "qqPlotJS";

    // subscribe to router event
    this.activated_route.params.subscribe((params: Params) => {
      // id is retrieved from URI
      if (params["id"] && this.router.url.toString().includes("/control/experiments/show")) {
        this.experiment_id = params["id"];
      }
    });
  }

  /* tslint:disable */

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
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
                    stages.sort(this.sort_by('number', true, parseInt));

                    const all_stages = {"number": "All Stages"};
                    this.availableStages.push(all_stages);
                    for (let j = 0; j < stages.length; j++) {
                      this.availableStages.push(stages[j]);
                    }
                    // prepare available stages for qq js that does not include all stages
                    this.availableStagesForQQJS = this.availableStages.slice(1);

                    this.dataAvailable = true;

                    // initially selected stage is "All Stages"
                    this.selected_stage_no = -1;

                    // polling using Timer (3 sec interval) for real-time data visualization
                    this.timer = Observable.timer(2000, 3000);
                    this.subscription = this.timer.subscribe(t => {
                      this.fetch_oeda_callback();
                    });

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

  private process_response(response) {
    const ctrl = this;
    if (isNullOrUndefined(response)) {
      ctrl.notify.error("Error", "Cannot retrieve data from DB, please try again");
      return;
    }

    if (ctrl.first_render_of_page) {
      // we can retrieve one or more stages at first render
      for (let index in response) {
        if (response.hasOwnProperty(index)) {
          let parsed_json_object = JSON.parse(response[index]);
          // distribute data points to empty bins
          let new_entity = ctrl.create_entity();
          new_entity.stage_number = parsed_json_object['stage_number'].toString();
          new_entity.values = parsed_json_object['values'];
          // we retrieve stages and data points in following format
          // e.g. [ 0: {stage_number: 1, values: ...}, 1: {stage_number: 2, values: ...}...]
          if (new_entity.values.length != 0) {
            ctrl.all_data.push(new_entity);
          }

          // as a guard against stage duplications
          const new_stage = {"number": parsed_json_object['stage_number']};
          let existing_stage = ctrl.availableStages.find(entity => entity.number.toString() === new_stage['number'].toString());
          // stage does not exist yet
          if (isNullOrUndefined(existing_stage)) {
            ctrl.availableStages.push(new_stage);
            ctrl.availableStagesForQQJS.push(new_stage);
          }
          // do not update timestamp here if we can't retrieve any data, just keep fetching with timestamp "-1"
          // because backend is also updated accordingly, i.e. it continues to fetch all data if timestamp is -1
        }
      }
      ctrl.first_render_of_page = false;
      return true;
    } else {
      // we can retrieve one or more stages upon other polls
      // so, iterate the these stages and concat their data_points with existing data_points
      console.log("response", response);
      for (let index in response) {
        let parsed_json_object = JSON.parse(response[index]);
        let existing_stage = ctrl.all_data.find(entity => entity.stage_number.toString() === parsed_json_object.stage_number.toString());
        // we have found an existing stage
        if (!isNullOrUndefined(existing_stage)) {
          let stage_index = parsed_json_object['stage_number'] - 1;
          if (parsed_json_object['values'].length > 0) {
            ctrl.all_data[stage_index].values = ctrl.all_data[stage_index].values.concat(parsed_json_object['values']);
          }
        } else if (isNullOrUndefined(existing_stage)) {
          // a new stage has been fetched, create a new bin for it, and push all the values to the bin, also push bin to all_data
          const stage_number = parsed_json_object['stage_number'].toString();
          const values = parsed_json_object['values'];
          const new_stage = {"number": stage_number};
          ctrl.availableStages.push(new_stage);

          let new_entity = ctrl.create_entity();
          new_entity.stage_number = stage_number;
          new_entity.values = values;
          ctrl.all_data.push(new_entity);
        }
        // update timestamp if we have retrieved a data
        if (Number(index) == response.length - 1) {
          let data_point_length = parsed_json_object['values'].length;
          if (data_point_length > 0) {
            ctrl.timestamp = parsed_json_object.values[data_point_length - 1]['created'];
            return true;
          }
        }

      }
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



  // draws plots by using ctrl.selected_stage_no variable to retrieve data points from local storage
  private draw_all_plots() {
    const ctrl = this;
    // set it to false in case a new scale is selected
    ctrl.is_enough_data_for_plots = false;


    // if "all stages" is selected
    if (ctrl.selected_stage_no == -1) {
      ctrl.processedData = ctrl.process_all_stage_data(ctrl.all_data,"timestamp", "value", ctrl.scale);
    }
    // if any other stage is selected
    else {
        ctrl.processedData = ctrl.get_data_from_local_structure(ctrl.selected_stage_no);
        ctrl.processedData = ctrl.process_single_stage_data(ctrl.processedData,"timestamp", "value", ctrl.scale);
    }
    // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
    const clonedData = JSON.parse(JSON.stringify(ctrl.processedData));
    ctrl.initialThresholdForSmoothLineChart = ctrl.calculate_threshold_for_given_percentile(clonedData, 95, 'value');

    if (ctrl.first_render_of_plots) {
      ctrl.draw_smooth_line_chart(ctrl.divId, ctrl.filterSummaryId, ctrl.processedData);
      ctrl.draw_histogram(ctrl.histogramDivId, ctrl.processedData);
      // ctrl.draw_qq_plot();
      ctrl.first_render_of_plots = false;
    } else {
      // now create a new graph with updated values
      ctrl.chart1.dataProvider = ctrl.processedData;
      ctrl.chart1.validateData();
      ctrl.chart4.dataProvider = this.categorize_data(ctrl.processedData);
      ctrl.chart4.validateData();
    }
    // initial case when page is rendered, check if next stage exists
    if (ctrl.selected_stage_no !== "-1") {
      // check if next stage exists
      ctrl.availableStagesForQQJS.some(function(element) {
        if (Number(element.number) === Number(ctrl.selected_stage_no) + 1) {
          // TODO: ensure that next stage has enough data?
          ctrl.selected_stage_for_qq_js = (Number(ctrl.selected_stage_no) + 1).toString();
          // ctrl.draw_qq_js(ctrl.selected_stage_for_qq_js);
          return true; // required as a callback for .some function
        }
      });
    }
    ctrl.is_enough_data_for_plots = true;
  }


  private fetch_oeda_callback() {
    const ctrl = this;

    ctrl.apiService.getOedaCallback(ctrl.experiment_id).subscribe(oedaCallback => {
      if(!isNullOrUndefined(oedaCallback)) {
        console.log(oedaCallback);
        ctrl.oedaCallback["status"] = oedaCallback.status;
        ctrl.oedaCallback["stage_counter"] = oedaCallback.stage_counter;
        // keywords (index, size) are same for the first two cases, but they indicate different things
        if (oedaCallback.status.toString() === "PROCESSING") {
          ctrl.oedaCallback["message"] = oedaCallback.message;
        } else if (oedaCallback.status.toString() === "IGNORING_SAMPLES") {
          ctrl.oedaCallback["index"] = oedaCallback.index;
          ctrl.oedaCallback["size"] = oedaCallback.size;
          ctrl.oedaCallback["complete"] = (Number(oedaCallback.index)) / (Number(oedaCallback.size));
        } else if (oedaCallback.status.toString() === "COLLECTING_DATA") {
          ctrl.oedaCallback["index"] = oedaCallback.index;
          ctrl.oedaCallback["size"] = oedaCallback.size;
          ctrl.oedaCallback["complete"] = (Number(oedaCallback.index)) / (Number(oedaCallback.size));

          if (ctrl.first_render_of_page) {
            ctrl.apiService.loadAllDataPointsOfExperiment(ctrl.experiment_id).subscribe(response => {
              let is_successful_fetch = ctrl.process_response(response);

              if (is_successful_fetch)
                ctrl.draw_all_plots();
            });
          } else {
            if (ctrl.timestamp == undefined) {
              ctrl.timestamp = "-1";
            }
            ctrl.apiService.loadAllDataPointsOfRunningExperiment(ctrl.experiment_id, ctrl.timestamp).subscribe(response => {
              ctrl.process_response(response);
              ctrl.draw_all_plots();
            });
          }
        } else if (oedaCallback.status.toString() === "EXPERIMENT_STAGE_DONE") {
          ctrl.oedaCallback["experiment_counter"] = oedaCallback.experiment_counter;
          ctrl.oedaCallback["total_experiments"] = oedaCallback.total_experiments; // updated according to the new logic
          // if these two are equal, then there is no need to poll data
          // TODO: well, this portion of code is not really synchronized with backend because of polling logic
          // i.e. the backend prints the remaining number of stages and time to console,
          // but usually backend has already started collecting data for the next stage when front-end sends a request to fetch the callback
          // i.e. user is not really well-informed about remaining time.
          ctrl.oedaCallback["remaining_stages"] = oedaCallback.remaining_stages;
          ctrl.oedaCallback["remaining_time"] = oedaCallback.remaining_time;
          if (ctrl.oedaCallback["remaining_stages"] == 0) {
            ctrl.disable_polling("Success", "Data is up-to-date, stopped polling.");

            // TODO: just to make sure that, all data is shown to the user instead of empty page. It Can be removed
            // TODO: also, another option would be updating the experiment status and setting the target system status manually

            ctrl.apiService.loadAllDataPointsOfExperiment(ctrl.experiment_id).subscribe(response => {
              let is_successful_fetch = ctrl.process_response(response);
              if (is_successful_fetch) {
                ctrl.selected_stage_no = -1;
                ctrl.draw_all_plots();
              }
            });
          }
        }
      }
    });
  }

  // remove qq plot retrieved from server otherwise memory will build up
  remove_all_plots() {
    // for (let j = 0; j < this.chart1.graphs.length; j++) {
    //   var graph = this.chart1.graphs.pop();
    //   this.chart1.removeGraph(graph);
    // }
    // for (let k = 0; k < this.chart4.graphs.length; k++) {
    //   var graph = this.chart4.graphs.pop();
    //   this.chart4.removeGraph(graph);
    // }
    if (document.getElementById(this.qqPlotDivId).hasAttribute('src')) {
      var image_qq_plot = document.getElementById(this.qqPlotDivId);
      image_qq_plot.removeAttribute('src');
    }
  }

  draw_histogram(divID, processedData) {
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
        "title": "Overhead"
      },
      "valueAxes": [{
        "title": "Percentage"
      }]
    });
    return this.chart4;
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

  // helper function for plotting single stage
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
                newElement[yAttribute] = Math.log(data_point["payload"]["overhead"]);
              } else if (scale === "Normal") {
                newElement[yAttribute] = data_point["payload"]["overhead"];
              } else {
                ctrl.notify.error("Error", "Please provide a valid scale");
                return;
              }
              processedData.push(newElement);
            } else {
              // this is for plotting qq plot with JS, as it only requires raw data in log or normal scale
              if (scale === "Log") {
                processedData.push(Math.log(data_point["payload"]["overhead"]));
              } else if (scale === "Normal") {
                processedData.push(data_point["payload"]["overhead"]);
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

  // helper function for plotting all stages
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
    for (let i = 0; i < array.length; i++) {
      retVal.push(array[i][attribute]);
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

  // https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
  sort_by(field, reverse, primer) {
    if (field !== null) {
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

  stage_changed(stage_no: number) {
    const ctrl = this;
    if (isNullOrUndefined(ctrl.scale)) {
      this.notify.error("Error", "Scale is null or undefined, please try again");
      return;
    }

    if (stage_no.toString() === "All Stages") {
      stage_no = -1;
    }
    // update selected stage no, and let draw_all_plots do the rest
    ctrl.selected_stage_no = stage_no;
    ctrl.draw_all_plots();
  }

  scale_changed(scale: string) {
    this.scale = scale;
    this.stage_changed(this.selected_stage_no);
  }

  disable_polling(status: string, content: string) {
    document.getElementById("polling_off_button").setAttribute('class', 'btn btn-primary active');
    document.getElementById("polling_on_button").setAttribute('class', 'btn btn-default');
    this.subscription.unsubscribe();
    if (status !== null && content !== null) {
      this.notify.success(status, content);
    } else {
      this.notify.success("Success", "Polling disabled");
    }
  }

  enable_polling() {
    document.getElementById("polling_on_button").setAttribute('class', 'btn btn-primary active');
    document.getElementById("polling_off_button").setAttribute('class', 'btn btn-default');
    this.subscription = this.timer.subscribe(t => {
      this.fetch_oeda_callback();
    });
    this.notify.success("Success", "Polling enabled");
  }

  private create_entity(): Entity {
    return {
      stage_number: "",
      values: []
    }
  }

  private create_oeda_callback_entity(): OedaCallbackEntity {
    return {
      status: "Initializing...",
      message: "",
      index: 0,
      size: 0,
      complete: 0,
      experiment_counter: 0,
      total_experiments: 0,
      stage_counter: null
    };
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
