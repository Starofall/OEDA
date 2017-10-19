import {Routes} from "@angular/router";
import {UserLayoutComponent} from "./layout/user-layout.component";
import {UserRouteGuard} from "../shared/modules/auth/staff-routeguard.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TargetsComponent} from "./targets/targets.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {DefinitionsComponent} from "./definitions/definitions.component";
import {EditDefinitionsComponent} from "./definitions/edit/edit-definitions.component";
import {EditTargetsComponent} from "./targets/edit/edit-targets.component";
import {ExperimentsComponent} from "./experiments/experiments.component";
import {ShowExperimentsComponent} from "./experiments/show/show-experiments.component";

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    // canActivate: [UserRouteGuard],
    children: [
      {
        path: 'configuration',
        component: ConfigurationComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'definitions',
        component: DefinitionsComponent,
      },
      {
        path: 'definitions/edit/:id',
        component: EditDefinitionsComponent
      },
      {
        path: 'experiments',
        component: ExperimentsComponent,
      },
      {
        path: 'experiments/show/:id',
        component: ShowExperimentsComponent,
      },
      {
        path: 'targets',
        component: TargetsComponent,
      },
      {
        path: 'targets/edit/:id',
        component: EditTargetsComponent,
      },
      {
        path: 'targets/create',
        component: EditTargetsComponent,
      },
    ]
  }
];
