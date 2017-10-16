import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {routes} from "./landingpage.routing";
import {LandingpageComponent} from "./landingpage.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
  declarations: [
    LandingpageComponent
  ]
})
export class LandingPageModule {
}
