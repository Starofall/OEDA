import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";

@Component({
  selector: 'edit-control-targets',
  templateUrl: './edit-targets.component.html',
})
export class EditTargetsComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Targets", "Edit Targets")
  }

  target = {
    primaryDataProvider: {},
    changeProvider: {}
  }

}
