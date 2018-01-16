import {NotificationsService} from "angular2-notifications";
import {LoggerService} from "../modules/helper/logger.service";
import {Injectable} from "@angular/core";
import {Entity, OedaCallbackEntity, UserEntity} from "../modules/api/oeda-api.service";
import {isNullOrUndefined} from "util";

@Injectable()
export class EntityService {

  constructor(public notify: NotificationsService, public log: LoggerService) {}

  public create_entity(): Entity {
    return {
      number: "",
      values: [],
      knobs: null
    }
  }

  /** returns data of the selected stage from all_data structure */
  public get_data_from_local_structure(all_data, stage_no, called_for_successful_experiment) {
    let retrieved_data = all_data[stage_no - 1];
    if (retrieved_data !== undefined) {
      if (called_for_successful_experiment)
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
  public process_all_stage_data(all_stage_object, xAttribute, yAttribute, scale, incoming_data_type_name, called_for_successful_experiment): Array<number> {
    const ctrl = this;
    try {
      if (all_stage_object !== undefined) {
        const processedData = [];

        all_stage_object.forEach(function(single_stage_object) {
          if (called_for_successful_experiment)
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

  /** parses static response object returned from server, creates new stage-point tuple(s) and pushes them to the all_data (array of json strings) */
  public process_response_for_successful_experiment(response, all_data): Entity[] {
    if (isNullOrUndefined(response)) {
      this.notify.error("Error", "Cannot retrieve data from DB, please try again");
      return;
    }

    // we can retrieve more than one array of stages and data points
    for (const index in response) {
      if (response.hasOwnProperty(index)) {
        const parsed_json_object = JSON.parse(response[index]);
        // distribute data points to empty bins
        const new_entity = this.create_entity();
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

  /** parses dynamic response object returned from server,
   * difference from upper function: it behaves differently depending on the first rendering status of the page.
   * i.e. if it is the first render, then it creates new bins and pushes them to all_data
   * if it is not the first render, then it concats new data with the existing ones */
  public process_response_for_running_experiment(response, all_data, first_render_of_page, available_stages, available_stages_for_qq_js, timestamp) {
    if (isNullOrUndefined(response)) {
      this.notify.error("Error", "Cannot retrieve data from DB, please try again");
      return;
    }
    if (first_render_of_page) {
      // we can retrieve one or more stages at first render
      for (const index in response) {
        if (response.hasOwnProperty(index)) {
          const parsed_json_object = JSON.parse(response[index]);
          // distribute data points to empty bins
          const new_entity = this.create_entity();
          new_entity.number = parsed_json_object['number'];
          new_entity.values = parsed_json_object['values'];
          new_entity.knobs = parsed_json_object['knobs'];
          // we retrieve stages and data points in following format
          // e.g. [ 0: {number: 1, values: ..., knobs: [...]}, 1: {number: 2, values: ..., knobs: [...] }...]
          if (new_entity.values.length !== 0) {
            all_data.push(new_entity);
          }
          // as a guard against stage duplications
          const new_stage = {"number": parsed_json_object.number, "knobs": parsed_json_object.knobs};
          const existing_stage = available_stages.find(entity => entity.number === parsed_json_object.number);
          // stage does not exist yet
          if (isNullOrUndefined(existing_stage)) {
            available_stages.push(new_stage);
            available_stages_for_qq_js.push(new_stage);
          }
          // do not update timestamp here if we can't retrieve any data, just keep fetching with timestamp "-1"
          // because backend is also updated accordingly, i.e. it continues to fetch all data if timestamp is -1
        }
      }
      return true;
    } else {
      // we can retrieve one or more stages upon other polls
      // so, iterate the these stages and concat their data_points with existing data_points
      for (const index in response) {
        if (response.hasOwnProperty(index)) {
          const parsed_json_object = JSON.parse(response[index]);
          const existing_stage = all_data.find(entity => entity.number === parsed_json_object.number);

          // we have found an existing stage
          if (existing_stage !== undefined) {
            const stage_index = parsed_json_object['number'] - 1;
            if (parsed_json_object['values'].length > 0) {
              all_data[stage_index].values = all_data[stage_index].values.concat(parsed_json_object['values']);
            }
          } else {
            // a new stage has been fetched, create a new bin for it, and push all the values to the bin, also push bin to all_data
            const number = parsed_json_object['number'];
            const values = parsed_json_object['values'];
            const knobs = parsed_json_object['knobs'];
            const new_stage = {"number": number, "knobs": knobs};
            available_stages.push(new_stage);

            const new_entity = this.create_entity();
            new_entity.number = number;
            new_entity.values = values;
            new_entity.knobs = knobs;
            all_data.push(new_entity);
          }
          // update timestamp if we have retrieved a data
          if (Number(index) === response.length - 1) {
            const data_point_length = parsed_json_object['values'].length;
            if (data_point_length > 0) {
              timestamp = parsed_json_object.values[data_point_length - 1]['created'];
              return true;
            }
          }
        }
      }
    }
  }

  public create_oeda_callback_entity(): OedaCallbackEntity {
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

  public create_user_entity(): UserEntity {
    return {
      name: "",
      password: "",
      db_configuration: new Map<string, string>()
    };
  }

}
