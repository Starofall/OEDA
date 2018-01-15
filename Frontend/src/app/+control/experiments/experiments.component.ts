import {Component, Injectable, AfterViewInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {TempStorageService} from "../../shared/modules/helper/temp-storage-service";
import {UserService} from "../../shared/modules/auth/user.service";

@Component({
  selector: 'control-experiments',
  templateUrl: './experiments.component.html',
})
export class ExperimentsComponent {

  public is_db_configured: boolean;

  constructor (
                private layout: LayoutService,
                private api: OEDAApiService,
                private router: Router,
                private notify: NotificationsService,
                private temp_storage: TempStorageService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute) {
    const ctrl = this;
    // redirect user to configuration page if it's not configured yet.
    ctrl.is_db_configured = ctrl.userService.is_db_configured();

    if (!ctrl.is_db_configured ) {
        return;
    }
    activatedRoute.params.subscribe(Event => {
      ctrl.fetch_experiments();
    });
  }

  experiments = [];

  fetch_experiments(): void {
    const ctrl = this;
    this.layout.setHeader("Experiments", "Current Experiments");
    this.api.loadAllExperiments().subscribe(
      (data) => {
        if (!isNullOrUndefined(data)) {
          this.experiments = data;

          // also check if there is any newly added experiment with TempStorageService
          const new_experiment = this.temp_storage.getNewValue();
          if (new_experiment) {
            // this is needed because the retrieved targets might already contain the new one
            if (!(ctrl.experiments.find(e => e.id == new_experiment.id))) {
              this.experiments.push(new_experiment);
            }
            this.temp_storage.clearNewValue();
          }

          // and now, get target system information by using targetSystemId
          for (let i = 0; i < this.experiments.length; i++) {
            this.api.loadTargetById(this.experiments[i].targetSystemId).subscribe((targetSystem) => {
              if (!isNullOrUndefined(targetSystem)) {
                this.experiments[i].targetSystem = targetSystem;
              }
            });
          }

        } else {
          this.notify.error("Error", "Failed to retrieve experiments from DB");
        }

      }
    )
  }

  navigateToConfigurationPage() {
    this.router.navigate(["control/configuration"]);
  }
}
