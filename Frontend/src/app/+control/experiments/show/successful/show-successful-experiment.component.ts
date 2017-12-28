import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../../../shared/modules/helper/layout.service";
import {PlotService} from "../../../../shared/util/plot-service";
import {EntityService} from "../../../../shared/util/entity-service";
import {Experiment, Target, OEDAApiService, Entity} from "../../../../shared/modules/api/oeda-api.service";
import {AmChartsService, AmChart} from "@amcharts/amcharts3-angular";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'show-successful-experiment',
  templateUrl: './show-successful-experiment.component.html'
})

export class ShowSuccessfulExperimentComponent implements OnInit {
  private scatter_plot: AmChart;
  private histogram: AmChart;

  public dataAvailable: boolean;
  public is_collapsed: boolean;

  private first_render_of_page: boolean;
  private all_data: Entity[];
  private incoming_data_type_name: string;

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

  public available_stages = [];
  public available_stages_for_qq_js = [];

  public selected_stage: any;

  constructor(private layout: LayoutService,
              private apiService: OEDAApiService,
              private plotService: PlotService,
              private entityService: EntityService,
              private AmCharts: AmChartsService,
              private activated_route: ActivatedRoute,
              private router: Router,
              private notify: NotificationsService) {


    this.dataAvailable = false;
    this.is_all_stages_selected = false;
    this.is_qq_plot_rendered = false;
    this.qqJSPlotIsRendered = false;
    this.is_enough_data_for_plots = false;
    this.is_collapsed = true;
    this.first_render_of_page = true;
    this.all_data = new Array<Entity>();
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

      // distinguish between successful and interrupted
      if (this.router.url.toString().includes("interrupted")) {
        this.layout.setHeader("Interrupted Experiment Results", "");
      } else if (this.router.url.toString().includes("success")) {
        this.layout.setHeader("Successful Experiment Results", "");
      } else {
        this.layout.setHeader("Experiment Results", "");
      }
    });
  }
  /* tslint:disable */

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
                this.incoming_data_type_name = targetSystem.incomingDataTypes[0]["name"].toString();
                // retrieve stages
                this.apiService.loadAvailableStagesWithExperimentId(this.experiment_id).subscribe(stages => {
                  if (!isNullOrUndefined(stages)) {
                    // initially selected stage is "All Stages"
                    this.selected_stage = {"number": -1, "knobs": ""};
                    this.available_stages.push(this.selected_stage);

                    for (let j = 0; j < stages.length; j++) {
                      this.available_stages.push(stages[j]);
                    }
                    stages.sort(this.entityService.sort_by('number', true, parseInt));
                    console.log("avail", this.available_stages);
                    // prepare available stages for qq js that does not include all stages
                    this.available_stages_for_qq_js = this.available_stages.slice(1);
                    this.dataAvailable = true;
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

  /** uses stage_object (that can be either one stage or all_stage) and PlotService to draw plots accordingly */
  draw_all_plots(stage_object) {
    const ctrl = this;

    if (stage_object !== undefined && stage_object.length !== 0) {
      // draw graphs for all_data
      if (ctrl.selected_stage.number === -1) {
        let processedData = ctrl.entityService.process_all_stage_data(stage_object, "timestamp", "value", ctrl.scale, ctrl.incoming_data_type_name, true);
        // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
        const clonedData = JSON.parse(JSON.stringify(processedData));
        ctrl.initial_threshold_for_scatter_chart = ctrl.plotService.calculate_threshold_for_given_percentile(clonedData, 95, 'value');
        ctrl.scatter_plot = ctrl.plotService.draw_scatter_plot("chartdiv", "filterSummary", processedData, ctrl.incoming_data_type_name, ctrl.initial_threshold_for_scatter_chart);
        ctrl.histogram = ctrl.plotService.draw_histogram("histogram", processedData, ctrl.incoming_data_type_name);
        ctrl.selectDistributionAndDrawQQPlot(ctrl.distribution);
      }
      // draw graphs for selected stage data
      else {
        let processedData = ctrl.entityService.process_single_stage_data(stage_object,"timestamp", "value", ctrl.scale, ctrl.incoming_data_type_name);
        const clonedData = JSON.parse(JSON.stringify(processedData));
        ctrl.initial_threshold_for_scatter_chart = ctrl.plotService.calculate_threshold_for_given_percentile(clonedData, 95, 'value');
        ctrl.scatter_plot = ctrl.plotService.draw_scatter_plot("chartdiv", "filterSummary", processedData, ctrl.incoming_data_type_name, ctrl.initial_threshold_for_scatter_chart);
        ctrl.histogram = ctrl.plotService.draw_histogram("histogram", processedData, ctrl.incoming_data_type_name);

        // check if next stage exists for javascript side of qq plot
        ctrl.available_stages_for_qq_js.some(function(element) {
          if (Number(element.number) == Number(ctrl.selected_stage.number) + 1) {
            ctrl.selected_stage_for_qq_js = (element.number).toString();
            ctrl.plotService.draw_qq_js("qqPlotJS", ctrl.all_data, ctrl.selected_stage, ctrl.selected_stage_for_qq_js, ctrl.scale, ctrl.incoming_data_type_name);
            ctrl.qqJSPlotIsRendered = true;
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

  /** called when stage dropdown (All Stages, Stage 1 [...], Stage 2 [...], ...) in main page is changed */
  stage_changed() {
    const ctrl = this;

    if (isNullOrUndefined(ctrl.scale)) {
      ctrl.notify.error("Error", "Scale is null or undefined, please try again");
      return;
    }

    if (!isNullOrUndefined(ctrl.selected_stage.number)) {
      if (ctrl.selected_stage.number === -1) {
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
        const stage_data = ctrl.entityService.get_data_from_local_structure(ctrl.all_data, ctrl.selected_stage.number, true);
        if (!isNullOrUndefined(stage_data)) {
          ctrl.draw_all_plots(stage_data);
        } else {
          ctrl.notify.error("", "Please select another stage");
          return;
        }
      }
    } else {
      ctrl.notify.error("Error", "Stage number is null or undefined, please try again");
      return;
    }
  }

  /** called when scale dropdown (Normal, Log) in main page is changed */
  scale_changed(scale: string) {
    this.scale = scale;
    // trigger plot drawing process
    this.stage_changed();
  }

  /** returns keys of the retrieved stage */
  knobs_of_stage(stage) : Array<string> {
    return Object.keys(stage);
  }

  /** called when selected stage dropdown in QQ JS is changed */
  selectStageNoForQQJS(selected_stage_for_qq_js) {
    this.selected_stage_for_qq_js = selected_stage_for_qq_js;
    this.plotService.draw_qq_js("qqPlotJS", this.all_data, this.selected_stage, this.selected_stage_for_qq_js, this.scale, this.incoming_data_type_name);
    this.qqJSPlotIsRendered = true;
  }

  /** called when theoretical distribution in QQ Plot's dropdown is changed */
  selectDistributionAndDrawQQPlot(distName) {
    this.distribution = distName;
    this.plotService.retrieve_qq_plot_image(this.experiment_id, this.selected_stage, this.distribution, this.scale).subscribe(response => {
      const imageSrc = 'data:image/jpg;base64,' + response;
      document.getElementById("qqPlot").setAttribute('src', imageSrc);
      this.is_qq_plot_rendered = true;
    }, err => {
      this.notify.error("Error", err.message);
    });
  }

  /** retrieves all_data from server */
  private fetch_data() {
    const ctrl = this;
    this.apiService.loadAllDataPointsOfExperiment(this.experiment_id).subscribe(
      data => {
        if (isNullOrUndefined(data)) {
          this.notify.error("Error", "Cannot retrieve data from DB, please try again");
          return;
        }
        this.all_data = ctrl.entityService.process_response_for_successful_experiment(this.all_data, data);
        this.draw_all_plots(this.all_data);
      }
    );
  }

}
