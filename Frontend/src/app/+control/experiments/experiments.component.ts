import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";

@Component({
  selector: 'control-experiments',
  templateUrl: './experiments.component.html',
})
export class ExperimentsComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Experiments", "Current Experiments")
  }

  experiments = [{
    id: "12313-123123123-123123",
    name: "RTX @ 12313",
    status: "RUNNING"
  }]
}
