import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService, Target} from "../../../shared/modules/api/oeda-api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UUID} from "angular2-uuid";
import {NotificationsService} from "angular2-notifications/dist";
import * as _ from "lodash";

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
    if (!this.hasErrors()) {

      console.log("router value: ", this.router.url.indexOf("/create"));
      if (this.router.url.indexOf("/create") !== -1) {

        this.api.saveTarget(this.target).subscribe(
          (success) => {
            this.notify.success("Success", "Target saved");
            this.router.navigate(["control/targets/edit", this.target.id]);
          }
        )
      } else {
        // this is a edit, so create new uuid
        this.target.id = UUID.UUID();
        this.target.name = this.target.name + " Copy";
        this.api.saveTarget(this.target).subscribe(
          (success) => {
            this.notify.success("Success", "Target saved")
            this.router.navigate(["control/targets/edit", this.target.id])
          }
        );
      }


    }
  }

  hasErrors(): boolean {
    return (this.target.name == null || this.target.name === "") ||
      (this.target.primaryDataProvider.type == null || this.target.primaryDataProvider.type === "") ||
      (this.target.changeProvider.type == null || this.target.changeProvider.type === "")
  }

  revertChanges() {
    this.target = _.cloneDeep(this.originalTarget)
  }

}
