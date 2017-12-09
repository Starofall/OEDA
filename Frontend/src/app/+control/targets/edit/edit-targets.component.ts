import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService, Target} from "../../../shared/modules/api/oeda-api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UUID} from "angular2-uuid";
import {NotificationsService} from "angular2-notifications/dist";
import * as _ from "lodash";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'edit-control-targets',
  templateUrl: './edit-targets.component.html',
})
export class EditTargetsComponent implements OnInit {


  constructor(private layout: LayoutService, private api: OEDAApiService,
              private router: Router, private route: ActivatedRoute,
              private notify: NotificationsService) {
  }

  target: Target;
  originalTarget: Target;
  pageTitle: string;
  saveButtonLabel: string;

  ngOnInit(): void {
    const ctrl = this;
    this.layout.setHeader("Target System", "");
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        ctrl.pageTitle = "Edit Target System";
        ctrl.saveButtonLabel = "Save Changes as Copy";
        this.api.loadTargetById(params['id']).subscribe(
          (data) => {
            this.target = data;
            this.originalTarget = _.cloneDeep(this.target);
            this.assureObjectContract();
          }
        )
      } else {
        ctrl.pageTitle = "Create Target System";
        ctrl.saveButtonLabel = "Save Target System";
        this.target = this.createTarget();
        this.originalTarget = _.cloneDeep(this.target);
        this.assureObjectContract();
      }
    })
  }

  assureObjectContract() {
    if (this.target.primaryDataProvider == null) {
      this.target.primaryDataProvider = {type: ""}
    }
    if (this.target.changeProvider == null) {
      this.target.changeProvider = {type: ""}
    }
    if (this.target.incomingDataTypes == null) {
      this.target.incomingDataTypes = []
    }
    if (this.target.changeableVariable == null) {
      this.target.changeableVariable = []
    }
  }

  createTarget(): Target {
    return {
      "id": UUID.UUID(),
      "primaryDataProvider": {
        "type": "",
      },
      "changeProvider": {
        "type": "",
      },
      "name": "",
      "status": "IDLE",
      "description": "",
      "incomingDataTypes": [],
      "changeableVariable": []
    }
  }

  addChangeableVariable() {
    this.target.changeableVariable.push({})
  }

  removeChangeableVariable(index) {
    this.target.changeableVariable.splice(index, 1)
  }

  addIncomingDataType() {
    this.target.incomingDataTypes.push({})
  }

  removeIncoming(index) {
    this.target.incomingDataTypes.splice(index, 1)
  }

  hasChanges(): boolean {
    return JSON.stringify(this.target) !== JSON.stringify(this.originalTarget)
  }


  saveChanges() {
    const ctrl = this;
    if (!ctrl.hasErrors()) {


      ctrl.target.name = ctrl.target.name.trim();
      if (ctrl.router.url.indexOf("/create") !== -1) {

        ctrl.api.saveTarget(this.target).subscribe(
          (success) => {
            ctrl.notify.success("Success", "Target saved");
            // this.router.navigate(["control/targets/edit", this.target.id]);
            ctrl.router.navigate(["control/experiments"]).then(() => {
              console.log("navigated to experiments page");
            });
          }
        )
      } else {
        // this is a edit, so create new uuid
        ctrl.target.id = UUID.UUID();
        ctrl.target.name = ctrl.target.name + " Copy";
        ctrl.api.saveTarget(this.target).subscribe(
          (success) => {
            ctrl.notify.success("Success", "Target saved");
            ctrl.router.navigate(["control/experiments"]).then(() => {
              console.log("navigated to experiments page");
            });
          }
        );
      }


    }
  }

  hasErrors(): boolean {

    if (this.target.primaryDataProvider.type === "kafka_consumer") {
      if (this.target.primaryDataProvider.serializer == null
        || this.target.primaryDataProvider.kafka_uri == null
        || this.target.primaryDataProvider.kafka_uri.length === 0
        || this.target.primaryDataProvider.topic == null
        || this.target.primaryDataProvider.topic.length === 0) {
        return true;
      }
    } else if (this.target.primaryDataProvider.type === "mqtt_listener") {
      if (this.target.primaryDataProvider.serializer == null
        || this.target.primaryDataProvider.host == null
        || this.target.primaryDataProvider.host.length === 0
        || this.target.primaryDataProvider.port == null
        || this.target.primaryDataProvider.port < 1
        || this.target.primaryDataProvider.port > 65535
        || this.target.primaryDataProvider.topic.length === 0
        || this.target.primaryDataProvider.topic == null
        ) {
        return true;
      }
    } else if (this.target.primaryDataProvider.type === "http_request") {
      if (this.target.primaryDataProvider.serializer == null
        || this.target.primaryDataProvider.url == null
        || this.target.primaryDataProvider.url.length === 0
      ) {
        return true;
      }
    }


    if (this.target.changeProvider.type === "kafka_producer") {
      if (this.target.changeProvider.serializer == null
        || this.target.changeProvider.kafka_uri == null
        || this.target.changeProvider.kafka_uri.length === 0
        || this.target.changeProvider.topic == null
        || this.target.changeProvider.topic.length === 0) {
        return true;
      }
    } else if (this.target.changeProvider.type === "mqtt_publisher") {
      if (this.target.changeProvider.serializer == null
        || this.target.changeProvider.host == null
        || this.target.changeProvider.host.length === 0
        || this.target.changeProvider.port == null
        || this.target.changeProvider.port < 1
        || this.target.changeProvider.port > 65535
        || this.target.changeProvider.topic.length === 0
        || this.target.changeProvider.topic == null
      ) {
        return true;
      }
    } else if (this.target.changeProvider.type === "http_request") {
      if (this.target.changeProvider.serializer == null
        || this.target.changeProvider.url == null
        || this.target.changeProvider.url.length === 0
      ) {
        return true;
      }
    }

    for (let i = 0; i < this.target.incomingDataTypes.length; i++) {
      if (this.target.incomingDataTypes[i].name == null
          || this.target.incomingDataTypes[i].length === 0
          || this.target.incomingDataTypes[i].description == null
          || this.target.incomingDataTypes[i].description === 0
          || isNullOrUndefined(this.target.incomingDataTypes[i].scale))
        return true;
    }

    for (let i = 0; i < this.target.changeableVariable.length; i++) {
      if (this.target.changeableVariable[i].name == null
        || this.target.changeableVariable[i].length === 0
        || this.target.changeableVariable[i].description == null
        || this.target.changeableVariable[i].description === 0
        || isNullOrUndefined(this.target.changeableVariable[i].scale)
        || isNullOrUndefined(this.target.changeableVariable[i].min)
        || isNullOrUndefined(this.target.changeableVariable[i].max))
        return true;
    }


    return (this.target.name == null || this.target.name === "") ||
      (this.target.primaryDataProvider.type == null || this.target.primaryDataProvider.type === "") ||
      (this.target.changeProvider.type == null || this.target.changeProvider.type === "") ||
      (this.target.changeProvider.type == null || this.target.changeProvider.type === "") ||
      (this.target.changeProvider.type == null || this.target.changeProvider.type === "") ||

      (this.target.changeProvider.type == null || this.target.changeProvider.type === "") ||
      (this.target.changeProvider.type == null || this.target.changeProvider.type === "") ||
      (this.target.changeProvider.type == null || this.target.changeProvider.type === "") ||
      (this.target.changeableVariable.length === 0 || this.target.incomingDataTypes.length === 0)
  }

  revertChanges() {
    this.target = _.cloneDeep(this.originalTarget)
  }

}
