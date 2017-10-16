import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {routes} from "./app.routes";
import {SharedModule} from "./shared/shared.module";
import {GlobalModule} from "./global.module";
import {SimpleNotificationsModule} from "angular2-notifications";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    GlobalModule,
    SharedModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [
    // should be empty as we import all global services through "SharedModule.forRoot()"
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
