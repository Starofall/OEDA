import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";

@Component({
  selector: 'control-targets',
  templateUrl: './targets.component.html',
})
export class TargetsComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Target System", "Experimental Remote Systems")
  }

  targets = []
}
