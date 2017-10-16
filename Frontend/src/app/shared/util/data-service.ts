import {Observable} from "rxjs";
import {AuthHttp} from "angular2-jwt";
import {NotificationsService} from "angular2-notifications";
import {LoggerService} from "../modules/helper/logger.service";
import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Try} from "monapt";

@Injectable()
export class DataService {

  constructor(public http: Http,
              public authHttp: AuthHttp,
              public notify: NotificationsService,
              public log: LoggerService) {
  }

  runningExperiments = [
    {
      name: "RTX Test 1",
      status: "RUNNING",
      complete: 0.5
    },
    {
      name: "RTX Test 2",
      status: "RUNNING",
      complete: 0.2
    },
    {
      name: "RTX Test 3",
      status: "RUNNING",
      complete: 0.8
    }
  ]
}
