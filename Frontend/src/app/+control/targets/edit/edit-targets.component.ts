import {Component, Injectable, OnInit, ElementRef} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {TempStorageService} from "../../../shared/modules/helper/temp-storage-service";
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


  constructor(private layout: LayoutService,
              private temp_storage: TempStorageService,
              private api: OEDAApiService,
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

  /* tslint:disable */
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

        // retrieve config json object via the api provided at localhost:5000/api/config/crowdnav
        this.api.getConfigFromAPI("/crowdnav").subscribe((config) => {
          console.log("config", config);
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
    if (this.target.dataProviders == null) {
      this.target.dataProviders = []
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
      "dataProviders": [],
      "primaryDataProvider": {},
      "secondaryDataProviders": [],
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

  addDataProvider(dataProvider) {
    if (dataProvider == null)
      // for usual case, without using any configuration files
      this.target.dataProviders.push({
        "is_primary": false
      });
    else {
      // user should not be able to add already-added data providers
      if (this.target.dataProviders.filter(variable => variable.name === dataProvider.name).length === 0) {
        // before push, mark data provider as "not primary". User will have to select it later.
        dataProvider["is_primary"] = false;
        this.target.dataProviders.push(dataProvider);
        // also push variables of pushed data provider to incoming data types
        for (let i = 0; i < dataProvider.incomingDataTypes.length; i++) {
          this.target.incomingDataTypes.push(dataProvider.incomingDataTypes[i]);
          // mark name and description of pushed variables as disabled, but Scale is not disabled (TODO?)
          let pushedDataType =  this.target.incomingDataTypes[this.target.incomingDataTypes.length - 1];
          pushedDataType["disabled"] = true;
        }
      } else {
        this.notify.error("", "Data provider is already added");
      }
    }
  }

  removeDataProvider(index) {
    // also remove associated incoming data types (i.e. the added ones via configuration)
    let dataProvider = this.target.dataProviders[index];
    if (dataProvider.hasOwnProperty("incomingDataTypes"))  {
      for (let i = 0; i < dataProvider.incomingDataTypes.length; i++) {
        console.log("to be filtered", dataProvider.incomingDataTypes[i]);
        this.target.incomingDataTypes = this.target.incomingDataTypes.filter(dataType => dataType.name !== dataProvider.incomingDataTypes[i].name);
      }
    }

    this.target.dataProviders.splice(index, 1);

  }

  // TODO: discuss the necessity of this function / feature with Ilias?
  addIncomingDataType() {
    this.target.incomingDataTypes.push({
      "disabled": false
    });
  }

  removeIncoming(index) {
    this.target.incomingDataTypes.splice(index, 1)
  }

  hasChanges(): boolean {
    return JSON.stringify(this.target) !== JSON.stringify(this.originalTarget)
  }

  checkValidityOfTargetSystemDefinition() {

    // check if names of user-added changeable variables are not same with the ones coming from configuration
    if (this.checkDuplicateInObject('name', this.target.changeableVariable)) {
      return this.notify.error("", "Changeable variables contain duplicate elements");
    }
    // check if names of user-added incoming data types are not same with the ones coming from configuration
    if (this.checkDuplicateInObject('name', this.target.incomingDataTypes)) {
      return this.notify.error("", "Incoming data types contain duplicate elements");
    }
    // check if names of data providers are not same with the ones coming from configuration
    if (this.checkDuplicateInObject('name', this.target.dataProviders)) {
      return this.notify.error("", "Data providers contain duplicate elements");
    }
  }

  // refresh primaryDataProvider & secondaryDataProviders modals, o/w there will be a bug related with sizes of respective arrays
  // it also checks if a primary data provider is selected or not
  refreshDataProvidersAndCheckValidity() {
    this.target.secondaryDataProviders = [];
    this.target.primaryDataProvider = {};
    let primary_exists = false;
    // now, mark the data provider selected by user as "primaryDataProvider", and push others to secondaryDataProviders
    for (let i = 0; i < this.target.dataProviders.length; i++) {
      let dataProvider = this.target.dataProviders[i];
      if (dataProvider["is_primary"] === true) {
        primary_exists = true;
        this.target.primaryDataProvider = dataProvider;
      } else {
        this.target.secondaryDataProviders.push(dataProvider);
      }
    }
    return primary_exists;
  }

  saveChanges() {
    const ctrl = this;
    if (!ctrl.hasErrors()) {

      ctrl.target.name = ctrl.target.name.trim();
      if (ctrl.router.url.indexOf("/create") !== -1) {
        // check for validity of target system
        this.checkValidityOfTargetSystemDefinition();
        let primary_data_provider_exists = this.refreshDataProvidersAndCheckValidity();
        if (!primary_data_provider_exists) {
          return ctrl.notify.error("", "Provide at least one primary data provider");
        }

        // and perform save operation
        ctrl.api.saveTarget(ctrl.target).subscribe(
          (new_target) => {
            ctrl.temp_storage.setNewValue(new_target);
            ctrl.notify.success("Success", "Target system is saved");
            ctrl.router.navigate(["control/targets"]);
          }
        )
      } else {
        // perform necessary checks for validity of target system
        this.checkValidityOfTargetSystemDefinition();
        let primary_exists = this.refreshDataProvidersAndCheckValidity();
        if (!primary_exists) {
          return ctrl.notify.error("", "Provide at least one primary data provider");
        }
        // everything is OK, create new uuid for edit operation
        ctrl.target.id = UUID.UUID();

        ctrl.api.saveTarget(this.target).subscribe(
          (new_target) => {
            ctrl.temp_storage.setNewValue(new_target);
            ctrl.notify.success("Success", "Target system is saved");
            ctrl.router.navigate(["control/targets"]);
          }
        );
      }
    }
  }


  hasErrors(): boolean {
    let nr_of_selected_primary_data_providers = 0;


    if (this.target.dataProviders.length === 0) {
      return true;
    }

    for (let i = 0; i < this.target.dataProviders.length; i++) {
      let dataProvider = this.target.dataProviders[i];

      // indicate error if user has selected more than one primary_data_provider
      if (dataProvider.hasOwnProperty("is_primary")) {
        if (dataProvider["is_primary"] === true) {
          nr_of_selected_primary_data_providers += 1;
        }
        if (nr_of_selected_primary_data_providers > 1) {
          return true;
        }
      }

      // check for attributes of data providers
      if (dataProvider.type === "kafka_consumer") {
        if (dataProvider.serializer == null
          || dataProvider.kafka_uri == null
          || dataProvider.kafka_uri.length === 0
          || dataProvider.topic == null
          || dataProvider.topic.length === 0) {
          return true;
        }
      } else if (dataProvider.type === "mqtt_listener") {
        if (dataProvider.serializer == null
          || dataProvider.host == null
          || dataProvider.host.length === 0
          || dataProvider.port == null
          || dataProvider.port < 1
          || dataProvider.port > 65535
          || dataProvider.topic.length === 0
          || dataProvider.topic == null
          ) {
          return true;
        }
      } else if (dataProvider.type === "http_request") {
        if (dataProvider.serializer == null
          || dataProvider.url == null
          || dataProvider.url.length === 0
        ) {
          return true;
        }
      }
    }

    // check for attributes of change provider
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

    // check for attributes of incoming data types
    for (let i = 0; i < this.target.incomingDataTypes.length; i++) {
      if (this.target.incomingDataTypes[i].name == null
          || this.target.incomingDataTypes[i].length === 0
          || this.target.incomingDataTypes[i].description == null
          || this.target.incomingDataTypes[i].description === 0
          || isNullOrUndefined(this.target.incomingDataTypes[i].scale))
        return true;
    }

    // check for attributes of changeable variables
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

    // kafkaHost attribute is retrieved from api
    if (this.selectedConfiguration.hasOwnProperty("kafkaHost")) {
      this.target.changeProvider['kafka_uri'] = this.selectedConfiguration['kafkaHost'];
      this.target.changeProvider['type'] = 'kafka_producer';
      this.target.changeProvider['topic'] = this.selectedConfiguration['kafkaCommandsTopic'];
      this.target.changeProvider['serializer'] = 'JSON';
    }
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
