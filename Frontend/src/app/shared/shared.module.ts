import {NgModule, ModuleWithProviders, ErrorHandler, Injectable, Injector} from "@angular/core";
import {FormsModule} from '@angular/forms';
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {Http, RequestOptions, HttpModule, XHRBackend, ConnectionBackend, RequestOptionsArgs} from "@angular/http";
import {CommonModule} from "@angular/common";
import {AccordionModule} from "ng2-bootstrap/accordion";
import {ProgressbarModule} from "ng2-bootstrap/progressbar";
import {ModalModule} from "ng2-bootstrap/modal";
import {NotificationsService} from "angular2-notifications";
import * as _ from 'lodash'
import {HttpInterceptor} from "./util/http-interceptor";
import {CustomErrorHandler} from "./util/custom-error-handler";
import {LoggerService} from "./modules/helper/logger.service";
import {UserService} from "./modules/auth/user.service";
import {LayoutService} from "./modules/helper/layout.service";
import {UserRouteGuard} from "./modules/auth/staff-routeguard.service";
import {UtilModule} from "./modules/util/util.module";
import {DataTableModule} from "angular2-datatable";
import {DataService} from "./util/data-service";
import {UIModule} from "./modules/ui/ui.module";
import {OEDAApiService} from "./modules/api/oeda-api.service";
import {RESTService} from "./util/rest-service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AccordionModule,
    ProgressbarModule,
    ModalModule,
    UtilModule,
    DataTableModule,
    UIModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ModalModule,
    AccordionModule,
    UtilModule,
    ProgressbarModule,
    DataTableModule,
    UIModule
  ],
  providers: [
    UserService,
    LoggerService,
    UserRouteGuard,
    LayoutService,
    DataService,
    // RESTService,
    OEDAApiService
    // should always be empty
  ]
})
export class SharedModule {

  /** defines the behaviour of angular2-jwt */
  static authHttpServiceFactory(http: HttpInterceptor, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
      tokenName: 'oeda_token',
      globalHeaders: [{'Content-Type': 'application/json'}],
    }), http, options)
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      // Here (and only here!) are all global shared services
      providers: [
        {
          provide: Http,
          useFactory: HttpInterceptor.httpInterceptorFactory,
          deps: [XHRBackend, RequestOptions, Injector]
        },
        {
          provide: AuthHttp,
          useFactory: SharedModule.authHttpServiceFactory,
          deps: [Http, RequestOptions]
        },
        {
          provide: ErrorHandler,
          useClass: CustomErrorHandler
        },
        LoggerService,
        UserService,
        LayoutService,
        UserRouteGuard,
        NotificationsService
      ]
    };
  }
}