import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";


@Injectable()
export class LoggerService {

  /** the current log level defined by the environment */
  level = environment.logLevel;

  OFF = 0
  ERROR = 1
  WARN = 2
  INFO = 3
  DEBUG = 4
  LOG = 5

  isErrorEnabled = () => this.level >= this.ERROR;
  isWarnEnabled = () => this.level >= this.WARN;
  isInfoEnabled = () => this.level >= this.INFO;
  isDebugEnabled = () => this.level >= this.DEBUG;
  isLogEnabled = () => this.level >= this.LOG;


  /** logs errors to console AND sends error to eventQ */
  error(message, ...optionalParams) {
    this.isErrorEnabled() && console.error.apply(console, arguments);
  }

  /** warning logging to console */
  warn(message, ...optionalParams) {
    this.isWarnEnabled() && console.warn.apply(console, arguments);
  }

  /** info logging to console */
  info(message, ...optionalParams) {
    this.isInfoEnabled() && console.info.apply(console, arguments);
  }

  /** debug logging to console */
  debug(message, ...optionalParams) {
    this.isDebugEnabled() && console.debug.apply(console, arguments);
  }

  /** normal logging to console */
  log(message, ...optionalParams) {
    this.isLogEnabled() && console.log.apply(console, arguments);
  }
}
