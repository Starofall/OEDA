import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'control-targets',
  templateUrl: './targets.component.html',
})
export class TargetsComponent implements OnInit {

  constructor(private layout: LayoutService, private api: OEDAApiService, private router: ActivatedRoute) {
    const ctrl = this;
    router.params.subscribe(Event => {
      console.log("Event subscribed in targets component: ", Event);
        ctrl.ngOnInit();
    });
  }

  targets = []

  ngOnInit(): void {
    this.layout.setHeader("Target System", "Experimental Remote Systems")
    this.api.loadAllTargets().subscribe(
      (data) => {
        this.targets = data
      }
    )
  }

}
