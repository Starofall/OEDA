import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import {ActivatedRoute} from "@angular/router";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'control-experiments',
  templateUrl: './experiments.component.html',
})
export class ExperimentsComponent implements OnInit {
  constructor(private layout: LayoutService, private api: OEDAApiService, private router: ActivatedRoute, private notify: NotificationsService) {
    const ctrl = this;
    router.params.subscribe(Event => {
      ctrl.ngOnInit();
    });
  }

  experiments = [];

  ngOnInit(): void {
    this.layout.setHeader("Experiments", "Current Experiments");
    this.api.loadAllExperiments().subscribe(
      (data) => {
        if (!isNullOrUndefined(data)) {
          this.experiments = data;
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
}
