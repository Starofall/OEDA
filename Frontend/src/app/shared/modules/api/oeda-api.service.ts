import {Injectable} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AuthHttp} from "angular2-jwt";
import {Http, Response} from "@angular/http";
import {RESTService} from "../../util/rest-service";
import {LoggerService} from "../helper/logger.service";
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

  public updateExperiment(experiment: Experiment): Observable<any> {
    return this.doPUTPublicRequest("/experiments/" + experiment.id, experiment)
  }

  public loadAllTargets(): Observable<Target[]> {
    return this.doGETPublicRequest("/targets")
  }

  public loadTargetById(id: string): Observable<Target> {
    return this.doGETPublicRequest("/targets/" + id)
  }

  public saveTarget(target: Target): Observable<Target> {
    return this.doPOSTPublicRequest("/targets/" + target.id, target)
      .map((res: Response) => res.json())
  }

  public updateTarget(target: Target): Observable<any> {
    return this.doPUTPublicRequest("/targets/" + target.id, target)
  }

  public loadConfiguration(): Observable<Configuration> {
    return this.doGETPublicRequest("/configuration")
  }

  public updateUser(user: UserEntity): Observable<any> {
    return this.doPOSTPublicRequest("/user/" + user.name, user);
  }

  public loadUserByName(user: UserEntity): Observable<any> {
    return this.doGETPublicRequest("/user" + user.name);
  }

  public loadAllUsers(user: UserEntity): Observable<any> {
    return this.doGETPublicRequest("/users" )
  }

  public registerUser(user: UserEntity): Observable<any> {
    return this.doPOSTPublicRequest("/auth/register", user);
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
  number: string,
  values: object[],
  knobs: any
}


export interface Target {
  id: string,
  name: string,
  status: string,
  description: string,
  dataProviders: any, // generic one
  primaryDataProvider: any,
  secondaryDataProviders: any,
  changeProvider: any,
  incomingDataTypes: any,
  changeableVariable: any
}

export interface ExecutionStrategy {
  type: string,
  ignore_first_n_results: number,
  sample_size: number,
  knobs: any,
  stages_count: number,
  optimizer_random_starts: number,
  optimizer_iterations: number,
  optimizer_method: any
}

export interface OedaCallbackEntity {
  status: string,
  message: string,
  index: number,
  size: number,
  complete: number,
  experiment_counter: number,
  total_experiments: number,
  stage_counter: number,
  current_knob: any,
  remaining_time_and_stages: any
}

export interface Configuration {
  host: string,
  port: number,
  type: string
}

export interface UserEntity {
  name: string,
  password: string,
  db_configuration: Map<string, string>
}
