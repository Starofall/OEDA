import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";

@Component({
  selector: 'control-definitions',
  templateUrl: './definitions.component.html',
})
export class DefinitionsComponent {

  constructor(private layout: LayoutService, api: OEDAApiService) {
    this.layout.setHeader("Definitions", "All System Definitions")
    api.loadAllDefinitions().subscribe(
      (data) => {
        this.definitions = data
      }
    )
  }

  definitions = []
}
