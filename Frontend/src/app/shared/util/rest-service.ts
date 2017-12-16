import {AuthHttp} from "angular2-jwt";
import {NotificationsService} from "angular2-notifications";
import {LoggerService} from "../modules/helper/logger.service";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Try} from "monapt";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/Observable";

@Injectable()
/** an abstract class that can be used to write REST compatible client APIs */
export abstract class RESTService {

  constructor(public http: Http,
              public authHttp: AuthHttp,
              public notify: NotificationsService,
              public log: LoggerService) {
  }

  baseURL = environment.backendURL;
  configBackendURL = environment.configBackendURL;

  requestOptions = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });


  /** creates a string out of a given object - also replaces empty strings "" with null */
  private createCleanJSON(object: any): string {
    return JSON
      .stringify(object)
      .replace(/:""/gi, ":null")
  }

  /** does a authed http get request to the given URL and returns type T */
  public doGETRequest<T>(url: string): Observable<T> {
    return this.authHttp.get(this.baseURL + url, this.requestOptions)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        // @todo add reroute if login failed
        this.notify.error("Server Error", "Action did not work")
        this.log.error("GET@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }

  /** does a authed http post request to the given URL with payload and returns type T */
  public doPOSTRequest<T>(url: string, object: any): Observable<T> {
    return this.authHttp.post(this.baseURL + url, this.createCleanJSON(object), this.requestOptions)
      .map((res: Response) => Try(() => res.json()).getOrElse(() => {
      }))
      .catch((error: any) => {
        this.notify.error("Server Error", "Action did not work")
        error.object = object // add post object to error
        this.log.error("POST@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }

  public doPUTRequest<T>(url: string, object: any): Observable<T> {
    return this.authHttp.put(this.baseURL + url, this.createCleanJSON(object), this.requestOptions)
      .catch((error: any) => {
        this.notify.error("Server Error", "Action did not work")
        error.object = object // add post object to error
        this.log.error("PUT@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }


  /** does a public http get request to the given URL and returns type T */
  public doGETPublicRequest<T>(url: string): Observable<T> {
    return this.http.get(this.baseURL + url, this.requestOptions)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        this.notify.error("Server Error", "Action did not work")
        this.log.error("GET@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }

  /** does a public http get request to the given URL and returns type T */
  public doGETPublicRequestForConfig<T>(url: string): Observable<T> {
    return this.http.get(this.configBackendURL + url, this.requestOptions)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        this.notify.error("Server Error", "Action did not work")
        this.log.error("GET@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }

  /** does a authed http post request to the given URL with payload and returns type T */
  public doPOSTPublicRequest<T>(url: string, object: any): Observable<T> {
    return this.http.post(this.baseURL + url, this.createCleanJSON(object), this.requestOptions)
      .catch((error: any) => {
        this.notify.error("Server Error", "Action did not work")
        error.object = object // add post object to error
        this.log.error("POST@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }

  public doPUTPublicRequest<T>(url: string, object: any): Observable<T> {
    return this.http.put(this.baseURL + url, this.createCleanJSON(object), this.requestOptions)
      .catch((error: any) => {
        this.notify.error("Server Error", "Action did not work")
        error.object = object // add post object to error
        this.log.error("PUT@" + url, error)
        return Observable.throw(error || 'Server error')
      })
  }
}
