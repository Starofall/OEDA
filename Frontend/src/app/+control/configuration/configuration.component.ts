import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";

@Component({
  selector: 'control-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Configuration", "Setup the System")
  }

}
