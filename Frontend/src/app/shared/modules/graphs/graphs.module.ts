import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared.module";
import {NVD3Component} from "./nvd3.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [NVD3Component],
  providers: [],
  declarations: [NVD3Component]
})
export class GraphsModule {
}
