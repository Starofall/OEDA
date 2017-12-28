import {NotificationsService} from "angular2-notifications";
import {LoggerService} from "../modules/helper/logger.service";
import {Injectable} from "@angular/core";
import {AmChartsService} from "@amcharts/amcharts3-angular";
import {OEDAApiService} from "../modules/api/oeda-api.service";
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from "util";
import {EntityService} from "./entity-service";

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
  // if data_field is null, then it is same to first sorting an array of float/int values, then finding the percentile
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
}
