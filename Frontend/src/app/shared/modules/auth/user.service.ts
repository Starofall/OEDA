import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {Http, Headers, Response} from "@angular/http";
import {LoggerService} from "../helper/logger.service";
import {JwtHelper, AuthHttp} from "angular2-jwt";
import {Router} from "@angular/router";
import {Try, Option, None, Some} from "monapt";
import {environment} from "../../../../environments/environment";
import {NotificationsService} from "angular2-notifications/dist";
import {RESTService} from "../../util/rest-service";

@Injectable()
export class UserService {

  constructor(private http: Http, private router: Router, private log: LoggerService, private notify: NotificationsService) {
  }

  /** store the URL so we can redirect after logging in */
  redirectUrl: string;

  /** helper for the jwt token */
  jwtHelper: JwtHelper = new JwtHelper();

  /** true if the user is logged in */
  isLoggedIn(): boolean {
    return this.getAuthTokenRaw().map(token => {
        return Try(() => !this.jwtHelper.isTokenExpired(token)).getOrElse(() => false)
      }
    ).getOrElse(() => false)
  }

  /** true if db is configured properly */
  is_db_configured(): any {
    const user_token_value = this.getAuthToken()["value"].user.db_configuration;
    if (user_token_value.hasOwnProperty("host") &&
            user_token_value.hasOwnProperty("port") &&
            user_token_value.hasOwnProperty("type")) {
      return true;
    }
    return false;
  }

  tryTokenRenewal(): Observable<boolean> {
    if (this.getAuthTokenRaw().isEmpty) {
      return Observable.throw("not logged in")
    }
    const authHeader = new Headers();
    authHeader.append('Authorization', 'Bearer ' + this.getAuthTokenRaw().get());
    return this.http.post(environment.backendURL + "/auth/renew", {},
      {headers: authHeader})
      .map((response: Response) => {
        this.log.debug("UserService - reauth successful");
        this.setAuthToken(response.json().token);
        return true;
      })
  }


  userIsInGroup(groupName: string): boolean {
    return this.getAuthToken()
      .map(token => token.roles.indexOf(groupName) > -1)
      .getOrElse(() => false)
  }

  sessionExpiresDate(): Date {
    return this.getAuthTokenRaw().map(token => this.jwtHelper.getTokenExpirationDate(token))
      .getOrElse(() => new Date())
  }

  /** tries to log in the user and stores the token in sessionStorage */
  login(request: LoginRequest): Observable<boolean> {
    this.log.debug("UserService - starting LoginRequest");
    return this.http.post(environment.backendURL + "/auth/login", request)
      .map((response: Response) => {
        this.log.debug("UserService - request successful");
        this.setAuthToken(response.json().token);
        return true;
      })
      .catch((error: any) => {
        const errorMsg = JSON.parse(error._body);
        this.notify.error("Error", errorMsg.error || errorMsg.message);
        return Observable.throw(error || 'Server error');
      })
  }

  /** returns the parsed token as JWTToken*/
  getAuthToken(): Option<JWTToken> {
    return this.getAuthTokenRaw().map(token => this.jwtHelper.decodeToken(token) as JWTToken)
  }

  /** stores the token*/
  setAuthToken(token: string): void {
    this.log.debug("UserService - storing token");
    sessionStorage.setItem('oeda_token', token)
  }

  /** returns the token stored in sessionStorage*/
  getAuthTokenRaw(): Option<string> {
    const token = sessionStorage.getItem('oeda_token');
    if (token == null || token.split('.').length !== 3) {
      return None
    } else {
      return new Some(token)
    }
  }

  /** logs out the user */
  logout(): void {
    console.log("UserService - removing token");
    this.log.debug("UserService - removing token");
    sessionStorage.removeItem('oeda_token');
    console.log(sessionStorage.getItem('oeda_token'));
    this.router.navigate(['/'])
  }

  /** checks if a user has a given permission */
  hasPermission(permission: Permission): boolean {
    return true
  }

  forcePermission(permission: Permission): Promise<boolean> { // Permission
    if (!this.isLoggedIn()) {
      this.log.warn("UserService - user is not logged in - sending to login");
      return this.router.navigate(['/auth/login'])
    }
    // check if the token has the given permission allowed
    const permissionNumber = this.getAuthToken().map(f => f.permissions).getOrElse(() => 0);
    const toLessPermissions = (permissionNumber === 0);
    if (toLessPermissions) {
      this.log.warn("UserService - not enough access rights for this page");
      return this.router.navigate(['/'])
    }
    this.log.debug("UserService - user has all permissions for this page");
  }
}


/** a permission in the system */
export class Permission {

  /** allows access to the system status page */
  static FOUND_SYSINFO_READ = new Permission(0, "FOUND_SYSINFO_READ");

  constructor(index: number, name: string) {
    this.index = index;
    this.name = name;
  }

  index: number;
  name: string;
}

/** request for logging in */
export interface LoginRequest {
  username: string,
  password: string
}

/** the format of tokens we use for auth*/
export interface JWTToken {
  id: string,
  value: string,
  roles: string[],
  representsArtists: string[],
  monitorsArtists: string[],
  permissions: number,
  exp: number,
  nbf: number
}
