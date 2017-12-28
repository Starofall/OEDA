import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../../../shared/modules/helper/layout.service";
import {PlotService} from "../../../../shared/util/plot-service";
import {EntityService} from "../../../../shared/util/entity-service";
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

  public availableStages = [];
  public availableStagesForQQJS = [];

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
                    this.availableStages.push(this.selected_stage);

                    for (let j = 0; j < stages.length; j++) {
                      this.availableStages.push(stages[j]);
                    }
                    stages.sort(this.entityService.sort_by('number', true, parseInt));

                    // prepare available stages for qq js that does not include all stages
                    this.availableStagesForQQJS = this.availableStages.slice(1);
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
        let processedData = ctrl.entityService.process_all_stage_data(stage_object, "timestamp", "value", ctrl.scale, ctrl.incoming_data_type_name);
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
        ctrl.availableStagesForQQJS.some(function(element) {
          if (Number(element.number) == Number(ctrl.selected_stage.number) + 1) {
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

  scale_changed(scale: string) {
    this.scale = scale;
    // trigger plot drawing process
    this.stage_changed();
  }

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
        const stage_data = ctrl.entityService.get_data_from_local_structure(ctrl.all_data, ctrl.selected_stage.number);
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

  knobs_of_stage(stage) : Array<string> {
    return Object.keys(stage);
  }

  draw_qq_js(other_stage_no) {
    const ctrl = this;
    // clear svg data, so that two different plots should not overlap with each other upon several rendering
    // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
    d3.select("#qqPlotJS").selectAll("*").remove();

    // retrieve data for the initially selected stage
    const data1 = ctrl.entityService.get_data_from_local_structure(ctrl.all_data, ctrl.selected_stage.number);

    if (isNullOrUndefined(data1)) {
      ctrl.notify.error("Error", "Selected stage might not contain data. Please select another stage.");
      return;
    }

    let data_for_x_axis = ctrl.entityService.process_single_stage_data(data1, null, null, ctrl.scale, ctrl.incoming_data_type_name);

    // retrieve data for the newly selected stage
    const data2 = ctrl.entityService.get_data_from_local_structure(ctrl.all_data, other_stage_no);
    if (isNullOrUndefined(data2)) {
      ctrl.notify.error("Error", "Selected stage might not contain data. Please select another stage.");
      return;
    }
    let data_for_y_axis = ctrl.entityService.process_single_stage_data(data2, null, null, ctrl.scale, ctrl.incoming_data_type_name);

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
      const percentile_for_data_x = ctrl.plotService.calculate_threshold_for_given_percentile(data_for_x_axis, 95,  null);
      const percentile_for_data_y = ctrl.plotService.calculate_threshold_for_given_percentile(data_for_y_axis, 95,  null);

      let scale_upper_bound = percentile_for_data_x;
      if (scale_upper_bound < percentile_for_data_y)
        scale_upper_bound = percentile_for_data_y;


      const min_x = data_for_x_axis.sort(this.entityService.sort_by(null, true, parseFloat))[0];
      const min_y = data_for_y_axis.sort(this.entityService.sort_by(null, true, parseFloat))[0];

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
        .text("Stage " + ctrl.selected_stage.number.toString() + " data");

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

  selectStageNoForQQJS(selected_stage_for_qq_js) {
    this.selected_stage_for_qq_js = selected_stage_for_qq_js;
    this.draw_qq_js(this.selected_stage_for_qq_js);
  }

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
        this.all_data = ctrl.entityService.process_response(this.all_data, data);
        console.log("all_data at beginning", this.all_data);
        this.draw_all_plots(this.all_data);
      }
    );
  }


}
