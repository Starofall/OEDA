import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {routes} from "./control.routing";
import {SharedModule} from "../shared/shared.module";
import {UserFooterComponent} from "./layout/footer/user-footer.component";
import {UserLayoutComponent} from "./layout/user-layout.component";
import {UserHeaderComponent} from "./layout/header/user-header.component";
import {UserNavigationComponent} from "./layout/navigation/user-navigation.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TargetsComponent} from "./targets/targets.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {DefinitionsComponent} from "./definitions/definitions.component";
import {ExperimentsComponent} from "./experiments/experiments.component";
import {ShowExperimentsComponent} from "./experiments/show/show-experiments.component";
import {GraphsModule} from "../shared/modules/graphs/graphs.module";
import {EditTargetsComponent} from "./targets/edit/edit-targets.component";
import {EditDefinitionsComponent} from "./definitions/edit/edit-definitions.component";

@NgModule({
  imports: [
    SharedModule,
    GraphsModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
  declarations: [
    ConfigurationComponent,
    EditDefinitionsComponent,
    UserNavigationComponent,
    UserHeaderComponent,
    UserLayoutComponent,
    UserFooterComponent,
    DashboardComponent,
    DefinitionsComponent,
    TargetsComponent,
    ExperimentsComponent,
    ShowExperimentsComponent,
    EditTargetsComponent
  ]
})
export class ControlModule {
}
