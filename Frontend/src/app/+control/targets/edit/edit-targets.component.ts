import {Component, Injectable, OnInit, ElementRef} from '@angular/core';
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
  availableConfigurations = [];
  selectedConfiguration: any;
  configsAvailable = false;

  ngOnInit(): void {
    const ctrl = this;
    this.layout.setHeader("Target System", "");
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        ctrl.pageTitle = "Edit Target System";
        ctrl.saveButtonLabel = "Save Changes";
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

        // retrieve config json object via the api provided at localhost:5005/config/oeda
        this.api.getConfigFromAPI("/oeda").subscribe((config) => {
            if (!isNullOrUndefined(config)) {
              // open the modal in frontend
              this.availableConfigurations.push(config);
              // this.traverse_json_object(config);
              this.configsAvailable = true;
              document.getElementById("openModalButton").click();
            }
          }
        );

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

  addChangeableVariable(existingKnob) {
    if (existingKnob == null)
      this.target.changeableVariable.push({}); // for usual case, without any configuration files
    else {
      // user should not be able to add already-added variable coming from config
      if (this.target.changeableVariable.filter(variable => variable.name === existingKnob.name).length === 0) {
        this.target.changeableVariable.push(existingKnob);
      } else {
        this.notify.error("", "Variable is already added");
      }
    }
  }

  removeChangeableVariable(index) {
    this.target.changeableVariable.splice(index, 1)
  }

  addIncomingDataType(incomingDataType) {
    if (incomingDataType == null)
      this.target.incomingDataTypes.push({}); // for usual case, without any configuration files
    else {
      // user should not be able to add already-added variable coming from config
      if (this.target.incomingDataTypes.filter(variable => variable.name === incomingDataType.name).length === 0) {
        this.target.incomingDataTypes.push(incomingDataType);
      } else {
        this.notify.error("", "Incoming data type is already added");
      }
    }
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

        // check if user-added variable(s) are not same with the ones coming from configuration
        if (!this.checkDuplicateInObject('name', this.target.changeableVariable)
            && !this.checkDuplicateInObject('name', this.target.incomingDataTypes) ) {
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
          this.notify.error("", "Incoming variables contain duplicate elements");
        }

      } else {
        // this is a edit, so create new uuid
        ctrl.target.id = UUID.UUID();
        // ctrl.target.name = ctrl.target.name + " Copy";
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

  traverse_json_object(o) {
    const type = typeof o;
    if (type === "object") {
      for (const key in o) {
        this.traverse_json_object(o[key]);
      }
    } else {
      console.log(o);
    }
  }

  configDropdownChanged(selected_configuration_name: any) {
    this.selectedConfiguration = this.availableConfigurations.filter(config => config.name === selected_configuration_name)[0];
  }

  useConfiguration() {

    this.target['name'] = this.selectedConfiguration['name'];
    this.target['description'] = this.selectedConfiguration['description'];

    // TODO: discuss how to discriminate between http/kafka/mqtt with Ilias
    if (this.selectedConfiguration.hasOwnProperty("kafkaHost")) {
      this.target.primaryDataProvider['type'] = 'kafka_consumer';
      this.target.primaryDataProvider['kafka_uri'] = this.selectedConfiguration['kafkaHost'];
      this.target.primaryDataProvider['topic'] = this.selectedConfiguration['kafkaTopicTrips'];
      this.target.primaryDataProvider['serializer'] = 'JSON';

      this.target.changeProvider['kafka_uri'] = this.selectedConfiguration['kafkaHost'];
      this.target.changeProvider['type'] = 'kafka_producer';
      this.target.changeProvider['topic'] = this.selectedConfiguration['kafkaCommandsTopic'];
      this.target.changeProvider['serializer'] = 'JSON';
    }
      // primaryDataProvider: any,
      // changeProvider: any,
      // incomingDataTypes: any,
      // changeableVariable: any
  }

  // http://www.competa.com/blog/lets-find-duplicate-property-values-in-an-array-of-objects-in-javascript/
  checkDuplicateInObject(propertyName, inputArray) {
    var seenDuplicate = false,
      testObject = {};

    inputArray.map(function(item) {
      var itemPropertyName = item[propertyName];
      if (itemPropertyName in testObject) {
        testObject[itemPropertyName].duplicate = true;
        item.duplicate = true;
        seenDuplicate = true;
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });

    return seenDuplicate;
  }
}
