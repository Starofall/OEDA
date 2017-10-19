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

  target: Target
  originalTarget: Target

  ngOnInit(): void {
    this.layout.setHeader("Targets", "Edit Targets")

    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.api.loadTargetById(params['id']).subscribe(
          (data) => {
            this.target = data
            this.originalTarget = _.cloneDeep(this.target)
            this.assureObjectContract()
          }
        )
      } else {
        this.target = this.createTarget()
        this.originalTarget = _.cloneDeep(this.target)
        this.assureObjectContract()
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
      this.api.saveTarget(this.target).subscribe(
        (success) => {
          this.originalTarget = _.cloneDeep(this.target)
          this.notify.success("Success", "Target saved")
          // move to the editing of this track
          if (this.router.url.indexOf("/create") !== -1) {
            this.router.navigate(["control/targets/edit", this.target.id])
          } else {
            // @todo reload track to see server based changes
          }
        }
      )
    }
  }

  hasErrors(): boolean {
    return this.target.name == null || this.target.name === ""
  }

  revertChanges() {
    this.target = _.cloneDeep(this.originalTarget)
  }

}
