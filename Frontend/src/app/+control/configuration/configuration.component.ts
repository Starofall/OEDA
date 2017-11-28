import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {Configuration, OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import * as _ from "lodash";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'control-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {

  constructor(private layout: LayoutService, private api: OEDAApiService,
              private router: Router, private route: ActivatedRoute,
              private notify: NotificationsService) {
  }

  configuration: Configuration = {database: ""};
  originalConfiguration = {};

  ngOnInit(): void {
    this.layout.setHeader("Configuration", "Setup the System");
    this.api.loadConfiguration().subscribe(
      (data) => {
        this.configuration = data;
        this.originalConfiguration = _.cloneDeep(this.configuration);
      }
    )
  }


  hasChanges(): boolean {
    return JSON.stringify(this.configuration) !== JSON.stringify(this.originalConfiguration)
  }

  saveChanges() {
    if (!this.hasErrors()) {
      this.api.saveConfiguration(this.configuration).subscribe(
        (success) => {
          this.originalConfiguration = _.cloneDeep(this.configuration);
          this.notify.success("Success", "Configuration saved")
        }
      )
    }
  }

  hasErrors(): boolean {
    return false
  }

  revertChanges() {
    this.configuration = _.cloneDeep(this.originalConfiguration);
  }


}
