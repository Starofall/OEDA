import {NotificationsService} from "angular2-notifications";
import {LoggerService} from "../modules/helper/logger.service";
import {Injectable} from "@angular/core";
import {AmChartsService} from "@amcharts/amcharts3-angular";
import {OEDAApiService} from "../modules/api/oeda-api.service";
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from "util";
import {EntityService} from "./entity-service";
import * as d3 from "d3";

@Injectable()
export class PlotService {

  constructor(public notify: NotificationsService, public log: LoggerService, private entityService: EntityService, private AmCharts: AmChartsService, private apiService: OEDAApiService) {}

  /** draws a scatter_plot with given parameters and the data */
  public draw_scatter_plot (divID: string,
                            summaryFieldID: string,
                            processedData: any,
                            incoming_data_type_name: string,
                            initial_threshold_for_scatter_plot: number) {
    let selectedThreshold = -1;
    const scatter_plot = this.AmCharts.makeChart(divID, {
      "responsive": {
        "enabled": true
      },
      "type": "serial",
      "theme": "light",
      "autoMarginOffset": 10,
      "dataProvider": processedData,
      "valueAxes": [{
        "position": "left",
        "title": incoming_data_type_name,
        "precision": 2
      }],
      "graphs": [{
        "balloonText": "[[category]]<br><b><span style='font-size:12px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 6,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": initial_threshold_for_scatter_plot,
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
        "value": initial_threshold_for_scatter_plot,
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
              this.notify.error("", "Please move your cursor to determine the threshold");
            }
          })
        }
      }]
    });
    return scatter_plot;
  }

  /** draws an histogram with given parameters and the data */
  public draw_histogram(divID: string, processedData: any, incoming_data_type_name: string) {
    const histogram = this.AmCharts.makeChart(divID, {
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
        "title": incoming_data_type_name
      },
      "valueAxes": [{
        "title": "Percentage"
      }]
    });
    return histogram;
  }

  /** retrieves qq plot image from the server */
  public retrieve_qq_plot_image(experiment_id, selected_stage, distribution, scale): Observable<any> {
    return this.apiService.getQQPlot(experiment_id, selected_stage.number.toString(), distribution, scale);
  }

  /** dstributes data to bins for histogram*/
  private categorize_data(data: any) {

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
      const val = data[j]["value"];
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

  /** returns maximum value of the given array */
  private get_maximum_value_from_array(array) {
    const max_of_array = Math.max.apply(Math, array);
    return max_of_array;
  }

  /** extracts values from given array */
  private extract_values_from_array(array, attribute) {
    const retVal = [];
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        retVal.push(array[i][attribute]);
      }
    }
    return retVal;
  }

  /** returns optimal number of bins */
  private determine_nr_of_bins_for_histogram(array, default_bin_size) {
    const h = this.get_bin_width(array), ulim = Math.max.apply(Math, array), llim = Math.min.apply(Math, array);
    if (h <= (ulim - llim) / array.length) {
      return default_bin_size || 10; // Fix num bins if binWidth yields too small a value.
    }
    return Math.ceil((ulim - llim) / h);
  }

  private get_bin_width(array) {
    return 2 * this.iqr(array) * Math.pow(array.length, -1 / 3);
  }

  /** IQR = inter-quaartile-range */
  private iqr(array) {
    const sorted = array.slice(0).sort(function (a, b) { return a - b; });
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
    return q3 - q1;
  }

  /** function that filters out data above the threshold */
  private filter_outliers(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const value = idAttr.nodeValue;
    console.log(target);
    console.log(idAttr);
    console.log(value);
  }

  /**
   * filters out data above the threshold
   * if data_field is null, then it is same to first sorting an array of float/int values, then finding the percentile
   */
  public calculate_threshold_for_given_percentile(data, percentile, data_field) {
    if (data.length !== 0) {
      const sortedData = data.sort(this.entityService.sort_by(data_field, true, parseFloat));
      const index = Math.floor(sortedData.length * percentile / 100 - 1);

      // TODO how can this index be -1? this is just a work-around for now
      if (index === -1) {
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

  /** draws QQ Plot based on https://gist.github.com/mbostock/4349187 and http://mbostock.github.io/protovis/ex/qqplot.html*/
  public draw_qq_js(divID, all_data, selected_stage, other_stage_number, scale, incoming_data_type_name) {
    const ctrl = this;
    // clear svg data, so that two different plots should not overlap with each other upon several rendering
    // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
    d3.select("#" + divID).selectAll("*").remove();

    // retrieve data for the initially selected stage
    const data1 = ctrl.entityService.get_data_from_local_structure(all_data, selected_stage.number);

    if (isNullOrUndefined(data1)) {
      ctrl.notify.error("Error", "Selected stage might not contain data. Please select another stage.");
      return;
    }

    const data_for_x_axis = ctrl.entityService.process_single_stage_data(data1, null, null, scale, incoming_data_type_name);

    // retrieve data for the newly selected stage
    const data2 = ctrl.entityService.get_data_from_local_structure(all_data, other_stage_number);
    if (isNullOrUndefined(data2)) {
      ctrl.notify.error("Error", "Selected stage might not contain data. Please select another stage.");
      return;
    }
    const data_for_y_axis = ctrl.entityService.process_single_stage_data(data2, null, null, scale, incoming_data_type_name);

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


    const min_x = data_for_x_axis.sort(ctrl.entityService.sort_by(null, true, parseFloat))[0];
    const min_y = data_for_y_axis.sort(ctrl.entityService.sort_by(null, true, parseFloat))[0];

    let scale_lower_bound = min_x;
    if (scale_lower_bound < min_y)
      scale_lower_bound = min_y;

    var chart = (qq() as any)
      .width(width)
      .height(height)
      .domain([scale_lower_bound - tm, scale_upper_bound]) // tm or td can also be subtracted from lower bound
      // .domain([0, 5])
      .tickFormat(function(d) { return ~~(d * 100); });

    var vis = d3.select("#" + divID)
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
      .text("Stage " + other_stage_number.toString() + " data");

    // x-axis title
    vis.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate(" + (width / 2) + "," + (height - (padding / 3) ) + ")" )  // centre below axis
      .text("Stage " + selected_stage.number.toString() + " data");

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
  }
}
