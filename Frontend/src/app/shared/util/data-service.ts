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

}
