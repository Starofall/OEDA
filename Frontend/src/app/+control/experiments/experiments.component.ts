import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";

@Component({
  selector: 'control-experiments',
  templateUrl: './experiments.component.html',
})
export class ExperimentsComponent {

  constructor(private layout: LayoutService, api: OEDAApiService) {
    this.layout.setHeader("Experiments", "Current Experiments");
    api.loadAllExperiments().subscribe(
      (data) => {
        this.experiments = data
      }
    )
  }

  experiments = []
}
