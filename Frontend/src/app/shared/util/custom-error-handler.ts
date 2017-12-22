import {ErrorHandler, Injectable} from "@angular/core";
import {LoggerService} from "../modules/helper/logger.service";
import {NotificationsService} from "angular2-notifications";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private log: LoggerService, private notify: NotificationsService) {
  }

  // handles exceptions in angular2 and forwards them to eventq
  handleError(error) {
    // this.log.error("RUNTIME_ERROR", error)
    // this.notify.error("Application Error", "Please reload...")
    console.log("-ERROR-")
    console.error(error)
  }
}

