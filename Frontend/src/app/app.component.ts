import {Component, ViewContainerRef} from '@angular/core';
import {environment} from "../environments/environment";
import {NotificationsService} from "angular2-notifications/dist";


@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <simple-notifications [options]="notificationOptions"></simple-notifications>
  `
})
export class AppComponent {

  public notificationOptions = {
    timeOut: 2500,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: false,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'fromRight',
    position: ['right', 'bottom']
  };

  private viewContainerRef: ViewContainerRef;

  public constructor(viewContainerRef: ViewContainerRef, notifiy: NotificationsService) {
    this.viewContainerRef = viewContainerRef;
  }
}
