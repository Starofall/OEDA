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
  private scatter_plot: AmChart;
  private histogram: AmChart;

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
  private incoming_data_type_name: string;

  private all_data: Entity[];

  public experiment_id: string;
  public experiment: Experiment;
  public targetSystem: Target;

  public initial_threshold_for_scatter_plot: number;

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

  public selected_stage: any;
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
          this.experiment.id = this.experiment_id;
          if (!isNullOrUndefined(experiment.targetSystemId)) {
            // retrieve target system
            this.apiService.loadTargetById(experiment.targetSystemId).subscribe(targetSystem => {
              if (!isNullOrUndefined(targetSystem)) {
                this.targetSystem = targetSystem;
                this.targetSystem.id = this.experiment.targetSystemId;
                this.incoming_data_type_name = targetSystem.incomingDataTypes[0]["name"].toString();
                // retrieve stages
                this.apiService.loadAvailableStagesWithExperimentId(this.experiment_id).subscribe(stages => {
                  if (!isNullOrUndefined(stages)) {
                    // initially selected stage is "All Stages"
                    this.selected_stage = {"number": -1, "knobs": ""};
                    this.availableStages.push(this.selected_stage);
                    for (let j = 0; j < stages.length; j++) {
                      this.availableStages.push(stages[j]);
                    }
                    stages.sort(this.sort_by('number', true, parseInt));

                    // prepare available stages for qq js that does not include all stages
                    this.availableStagesForQQJS = this.availableStages.slice(1);
                    this.dataAvailable = true;

                    // polling using Timer (2 sec interval) for real-time data visualization
                    this.timer = Observable.timer(1000, 2000);

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
          ctrl.oedaCallback.current_knob = oedaCallback.current_knob;
          // remaining_time_and_stages is a experiment-wise unique dict that contains remaining stages and time
          ctrl.oedaCallback.remaining_time_and_stages = oedaCallback.remaining_time_and_stages;

          if (oedaCallback.remaining_time_and_stages === undefined)
            ctrl.oedaCallback.remaining_time_and_stages["remaining_stages"] = ctrl.experiment.executionStrategy.sample_size;
          else
            ctrl.oedaCallback.remaining_time_and_stages["remaining_stages"] = ctrl.oedaCallback.remaining_time_and_stages.remaining_stages;

          if (oedaCallback.remaining_time_and_stages["remaining_time"] !== undefined)
            ctrl.oedaCallback.remaining_time_and_stages["remaining_time"] = ctrl.oedaCallback.remaining_time_and_stages.remaining_time;

        } else if (oedaCallback.status.toString() === "COLLECTING_DATA") {
          ctrl.oedaCallback["index"] = oedaCallback.index;
          ctrl.oedaCallback["size"] = oedaCallback.size;
          ctrl.oedaCallback["complete"] = (Number(oedaCallback.index)) / (Number(oedaCallback.size));
          ctrl.oedaCallback.current_knob = oedaCallback.current_knob;
          // remaining_time_and_stages is a experiment-wise unique dict that contains remaining stages and time
          ctrl.oedaCallback.remaining_time_and_stages = oedaCallback.remaining_time_and_stages;

          if (oedaCallback.remaining_time_and_stages["remaining_stages"] === undefined)
            ctrl.oedaCallback.remaining_time_and_stages["remaining_stages"] = ctrl.experiment.executionStrategy.sample_size;
          else
            ctrl.oedaCallback.remaining_time_and_stages["remaining_stages"] = ctrl.oedaCallback.remaining_time_and_stages.remaining_stages;

          if (oedaCallback.remaining_time_and_stages["remaining_time"] !== undefined)
            ctrl.oedaCallback.remaining_time_and_stages["remaining_time"] = ctrl.oedaCallback.remaining_time_and_stages.remaining_time;


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
          if (oedaCallback.remaining_time_and_stages["remaining_stages"] == 0) {
            ctrl.disable_polling("Success", "Data is up-to-date, stopped polling.");

            // switch to successful experiment page to show other plots to the user
            ctrl.router.navigate(["control/experiments/show/"+ctrl.experiment_id+"/success"]).then(() => {
              console.log("navigated to successful experiments page");
            });
          }
        }
      }
    });
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
          new_entity.number = parsed_json_object['number'];
          new_entity.values = parsed_json_object['values'];
          new_entity.knobs = parsed_json_object['knobs'];
          // we retrieve stages and data points in following format
          // e.g. [ 0: {number: 1, values: ..., knobs: [...]}, 1: {number: 2, values: ..., knobs: [...] }...]
          if (new_entity.values.length != 0) {
            ctrl.all_data.push(new_entity);
          }
          // as a guard against stage duplications
          const new_stage = {"number": parsed_json_object.number, "knobs": parsed_json_object.knobs};
          let existing_stage = ctrl.availableStages.find(entity => entity.number === parsed_json_object.number);
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
      for (let index in response) {
        let parsed_json_object = JSON.parse(response[index]);
        let existing_stage = ctrl.all_data.find(entity => entity.number === parsed_json_object.number);

        // we have found an existing stage
        if (existing_stage !== undefined) {
          let stage_index = parsed_json_object['number'] - 1;
          if (parsed_json_object['values'].length > 0) {
            ctrl.all_data[stage_index].values = ctrl.all_data[stage_index].values.concat(parsed_json_object['values']);
          }
        } else {
          // a new stage has been fetched, create a new bin for it, and push all the values to the bin, also push bin to all_data
          const number = parsed_json_object['number'];
          const values = parsed_json_object['values'];
          const knobs = parsed_json_object['knobs'];
          const new_stage = {"number": number, "knobs": knobs};
          ctrl.availableStages.push(new_stage);

          let new_entity = ctrl.create_entity();
          new_entity.number = number;
          new_entity.values = values;
          new_entity.knobs = knobs;
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

  // draws plots by using ctrl.selected_stage.number variable to retrieve data points from local storage
  private draw_all_plots() {
    const ctrl = this;
    // set it to false in case a new scale is selected
    ctrl.is_enough_data_for_plots = false;


    // if "all stages" is selected
    if (ctrl.selected_stage.number == -1) {
      ctrl.processedData = ctrl.process_all_stage_data(ctrl.all_data,"timestamp", "value", ctrl.scale);
    }
    // if any other stage is selected
    else {
        ctrl.processedData = ctrl.get_data_from_local_structure(ctrl.selected_stage.number);
        ctrl.processedData = ctrl.process_single_stage_data(ctrl.processedData,"timestamp", "value", ctrl.scale);
    }
    // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
    const clonedData = JSON.parse(JSON.stringify(ctrl.processedData));
    ctrl.initial_threshold_for_scatter_plot = ctrl.calculate_threshold_for_given_percentile(clonedData, 95, 'value');

    if (ctrl.first_render_of_plots) {
      ctrl.draw_scatter_plot(ctrl.divId, ctrl.filterSummaryId, ctrl.processedData);
      ctrl.draw_histogram(ctrl.histogramDivId, ctrl.processedData);
      // ctrl.draw_qq_plot();
      ctrl.first_render_of_plots = false;
    } else {
      // now create a new graph with updated values
      ctrl.scatter_plot.dataProvider = ctrl.processedData;
      ctrl.scatter_plot.validateData();
      ctrl.histogram.dataProvider = this.categorize_data(ctrl.processedData);
      ctrl.histogram.validateData();
    }
    ctrl.is_enough_data_for_plots = true;
  }

  draw_histogram(divID, processedData) {
    const ctrl = this;
    const AmCharts = this.AmCharts;
    this.histogram = AmCharts.makeChart(divID, {
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
    return this.histogram;
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
    const AmCharts = this.AmCharts;
    this.scatter_plot = AmCharts.makeChart(divID, {
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
        "negativeBase": ctrl.initial_threshold_for_scatter_plot,
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
        "value": ctrl.initial_threshold_for_scatter_plot,
        "lineAlpha": "1",
        "lineColor": "#c44"
      }],
      // used to draw a line for at the cursor's position horizontally
      "listeners": [{
        "event": "init",
        "method": function (e) {
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

  // helper function for plotting all stages
  process_all_stage_data(all_stage_object, xAttribute, yAttribute, scale): Array<number> {
    const ctrl = this;
    try {
      if (all_stage_object !== undefined) {
        const processedData = [];
        all_stage_object.forEach(function(stage_bin) {
          let data_array = ctrl.process_single_stage_data(stage_bin, xAttribute, yAttribute, scale);
          if (data_array !== undefined) {
            data_array.forEach(function (data_value) {
              processedData.push(data_value);
            });
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
    if (data.length != 0) {
      const sortedData = data.sort(this.sort_by(data_field, true, parseFloat));
      const index = Math.floor(sortedData.length * percentile / 100 - 1);
      // TODO how can this index be -1? this is just a work-around for now
      if (index == -1) {
        return 0;
      }
      if (!isNullOrUndefined(data_field)) {
        const result = sortedData[index][data_field];
        return +result.toFixed(2);
      }
      const result = sortedData[index];
      return +result.toFixed(2);
    }
    return 0;
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

  stage_changed() {
    if (isNullOrUndefined(this.scale)) {
      this.notify.error("Error", "Scale is null or undefined, please try again");
      return;
    }
    this.draw_all_plots();
  }

  scale_changed(scale: string) {
    this.scale = scale;
    this.stage_changed();
  }

  disable_polling(status: string, content: string) {
    document.getElementById("polling_off_button").setAttribute('class', 'btn btn-primary active');
    document.getElementById("polling_on_button").setAttribute('class', 'btn btn-default');
    this.subscription.unsubscribe();
    if (!isNullOrUndefined(status) && !isNullOrUndefined(content)) {
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
      number: "",
      values: [],
      knobs: null
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
      stage_counter: null,
      current_knob: new Map<string, number>(),
      remaining_time_and_stages: new Map<any, any>()
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

  // https://stackoverflow.com/questions/31490713/iterate-over-object-in-angular
  current_knob_keys() : Array<string> {
    return Object.keys(this.oedaCallback.current_knob);
  }

  knobs_of_stage(stage_object) : Array<string> {
    if (stage_object.knobs !== undefined) {
      return Object.keys(stage_object.knobs);
    }
  }

  stopRunningExperiment(): void {
    alert("Do you really want to stop the running experiment?");
    this.experiment.status = "INTERRUPTED";
    this.apiService.updateExperiment(this.experiment).subscribe(response => {
      this.targetSystem.status = "READY";
      this.apiService.updateTarget(this.targetSystem).subscribe(response2 => {
        this.notify.success("Success", response.message);
      }, errorResp2 => {
        this.notify.error("Error", errorResp2.message);
      });
    }, errorResp => {
      this.notify.error("Error", errorResp.message);
    });
  }
}
