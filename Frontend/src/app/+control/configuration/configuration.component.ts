import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {Configuration, OEDAApiService, UserEntity} from "../../shared/modules/api/oeda-api.service";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'control-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {

  save_button_clicked: boolean;
  constructor(private layout: LayoutService,
              private api: OEDAApiService,
              private router: Router,
              private notify: NotificationsService,
              private userService: UserService) {
    this.save_button_clicked = false;
  }


  user: UserEntity;
  // default values are provided here
  configuration: Configuration = {host: "", port: null, type: ""};
  originalConfiguration = {};

  ngOnInit(): void {
    this.layout.setHeader("Configuration", "Setup the Database for Experiments");
    this.user = this.userService.getAuthToken()["value"].user;
    if (this.user.db_configuration["host"] && this.user.db_configuration["port"] && this.user.db_configuration["type"]) {
      this.configuration.host = this.user.db_configuration["host"];
      this.configuration.port = this.user.db_configuration["port"];
      this.configuration.type = this.user.db_configuration["type"];
      this.originalConfiguration = _.cloneDeep(this.configuration);
    } else {
      this.notify.success("", "Default values for configuration are populated");
      this.configuration.host = "localhost";
      this.configuration.port = 9200;
      this.configuration.type = "elasticsearch";
    }
  }

  populate_default_values() {
    this.configuration.host = "localhost";
    this.configuration.port = 9200;
    this.configuration.type = "elasticsearch";
  }
  hasChanges(): boolean {
    return JSON.stringify(this.configuration) !== JSON.stringify(this.originalConfiguration)
  }

  saveChanges() {
    const ctrl = this;
    if (!this.hasErrors()) {
      this.save_button_clicked = true;
      this.user.db_configuration["host"] = this.configuration.host;
      this.user.db_configuration["port"] = this.configuration.port.toString();
      this.user.db_configuration["type"] = this.configuration.type;
      console.log(this.user);
      this.api.updateUser(this.user).subscribe(
        (success) => {
          console.log("success", success);
          ctrl.originalConfiguration = _.cloneDeep(this.configuration);
          const parsed_json = JSON.parse(success['_body']);
          console.log("parsed_json", parsed_json);
          ctrl.notify.success("Success", parsed_json["message"]);
          // after a successful update, use the retrieved token and put it into userService, so that user will be able to run experiments
          ctrl.userService.setAuthToken(parsed_json["token"]);
          this.save_button_clicked = false;
        }, (error => {
          console.log("error", error);
          error = JSON.parse(error._body);
          ctrl.notify.error("Error", error.message);
          this.save_button_clicked = false;
          this.revertChanges();
        })
      )
    }
  }

  hasErrors(): boolean {
    if ( this.configuration.type.length === 0
          || this.configuration.host == null
          || this.configuration.host.length === 0
          || this.configuration.port == null
          || this.configuration.port < 1
          || this.configuration.port > 65535) {
      return true;
    }
    return false;
  }

  revertChanges() {
    this.configuration = _.cloneDeep(this.originalConfiguration);
  }


}
