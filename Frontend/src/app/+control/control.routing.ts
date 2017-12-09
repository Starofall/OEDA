import {Routes} from "@angular/router";
import {UserLayoutComponent} from "./layout/user-layout.component";
import {UserRouteGuard} from "../shared/modules/auth/staff-routeguard.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TargetsComponent} from "./targets/targets.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EditTargetsComponent} from "./targets/edit/edit-targets.component";
import {ExperimentsComponent} from "./experiments/experiments.component";
import {ShowRunningExperimentComponent} from "./experiments/show/running/show-running-experiment.component";
import {ShowSuccessfulExperimentComponent} from "./experiments/show/successful/show-successful-experiment.component";
import {CreateExperimentsComponent} from "./experiments/create/create-experiments.component";

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    // canActivate: [UserRouteGuard],
    children: [
      {
        path: '',
        redirectTo: '/control/experiments',
        pathMatch: 'full'
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'experiments',
        component: ExperimentsComponent,
      },
      {
        path: 'experiments/create',
        component: CreateExperimentsComponent,
      },
      {
        path: 'experiments/show/:id/running',
        component: ShowRunningExperimentComponent,
      },
      {
        path: 'experiments/show/:id/success',
        component: ShowSuccessfulExperimentComponent,
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
