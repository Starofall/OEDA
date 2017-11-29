import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'control-experiments',
  templateUrl: './experiments.component.html',
})
export class ExperimentsComponent implements OnInit {
  constructor(private layout: LayoutService, private api: OEDAApiService, private router: ActivatedRoute) {
    const ctrl = this;
    router.params.subscribe(Event => {
      console.log("Event subscribed in targets component: ", Event);
      ctrl.ngOnInit();
    });
  }

  experiments = [];

  ngOnInit(): void {
    console.log("initialise in Experiments component");
    this.layout.setHeader("Experiments", "Current Experiments");
    this.api.loadAllExperiments().subscribe(
      (data) => {
        console.log("data in ngOnInit experiments component ", data);
        this.experiments = data;
      }
    )
  }
}
