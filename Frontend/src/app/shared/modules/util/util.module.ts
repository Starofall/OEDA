import {ModuleWithProviders, NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {UtilService} from "./util.service";

@NgModule({
  imports: [
    HttpModule,
  ],
  exports: [
  ],
  providers: [
    UtilService
  ]
})
export class UtilModule {
}
