import {Injectable} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AuthHttp} from "angular2-jwt";
import {Http} from "@angular/http";
import {RESTService} from "../../util/rest-service";
import {LoggerService} from "../helper/logger.service";
import {URLSearchParams} from "@angular/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs/Observable";


@Injectable()
export class OEDAApiService extends RESTService {

  constructor(http: Http, authHttp: AuthHttp, notify: NotificationsService, log: LoggerService) {
    super(http, authHttp, notify, log);
  }

  public loadAllExperiments(): Observable<Experiment[]> {
    return this.doGETPublicRequest("/experiments")
  }

  public loadExperimentById(experiment_id: string): Observable<Experiment> {
    return this.doGETPublicRequest("/experiments/" + experiment_id)
  }

  public loadDataPointsOfStage(experiment_id: string, stage_no: string): Observable<any> {
    return this.doGETPublicRequest("/experiment_results/" + experiment_id + "/" + stage_no)
  }

  public loadAllDataPointsOfExperiment(experiment_id: string): Observable<any> {
    return this.doGETPublicRequest("/experiment_results/" + experiment_id)
  }

  public loadAllDataPointsOfRunningExperiment(experiment_id: string, timestamp: string): Observable<any> {
    return this.doGETPublicRequest("/running_experiment_results/" + experiment_id + "/" + timestamp)
  }

  public loadAvailableStagesWithExperimentId(experiment_id: string): Observable<any> {
    return this.doGETPublicRequest("/stages/" + experiment_id)
  }

  public getOedaCallback(experiment_id: string): Observable<any> {
    return this.doGETPublicRequest("/running_experiment_results/oeda_callback/" + experiment_id)
  }

  public getQQPlot(experiment_id: string, stage_no: string, distribution: string, scale: string): Observable<any> {
    return this.doGETPublicRequest("/qqPlot/" + experiment_id + "/" + stage_no + "/" + distribution + "/" + scale)
  }

  public getConfigFromAPI(url: string): Observable<any> {
    return this.doGETPublicRequestForConfig(url)
  }

  public saveExperiment(experiment: Experiment): Observable<any> {
    return this.doPOSTPublicRequest("/experiments/" + experiment.id, experiment)
  }

  public loadAllDefinitions(): Observable<Definition[]> {
    return this.doGETPublicRequest("/definitions")
  }

  public loadDefinitionsById(id: string): Observable<Definition> {
    return this.doGETPublicRequest("/definitions/" + id)
  }

  public saveDefinitions(definition: Definition): Observable<any> {
    return this.doPOSTPublicRequest("/definitions/" + definition.id, definition)
  }

  public loadAllTargets(): Observable<Target[]> {
    return this.doGETPublicRequest("/targets")
  }

  public loadTargetById(id: string): Observable<Target> {
    return this.doGETPublicRequest("/targets/" + id)
  }

  public saveTarget(target: Target): Observable<any> {
    return this.doPOSTPublicRequest("/targets/" + target.id, target)
  }


  public loadConfiguration(): Observable<Configuration> {
    return this.doGETPublicRequest("/configuration")
  }

  public saveConfiguration(configuration: Configuration): Observable<any> {
    return this.doPOSTPublicRequest("/configuration", configuration)
  }

}

export interface Experiment {
  id: string,
  name: string,
  description: string,
  status: string,
  targetSystemId: string,
  changeableVariable: any,
  executionStrategy: ExecutionStrategy,
}

export interface Entity {
  stage_number: string;
  values: object[];
}


export interface Definition {
  id: string,
  name: string
}


export interface Target {
  id: string,
  name: string,
  status: string,
  description: string,
  primaryDataProvider: any,
  changeProvider: any,
  incomingDataTypes: any,
  changeableVariable: any
}

export interface ExecutionStrategy {
  type: string,
  ignore_first_n_results: number,
  sample_size: number,
  knobs: any
}

export interface OedaCallbackEntity {
  status: string,
  message: string,
  index: number,
  size: number,
  complete: number,
  experiment_counter: number,
  total_experiments: number,
  stage_counter: number
}

export interface Configuration {
  database: any
}
