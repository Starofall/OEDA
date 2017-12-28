import {NotificationsService} from "angular2-notifications";
import {LoggerService} from "../modules/helper/logger.service";
import {Injectable} from "@angular/core";
import {Entity} from "../modules/api/oeda-api.service";
import {isNullOrUndefined} from "util";

@Injectable()
export class EntityService {

  constructor(public notify: NotificationsService, public log: LoggerService) {}

  public createEntity(): Entity {
    return {
      number: "",
      values: [],
      knobs: null
    }
  }

  /** returns data of the selected stage from all_data structure */
  public get_data_from_local_structure(all_data, stage_no) {
    let retrieved_data = all_data[stage_no - 1];
    if (retrieved_data !== undefined) {
      retrieved_data = JSON.parse(retrieved_data);
      if (retrieved_data.values.length === 0) {
        this.notify.error("Error", "Selected stage might not contain data points. Please select another stage.");
        return;
      }
    } else {
      this.notify.error("Error", "Cannot retrieve data from local storage");
      return;
    }
    return retrieved_data;
  }

  /** parses single stage data with given attributes & scale, and returns values in array */
  public process_single_stage_data(single_stage_object, xAttribute, yAttribute, scale, incoming_data_type_name): Array<number> {
    const ctrl = this;
    try {
      if (single_stage_object !== undefined) {
        const processedData = [];
        // now inner element
        console.log("single_stage_object in process_sing", single_stage_object);
        single_stage_object.values.forEach(function(data_point) {
          if (xAttribute !== null && yAttribute !== null) {
            const newElement = {};
            newElement[xAttribute] = data_point["created"];
            if (scale === "Log") {
              newElement[yAttribute] = Math.log(data_point["payload"][incoming_data_type_name]);
            } else if (scale === "Normal") {
              newElement[yAttribute] = data_point["payload"][incoming_data_type_name];
            } else {
              ctrl.notify.error("Error", "Please provide a valid scale");
              return;
            }
            processedData.push(newElement);
          } else {
            // this is for plotting qq plot with JS, as it only requires raw data in log or normal scale
            if (scale === "Log") {
              processedData.push(Math.log(data_point["payload"][incoming_data_type_name]));
            } else if (scale === "Normal") {
              processedData.push(data_point["payload"][incoming_data_type_name]);
            } else {
              ctrl.notify.error("Error", "Please provide a valid scale");
              return;
            }
          }
        });
        return processedData;
      }
    } catch (err) {
      ctrl.notify.error("Error", err.message);
    }
  }

  /** stage object contains more than one stages here */
  public process_all_stage_data(all_stage_object, xAttribute, yAttribute, scale, incoming_data_type_name): Array<number> {
    const ctrl = this;
    try {
      if (all_stage_object !== undefined) {
        const processedData = [];
        all_stage_object.forEach(function(single_stage_object) {
          single_stage_object = JSON.parse(single_stage_object);
          const data_array = ctrl.process_single_stage_data(single_stage_object, xAttribute, yAttribute, scale, incoming_data_type_name);
          data_array.forEach(function(data_value){
            processedData.push(data_value);
          });
        });
        return processedData;
      } else {
        this.notify.error("Error", "Failed to process all stage data");
      }
    } catch (err) {
      this.notify.error("Error", err.message);
      throw err;
    }
  }

  /** https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects */
  public sort_by(field, reverse, primer) {
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

  /** parses response object returned from server, creates new stage-point tuple(s) and pushes them to the all_data (array of json strings) */
  public process_response(response, all_data): Entity[] {

    if (isNullOrUndefined(response)) {
      this.notify.error("Error", "Cannot retrieve data from DB, please try again");
      return;
    }

    // we can retrieve more than one array of stages and data points
    for (const index in response) {
      if (response.hasOwnProperty(index)) {
        const parsed_json_object = JSON.parse(response[index]);
        // distribute data points to empty bins
        const new_entity = this.createEntity();
        new_entity.number = parsed_json_object['number'].toString();
        new_entity.values = parsed_json_object['values'];
        new_entity.knobs = parsed_json_object['knobs'];
        // important assumption here: we retrieve stages and data points in a sorted manner with respect to created field
        // thus, pushed new_entity will have a key of its "number" with this assumption
        // e.g. [ 0: {number: 1, values: ..., knobs: [...]}, 1: {number: 2, values: ..., knobs: [...] }...]
        all_data.push(new_entity);
      }
    }
    return all_data;
  }

}
