import {Injectable} from '@angular/core';
import {
  CanActivate, CanLoad, Route, CanActivateChild, RouterStateSnapshot,
  ActivatedRouteSnapshot, Router
} from '@angular/router';
import {UserService} from "./user.service";
import {LoggerService} from "../helper/logger.service";
import {Observable} from "rxjs/Observable";
import {NotificationsService} from "angular2-notifications/dist";


@Injectable()
export class UserRouteGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(private router: Router, private logger: LoggerService, private userService: UserService, private notifiy: NotificationsService) {
  }

  doUserCheck(state: RouterStateSnapshot): Observable<boolean> {
    if (this.userService.isLoggedIn()) { // @todo readd this && this.userService.userIsInGroup("PINYAL_STAFF")
      this.logger.debug("RouteGuard - User is authed")
      return Observable.of(true)
    } else {
      if (this.userService.getAuthTokenRaw().isEmpty) {
        this.logger.debug("RouteGuard - User has no auth token, direct send him to login")
        this.router.navigate(['/'], {queryParams: {returnUrl: state.url}})
        return Observable.of(false)
      } else {
        this.logger.debug("RouteGuard - User auth expired - try to reauth")
        this.userService.tryTokenRenewal().subscribe(
          (worked) => {
            this.logger.debug("RouteGuard - re-auth worked")
            this.router.navigate([state.url])
            return true
          },
          (failed) => {
            this.router.navigate(['/'], {queryParams: {returnUrl: state.url}})
            return false
          }
        )
      }
    }
  }

  canLoad(router: Route) {
    return true // this.doUserCheck()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.doUserCheck(state)
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.doUserCheck(state)
  }
}
